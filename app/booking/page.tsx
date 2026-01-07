"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Users, Briefcase, CheckCircle2, Star, ShieldCheck, ArrowRight, MapPin, Calendar, Info, AlertCircle } from "lucide-react"
import { useCurrency } from "@/components/CurrencyContext"

export default function BookingSelectionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const from = searchParams.get("from") || "Konum Belirtilmedi"
  const to = searchParams.get("to") || "Konum Belirtilmedi"
  const date = searchParams.get("date") || "Tarih Seçilmedi"
  const time = searchParams.get("time") || ""
  const passengers = searchParams.get("passengers") || "1"
  const type = searchParams.get("type") || "tek-yon"

  const { convertPrice } = useCurrency()

  // ARAÇ LİSTESİ (FİYATLAR ARTIK DOLAR BAZLI)
  const vehicles = [
    {
      id: 1,
      name: "Mercedes-Benz Vito VIP",
      type: "Premium Minivan",
      image: "/vehicles/vito.png", 
      capacity: "6",
      luggage: "6",
      priceUsd: 50, // 55 Dolar
      badge: "En Çok Tercih Edilen",
      features: ["Ücretsiz Wifi", "Deri Koltuk", "Klima", "Su & Atıştırmalık", "Bluetooth"]
    },
    {
      id: 2,
      name: "Mercedes-Benz Sprinter",
      type: "Large Group Van",
      image: "/vehicles/sprinter.png",
      capacity: "16",
      luggage: "12",
      priceUsd: 150, // 110 Dolar
      badge: "",
      features: ["Geniş İç Hacim", "TV Ünitesi", "Buzdolabı", "USB Şarj", "Yatar Koltuk"]
    },
    {
      id: 3,
      name: "S-Class Maybach",
      type: "Luxury Sedan",
      image: "/vehicles/sclass.png",
      capacity: "3",
      luggage: "2",
      priceUsd: 270, // 275 Dolar
      badge: "Lüks Seçim",
      features: ["Masajlı Koltuk", "Şampanya İkramı", "Özel Şoför", "Gizlilik Camı"]
    }
  ]

  const handleSelect = (vehicleName: string, finalPrice: string) => {
    const params = new URLSearchParams({
      from, to, date, time,
      vehicle: vehicleName,
      price: finalPrice 
    }).toString()
    
    router.push(`/checkout?${params}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between md:justify-center md:gap-12 text-sm font-medium">
            <div className="flex items-center gap-2 text-gray-400">
                <span className="w-6 h-6 rounded-full border flex items-center justify-center">1</span>
                <span className="hidden md:inline">Arama</span>
            </div>
            <div className="w-8 h-[1px] bg-gray-300 hidden md:block"></div>
            <div className="flex items-center gap-2 text-amber-600">
                <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-600 flex items-center justify-center">2</span>
                <span>Araç Seçimi</span>
            </div>
            <div className="w-8 h-[1px] bg-gray-300 hidden md:block"></div>
            <div className="flex items-center gap-2 text-gray-400">
                <span className="w-6 h-6 rounded-full border flex items-center justify-center">3</span>
                <span className="hidden md:inline">Ödeme & Onay</span>
            </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm shrink-0">
                    <MapPin className="text-amber-400" />
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <span>Başlangıç & Varış</span>
                    </div>
                    <div className="font-semibold text-lg flex items-center gap-2 flex-wrap">
                        <span>{from}</span>
                        <ArrowRight size={16} className="text-amber-500 shrink-0"/>
                        <span>{to}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm border border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-amber-400"/>
                    <span className="font-medium">{date}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-blue-800">
                <span className="font-bold">Bilgilendirme:</span> Listelenen fiyatlar <span className="font-bold underline">İstanbul içi başlangıç fiyatlarıdır</span>. 
                Mesafenize ve güzergahınıza göre net fiyat, rezervasyon onayı sırasında WhatsApp üzerinden iletilecektir.
            </p>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-6 px-2">Size Uygun Araçlar</h2>

        <div className="space-y-6">
            {vehicles.map((v) => {
                
                let calculatedBasePrice = v.priceUsd
                if (type === "gidis-donus") {
                    calculatedBasePrice = calculatedBasePrice * 2
                }
                
                // Kura Çevir (Dolar'dan Seçilene)
                const { price, symbol } = convertPrice(calculatedBasePrice)

                return (
                    <div key={v.id} className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-amber-300 transition-all duration-300 relative">
                        {v.badge && (
                            <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-bold px-4 py-1.5 rounded-br-xl z-10 shadow-sm flex items-center gap-1">
                                <Star size={12} fill="white" /> {v.badge}
                            </div>
                        )}
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-2/5 relative h-64 md:h-auto bg-gradient-to-br from-gray-50 to-gray-200 p-6 flex items-center justify-center">
                                <Image src={v.image} alt={v.name} fill className="object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700" unoptimized={true} />
                            </div>
                            <div className="p-6 md:w-2/5 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100">
                                <div className="mb-1 text-xs font-bold text-amber-600 uppercase tracking-wide">{v.type}</div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{v.name}</h3>
                                <div className="flex gap-4 mb-6">
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg text-sm text-gray-600 border border-gray-100"><Users size={16} className="text-gray-400"/><span className="font-semibold">{v.capacity}</span> Yolcu</div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg text-sm text-gray-600 border border-gray-100"><Briefcase size={16} className="text-gray-400"/><span className="font-semibold">{v.luggage}</span> Valiz</div>
                                </div>
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                    {v.features.map((f, i) => (<div key={i} className="flex items-center gap-2 text-xs text-gray-500"><CheckCircle2 size={14} className="text-amber-500 shrink-0"/> {f}</div>))}
                                </div>
                            </div>
                            <div className="p-6 md:w-1/5 bg-gray-50/50 flex flex-col justify-center items-center text-center">
                                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-bold">
                                    {type === "gidis-donus" ? "Gidiş - Dönüş" : "Başlangıç Fiyatı"}
                                </div>
                                <div className="text-4xl font-bold text-slate-900 mb-1">{price}{symbol}</div>
                                <div className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded mb-4">Ücretsiz İptal</div>
                                <button onClick={() => handleSelect(v.name, `${price}${symbol}`)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group-hover:scale-105">Seç <ArrowRight size={16} className="text-amber-400"/></button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  )
}