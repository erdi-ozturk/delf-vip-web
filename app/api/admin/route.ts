import { NextRequest, NextResponse } from "next/server";

// Brute force koruması: IP başına 15 dakikada max 5 başarısız deneme
const loginRateMap = new Map<string, { failures: number; lockedUntil: number }>();

function checkLoginRate(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const entry = loginRateMap.get(ip);
  if (!entry) return { allowed: true };
  if (entry.lockedUntil > now) {
    return { allowed: false, waitSeconds: Math.ceil((entry.lockedUntil - now) / 1000) };
  }
  return { allowed: true };
}

function recordFailure(ip: string) {
  const now = Date.now();
  const entry = loginRateMap.get(ip) ?? { failures: 0, lockedUntil: 0 };
  entry.failures += 1;
  if (entry.failures >= 5) {
    entry.lockedUntil = now + 15 * 60_000; // 15 dakika kilitle
    entry.failures = 0;
  }
  loginRateMap.set(ip, entry);
}

function recordSuccess(ip: string) {
  loginRateMap.delete(ip);
}

// POST /api/admin → giriş yap
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rateCheck = checkLoginRate(ip);
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.waitSeconds ?? 900) / 60);
    return NextResponse.json(
      { error: `Çok fazla başarısız deneme. ${minutes} dakika sonra tekrar deneyin.` },
      { status: 429 }
    );
  }

  const { password } = await request.json();
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Sunucu yapılandırma hatası" }, { status: 500 });
  }

  if (!password || password !== secret) {
    recordFailure(ip);
    return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 });
  }

  recordSuccess(ip);
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_token", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 saat
  });
  return response;
}

// DELETE /api/admin → çıkış yap
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("admin_token");
  return response;
}
