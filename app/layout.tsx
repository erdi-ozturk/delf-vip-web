import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; 
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone } from "lucide-react";

import WeglotScript from "@/components/WeglotScript";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CookieBanner from "@/components/CookieBanner";
import Script from 'next/script';

// 🔥 Google Analytics bileşenini import ettik
import { GoogleAnalytics } from '@next/third-parties/google' 
import { LanguageProvider } from "@/components/LanguageContext"; 

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://www.delfvip.com";
const defaultTitle = "DELF VIP | İstanbul VIP Transfer & Şoförlü Araç Kiralama";
const defaultDescription = "İstanbul Havalimanı (IST) ve Sabiha Gökçen (SAW) için 7/24 lüks VIP transfer hizmeti. Mercedes Vito araçlarla konforlu, güvenli ve sabit fiyatlı yolculuk.";

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: "%s | DELF VIP Transfer"
  },
  description: defaultDescription,
  keywords: [
    // Türkçe
    "istanbul vip transfer", "sabiha gökçen transfer", "istanbul havalimanı transfer",
    "şoförlü araç kiralama", "mercedes vito transfer", "havalimanı karşılama hizmeti",
    // English
    "istanbul airport transfer", "istanbul private driver", "turkey vip transfer",
    "luxury transfer istanbul", "chauffeur service istanbul", "ist airport taxi",
    "saw airport transfer", "mercedes vito hire istanbul",
    // Arabic
    "نقل فيب اسطنبول", "نقل مطار اسطنبول", "سائق خاص اسطنبول", "ليموزين اسطنبول",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      "tr": siteUrl,
      "en": `${siteUrl}/en`,
      "ar": `${siteUrl}/ar`,
      "x-default": siteUrl,
    },
  },
  icons: {
    icon: '/logo2.png',
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "DELF VIP",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DELF VIP Transfer - İstanbul Lüks Transfer Hizmeti",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        
        {/* Google Tag (gtag.js) - Mevcut olanlar kalıyor */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-17907386520"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17907386520');
          `}
        </Script>
        
        {/* Microsoft Clarity - Kullanıcı Davranışı Kayıt */}
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","vob4f5slim");`}
        </Script>

        {/* WEGLOT SCRIPT */}
        <WeglotScript />

        {/* GOOGLE MAPS SCRIPT */}
        <Script
          id="google-maps"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
          strategy="beforeInteractive"
        />

        <LanguageProvider>
          
          <Navbar />

          {children}

          <WhatsAppFloat />
          <CookieBanner />

          {/* --- FOOTER --- */}
          <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 pt-16 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                
                {/* 1. SÜTUN: MARKA */}
                <div className="space-y-6">
                  <div className="relative w-48 h-16">
                    <Image 
                      src="/logo2.png" 
                      alt="DELF VIP" 
                      fill 
                      className="object-contain brightness-0 invert opacity-90"
                    />
                  </div>

                  <p className="text-sm leading-relaxed text-gray-400">
                    DELF VIP ile yolculuk bir ulaşım değil, bir ayrıcalıktır. Konfor, güvenlik ve prestijin buluşma noktası.
                  </p>
                  
                  <div className="flex gap-4">
                    <a href="https://facebook.com" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-all text-white">
                      <Facebook size={20} />
                    </a>
                    <a href="https://instagram.com" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-all text-white">
                      <Instagram size={20} />
                    </a>
                  </div>
                </div>

                {/* 2. SÜTUN: HIZLI MENÜ */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-6">Hızlı Erişim</h3>
                  <ul className="space-y-3 text-sm">
                    <li><Link href="/" className="hover:text-amber-500 transition-colors">Anasayfa</Link></li>
                    <li><Link href="/about" className="hover:text-amber-500 transition-colors">Hakkımızda</Link></li>
                    <li><Link href="/tours" className="hover:text-amber-500 transition-colors">Turlar & Geziler</Link></li>
                    <li><Link href="/services" className="hover:text-amber-500 transition-colors">VIP Hizmetler</Link></li>
                    <li><Link href="/contact" className="hover:text-amber-500 transition-colors">İletişim</Link></li>
                  </ul>
                </div>

                {/* 3. SÜTUN: KURUMSAL */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-6">Kurumsal</h3>
                  <ul className="space-y-3 text-sm">
                    <li><Link href="/privacy" className="hover:text-amber-500 transition-colors">Gizlilik Politikası</Link></li>
                    <li><Link href="/terms" className="hover:text-amber-500 transition-colors">Kullanım Koşulları</Link></li>
                    <li><Link href="/faq" className="hover:text-amber-500 transition-colors">Sıkça Sorulan Sorular</Link></li>
                    <li><Link href="/career" className="hover:text-amber-500 transition-colors">Şoför Başvurusu</Link></li>
                  </ul>
                </div>

                {/* 4. SÜTUN: İLETİŞİM */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-6">Bize Ulaşın</h3>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                      <div className="bg-slate-800 p-2 rounded text-amber-500 mt-1">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Rezervasyon Hattı</p>
                        <p className="text-white font-bold text-lg">+90 544 145 91 99</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-slate-800 p-2 rounded text-amber-500 mt-1">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Merkez Ofis</p>
                        <p className="text-white leading-snug">İstanbul Havalimanı Yolu Üzeri, 34275 Arnavutköy/İstanbul</p>
                      </div>
                    </li>
                  </ul>
                </div>

              </div>

              <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-gray-500 text-center md:text-left">
                  &copy; {new Date().getFullYear()} DELF VIP. Tüm hakları saklıdır.
                </p>
                
                <div className="flex gap-3">
                  <div className="bg-white px-2 py-1 rounded w-10 h-6 flex items-center justify-center shadow-sm">
                      <span className="text-[8px] font-bold text-blue-800 italic">VISA</span>
                  </div>
                  <div className="bg-white px-2 py-1 rounded w-10 h-6 flex items-center justify-center shadow-sm">
                      <div className="flex -space-x-1">
                        <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div>
                      </div>
                  </div>
                </div>
              </div>

            </div>
          </footer>

        </LanguageProvider>

        {/* 🔥 GOOGLE ANALYTICS BURAYA EKLENDİ */}
        {/* 'G-XXXXXXXXXX' kısmını kendi numaranla değiştirmeyi unutma! */}
        <GoogleAnalytics gaId="G-Z72VL1M3MX" />

      </body>
    </html>
  );
}