// @ yerine noktalı yol kullanalım
import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";

interface Vehicle {
  id: string;
  name: string;
  capacity: string;
  pricePerKm: number;
  basePriceUsd: number;
}

export default async function AdminVehiclesPage() {
  // Veritabanındaki araçları çekiyoruz
  const vehicles = await db.vehicle.findMany();

  // Sunucu tarafında çalışan "Araç Ekleme" fonksiyonu
  async function addVehicle(formData: FormData) {
    "use server";

    const name = (formData.get("name") as string)?.trim();
    const basePrice = parseFloat(formData.get("basePrice") as string);
    const pricePerKm = parseFloat(formData.get("pricePerKm") as string);
    const capacity = (formData.get("capacity") as string)?.trim();

    if (!name || name.length > 100) return;
    if (!capacity || capacity.length > 50) return;
    if (isNaN(basePrice) || basePrice < 0 || basePrice > 10000) return;
    if (isNaN(pricePerKm) || pricePerKm < 0 || pricePerKm > 1000) return;

    await db.vehicle.create({
      data: {
        name,
        image: "/vehicles/vito.png",
        basePriceUsd: basePrice,
        pricePerKm: pricePerKm,
        capacity: capacity,
        luggage: "4",
      },
    });

    revalidatePath("/admin/vehicles");
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Araç Filosu Yönetimi</h1>

      {/* ARAÇ EKLEME FORMU */}
      <form action={addVehicle} className="bg-white p-6 rounded-xl shadow-sm border mb-10 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Araç Adı</label>
          <input name="name" placeholder="Örn: Mercedes Vito VIP" className="border p-2 rounded" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Kapasite</label>
          <input name="capacity" placeholder="Örn: 6 Kişi" className="border p-2 rounded" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Açılış Ücreti ($)</label>
          <input name="basePrice" type="number" step="0.1" placeholder="50" className="border p-2 rounded" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">KM Başı Ücret ($)</label>
          <input name="pricePerKm" type="number" step="0.1" placeholder="1.2" className="border p-2 rounded" required />
        </div>
        <button type="submit" className="col-span-2 bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800 transition">
          Aracı Sisteme Kaydet
        </button>
      </form>

      {/* ARAÇ LİSTESİ */}
      <div className="grid gap-4">
        <h2 className="text-xl font-bold">Mevcut Araçlar</h2>
        {vehicles.map((v: Vehicle) => (
          <div key={v.id} className="bg-white p-4 rounded-lg border flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold text-lg">{v.name}</p>
              <p className="text-sm text-gray-500">Kapasite: {v.capacity} | KM Ücreti: ${v.pricePerKm}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600 text-xl">${v.basePriceUsd}</p>
              <p className="text-xs text-gray-400 font-semibold uppercase">Açılış Fiyatı</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}