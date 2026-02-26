import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description: "DELF VIP Transfer kullanım koşulları: rezervasyon, iptal, iade politikası ve hizmet şartları.",
  robots: { index: false },
  openGraph: {
    title: "Kullanım Koşulları | DELF VIP Transfer",
    description: "Rezervasyon, iptal ve iade politikası dahil tüm hizmet şartlarımızı öğrenin.",
    url: "https://www.delfvip.com/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="bg-gray-50 min-h-screen pb-20">
      <section className="bg-slate-900 py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Kullanım Koşulları</h1>
        <p className="text-gray-400">Hizmet alım şartları ve kurallar.</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm space-y-8 text-gray-700 leading-relaxed">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Rezervasyon ve Onay</h2>
                <p>Web sitesi üzerinden yapılan rezervasyonlar, tarafımızca onaylandıktan sonra kesinlik kazanır. Yanlış girilen bilgilerden (Tarih, saat, uçuş kodu) müşteri sorumludur.</p>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. İptal ve İade</h2>
                <p>Transfer saatine 12 saat kala yapılan iptallerde ücret talep edilmez. Daha geç yapılan iptallerde hizmet bedelinin bir kısmı talep edilebilir.</p>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Yolcu ve Bagaj</h2>
                <p>Araç kapasitesini aşan yolcu veya bagaj durumunda, DELF VIP ek ücret talep etme veya hizmeti vermeme hakkını saklı tutar. Lütfen rezervasyon sırasında doğru araç tipini seçiniz.</p>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Bekleme Süresi</h2>
                <p>Havalimanı karşılamalarında uçak inişinden itibaren 1 saat, otel/adres alımlarında ise 15 dakika ücretsiz bekleme süresi vardır.</p>
            </div>
        </div>
      </div>
    </main>
  )
}