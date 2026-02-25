import { NextRequest, NextResponse } from "next/server";

// POST /api/admin → giriş yap
export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Sunucu yapılandırma hatası" }, { status: 500 });
  }

  if (!password || password !== secret) {
    return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 });
  }

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
