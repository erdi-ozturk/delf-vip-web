import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

// Saatlik çarpanlar (booking/page.tsx ile senkron)
const HOURLY_MULTIPLIERS: Record<string, number> = {
  "4 Saat": 1,
  "8 Saat": 1.8,
  "10 Saat": 2.2,
  "12 Saat": 2.5,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vehicleName = searchParams.get("vehicle");
  const bookingType = searchParams.get("type") || "transfer";
  const roundTrip = searchParams.get("roundTrip") === "true";
  const duration = searchParams.get("duration") || "4 Saat";
  const pickup = searchParams.get("pickup") || "";
  const dropoff = searchParams.get("dropoff") || "";

  if (!vehicleName) {
    return NextResponse.json({ error: "Araç belirtilmedi" }, { status: 400 });
  }

  try {
    // 1. Sabit rota var mı kontrol et
    if (bookingType === "transfer") {
      const fixedRoute = await db.fixedRoute.findFirst({
        where: {
          vehicleType: { contains: vehicleName.split(" ").slice(0, 2).join(" "), mode: "insensitive" },
          fromLocation: { contains: pickup.slice(0, 50), mode: "insensitive" },
          toLocation: { contains: dropoff.slice(0, 50), mode: "insensitive" },
        },
      });

      if (fixedRoute) {
        const price = roundTrip ? fixedRoute.priceUsd * 2 : fixedRoute.priceUsd;
        return NextResponse.json({ priceUsd: price, source: "fixed" });
      }
    }

    // 2. Araç tablosundan taban fiyatı al
    const vehicle = await db.vehicle.findFirst({
      where: { name: { contains: vehicleName.split(" ").slice(0, 2).join(" "), mode: "insensitive" } },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Araç bulunamadı" }, { status: 404 });
    }

    let priceUsd = vehicle.basePriceUsd;

    if (bookingType === "transfer") {
      priceUsd = roundTrip ? priceUsd * 2 : priceUsd;
    } else {
      const multiplier = HOURLY_MULTIPLIERS[duration] ?? 1;
      priceUsd = priceUsd * multiplier;
    }

    return NextResponse.json({ priceUsd: Math.round(priceUsd), source: "dynamic" });
  } catch (error) {
    console.error("Fiyat hesaplanamadı:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
