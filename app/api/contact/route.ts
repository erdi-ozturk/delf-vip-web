import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiter: IP başına 10 dakikada max 3 mesaj
const contactRateMap = new Map<string, { count: number; resetAt: number }>();
function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = contactRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    contactRateMap.set(ip, { count: 1, resetAt: now + 600_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRate(ip)) {
    return NextResponse.json(
      { error: "Çok fazla mesaj gönderildi. Lütfen bekleyin." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    // Basit e-posta doğrulama
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Geçersiz e-posta adresi" }, { status: 400 });
    }

    const name = `${firstName.trim().slice(0, 50)} ${lastName.trim().slice(0, 50)}`;
    const toEmail = process.env.RESEND_TO_EMAIL;

    if (process.env.RESEND_API_KEY && toEmail) {
      await resend.emails.send({
        from: "DELF VIP <noreply@delfvip.com>",
        to: toEmail,
        replyTo: email.trim().slice(0, 200),
        subject: `✉️ İletişim Formu: ${subject?.trim().slice(0, 100) || "Yeni Mesaj"} — ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:12px;">
            <div style="background:#1e293b;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
              <h1 style="margin:0;font-size:20px;">✉️ İletişim Formu Mesajı</h1>
              <p style="margin:4px 0 0;font-size:13px;opacity:0.7;">DELF VIP Web Sitesi</p>
            </div>
            <div style="background:white;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;border-top:none;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td colspan="2" style="padding:8px 0;font-weight:bold;color:#f59e0b;border-bottom:2px solid #fef3c7;">👤 Gönderen</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;width:120px;">Ad Soyad</td><td style="padding:6px 0;font-weight:bold;">${name}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">E-Posta</td><td style="padding:6px 0;"><a href="mailto:${email}" style="color:#3b82f6;">${email}</a></td></tr>
                ${subject ? `<tr><td style="padding:6px 0;color:#64748b;">Konu</td><td style="padding:6px 0;">${subject.trim().slice(0, 200)}</td></tr>` : ""}
                <tr><td colspan="2" style="padding:16px 0 8px;font-weight:bold;color:#f59e0b;border-bottom:2px solid #fef3c7;">💬 Mesaj</td></tr>
                <tr><td colspan="2" style="padding:12px 0;white-space:pre-wrap;line-height:1.6;">${message.trim().slice(0, 2000)}</td></tr>
              </table>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("İletişim formu gönderilemedi:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
