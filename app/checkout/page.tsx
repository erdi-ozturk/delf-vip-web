"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { MapPin, Calendar, User, Phone, Mail, FileText, ShieldCheck, ArrowRight } from "lucide-react"

export default function CheckoutPage() {
  const searchParams = useSearchParams()

  // URL'den gelen verileri alıyoruz
  const from = searchParams.get("from") || "Belirtilmedi"
  const to = searchParams.get("to") || "Belirtilmedi"
  const date = searchParams.get("date") || "Tarih Yok"
  const time = searchParams.get("time") || ""
  const vehicle = searchParams.get("vehicle") || "Araç Seçilmedi"
  
  // DÜZELTME: Fiyatı olduğu gibi alıyoruz (Zaten önceki sayfada çevrildi)
  // Örn: "58$" veya "1800₺" olarak gelir.
  const finalPrice = searchParams.get("price") || "0€" 

  // Form Verileri
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    flightCode: "",
    note: ""
  })

  // WhatsApp'a Yönlendirme Fonksiyonu
  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault()

    const message = `
🌟 *YENİ REZERVASYON TALEBİ* 🌟

👤 *Müşteri:* ${form.name}
📞 *Tel:* ${form.phone}
📧 *Email:* ${form.email}

🚕 *Araç:* ${vehicle}
💰 *Tutar:* ${finalPrice} (Nakit Ödeme)

📍 *Nereden:* ${from}
🏁 *Nereye:* ${to}
📅 *Tarih:* ${date} - ${time}

✈️ *Uçuş Kodu:* ${form.flightCode || "Yok"}
📝 *Not:* ${form.note || "Yok"}

-------------------------
_Web sitesinden gönderildi._
    `.trim()

    const phoneNumber = "905441459199" 
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    
    window.open(url, "_blank")
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Rezervasyonu Tamamla</h1>
        <p className="text-gray-500">Bilgilerinizi girin ve transferinizi anında onaylayın.</p>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        
        {/* SOL TARAF: Özet Kartı */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-gray-100 sticky top-24">
                <div className="bg-slate-900 p-6 text-white text-center">
                    <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-1">Seçilen Paket</p>
                    <h2 className="text-2xl font-bold">{vehicle}</h2>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Rota */}
                    <div className="relative pl-6 border-l-2 border-dashed border-gray-300 space-y-6">
                        <div className="relative">
                            <div className="absolute -left-[31px] top-0 bg-green-100 p-1.5 rounded-full border-2 border-white shadow-sm">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                            </div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Alınış</p>
                            <p className="text-sm font-bold text-slate-900 line-clamp-2">{from}</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[31px] top-0 bg-red-100 p-1.5 rounded-full border-2 border-white shadow-sm">
                                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                            </div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Varış</p>
                            <p className="text-sm font-bold text-slate-900 line-clamp-2">{to}</p>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Tarih & Fiyat */}
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-400">Tarih & Saat</p>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                <Calendar size={14} className="text-amber-500"/>
                                {date} <span className="text-gray-300">|</span> {time}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Toplam Tutar</p>
                            {/* DÜZELTME: Doğrudan URL'den gelen fiyatı göster */}
                            <p className="text-2xl font-bold text-slate-900">{finalPrice}</p>
                        </div>
                    </div>
                    
                    <div className="bg-amber-50 rounded-xl p-3 flex items-center gap-3 text-xs text-amber-800 border border-amber-100">
                        <ShieldCheck size={16} className="shrink-0"/>
                        <span>Rezervasyonunuz <b>ücretsiz iptal</b> ve <b>bekleme garantisi</b> altındadır.</span>
                    </div>

                </div>
            </div>
        </div>

        {/* SAĞ TARAF: Bilgi Formu */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <User className="text-amber-500" /> İletişim Bilgileri
                </h3>

                <form onSubmit={handleComplete} className="space-y-6">
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Adınız Soyadınız</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-3.5 text-gray-400"/>
                                <input 
                                    type="text" required 
                                    placeholder="Örn: Ahmet Yılmaz"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                                    onChange={(e) => setForm({...form, name: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Telefon Numaranız</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-4 top-3.5 text-gray-400"/>
                                <input 
                                    type="tel" required 
                                    placeholder="+90 555 ..."
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                                    onChange={(e) => setForm({...form, phone: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">E-Posta Adresi</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-3.5 text-gray-400"/>
                                <input 
                                    type="email" required 
                                    placeholder="ornek@email.com"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                                    onChange={(e) => setForm({...form, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Uçuş Kodu (Varsa)</label>
                            <div className="relative">
                                <FileText size={18} className="absolute left-4 top-3.5 text-gray-400"/>
                                <input 
                                    type="text" 
                                    placeholder="Örn: TK1923"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                                    onChange={(e) => setForm({...form, flightCode: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Şoföre Notunuz (Opsiyonel)</label>
                        <textarea 
                            rows={3}
                            placeholder="Çocuk koltuğu istiyorum, vb..."
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                            onChange={(e) => setForm({...form, note: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Ödeme Yöntemi</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="border-2 border-amber-500 bg-amber-50 p-4 rounded-xl flex items-center gap-3 cursor-pointer relative">
                                <div className="w-5 h-5 rounded-full border-2 border-amber-500 bg-amber-500 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <span className="font-bold text-slate-900 text-sm">Araçta Nakit / Kredi Kartı</span>
                                <div className="absolute top-2 right-2 text-amber-600 bg-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm">ÖNERİLEN</div>
                            </label>
                            <label className="border border-gray-200 p-4 rounded-xl flex items-center gap-3 cursor-not-allowed opacity-50">
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                <span className="font-medium text-gray-500 text-sm">Online Ödeme (Bakımda)</span>
                            </label>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-5 rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-3 text-lg mt-6 hover:-translate-y-1"
                    >
                        WhatsApp ile Onayla <ArrowRight />
                    </button>
                    <p className="text-center text-xs text-gray-400">
                        Butona tıkladığınızda WhatsApp uygulaması açılacak ve bilgileriniz bize iletilecektir.
                    </p>

                </form>
            </div>
        </div>

      </div>
    </main>
  )
}