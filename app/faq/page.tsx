import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: "DELF VIP transfer hakkında en çok sorulan sorular: rezervasyon, iptal, ödeme, havalimanı karşılama ve daha fazlası.",
  openGraph: {
    title: "SSS | DELF VIP Transfer",
    description: "Rezervasyon, iptal politikası, ödeme ve havalimanı transferi hakkında tüm sorularınızın cevapları.",
    url: "https://www.delfvip.com/faq",
  },
};

const faqs = [
  {
    q: "Rezervasyonu nasıl yapabilirim?",
    a: "Web sitemiz üzerinden tarih, saat ve güzergah seçerek anında rezervasyon oluşturabilirsiniz. İşlem sonunda WhatsApp üzerinden onay mesajı alırsınız.",
  },
  {
    q: "Ödemeyi ne zaman yapacağım?",
    a: "Ödemeyi transfer işlemi tamamlandığında şoförümüze nakit (EUR, USD veya TL) olarak yapabilirsiniz. Kredi kartı ile ödeme için önceden bilgi vermeniz gerekmektedir.",
  },
  {
    q: "Havalimanında sizi nasıl bulacağım?",
    a: "Uçağınız indiğinde şoförümüz sizi çıkış kapısında isminizin yazılı olduğu bir tabela ile karşılıyor olacak. Ayrıca iniş saatinizde sizinle iletişime geçilecektir.",
  },
  {
    q: "Uçağım rötar yaparsa ne olur?",
    a: "Endişelenmeyin! Uçuş kodunuzu takip ediyoruz. Uçağınız gecikse bile şoförümüz sizi bekliyor olacak. Ekstra bekleme ücreti talep edilmez.",
  },
  {
    q: "Rezervasyonu iptal edebilir miyim?",
    a: "Evet, transfer saatinizden 12 saat öncesine kadar ücretsiz iptal veya değişiklik yapabilirsiniz.",
  },
  {
    q: "Araçlarınızda bebek koltuğu var mı?",
    a: "Evet, rezervasyon sırasında belirtmeniz durumunda araçlarımıza ücretsiz bebek koltuğu ekliyoruz.",
  },
  {
    q: "Grup transferi yapıyor musunuz?",
    a: "Evet, Mercedes Sprinter araçlarımızla 8+1 kişiye kadar grup transferi gerçekleştiriyoruz. Daha büyük gruplar için iletişime geçebilirsiniz.",
  },
  {
    q: "Saatlik araç kiralama nasıl çalışıyor?",
    a: "Minimum 4 saatlik kiralama seçeneğimizle şoförlü aracı istediğiniz amaç için kullanabilirsiniz; şehir turu, alışveriş, iş toplantıları gibi. Fiyat bilgisi için rezervasyon sayfamızı ziyaret edin.",
  },
];

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a,
      },
    })),
  };

  return (
    <main className="bg-gray-50 min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-slate-900 py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Sıkça Sorulan Sorular</h1>
        <p className="text-gray-400">Aklınıza takılan tüm soruların cevapları burada.</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {faqs.map((item, i) => (
            <div key={i} className="border-b border-gray-100 last:border-0 p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600 mt-1 shrink-0">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg mb-2">{item.q}</h2>
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
