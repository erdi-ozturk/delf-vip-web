import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const tours = [
    {
      title: "İstanbul Ulaşım & Tahsis",
      location: "Sultanahmet, İstanbul",
      image: "/images/tours/istanbul-vip-transfer-tour.jpg",
      duration: "10 Saat (Araç Tahsis)",
      rating: "4.9",
      priceUsd: 150,
      tags: "Şoförlü Araç,Günlük,Transfer",
      bookingType: "hourly",
      bookingDuration: "10 Saat",
      pickupAddr: "İstanbul, Türkiye",
      pickupName: "İstanbul",
      dropoffAddr: "İstanbul, Türkiye",
      dropoffName: "İstanbul",
      vehicle: "Mercedes-Benz Vito VIP",
      passengers: "1",
      roundTrip: false,
      isActive: true,
      order: 1,
    },
    {
      title: "Sapanca & Maşukiye Transfer",
      location: "Sakarya",
      image: "/images/tours/sapanca-masukiye-vip-transfer-tour.jpg",
      duration: "Tam Gün (Gidiş-Dönüş)",
      rating: "5.0",
      priceUsd: 225,
      tags: "Doğa,Beklemeli,VIP",
      bookingType: "transfer",
      bookingDuration: "",
      pickupAddr: "İstanbul, Türkiye",
      pickupName: "İstanbul",
      dropoffAddr: "Sapanca, Sakarya, Türkiye",
      dropoffName: "Sapanca & Maşukiye",
      vehicle: "Mercedes-Benz Vito VIP",
      passengers: "1",
      roundTrip: true,
      isActive: true,
      order: 2,
    },
    {
      title: "Bursa & Uludağ Ulaşım",
      location: "Bursa",
      image: "/images/tours/Bursa-Uludag-vip-tour-transfer.jpg",
      duration: "Tam Gün (Gidiş-Dönüş)",
      rating: "4.8",
      priceUsd: 280,
      tags: "Kayak,Teleferik,Ulaşım",
      bookingType: "transfer",
      bookingDuration: "",
      pickupAddr: "İstanbul, Türkiye",
      pickupName: "İstanbul",
      dropoffAddr: "Bursa, Türkiye",
      dropoffName: "Bursa & Uludağ",
      vehicle: "Mercedes-Benz Vito VIP",
      passengers: "1",
      roundTrip: true,
      isActive: true,
      order: 3,
    },
    {
      title: "Lüks Alışveriş Noktaları Transferi",
      location: "Zorlu & İstinye Park",
      image: "/images/tours/istanbul-transfer-tour.jpeg",
      duration: "8 Saat Tahsis",
      rating: "4.7",
      priceUsd: 120,
      tags: "Alışveriş,Beklemeli,VIP",
      bookingType: "hourly",
      bookingDuration: "8 Saat",
      pickupAddr: "İstanbul, Türkiye",
      pickupName: "İstanbul",
      dropoffAddr: "İstanbul, Türkiye",
      dropoffName: "İstanbul",
      vehicle: "Mercedes-Benz Vito VIP",
      passengers: "1",
      roundTrip: false,
      isActive: true,
      order: 4,
    },
  ];

  for (const tour of tours) {
    await db.tour.create({ data: tour });
  }

  console.log(`✅ ${tours.length} tur başarıyla eklendi.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
