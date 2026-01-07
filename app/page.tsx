import BookingForm from "@/components/BookingForm";
import { ShieldCheck, Star, Clock, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* --- 1. HERO SECTION (GİRİŞ) --- */}
      <section className="relative h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
        
        {/* Arka Plan Resmi */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop" 
            alt="VIP Transfer Background" 
            fill 
            className="object-cover brightness-[0.4]" // Resmi kararttık ki yazılar okunsun
            priority
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Sol Taraf: Yazılar */}
          <div className="text-white space-y-6 text-center lg:text-left pt-10 lg:pt-0">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/50 rounded-full px-4 py-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Star size={14} fill="currentColor" /> Premium Taşımacılık
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Şehrin Keyfini <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                VIP Yaşayın.
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              İstanbul Havalimanı, Sabiha Gökçen ve şehirlerarası transferlerinizde, 
              özel şoförlü Mercedes Vito konforuyla 7/24 hizmetinizdeyiz.
            </p>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/tours" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg">
                Rotaları İncele
              </Link>
              <Link href="/contact" className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                İletişime Geç
              </Link>
            </div>

            {/* Alt Bilgi İkonları */}
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-400" /> Sabit Fiyat
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-400" /> Ücretsiz İptal
              </div>
              <div className="flex items-center gap-2">
                 <CheckCircle2 size={18} className="text-green-400" /> Lüks Araçlar
              </div>
            </div>
          </div>

          {/* Sağ Taraf: Rezervasyon Formu */}
          <div className="hidden lg:block">
            <BookingForm />
          </div>

        </div>
      </section>

      {/* --- MOBİL İÇİN FORM ALANI (Sadece Telefonta Gözükür) --- */}
      <div className="lg:hidden px-4 -mt-20 relative z-20 mb-12">
        <BookingForm />
      </div>

      {/* --- 2. ÖZELLİKLER BÖLÜMÜ --- */}
      {/* --- 2. ÖZELLİKLER BÖLÜMÜ --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            {/* GÜNCELLENDİ: Başlık */}
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Neden DELF VIP?</h2>
            <p className="text-gray-500">Sıradan bir yolculuk değil, birinci sınıf bir deneyim sunuyoruz.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Özellik 1 */}
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-transparent hover:border-amber-200 group">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Güvenli Yolculuk</h3>
              <p className="text-gray-500 leading-relaxed">
                Tüm araçlarımız sigortalı, şoförlerimiz profesyonel ve SRC belgeli. Güvenliğiniz bizim önceliğimizdir.
              </p>
            </div>

            {/* Özellik 2 */}
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-transparent hover:border-amber-200 group">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">VIP Konfor</h3>
              <p className="text-gray-500 leading-relaxed">
                Mercedes Vito ve Sprinter araçlarımızla, deri koltuk, wifi ve ikramlar eşliğinde konforun tadını çıkarın.
              </p>
            </div>

            {/* Özellik 3 */}
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-transparent hover:border-amber-200 group">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">7/24 Hizmet</h3>
              <p className="text-gray-500 leading-relaxed">
                Uçağınız ne zaman inerse insin, şoförünüz sizi kapıda isim tabelasıyla bekliyor olacak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. CTA (Çağrı) BÖLÜMÜ --- */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        {/* Arka plan süslemesi */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Özel Bir Yolculuğa Hazır mısınız?
          </h2>
          <p className="text-gray-400 mb-10 text-lg max-w-2xl mx-auto">
            Hemen rezervasyon yapın veya özel talepleriniz için bize WhatsApp üzerinden ulaşın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link href="/booking" className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-amber-500/20 transition-all">
                Hemen Rezervasyon Yap
             </Link>
             <Link href="/contact" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-10 py-4 rounded-xl font-bold text-lg backdrop-blur-sm transition-all">
                Bize Ulaşın
             </Link>
          </div>
        </div>
      </section>

    </main>
  );
}