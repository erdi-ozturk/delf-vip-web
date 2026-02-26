import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Veritabanı seed başlıyor...");

  // --- ARAÇLAR ---
  const vehicleData = [
    {
      name: "Mercedes-Benz Vito VIP",
      image: "/vehicles/vito.png",
      basePriceUsd: 55,
      pricePerKm: 1.5,   // 40km üzeri her km için $1.5
      capacity: "6 Kişi",
      luggage: "6 Valiz",
      badge: "En Çok Tercih Edilen",
    },
    {
      name: "Mercedes-Benz Sprinter",
      image: "/vehicles/sprinter.png",
      basePriceUsd: 110,
      pricePerKm: 3.0,   // 40km üzeri her km için $3
      capacity: "16 Kişi",
      luggage: "12 Valiz",
      badge: "",
    },
    {
      name: "S-Class Maybach",
      image: "/vehicles/sclass.png",
      basePriceUsd: 275,
      pricePerKm: 7.0,   // 40km üzeri her km için $7
      capacity: "3 Kişi",
      luggage: "2 Valiz",
      badge: "Lüks Seçim",
    },
  ];

  for (const v of vehicleData) {
    const existing = await prisma.vehicle.findFirst({ where: { name: v.name } });
    if (existing) {
      await prisma.vehicle.update({
        where: { id: existing.id },
        data: { basePriceUsd: v.basePriceUsd, pricePerKm: v.pricePerKm },
      });
      console.log(`✓ Araç güncellendi: ${v.name}`);
    } else {
      await prisma.vehicle.create({ data: v });
      console.log(`+ Araç oluşturuldu: ${v.name}`);
    }
  }

  // --- SABİT ROTALAR ---
  // Vito fiyatları (kullanıcı tarafından verildi)
  // Sprinter = Vito x2, S-Class = Vito x5
  const baseRoutes = [
    { from: "İstanbul Havalimanı", to: "Taksim",      vitoPrice: 50 },
    { from: "İstanbul Havalimanı", to: "Kadıköy",     vitoPrice: 60 },
    { from: "İstanbul Havalimanı", to: "Sultanahmet", vitoPrice: 50 },
    { from: "Sabiha Gökçen",       to: "Taksim",      vitoPrice: 65 },
    { from: "Sabiha Gökçen",       to: "Sultanahmet", vitoPrice: 65 },
    { from: "Sabiha Gökçen",       to: "Kadıköy",     vitoPrice: 50 },
  ];

  const vehicleMultipliers = [
    { type: "Vito",    multiplier: 1 },
    { type: "Sprinter", multiplier: 2 },
    { type: "S-Class",  multiplier: 5 },
  ];

  // Mevcut tüm rotaları temizle
  await prisma.fixedRoute.deleteMany();
  console.log("🗑️  Eski rotalar silindi");

  const routesToCreate = baseRoutes.flatMap((route) =>
    vehicleMultipliers.map((v) => ({
      fromLocation: route.from,
      toLocation: route.to,
      vehicleType: v.type,
      priceUsd: Math.round(route.vitoPrice * v.multiplier),
    }))
  );

  await prisma.fixedRoute.createMany({ data: routesToCreate });
  console.log(`✓ ${routesToCreate.length} sabit rota oluşturuldu`);

  // --- SAAT ÇARPANLARI ---
  const existing = await prisma.rateMultipliers.findFirst();
  if (!existing) {
    await prisma.rateMultipliers.create({
      data: { id: 1, h4: 1.0, h8: 1.8, h10: 2.2, h12: 2.5 },
    });
    console.log("✓ Saat çarpanları oluşturuldu");
  }

  console.log("✅ Seed tamamlandı!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
