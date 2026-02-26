import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rezervasyon Yap",
  description:
    "İstanbul Havalimanı (IST) ve Sabiha Gökçen (SAW) için VIP transfer rezervasyonu yapın. Mercedes Vito, Sprinter ve S-Class seçenekleriyle sabit fiyatlı yolculuk.",
  keywords: [
    "istanbul havalimanı transfer rezervasyon",
    "sabiha gökçen transfer rezervasyon",
    "vip transfer fiyat",
    "mercedes vito kiralama",
    "şoförlü araç rezervasyon",
  ],
  openGraph: {
    title: "VIP Transfer Rezervasyonu | DELF VIP",
    description:
      "İstanbul havalimanı transferi için online rezervasyon. Sabit fiyat, ücretsiz bekleme, 7/24 hizmet.",
    url: "https://www.delfvip.com/booking",
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
