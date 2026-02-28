import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET(request: NextRequest) {
  // Auth check — middleware doesn't cover /api/admin/export
  const token = request.cookies.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET;
  if (!token || !secret || token !== secret) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const reservations = await db.reservation.findMany({
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "ID", "Kayıt Tarihi", "Durum", "Ad Soyad", "Telefon", "E-posta",
    "Nereden", "Nereye", "Transfer Tarihi", "Dönüş Tarihi",
    "Araç", "Yolcu Sayısı", "Fiyat", "Not",
  ];

  const rows = reservations.map((r) => [
    r.id,
    new Date(r.createdAt).toLocaleString("tr-TR"),
    r.status,
    r.name,
    r.phone,
    r.email ?? "",
    r.pickupName ?? r.pickupAddr,
    r.dropoffName ?? r.dropoffAddr,
    r.date ?? "",
    r.returnDate ?? "",
    r.vehicle,
    r.passengers,
    r.price,
    r.note ?? "",
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));

  const csv = [headers.join(","), ...rows].join("\r\n");
  const bom = "\uFEFF"; // UTF-8 BOM — Excel'in Türkçe karakterleri doğru okuması için

  const today = new Date().toISOString().split("T")[0];
  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rezervasyonlar-${today}.csv"`,
    },
  });
}
