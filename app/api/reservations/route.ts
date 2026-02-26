import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiter: IP başına 10 dakikada max 5 rezervasyon isteği
const reservationRateMap = new Map<string, { count: number; resetAt: number }>();
function checkReservationRate(ip: string): boolean {
  const now = Date.now();
  const entry = reservationRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    reservationRateMap.set(ip, { count: 1, resetAt: now + 600_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkReservationRate(ip)) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen 10 dakika bekleyin." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    const {
      name, phone, email, note,
      bookingType, pickupName, pickupAddr, dropoffName, dropoffAddr,
      date, returnDate, duration, passengers,
      vehicle, price,
    } = body;

    // Zorunlu alanlar
    if (!name?.trim() || !phone?.trim() || !pickupAddr || !dropoffAddr || !date || !vehicle) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    const reservation = await db.reservation.create({
      data: {
        name: name.trim().slice(0, 100),
        phone: phone.trim().slice(0, 30),
        email: email?.trim().slice(0, 200) || null,
        note: note?.trim().slice(0, 500) || null,
        bookingType: bookingType || "transfer",
        pickupName: pickupName?.slice(0, 200) || null,
        pickupAddr: pickupAddr.slice(0, 300),
        dropoffName: dropoffName?.slice(0, 200) || null,
        dropoffAddr: dropoffAddr.slice(0, 300),
        date: date.slice(0, 50),
        returnDate: returnDate?.slice(0, 50) || null,
        duration: duration?.slice(0, 20) || null,
        passengers: passengers?.slice(0, 5) || "1",
        vehicle: vehicle.slice(0, 100),
        price: price?.slice(0, 30) || "",
        status: "new",
      },
    });

    // E-posta bildirimi (hata olsa rezervasyon yine kaydedilmiş olur)
    const toEmail = process.env.RESEND_TO_EMAIL;
    if (process.env.RESEND_API_KEY && toEmail) {
      const typeLabel = bookingType === "hourly" ? "Saatlik Tahsis" : "Transfer";
      await resend.emails.send({
        from: "DELF VIP <noreply@delfvip.com>",
        to: toEmail,
        subject: `🚐 Yeni ${typeLabel} Talebi — ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:12px;">
            <div style="background:#1e293b;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
              <h1 style="margin:0;font-size:20px;">🚐 Yeni ${typeLabel} Talebi</h1>
              <p style="margin:4px 0 0;font-size:13px;opacity:0.7;">DELF VIP Web Sitesi</p>
            </div>
            <div style="background:white;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;border-top:none;">

              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td colspan="2" style="padding:8px 0;font-weight:bold;color:#f59e0b;border-bottom:2px solid #fef3c7;">👤 Müşteri Bilgileri</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;width:140px;">Ad Soyad</td><td style="padding:6px 0;font-weight:bold;">${name}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Telefon</td><td style="padding:6px 0;"><a href="tel:${phone}" style="color:#3b82f6;font-weight:bold;">${phone}</a></td></tr>
                ${email ? `<tr><td style="padding:6px 0;color:#64748b;">E-Posta</td><td style="padding:6px 0;">${email}</td></tr>` : ""}

                <tr><td colspan="2" style="padding:16px 0 8px;font-weight:bold;color:#f59e0b;border-bottom:2px solid #fef3c7;">📍 Güzergah</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Nereden</td><td style="padding:6px 0;">${pickupAddr}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Nereye</td><td style="padding:6px 0;">${dropoffAddr}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Tarih</td><td style="padding:6px 0;font-weight:bold;">${formatDate(date)}</td></tr>
                ${returnDate ? `<tr><td style="padding:6px 0;color:#64748b;">Dönüş</td><td style="padding:6px 0;">${formatDate(returnDate)}</td></tr>` : ""}
                ${duration ? `<tr><td style="padding:6px 0;color:#64748b;">Süre</td><td style="padding:6px 0;">${duration}</td></tr>` : ""}
                <tr><td style="padding:6px 0;color:#64748b;">Yolcu</td><td style="padding:6px 0;">${passengers} kişi</td></tr>

                <tr><td colspan="2" style="padding:16px 0 8px;font-weight:bold;color:#f59e0b;border-bottom:2px solid #fef3c7;">🚐 Araç & Ücret</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Araç</td><td style="padding:6px 0;font-weight:bold;">${vehicle}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Tutar</td><td style="padding:6px 0;font-weight:bold;font-size:18px;color:#16a34a;">${price}</td></tr>
                ${note ? `<tr><td style="padding:6px 0;color:#64748b;">Not</td><td style="padding:6px 0;font-style:italic;">${note}</td></tr>` : ""}
              </table>

              <div style="margin-top:20px;padding:12px 16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;font-size:13px;color:#166534;">
                Rezervasyon ID: <strong>${reservation.id}</strong>
              </div>
            </div>
          </div>
        `,
      }).catch((err) => console.error("Mail gönderilemedi:", err));
    }

    return NextResponse.json({ ok: true, id: reservation.id }, { status: 201 });
  } catch (error) {
    console.error("Rezervasyon kaydedilemedi:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
