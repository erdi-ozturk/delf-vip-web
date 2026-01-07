import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  // 1. Sorgu yoksa hata dön
  if (!query) {
    return NextResponse.json({ error: "Sorgu parametresi (q) eksik" }, { status: 400 })
  }

  // 2. API Anahtarını .env.local dosyasından çekiyoruz
  // SENİN DOSYANDAKİ İSİM İLE GÜNCELLENDİ:
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  // 3. GÜVENLİK & TEST MODU:
  // Eğer .env dosyasında anahtar okunamazsa veya silinirse site bozulmasın diye sahte veri döner.
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

  // 4. GERÇEK İSTEK: Google Sunucularına Bağlan
  try {
    // Burada da apiKey değişkenini kullanıyoruz
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