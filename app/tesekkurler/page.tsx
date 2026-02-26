import Link from "next/link";
import { CheckCircle2, MessageSquare, Phone, Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rezervasyonunuz Alındı",
  robots: { index: false },
};

export default function TesekkurlerPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">

        {/* İkon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="text-green-500" size={48} />
          </div>
        </div>

        {/* Başlık */}
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Rezervasyonunuz Alındı!
        </h1>
        <p className="text-gray-500 text-lg mb-2">
          Talebiniz başarıyla kaydedildi.
        </p>
        <p className="text-gray-400 text-sm mb-10">
          Operatörümüz en kısa sürede WhatsApp veya telefon ile sizinle iletişime geçecektir.
        </p>

        {/* Bilgi kutusu */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 text-left space-y-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="text-green-500 mt-0.5 shrink-0" size={20} />
            <div>
              <p className="font-bold text-slate-900 text-sm">WhatsApp Onayı</p>
              <p className="text-gray-500 text-xs">Açılan WhatsApp penceresinden mesajı gönderdiyseniz operatörümüz sizi görecektir.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="text-amber-500 mt-0.5 shrink-0" size={20} />
            <div>
              <p className="font-bold text-slate-900 text-sm">7/24 Destek</p>
              <a href="tel:+905441459199" className="text-amber-600 font-bold text-sm hover:underline">
                +90 544 145 91 99
              </a>
            </div>
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/905441459199"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <MessageSquare size={18} /> WhatsApp'ı Aç
          </a>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-400 text-slate-700 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Home size={18} /> Anasayfaya Dön
          </Link>
        </div>

      </div>
    </main>
  );
}
