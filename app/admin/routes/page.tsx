import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";

interface FixedRoute {
  id: string;
  fromLocation: string;
  toLocation: string;
  priceUsd: number;
  vehicleType: string;
}

export default async function AdminRoutesPage() {
  const routes = await db.fixedRoute.findMany();

  async function addRoute(formData: FormData) {
    "use server";

    const fromLocation = (formData.get("fromLocation") as string)?.trim();
    const toLocation = (formData.get("toLocation") as string)?.trim();
    const price = parseFloat(formData.get("price") as string);
    const vehicleType = (formData.get("vehicleType") as string)?.trim();

    if (!fromLocation || fromLocation.length > 200) return;
    if (!toLocation || toLocation.length > 200) return;
    if (isNaN(price) || price < 0 || price > 100000) return;
    if (!vehicleType || vehicleType.length > 100) return;

    await db.fixedRoute.create({
      data: {
        fromLocation,
        toLocation,
        priceUsd: price,
        vehicleType,
      },
    });

    revalidatePath("/admin/routes");
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sabit Rota Yönetimi</h1>

      {/* ROTA EKLEME FORMU */}
      <form action={addRoute} className="bg-white p-6 rounded-xl shadow-sm border mb-10 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Nereden (Başlangıç)</label>
          <input name="fromLocation" placeholder="Örn: Istanbul Airport (IST)" className="border p-2 rounded" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Nereye (Varış)</label>
          <input name="toLocation" placeholder="Örn: Sultanahmet" className="border p-2 rounded" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Sabit Ücret ($)</label>
          <input name="price" type="number" step="0.1" placeholder="60" className="border p-2 rounded" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Araç Tipi</label>
          <select name="vehicleType" title="Araç Tipi" className="border p-2 rounded" required>
            <option value="Mercedes Vito">Mercedes Vito</option>
            <option value="Mercedes Sprinter">Mercedes Sprinter</option>
          </select>
        </div>
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Rotayı Sisteme Kaydet
        </button>
      </form>

      {/* ROTA LİSTESİ */}
      <div className="grid gap-4">
        <h2 className="text-xl font-bold">Kayıtlı Sabit Rotalar</h2>
        {routes.length === 0 ? (
          <p className="text-gray-500">Henüz sabit rota eklenmemiş.</p>
        ) : (
          routes.map((r: FixedRoute) => (
            <div key={r.id} className="bg-white p-4 rounded-lg border flex justify-between items-center shadow-sm">
              <div>
                <p className="font-bold text-lg">{r.fromLocation} → {r.toLocation}</p>
                <p className="text-sm text-gray-500">Araç: {r.vehicleType}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600 text-xl">${r.priceUsd}</p>
                <p className="text-xs text-gray-400 font-semibold uppercase">Sabit Fiyat</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}