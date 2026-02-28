import Image from "next/image"
import Link from "next/link"
import { Car, Info, Calendar, MapPin } from "lucide-react"
import { db } from "@/app/lib/db"
import ToursGrid from "./ToursGrid"

export default async function ToursPage() {
  const tours = await db.tour.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })

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
            Özel Rotalar & <br />
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
            <Info className="shrink-0 mt-0.5" size={20} />
            <p>
              <strong>Bilgilendirme:</strong> Listelenen hizmetler{" "}
              <span className="underline">sadece şoförlü araç tahsis ve ulaşım hizmetini</span> kapsamaktadır.
              Müze girişleri, rehberlik hizmeti ve otel konaklaması fiyata dahil değildir.
            </p>
          </div>

          <ToursGrid tours={tours} />

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
