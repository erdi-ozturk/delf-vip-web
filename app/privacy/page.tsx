import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "DELF VIP Transfer gizlilik politikası: kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.",
  robots: { index: false },
  openGraph: {
    title: "Gizlilik Politikası | DELF VIP Transfer",
    description: "Kişisel verilerinizin güvenliği ve gizliliği hakkında bilgi edinin.",
    url: "https://www.delfvip.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="bg-gray-50 min-h-screen pb-20">
      <section className="bg-slate-900 py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Gizlilik Politikası</h1>
        <p className="text-gray-400">Verilerinizin güvenliği bizim için önemlidir.</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm space-y-8 text-gray-700 leading-relaxed">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Veri Toplama</h2>
                <p>DELF VIP olarak, hizmetlerimizi sunabilmek adına yalnızca gerekli olan (Ad, Soyad, Telefon, Uçuş Bilgileri) kişisel verilerinizi talep etmekteyiz. Bu veriler sadece rezervasyonunuzu gerçekleştirmek için kullanılır.</p>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Veri Güvenliği</h2>
                <p>Kişisel bilgileriniz, yasal zorunluluklar haricinde üçüncü şahıslarla kesinlikle paylaşılmamaktadır. Verileriniz güvenli sunucularda saklanmaktadır.</p>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Çerezler (Cookies)</h2>
                <p>Web sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerez kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman engelleyebilirsiniz.</p>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. İletişim</h2>
                <p>Gizlilik politikamızla ilgili sorularınız için info@delfvip.com adresinden bize ulaşabilirsiniz.</p>
            </div>
        </div>
      </div>
    </main>
  )
}