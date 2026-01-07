import { client } from "@/sanity/lib/client"
import { PortableText } from "@portabletext/react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

// 1. O tura ait verileri çeken fonksiyon
async function getTour(slug: string) {
  const query = `*[_type == "tour" && slug.current == "${slug}"][0]{
    title,
    "imageUrl": mainImage.asset->url,
    price,
    duration,
    description,
    whatsappMessage
  }`
  
  const tour = await client.fetch(query)
  return tour
}

// 2. Sayfa Yapısı
export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tour = await getTour(slug)

  // Eğer tur bulunamazsa 404 sayfasına at
  if (!tour) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Üst Görsel Alanı */}
      <div className="relative h-[50vh] w-full">
        {tour.imageUrl ? (
          <Image 
            src={tour.imageUrl} 
            alt={tour.title} 
            fill 
            className="object-cover"
            priority
          />
        ) : (
          <div className="bg-gray-200 h-full w-full flex items-center justify-center">Görsel Yok</div>
        )}
        <div className="absolute inset-0 bg-black/40" /> {/* Karartma efekti */}
        <div className="absolute bottom-0 left-0 p-8 text-white max-w-6xl mx-auto w-full">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{tour.title}</h1>
          <p className="text-xl opacity-90">{tour.duration || "Günlük Tur"}</p>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="max-w-4xl mx-auto p-8 -mt-10 relative bg-white rounded-t-3xl shadow-xl">
        
        <div className="flex flex-col md:flex-row gap-8 justify-between">
          
          {/* Sol: Açıklamalar */}
          <div className="md:w-2/3 prose lg:prose-xl">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Tur Programı & Detaylar</h3>
            <div className="text-gray-600 leading-relaxed">
              {/* Sanity'den gelen zengin metni buraya basıyoruz */}
              {tour.description && <PortableText value={tour.description} />}
            </div>
          </div>

          {/* Sağ: Fiyat ve Buton (Yapışkan Menü) */}
          <div className="md:w-1/3">
            <div className="sticky top-10 bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 mb-1">Başlangıç Fiyatı</p>
              <div className="text-3xl font-bold text-gray-900 mb-6">{tour.price}€</div>
              
              <div className="space-y-3">
                <Link 
                  href={`https://wa.me/905000000000?text=${encodeURIComponent(tour.whatsappMessage || "Bilgi almak istiyorum")}`}
                  target="_blank"
                  className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-green-200 shadow-lg transform hover:-translate-y-1"
                >
                  WhatsApp ile Planla 💬
                </Link>
                
                <p className="text-xs text-center text-gray-400 mt-4">
                  * Fiyatlar araç başı fiyattır, kişi başı değildir.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}