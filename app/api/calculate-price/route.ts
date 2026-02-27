import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

// Saatlik çarpanlar
const HOURLY_MULTIPLIERS: Record<string, number> = {
  "4 Saat": 1,
  "8 Saat": 1.8,
  "10 Saat": 2.2,
  "12 Saat": 2.5,
};

// Bölge anahtar kelimeleri — yakın semtler aynı bölgede
// Fatih girerken Sultanahmet fiyatı alır, Üsküdar girince Kadıköy fiyatı alır vb.
const ZONE_KEYWORDS: Record<string, string[]> = {
  "İstanbul Havalimanı": [
    "istanbul havaliman", "ist airport", "istanbul airport",
    "arnavutkoy havaliman", "yeni havaliman", "istanbul new airport",
    "havalimani", "istanbul intl",
  ],
  "Sabiha Gökçen": [
    "sabiha", "saw airport", "sabiha gokcen", "sabiha gökçen",
    "pendik havaliman", "kurtkoy", "kurtköy",
  ],
  "Taksim": [
    "taksim", "besiktas", "beşiktaş", "beyoglu", "beyoğlu",
    "sisli", "şişli", "levent", "nisantasi", "nişantaşı",
    "macka", "maçka", "cihangir", "karakoy", "karaköy",
    "galata", "gumussuyu", "gümüşsuyu", "harbiye", "tesvikiye",
  ],
  "Sultanahmet": [
    "sultanahmet", "fatih", "eminonu", "eminönü", "beyazit", "beyazıt",
    "aksaray", "laleli", "vezneciler", "kapalicarsi", "kapalıçarşı",
    "topkapi", "topkapı", "cemberlitas", "çemberlitaş", "kumkapi",
    "kumkapı", "yenikapı", "yenikapu", "sirkeci",
  ],
  "Kadıköy": [
    "kadikoy", "kadıköy", "moda", "fenerbahce", "fenerbahçe",
    "bostanci", "bostancı", "maltepe", "uskudar", "üsküdar",
    "atasehir", "ataşehir", "kozyatagi", "kozyataği",
    "goztepe", "göztepe", "suadiye",
  ],
};

// Türkçe karakterleri normalize et
// ÖNEMLİ: Büyük harfli Türkçe karakterler (İ,Ğ,Ü,Ş,Ö,Ç) toLowerCase'den ÖNCE değiştirilmeli,
// aksi hâlde "İ" → toLowerCase → "i\u0307" (2 karakter) olur ve replace çalışmaz.
function normalize(str: string): string {
  return str
    .replace(/İ/g, "i").replace(/Ğ/g, "g").replace(/Ü/g, "u")
    .replace(/Ş/g, "s").replace(/Ö/g, "o").replace(/Ç/g, "c")
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c");
}

// Adresin hangi bölgeye ait olduğunu bul
function matchZone(address: string, zoneName: string): boolean {
  const normalAddr = normalize(address);
  const keywords = ZONE_KEYWORDS[zoneName] || [normalize(zoneName)];
  return keywords.some((kw) => normalAddr.includes(normalize(kw)));
}

