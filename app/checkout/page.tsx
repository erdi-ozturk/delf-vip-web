"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  MapPin, Calendar, Clock, User, Mail, Phone, 
  MessageSquare, CheckCircle2, AlertCircle, ArrowRight, Plane, History 
} from "lucide-react"

export default function CheckoutPage() {
  const searchParams = useSearchParams()

  // --- URL'DEN VERİLERİ ÇEKME ---
  const bookingType = searchParams.get("type") || "transfer"; // 'transfer' veya 'hourly'
  
  // Nereden Bilgileri
  const pickupAddr = searchParams.get("pickup") || "Belirtilmedi";
  const pickupName = searchParams.get("pickupName") || pickupAddr;

  // Nereye Bilgileri
  const dropoffAddr = searchParams.get("dropoff") || "Belirtilmedi";
  const dropoffName = searchParams.get("dropoffName") || dropoffAddr;

  // Saatlik Mod için Süre
  const duration = searchParams.get("duration") || "4 Saat";

  const dateStr = searchParams.get("date");
  const returnDateStr = searchParams.get("returnDate");
  const vehicle = searchParams.get("vehicle") || "Araç Seçilmedi";
  const price = searchParams.get("price") || "0 ₺";
  const passengers = searchParams.get("passengers") || "1";

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    note: ""
  });

  // --- TARİH FORMATLAMA ---
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Seçilmedi";
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            weekday: 'long'
        }).format(date);
    } catch (e) {
        return dateString;
    }
  }

  // --- WHATSAPP MESAJI ---
  const handleWhatsAppClick = () => {
    const typeLabel = bookingType === 'hourly' ? "SAATLİK TAHSİS" : "TRANSFER";
    
    const message = `
*Merhaba, Web Sitenizden Yeni ${typeLabel} Talebi!* 🚐✨

*👤 İletişim Bilgileri:*
Ad Soyad: ${formData.name || "Belirtilmedi"}
Telefon: ${formData.phone || "Belirtilmedi"}

*📍 Rezervasyon Detayları:*
Nereden: ${pickupName} (${pickupAddr})
Nereye: ${dropoffName} (${dropoffAddr})
${bookingType === 'hourly' ? `Kiralama Süresi: ${duration}` : ""}
Tarih: ${formatDate(dateStr)}
${returnDateStr ? `Dönüş Tarihi: ${formatDate(returnDateStr)}` : ""}
Yolcu Sayısı: ${passengers} Kişi

*🚐 Araç & Tutar:*
Araç: ${vehicle}
Tutar: ${price}

*📝 Not:* ${formData.note || "Yok"}
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/905441459199?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">Rezervasyonu Tamamla</h1>
        <p className="text-gray-500 text-center mb-10">Bilgilerinizi girin ve transferinizi anında onaylayın.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- SOL TARA: ÖZET KARTI --- */}
          <div className="lg:col-span-1 h-fit">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
              
              {/* Araç Başlığı */}
              <div className="bg-slate-900 text-white p-6 text-center">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                    {bookingType === 'hourly' ? 'SAATLİK VIP TAHSİS' : 'SEÇİLEN PAKET'}
                </p>
                <h3 className="text-xl font-bold">{vehicle}</h3>
              </div>

              <div className="p-6 space-y-8">
                
                {/* Rota Görselleştirmesi */}
                <div className="relative pl-4 border-l-2 border-dashed border-gray-200 ml-2 space-y-8">
                    {/* Alınış */}
                    <div className="relative">
                        <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-sm"></div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">ALINIŞ NOKTASI</span>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{pickupName}</p>
                            <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">{pickupAddr}</p>
                        </div>
                    </div>

                    {/* Varış */}
                    <div className="relative">
                        <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-red-500 border-4 border-white shadow-sm"></div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">VARIŞ NOKTASI</span>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{dropoffName}</p>
                            <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">{dropoffAddr}</p>
                        </div>
                    </div>
                </div>

                {/* Bilgi Kutusu */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                    <div className="flex items-start gap-3">
                        <Calendar className="text-amber-500 mt-0.5 shrink-0" size={18} />
                        <div>
                            <span className="text-xs font-bold text-gray-400 block uppercase">Başlangıç Tarihi</span>
                            <span className="text-sm font-bold text-slate-900">{formatDate(dateStr)}</span>
                        </div>
                    </div>

                    {/* Saatlik Mod ise Süreyi Göster */}
                    {bookingType === 'hourly' && (
                        <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                            <Clock className="text-amber-500 mt-0.5 shrink-0" size={18} />
                            <div>
                                <span className="text-xs font-bold text-gray-400 block uppercase">Tahsis Süresi</span>
                                <span className="text-sm font-bold text-slate-900">{duration} Boyunca</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Transfer Modu ve Dönüş varsa */}
                    {bookingType === 'transfer' && returnDateStr && (
                        <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                            <History className="text-amber-500 mt-0.5 shrink-0" size={18} />
                            <div>
                                <span className="text-xs font-bold text-gray-400 block uppercase">Dönüş Tarihi</span>
                                <span className="text-sm font-bold text-slate-900">{formatDate(returnDateStr)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fiyat */}
                <div className="flex justify-between items-end border-t border-gray-100 pt-6">
                    <span className="text-sm text-gray-500 font-medium">Toplam Tutar</span>
                    <span className="text-3xl font-bold text-slate-900 text-right">{price}</span>
                </div>

              </div>
              
              <div className="bg-amber-50 p-4 flex items-center justify-center gap-2 text-amber-700 text-xs font-bold border-t border-amber-100">
                 <CheckCircle2 size={16} /> Ücretsiz İptal ve Bekleme Garantisi
              </div>
            </div>
          </div>

          {/* --- SAĞ TARAF: FORM --- */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <User className="text-amber-500" /> İletişim Bilgileri
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Adınız Soyadınız</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Örn: Ahmet Yılmaz" 
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm font-bold text-slate-900"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Telefon Numaranız</label>
                        <div className="relative">
                            <input 
                                type="tel" 
                                placeholder="+90 555 ..." 
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm font-bold text-slate-900"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">E-Posta Adresi</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                placeholder="ornek@email.com" 
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm font-bold text-slate-900"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Uçuş Kodu (Varsa)</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Örn: TK1923" 
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm font-bold text-slate-900"
                            />
                            <Plane className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>
                    </div>
                </div>

                <div className="space-y-2 mb-8">
                    <label className="text-xs font-bold text-gray-500 uppercase">Şoföre Notunuz (Opsiyonel)</label>
                    <textarea 
                        rows={3}
                        placeholder="Çocuk koltuğu istiyorum, vb..." 
                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm font-bold text-slate-900 resize-none"
                        value={formData.note}
                        onChange={(e) => setFormData({...formData, note: e.target.value})}
                    />
                </div>

                <div className="border-t border-gray-100 pt-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Ödeme Yöntemi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 p-4 border-2 border-amber-500 bg-amber-50/50 rounded-xl cursor-pointer relative">
                            <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-amber-600 focus:ring-amber-500" />
                            <span className="font-bold text-slate-900">Araçta Nakit / Kredi Kartı</span>
                            <span className="absolute top-2 right-2 text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded">ÖNERİLEN</span>
                        </label>
                        <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-not-allowed opacity-60">
                            <input type="radio" name="payment" disabled className="w-5 h-5" />
                            <span className="font-bold text-gray-400">Online Ödeme (Bakımda)</span>
                        </label>
                    </div>
                </div>

                <div className="mt-8">
                    <button 
                        onClick={handleWhatsAppClick}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
                    >
                        <MessageSquare size={24} />
                        WhatsApp ile Onayla & Bitir
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Butona tıkladığınızda WhatsApp uygulaması açılacak ve bilgileriniz bize iletilecektir. Operatörümüz hemen dönüş yapacaktır.
                    </p>
                </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}