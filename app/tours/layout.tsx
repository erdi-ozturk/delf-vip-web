import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Özel Rotalar & Gezi Transferleri",
  description: "İstanbul şehir turu, Sapanca, Bursa, Uludağ ve alışveriş noktaları için şoförlü VIP araç tahsis hizmeti. Rotayı siz belirleyin, biz sürelim.",
  openGraph: {
    title: "Özel Rotalar & Gezi Transferleri | DELF VIP",
    description: "İstanbul ve çevresi için özel şoförlü VIP araç tahsis hizmeti. Sapanca, Bursa, Uludağ ve şehir turları.",
    url: "https://www.delfvip.com/tours",
  },
};

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