// Google Distance Matrix ile iki adres arası mesafeyi km olarak al
async function getDistanceKm(origin: string, destination: string): Promise<number | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;
  try {
    const url =
      `https://maps.googleapis.com/maps/api/distancematrix/json` +
      `?origins=${encodeURIComponent(origin)}` +
      `&destinations=${encodeURIComponent(destination)}` +
      `&key=${apiKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    const meters = data?.rows?.[0]?.elements?.[0]?.distance?.value;
    if (typeof meters !== "number") return null;
    return meters / 1000;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vehicleName = searchParams.get("vehicle");
  const bookingType = searchParams.get("type") || "transfer";
  const roundTrip   = searchParams.get("roundTrip") === "true";
  const duration    = searchParams.get("duration") || "4 Saat";
  const pickup      = searchParams.get("pickup") || "";
  const dropoff     = searchParams.get("dropoff") || "";

  if (!vehicleName) {
    return NextResponse.json({ error: "Araç belirtilmedi" }, { status: 400 });
  }

  try {
    // Araç tipini belirle
    const vehicleType = vehicleName.includes("Vito")    ? "Vito"
      : vehicleName.includes("Sprinter")                ? "Sprinter"
      : vehicleName.includes("S-Class") || vehicleName.includes("Maybach") ? "S-Class"
      : null;

    // ── 1. SABİT ROTA — bölge eşleştirmesi ─────────────────────────────────
    if (bookingType === "transfer" && vehicleType && pickup && dropoff) {
      const allRoutes = await db.fixedRoute.findMany({
        where: { vehicleType: { contains: vehicleType, mode: "insensitive" } },
        orderBy: { id: "asc" },
      });

      console.log(`[calculate-price] ${vehicleType} | pickup="${pickup}" | dropoff="${dropoff}" | routes found: ${allRoutes.length}`);

      // Normal yön: pickup → dropoff
      const matched = allRoutes.find(
        (r) => matchZone(pickup, r.fromLocation) && matchZone(dropoff, r.toLocation)
      );
      if (matched) {
        const price = roundTrip ? matched.priceUsd * 2 : matched.priceUsd;
        console.log(`[calculate-price] MATCHED: ${matched.fromLocation} → ${matched.toLocation} = $${matched.priceUsd}`);
        return NextResponse.json({ priceUsd: Math.round(price), source: "fixed", route: `${matched.fromLocation}→${matched.toLocation}` });
      }

      // Ters yön: dropoff → pickup (otel → havalimanı transferi)
      const matchedReverse = allRoutes.find(
        (r) => matchZone(dropoff, r.fromLocation) && matchZone(pickup, r.toLocation)
      );
      if (matchedReverse) {
        const price = roundTrip ? matchedReverse.priceUsd * 2 : matchedReverse.priceUsd;
        console.log(`[calculate-price] MATCHED REVERSE: ${matchedReverse.fromLocation} → ${matchedReverse.toLocation} = $${matchedReverse.priceUsd}`);
        return NextResponse.json({ priceUsd: Math.round(price), source: "fixed-reverse", route: `${matchedReverse.fromLocation}→${matchedReverse.toLocation}` });
      }

      console.log(`[calculate-price] NO ZONE MATCH for pickup="${normalize(pickup)}" dropoff="${normalize(dropoff)}"`);
      allRoutes.forEach(r => {
        console.log(`  route: ${r.fromLocation}→${r.toLocation} | fromMatch=${matchZone(pickup,r.fromLocation)} toMatch=${matchZone(dropoff,r.toLocation)}`);
      });
    }

    // ── 2. Aracı DB'den al ──────────────────────────────────────────────────
    const vehicle = await db.vehicle.findFirst({
      where: { name: { contains: vehicleType ?? vehicleName.split(" ")[0], mode: "insensitive" } },
    });
    if (!vehicle) {
      return NextResponse.json({ error: "Araç bulunamadı" }, { status: 404 });
    }

    // ── 3. Saatlik tahsis ───────────────────────────────────────────────────
    if (bookingType === "hourly") {
      const multiplier = HOURLY_MULTIPLIERS[duration] ?? 1;
      return NextResponse.json({
        priceUsd: Math.round(vehicle.basePriceUsd * multiplier),
        source: "hourly",
      });
    }

    // ── 4. Transfer: mesafe bazlı fallback ──────────────────────────────────
    if (pickup && dropoff && vehicle.pricePerKm > 0) {
      const distanceKm = await getDistanceKm(pickup, dropoff);
      if (distanceKm !== null) {
        // İlk 40km taban fiyata dahil, sonrası km başına ücret
        const BASE_KM = 40;
        let priceUsd = vehicle.basePriceUsd;
        if (distanceKm > BASE_KM) {
          priceUsd += (distanceKm - BASE_KM) * vehicle.pricePerKm;
        }
        if (roundTrip) priceUsd *= 2;
        return NextResponse.json({
          priceUsd: Math.round(priceUsd),
          source: "distance",
          distanceKm: Math.round(distanceKm),
        });
      }
    }

    // ── 5. Son çare: sadece taban fiyat ────────────────────────────────────
    const priceUsd = roundTrip ? vehicle.basePriceUsd * 2 : vehicle.basePriceUsd;
    return NextResponse.json({ priceUsd: Math.round(priceUsd), source: "base" });

  } catch (error) {
    console.error("Fiyat hesaplanamadı:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
