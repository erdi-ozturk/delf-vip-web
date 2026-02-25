import { db } from "./db";

export async function calculatePrice(from: string, to: string, distanceKm: number) {
  // 1. Önce sabit rota var mı diye bak
  const fixedRoute = await db.fixedRoute.findFirst({
    where: {
      fromLocation: { contains: from, mode: 'insensitive' },
      toLocation: { contains: to, mode: 'insensitive' }
    }
  });

  if (fixedRoute) {
    return { type: 'fixed', price: fixedRoute.priceUsd };
  }

  // 2. Sabit rota yoksa, araçların KM bazlı fiyatını hesapla
  const vehicles = await db.vehicle.findMany();
  
  const calculatedPrices = vehicles.map(v => ({
    vehicleId: v.id,
    vehicleName: v.name,
    totalPrice: v.basePriceUsd + (distanceKm * v.pricePerKm)
  }));

  return { type: 'dynamic', prices: calculatedPrices };
}