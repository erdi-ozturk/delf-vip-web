import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Plane, Map, Clock, Briefcase, Star, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Gem } from "lucide-react"

export const metadata: Metadata = {
  title: "Hizmetlerimiz",
  description: "DELF VIP Transfer hizmetleri: havalimanı karşılama, şehirlerarası transfer, saatlik araç kiralama, kurumsal seyahat, gelin arabası ve özel şehir turları.",
  openGraph: {
    title: "Hizmetlerimiz | DELF VIP Transfer",
    description: "İstanbul'da VIP transfer, saatlik araç kiralama ve kurumsal ulaşım çözümleri.",
    url: "https://www.delfvip.com/services",
  },
};

export default function ServicesPage() {
  
  const services = [
    {
      id: 1,
      title: "Havalimanı VIP Transfer",
      description: "İstanbul Havalimanı ve Sabiha Gökçen'den otelinize veya evinize, uçuşunuzu takip ederek tam zamanında karşılama.",
      icon: Plane,
      image: "/images/cars/istanbul-airpot-shuttle-transfer-tour.png"
    },
    {
      id: 2,
      title: "Şehirlerarası Transfer",
      description: "İstanbul'dan Bursa, Sapanca, Antalya, Bodrum gibi şehirlere lüks araçlarımızla konforlu ve güvenli yolculuk.",
      icon: Map,
      image: "/images/cars/istanbul-vip-transfer-tour.png"
    },
    {
      id: 3,
      title: "Saatlik & Günlük Tahsis",
      description: "Özel şoförünüzle birlikte aracınızı saatlik veya günlük kiralayın. Siz toplantıdayken şoförünüz sizi beklesin.",
      icon: Clock,
      image: "/images/cars/istanbul-tour-shuttle-vip-transfer.png"
    },
    {
      id: 4,
      title: "Kurumsal & İş Gezileri",
      description: "Misafirleriniz veya yöneticileriniz için prestijli ulaşım çözümleri. Fatura ve kurumsal ödeme kolaylığı.",
      icon: Briefcase,
      image: "/images/tours/kurumsal-gezi.webp"
    },
    {
      id: 5,
      title: "Gelin Arabası & Düğün",
      description: "En özel gününüzde Mercedes Vito VIP araçlarımızla, süsleme seçenekleriyle hizmetinizdeyiz.",
      icon: Star,
      image: "/images/cars/gelin-arabasi.webp"
    },
    {
      id: 6,
      title: "Özel Şehir Turları",
      description: "İstanbul'un tarihi ve turistik yerlerini, bilen bir şoför eşliğinde ailenizle keşfedin.",
      icon: MapPin,
      image: "/images/tours/istanbul-city-tour-transfer.webp"
    }
  ]

  return (
    <main className="bg-gray-50 min-h-screen">
      
      {/* --- 1. HERO SECTION (Giriş) --- */}
      <section className="relative h-[400px] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Arka Plan Deseni */}
        <div className="absolute inset-0 opacity-20">
            
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/50"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm mb-6">
              <Gem size={14} /> Profesyonel Hizmetler
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Yolculuğunuzu <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Özelleştiriyoruz.</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Sadece bir noktadan diğerine gitmek değil, yolculuğun keyfini çıkarmak için tasarlanmış VIP transfer çözümleri.
            </p>
        </div>
      </section>

      {/* --- 2. HİZMET KARTLARI --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                    <div key={service.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 border border-gray-100 hover:border-amber-200">
                        
                        {/* Resim Alanı */}
                        <div className="h-48 relative overflow-hidden">
                            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors z-10"></div>
                            <Image 
                                src={service.image} 
                                alt={service.title} 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* İkon Kutusu */}
                            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-xl shadow-lg z-20 group-hover:bg-slate-900 transition-colors">
                                <service.icon className="text-slate-900 group-hover:text-amber-400 transition-colors" size={24} />
                            </div>
                        </div>

                        {/* İçerik */}
                        <div className="p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                {service.description}
                            </p>
                            
                            <Link href="/booking" className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors">
                                Rezervasyon Yap <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- 3. SÜREÇ (NASIL ÇALIŞIR?) --- */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Dekoratif Çizgiler */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-amber-500 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">VIP Deneyim Nasıl Başlar?</h2>
                <p className="text-gray-400">3 adımda kolay ve güvenli rezervasyon süreci.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Bağlantı Çizgisi (Sadece Desktop) */}
                <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-slate-800 via-amber-500/50 to-slate-800 z-0"></div>

                {/* Adım 1 */}
                <div className="relative z-10 text-center group">
                    <div className="w-24 h-24 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-amber-500 transition-colors shadow-lg shadow-black/50">
                        <span className="text-3xl font-bold text-gray-500 group-hover:text-amber-500">1</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">Aracını Seç</h3>
                    <p className="text-gray-400 text-sm px-6">
                        İhtiyacınıza uygun Vito veya Sprinter aracınızı seçin, tarih ve saati belirleyin.
                    </p>
                </div>

                {/* Adım 2 */}
                <div className="relative z-10 text-center group">
                    <div className="w-24 h-24 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-amber-500 transition-colors shadow-lg shadow-black/50">
                        <span className="text-3xl font-bold text-gray-500 group-hover:text-amber-500">2</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">Onay ve Karşılama</h3>
                    <p className="text-gray-400 text-sm px-6">
                        Rezervasyonunuz anında onaylanır. Şoförünüz sizi havalimanında isim tabelasıyla karşılar.
                    </p>
                </div>

                {/* Adım 3 */}
                <div className="relative z-10 text-center group">
                    <div className="w-24 h-24 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-amber-500 transition-colors shadow-lg shadow-black/50">
                        <span className="text-3xl font-bold text-gray-500 group-hover:text-amber-500">3</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">VIP Yolculuk</h3>
                    <p className="text-gray-400 text-sm px-6">
                        Wifi, ikramlar ve konforlu koltuklar eşliğinde yolculuğun tadını çıkarın. Ödemeyi araçta yapın.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* --- 4. ALT CTA --- */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Özel Bir Talebiniz mi Var?</h2>
            <p className="text-slate-800 mb-8 text-lg font-medium">
                Düğün, kongre veya kalabalık grup transferleri için size özel fiyat teklifi hazırlayalım.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl">
                    Bize Ulaşın
                </Link>
                <Link href="https://wa.me/905441459199" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl">
                    WhatsApp Destek
                </Link>
            </div>
        </div>
      </section>

    </main>
  )
}