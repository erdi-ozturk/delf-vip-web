import { NextRequest, NextResponse } from "next/server"

// Basit in-memory rate limiter: IP başına 30 saniyede max 20 istek
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 30_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen bekleyin." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Sorgu parametresi (q) eksik" }, { status: 400 })
  }

  // Sorgu uzunluğunu sınırla
  if (query.length > 100) {
    return NextResponse.json({ error: "Sorgu çok uzun" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.warn("⚠️ UYARI: GOOGLE_MAPS_API_KEY bulunamadı. Test (Sahte) veriler dönülüyor.")

    const mockData = [
      { place_id: "1", description: "İstanbul Havalimanı (IST)", types: ["airport"] },
      { place_id: "2", description: "Sabiha Gökçen Havalimanı (SAW)", types: ["airport"] },
      { place_id: "3", description: "Taksim Meydanı, İstanbul", types: ["locality"] },
      { place_id: "4", description: "Sultanahmet, Fatih/İstanbul", types: ["locality"] },
      { place_id: "5", description: "Beşiktaş, İstanbul", types: ["locality"] },
      { place_id: "6", description: "Kadıköy Rıhtım, İstanbul", types: ["locality"] },
      { place_id: "7", description: "Swissotel The Bosphorus", types: ["lodging"] },
      { place_id: "8", description: "Hilton Istanbul Bomonti", types: ["lodging"] },
      { place_id: "9", description: "Ankara Esenboğa Havalimanı (ESB)", types: ["airport"] },
      { place_id: "10", description: "Kızılay, Ankara", types: ["locality"] },
    ]

    const filteredMock = mockData.filter(item =>
        item.description.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json(filteredMock.length > 0 ? filteredMock : mockData)
  }

  try {
    const googleUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&language=tr&components=country:tr`

    const res = await fetch(googleUrl)
    const data = await res.json()

    if (data.status === "OK" || data.status === "ZERO_RESULTS") {
      return NextResponse.json(data.predictions)
    } else {
      console.error("Google API Hatası:", data.status, data.error_message)
      return NextResponse.json({ error: data.status }, { status: 500 })
    }

  } catch (error) {
    console.error("Sunucu Hatası:", error)
    return NextResponse.json({ error: "Sunucu bağlantı hatası" }, { status: 500 })
  }
}
