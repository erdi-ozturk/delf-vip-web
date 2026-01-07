"use client"
import { Send, CheckCircle2 } from "lucide-react"

export default function CareerPage() {
  
  const handleApply = () => {
    const message = "Merhaba, DELF VIP bünyesinde şoför olarak çalışmak istiyorum. Deneyimim ve belgelerim hakkında bilgi vermek isterim."
    window.open(`https://wa.me/905441459199?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <main className="bg-gray-50 min-h-screen pb-20">
      <section className="bg-slate-900 py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Kariyer / Şoför Başvurusu</h1>
        <p className="text-gray-400">Büyüyen ekibimizin bir parçası olun.</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            
            <div className="md:w-1/2 p-8 md:p-12 space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Aranan Nitelikler</h2>
                <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-gray-700">
                        <CheckCircle2 className="text-amber-500" /> SRC ve Psikoteknik belgelerine sahip
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                        <CheckCircle2 className="text-amber-500" /> Turizm taşımacılığında deneyimli
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                        <CheckCircle2 className="text-amber-500" /> Diksiyonu düzgün ve prezentabl
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                        <CheckCircle2 className="text-amber-500" /> İstanbul yol bilgisine hakim
                    </li>
                </ul>

                <div className="pt-4">
                    <button onClick={handleApply} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all w-full md:w-auto justify-center">
                        WhatsApp ile Başvur <Send size={18} />
                    </button>
                    <p className="text-xs text-gray-500 mt-3 text-center md:text-left">Başvurunuz doğrudan İK yetkilisine iletilecektir.</p>
                </div>
            </div>

            <div className="md:w-1/2 bg-gray-100 relative min-h-[300px]">
                 {/* Ofis veya Şoför görseli - Unsplash */}
                 <img 
                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop" 
                    alt="Career" 
                    className="absolute inset-0 w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-slate-900/20"></div>
            </div>

        </div>
      </div>
    </main>
  )
}