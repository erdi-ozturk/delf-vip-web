import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, ShieldCheck, Star, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      
      {/* --- 1. HERO SECTION (Giriş) --- */}
      <section className="relative h-[400px] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Arka Plan Resmi */}
        <div className="absolute inset-0 opacity-30">
            <Image 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
                alt="Istanbul City"
                fill
                className="object-cover"
                priority
                unoptimized={true} // Garanti olsun diye buna da ekledim
            />
        </div>
        {/* Gradient Katman */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-900"></div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mt-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Yolculuğun <span className="text-amber-500">VIP Hali.</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto">
                İstanbul'un karmaşasında size özel, konforlu ve güvenli bir alan yaratıyoruz.
            </p>
        </div>
      </section>

      {/* --- 2. HİKAYEMİZ & MİSYON --- */}
      <section className="py-20 px-4 relative z-20 -mt-20">
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                
                {/* Dekoratif Arka Plan */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-12 -mt-12"></div>

                {/* Sol: Görsel Alanı */}
                <div className="md:w-1/2 relative">
                    <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-lg z-10">
                        {/* --- KRİTİK DÜZELTME BURADA --- */}
                        <Image 
                            src="/hakkimizda.avif"
                            alt="Our Driver"
                            fill
                            className="object-cover"
                           unoptimized={true} // BU SATIR SAYESİNDE RESİM KESİN GELECEK
                        />
                    </div>
                    {/* Deneyim Kartı */}
                    <div className="absolute -bottom-6 -right-6 z-20 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-bounce-slow">
                        <p className="text-4xl font-bold text-amber-500 mb-1">10k+</p>
                        <p className="font-bold text-slate-900 mb-1">Mutlu Müşteri</p>
                        <p className="text-xs text-gray-500 w-40">Dünyanın dört bir yanından misafirlerimizi ağırladık.</p>
                    </div>
                </div>

                {/* Sağ: İçerik Alanı */}
                <div className="md:w-1/2 space-y-8">
                    <div>
                        <h4 className="text-amber-600 font-bold uppercase tracking-wider text-sm mb-2">Hakkımızda</h4>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Konfor ve Güvenin <br/>Tek Adresi.</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            DELF VIP olarak, sadece sizi bir noktadan diğerine götürmüyoruz; size özel bir deneyim tasarlıyoruz. 
                            İstanbul Havalimanı ve Sabiha Gökçen başta olmak üzere, tüm şehirlerarası transferlerinizde 
                            Mercedes-Benz filomuzla hizmet veriyoruz.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Deneyimli, yabancı dil bilen ve protokol kurallarına hakim şoförlerimizle, 
                            iş gezilerinizden tatil planlarınıza kadar her an yanınızdayız.
                        </p>
                    </div>
                    
                    {/* Özellikler Grid */}
                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                        <div className="flex items-start gap-3">
                            <div className="bg-amber-50 p-2 rounded-lg text-amber-600 shrink-0">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">TÜRSAB Belgeli</h3>
                                <p className="text-sm text-gray-500">Resmi ve lisanslı acente.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-amber-50 p-2 rounded-lg text-amber-600 shrink-0">
                                <Star size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">VIP Hizmet</h3>
                                <p className="text-sm text-gray-500">Premium araç filosu.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-amber-50 p-2 rounded-lg text-amber-600 shrink-0">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Özel Şoför</h3>
                                <p className="text-sm text-gray-500">Yabancı dil bilen ekip.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-amber-50 p-2 rounded-lg text-amber-600 shrink-0">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">7/24 Destek</h3>
                                <p className="text-sm text-gray-500">Her an yanınızdayız.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <Link href="/contact" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold transition-all inline-flex shadow-lg shadow-slate-900/20 hover:shadow-amber-500/20 hover:bg-amber-600">
                            İletişime Geçin
                        </Link>
                    </div>

                </div>
            </div>
        </div>
      </section>
    </main>
  )
}