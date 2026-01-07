"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Users, Star, ArrowRight, Calendar, Info, Car } from "lucide-react"
import { useCurrency } from "@/components/CurrencyContext"

export default function ToursPage() {
  
  const { convertPrice } = useCurrency()

  // BAZ FİYATLAR ARTIK DOLAR ($)
  const tours = [
    {
      id: 1,
      title: "Tarihi Yarımada Ulaşım & Tahsis",
      location: "Sultanahmet, İstanbul",
      image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=1000&auto=format&fit=crop",
      duration: "10 Saat (Araç Tahsis)",
      rating: "4.9",
      priceUsd: 220, // ÖRNEK: 220 Dolar
      tags: ["Şoförlü Araç", "Günlük", "Transfer"]
    },
    {
      id: 2,
      title: "Sapanca & Maşukiye Transfer",
      location: "Sakarya",
      image: "https://images.unsplash.com/photo-1550586678-f7225f03c44b?q=80&w=1000&auto=format&fit=crop",
      duration: "Tam Gün (Gidiş-Dönüş)",
      rating: "5.0",
      priceUsd: 280, // ÖRNEK: 280 Dolar
      tags: ["Doğa", "Beklemeli", "VIP"]
    },
    {
      id: 3,
      title: "Bursa & Uludağ Ulaşım",
      location: "Bursa",
      image: "https://images.unsplash.com/photo-1551524164-687a55dd1126?q=80&w=1000&auto=format&fit=crop",
      duration: "Günübirlik Transfer",
      rating: "4.8",
      priceUsd: 330, // ÖRNEK: 330 Dolar
      tags: ["Kayak", "Teleferik", "Ulaşım"]
    },
    {
      id: 5,
      title: "Kapadokya VIP Transfer",
      location: "Nevşehir",
      image: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=1000&auto=format&fit=crop",
      duration: "Şehirlerarası",
      rating: "5.0",
      priceUsd: 650, 
      tags: ["Şehirlerarası", "Tek Yön", "VIP"]
    },
    {
      id: 6,
      title: "Lüks Alışveriş Noktaları Transferi",
      location: "Zorlu & İstinye Park",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
      duration: "6 Saat Tahsis",
      rating: "4.7",
      priceUsd: 200, 
      tags: ["Alışveriş", "Beklemeli", "VIP"]
    }
  ]

  return (
    <main className="bg-gray-50 min-h-screen">
      
      <section className="relative h-[500px] flex items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
            <Image 
                src="https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=1998&auto=format&fit=crop"
                alt="Turkey Tours"
                fill
                className="object-cover"
                priority
                unoptimized={true}
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/50 rounded-full px-4 py-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm mb-6">
              <Car size={14} /> VIP Ulaşım Hizmetleri
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Özel Rotalar & <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Gezi Transferleri.</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                İstediğiniz rotaya, size özel tahsis edilen şoförlü VIP araçlarımızla konforla ulaşın. Programı siz belirleyin, biz sürelim.
            </p>
        </div>
      </section>

      <section className="py-20 px-4 -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto">
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800 flex items-start gap-3 shadow-md">
                <Info className="shrink-0 mt-0.5" size={20}/>
                <p>
                    <strong>Bilgilendirme:</strong> Listelenen hizmetler <span className="underline">sadece şoförlü araç tahsis ve ulaşım hizmetini</span> kapsamaktadır. 
                    Müze girişleri, rehberlik hizmeti ve otel konaklaması fiyata dahil değildir.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.map((tour) => {
                    // YENİ: Dolar fiyatını çeviriyoruz
                    const { price, symbol } = convertPrice(tour.priceUsd)

                    return (
                        <div key={tour.id} className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 border border-gray-100 hover:border-amber-200 flex flex-col">
                            
                            <div className="h-64 relative overflow-hidden bg-gray-200">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60 z-10"></div>
                                <Image 
                                    src={tour.image} 
                                    alt={tour.title} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    unoptimized={true}
                                />
                                
                                <div className="absolute top-4 left-4 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                                    <MapPin size={12} className="text-amber-400"/> {tour.location}
                                </div>
                                <div className="absolute top-4 right-4 z-20 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg">
                                    <Star size={12} fill="currentColor"/> {tour.rating}
                                </div>
                                <div className="absolute bottom-4 left-4 z-20 text-white">
                                    <div className="flex gap-2 text-xs font-medium mb-1 opacity-90">
                                        {tour.tags.map((tag, i) => (
                                            <span key={i} className="bg-white/20 px-2 py-0.5 rounded">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                                        {tour.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={16} className="text-amber-500"/>
                                        <span>{tour.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users size={16} className="text-amber-500"/>
                                        <span>Özel Araç</span>
                                    </div>
                                </div>
                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-400">Tahsis Ücreti</p>
                                        <p className="text-2xl font-bold text-slate-900">{price}{symbol}</p>
                                    </div>
                                    <Link 
                                        href="/contact" 
                                        className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 group-hover:bg-amber-600"
                                    >
                                        Rezervasyon Yap <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="bg-slate-900 rounded-3xl p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                <div className="relative z-10 text-center md:text-left max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kendi Rotanızı Çizin</h2>
                    <p className="text-gray-400 text-lg mb-8">
                        Listelenen rotaların dışında, gitmek istediğiniz özel bir yer mi var? 
                        Şoförlü araç tahsis hizmetimizle rotayı tamamen siz belirleyin.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link href="/contact" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
                           <Info size={20} /> Teklif İsteyin
                        </Link>
                        <Link href="/booking" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold backdrop-blur-sm transition-all flex items-center justify-center gap-2">
                           <Calendar size={20} /> Araç Kiralayın
                        </Link>
                    </div>
                </div>
                <div className="relative z-10 hidden md:block">
                     <div className="w-64 h-64 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/20">
                        <MapPin size={80} className="text-white animate-bounce" />
                     </div>
                </div>
            </div>
        </div>
      </section>

    </main>
  )
}