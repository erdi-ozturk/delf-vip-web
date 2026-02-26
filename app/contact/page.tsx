import type { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: "İletişim",
  description: "DELF VIP ile iletişime geçin. 7/24 rezervasyon hattı, WhatsApp destek ve İstanbul ofis bilgileri.",
  openGraph: {
    title: "İletişim | DELF VIP Transfer",
    description: "DELF VIP ile iletişime geçin. 7/24 rezervasyon hattı ve WhatsApp destek.",
    url: "https://www.delfvip.com/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* --- HEADER --- */}
      <section className="bg-slate-900 py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Bize Ulaşın</h1>
        {/* GÜNCELLENDİ: Metin */}
        <p className="text-gray-400">DELF VIP ayrıcalığıyla 7/24 hizmetinizdeyiz.</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 pb-20">
        
        {/* İletişim Kartları */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 mb-4">
                    <Phone size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Telefon & WhatsApp</h3>
                <p className="text-gray-500 text-sm mb-4">7/24 Bizi arayabilirsiniz.</p>
                {/* GÜNCELLENDİ: Telefon Numaran */}
                <a href="tel:+905441459199" className="text-lg font-bold text-amber-600 hover:text-amber-700 block">
                    +90 544 145 91 99
                </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 mb-4">
                    <Mail size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">E-Posta Adresi</h3>
                <p className="text-gray-500 text-sm mb-4">Kurumsal talepleriniz için.</p>
                {/* GÜNCELLENDİ: Mail Adresi */}
                <a href="mailto:info@delfvip.com" className="text-lg font-bold text-amber-600 hover:text-amber-700 block">
                    info@delfvip.com
                </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 mb-4">
                    <MapPin size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Merkez Ofis</h3>
                <p className="text-gray-500 text-sm mb-4">7/24 Hizmet Noktası</p>
                <p className="text-slate-800 font-medium text-sm px-4">İstanbul Havalimanı Yolu Üzeri, Arnavutköy/İSTANBUL</p>
            </div>

        </div>

        {/* Harita ve Form Alanı */}
        <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden">
            
            {/* Sol: Harita */}
            <div className="bg-gray-200 h-[400px] lg:h-auto w-full relative">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001.696956799074!2d28.725968376518865!3d41.20625697132378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa36066266037%3A0xb35555577636e093!2zxLBzdGFuYnVsIEhhdmFsaW1hbsSx!5e0!3m2!1str!2str!4v1715000000000!5m2!1str!2str" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy"
                    className="absolute inset-0 grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                ></iframe>
            </div>

            {/* Sağ: İletişim Formu */}
            <div className="p-8 lg:p-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Bize Mesaj Gönderin</h2>
                <ContactForm />
            </div>

        </div>

      </div>
    </main>
  )
}