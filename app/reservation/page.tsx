import BookingForm from "@/components/BookingForm";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, Star } from "lucide-react";

export default function ReservationPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 relative">
      
      {/* ARKA PLAN: Premium Koyu Tema */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        <Image 
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
            alt="VIP Transfer"
            fill
            className="object-cover opacity-20"
        />
        {/* Dekoratif Işıklar */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl w-full mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* SOL TARAF: İkna Edici Yazılar */}
        <div className="text-white space-y-8 order-2 lg:order-1 text-center lg:text-left">
            <div>
                <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/50 rounded-full px-4 py-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm mb-4">
                    <Star size={14} fill="currentColor" /> %100 Memnuniyet
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                    Yolculuğunuzu <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Şimdi Planlayın.</span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Formu doldurun, size en uygun VIP aracı seçin ve ödemenizi güvenle tamamlayın. Şoförünüz sizi bekliyor olacak.
                </p>
            </div>

            {/* Avantajlar Listesi */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                        <CheckCircle2 size={20} />
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-white text-sm">Ücretsiz İptal</h4>
                        <p className="text-xs text-gray-400">Son 24 saate kadar</p>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3">
                    <div className="bg-amber-500/20 p-2 rounded-lg text-amber-400">
                        <ShieldCheck size={20} />
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-white text-sm">Sabit Fiyat</h4>
                        <p className="text-xs text-gray-400">Sürpriz ücret yok</p>
                    </div>
                </div>
            </div>

            {/* Alt Bilgi */}
            <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-500">
                    Sorularınız mı var? <span className="text-white font-bold">+90 544 145 91 99</span>
                </p>
            </div>
        </div>

        {/* SAĞ TARAF: Rezervasyon Formu */}
        <div className="order-1 lg:order-2">
            <BookingForm />
        </div>

      </div>
    </main>
  )
}