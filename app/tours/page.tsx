"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Users, Star, ArrowRight, Info, Car, Calendar } from "lucide-react"

// ✅ 1. ADIM: Global Dil Merkezini (Context) içe aktar
import { useLanguage } from "@/components/LanguageContext";

export default function ToursPage() {
  
  // ✅ 2. ADIM: Global dili çek
  const { language } = useLanguage();

  // CANLI KUR SİSTEMİ
  const [tryRate, setTryRate] = useState(36); 
  const SAFETY_MARGIN = 1.05; 

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY');
        const data = await res.json();
        
        if (data && data.rates && data.rates.TRY) {
          const liveRate = data.rates.TRY * SAFETY_MARGIN;
          setTryRate(liveRate);
        }
      } catch (error) {
        console.error("Kur çekilemedi, varsayılan değer kullanılıyor.");
      }
    }
    fetchRate();
  }, []);
  // CANLI KUR SİSTEMİ BİTİŞ

  // BAZ FİYATLAR (DOLAR $)
  const tours = [
    {
      id: 1,
      title: "İstanbul Ulaşım & Tahsis",
      location: "Sultanahmet, İstanbul",
      image: "/images/tours/istanbul-vip-transfer-tour.jpg",
      duration: "10 Saat (Araç Tahsis)",
      rating: "4.9",
      priceUsd: 150,
      tags: ["Şoförlü Araç", "Günlük", "Transfer"],
      checkoutParams: new URLSearchParams({
        tourFixed: "true",
        type: "hourly",
        duration: "10 Saat",
        pickup: "İstanbul, Türkiye",
        pickupName: "İstanbul",
        dropoff: "İstanbul, Türkiye",
        dropoffName: "İstanbul",
        vehicle: "Mercedes-Benz Vito VIP",
        price: "$150",
        passengers: "1",
      }).toString(),
    },
    {
      id: 2,
      title: "Sapanca & Maşukiye Transfer",
      location: "Sakarya",
      image: "/images/tours/sapanca-masukiye-vip-transfer-tour.jpg",
      duration: "Tam Gün (Gidiş-Dönüş)",
      rating: "5.0",
      priceUsd: 225,
      tags: ["Doğa", "Beklemeli", "VIP"],
      checkoutParams: new URLSearchParams({
        tourFixed: "true",
        type: "transfer",
        roundTrip: "true",
        pickup: "İstanbul, Türkiye",
        pickupName: "İstanbul",
        dropoff: "Sapanca, Sakarya, Türkiye",
        dropoffName: "Sapanca & Maşukiye",
        vehicle: "Mercedes-Benz Vito VIP",
        price: "$225",
        passengers: "1",
      }).toString(),
    },
    {
      id: 3,
      title: "Bursa & Uludağ Ulaşım",
      location: "Bursa",
      image: "/images/tours/Bursa-Uludag-vip-tour-transfer.jpg",
      duration: "Tam Gün (Gidiş-Dönüş)",
      rating: "4.8",
      priceUsd: 280,
      tags: ["Kayak", "Teleferik", "Ulaşım"],
      checkoutParams: new URLSearchParams({
        tourFixed: "true",
        type: "transfer",
        roundTrip: "true",
        pickup: "İstanbul, Türkiye",
        pickupName: "İstanbul",
        dropoff: "Bursa, Türkiye",
        dropoffName: "Bursa & Uludağ",
        vehicle: "Mercedes-Benz Vito VIP",
        price: "$280",
        passengers: "1",
      }).toString(),
    },
    {
      id: 6,
      title: "Lüks Alışveriş Noktaları Transferi",
      location: "Zorlu & İstinye Park",
      image: "/images/tours/istanbul-transfer-tour.jpeg",
      duration: "8 Saat Tahsis",
      rating: "4.7",
      priceUsd: 120,
      tags: ["Alışveriş", "Beklemeli", "VIP"],
      checkoutParams: new URLSearchParams({
        tourFixed: "true",
        type: "hourly",
        duration: "8 Saat",
        pickup: "İstanbul, Türkiye",
        pickupName: "İstanbul",
        dropoff: "İstanbul, Türkiye",
        dropoffName: "İstanbul",
        vehicle: "Mercedes-Benz Vito VIP",
        price: "$120",
        passengers: "1",
      }).toString(),
    },
  ]

  return (
    <main className="bg-gray-50 min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative h-[500px] flex items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
            <Image 
                src="/images/tours/istanbul-transfer-tour.avif"
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

      {/* TOURS LIST */}
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
                    
                    const price = `$${tour.priceUsd}`;
                    // Güncel kur ile çarpıp yuvarlıyoruz
                    const priceTry = Math.round(tour.priceUsd * tryRate);

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
                                        <p className="text-2xl font-bold text-slate-900">{price}</p>
                                        
                                        {/* ✅ 3. ADIM: Global Dil Kontrolü */}
                                        <p className="text-[10px] text-gray-400">
                                            <span>{language === 'tr' ? 'Yaklaşık' : 'Approx'} </span> 
                                            <span className="notranslate">{priceTry}₺</span>
                                        </p>

                                    </div>
                                    
                                    <Link
                                        href={`/checkout?${tour.checkoutParams}`}
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

      {/* CALL TO ACTION */}
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