import Image from "next/image";
import Link from "next/link";
import { Users, Briefcase, Plane, Lock, HandMetal, ThumbsUp } from "lucide-react";

interface VehicleProps {
  name: string;
  image: string;
  capacity: { person: number; bag: number };
  prices: { eur: number; usd: number; try: number; gbp: number };
}

export default function VehicleCard({ name, image, capacity, prices }: VehicleProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow duration-300">
      
      {/* SOL: Resim Alanı */}
      <div className="relative w-full md:w-1/3 h-64 md:h-auto bg-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover md:object-contain p-4"
        />
        {/* Sol üst köşe etiketi (İsteğe bağlı) */}
        <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
          %20 İndirim
        </div>
      </div>

      {/* ORTA & SAĞ: Bilgiler ve Fiyatlar */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        
        {/* Başlık ve Kapasite */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{name}</h3>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Users size={16} /> {capacity.person} Kişi</span>
              <span className="flex items-center gap-1"><Briefcase size={16} /> {capacity.bag} Bavul</span>
            </div>
          </div>
        </div>

        {/* Özellikikonları (Görseldeki gibi) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 mb-6">
          <div className="flex items-center gap-1"><Lock size={14} /> Sabit Fiyat</div>
          <div className="flex items-center gap-1"><Plane size={14} /> Uçuş Takibi</div>
          <div className="flex items-center gap-1"><HandMetal size={14} /> Karşılama</div>
          <div className="flex items-center gap-1"><ThumbsUp size={14} /> Ücretsiz İptal</div>
        </div>

        {/* FİYAT KUTULARI (Kritik Kısım) */}
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4 border-t border-gray-100 pt-4 mt-auto">
          
          <div className="flex-1 w-full">
            <p className="text-xs text-red-500 font-bold mb-2 text-right md:text-left">Toplam araç fiyatıdır.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              
              {/* TRY KUTUSU (Yeşil - Seçili Gibi) */}
              <div className="border-2 border-green-500 bg-green-50 rounded-lg p-2 text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-green-500 text-white text-[8px] px-1">ÖNERİLEN</div>
                 <span className="block text-gray-400 line-through text-xs">{Math.round(prices.try * 1.2)}₺</span>
                 <span className="block text-green-700 font-bold text-lg">{prices.try}₺</span>
                 <span className="text-[10px] text-green-600">%20 İndirim</span>
              </div>

              {/* EUR KUTUSU */}
              <div className="border border-gray-200 rounded-lg p-2 text-center hover:border-gray-400 transition-colors">
                 <span className="block text-gray-400 line-through text-xs">€{Math.round(prices.eur * 1.2)}</span>
                 <span className="block text-slate-800 font-bold text-lg">€{prices.eur}</span>
              </div>

              {/* USD KUTUSU */}
              <div className="border border-gray-200 rounded-lg p-2 text-center hover:border-gray-400 transition-colors">
                 <span className="block text-gray-400 line-through text-xs">${Math.round(prices.usd * 1.2)}</span>
                 <span className="block text-slate-800 font-bold text-lg">${prices.usd}</span>
              </div>

               {/* GBP KUTUSU */}
               <div className="border border-gray-200 rounded-lg p-2 text-center hover:border-gray-400 transition-colors">
                 <span className="block text-gray-400 line-through text-xs">£{Math.round(prices.gbp * 1.2)}</span>
                 <span className="block text-slate-800 font-bold text-lg">£{prices.gbp}</span>
              </div>

            </div>
          </div>

          {/* Rezervasyon Butonu */}
          <Link href="/booking" className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors shadow-lg shadow-green-200">
            Rezervasyon Yap
          </Link>

        </div>

      </div>
    </div>
  );
}