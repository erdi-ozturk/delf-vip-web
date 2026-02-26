import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DeleteButton from "../components/DeleteButton";

interface FixedRoute {
  id: string;
  fromLocation: string;
  toLocation: string;
  priceUsd: number;
  vehicleType: string;
}

export default async function AdminRoutesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const routes = await db.fixedRoute.findMany();
  const editingRoute = edit ? routes.find((r: FixedRoute) => r.id === edit) : null;

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

    await db.fixedRoute.create({ data: { fromLocation, toLocation, priceUsd: price, vehicleType } });
    revalidatePath("/admin/routes");
  }

  async function updateRoute(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const fromLocation = (formData.get("fromLocation") as string)?.trim();
    const toLocation = (formData.get("toLocation") as string)?.trim();
    const price = parseFloat(formData.get("price") as string);
    const vehicleType = (formData.get("vehicleType") as string)?.trim();

    if (!id || !fromLocation || fromLocation.length > 200) return;
    if (!toLocation || toLocation.length > 200) return;
    if (isNaN(price) || price < 0 || price > 100000) return;
    if (!vehicleType || vehicleType.length > 100) return;

    await db.fixedRoute.update({
      where: { id },
      data: { fromLocation, toLocation, priceUsd: price, vehicleType },
    });
    redirect("/admin/routes");
  }

  async function deleteRoute(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await db.fixedRoute.delete({ where: { id } });
    revalidatePath("/admin/routes");
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sabit Rota Yönetimi</h1>
        <a href="/admin" className="text-sm font-bold text-gray-500 hover:text-gray-800 border border-gray-200 bg-white px-4 py-2 rounded-xl transition-colors">
          ← Panele Dön
        </a>
      </div>

      {/* ROTA EKLEME FORMU */}
      <form action={addRoute} className="bg-white p-6 rounded-xl shadow-sm border mb-10 grid grid-cols-2 gap-4">
        <h2 className="col-span-2 font-bold text-lg text-gray-700">Yeni Rota Ekle</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="new-from" className="text-sm font-semibold">Nereden (Başlangıç)</label>
          <input id="new-from" name="fromLocation" placeholder="Örn: Istanbul Airport (IST)" title="Başlangıç noktası" className="border p-2 rounded" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="new-to" className="text-sm font-semibold">Nereye (Varış)</label>
          <input id="new-to" name="toLocation" placeholder="Örn: Sultanahmet" title="Varış noktası" className="border p-2 rounded" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="new-price" className="text-sm font-semibold">Sabit Ücret ($)</label>
          <input id="new-price" name="price" type="number" step="0.1" placeholder="60" title="Sabit ücret" className="border p-2 rounded" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="new-vehicle" className="text-sm font-semibold">Araç Tipi</label>
          <select id="new-vehicle" name="vehicleType" title="Araç Tipi" className="border p-2 rounded" required>
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
            <div key={r.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              {/* Rota bilgisi + butonlar */}
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <p className="font-bold text-lg">{r.fromLocation} → {r.toLocation}</p>
                  <p className="text-sm text-gray-500">Araç: {r.vehicleType}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-blue-600 text-xl">${r.priceUsd}</p>
                  <a
                    href={`/admin/routes?edit=${r.id}`}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                  >
                    Düzenle
                  </a>
                  <form action={deleteRoute}>
                    <input type="hidden" name="id" value={r.id} aria-hidden="true" />
                    <DeleteButton message={`"${r.fromLocation} → ${r.toLocation}" silinsin mi?`} />
                  </form>
                </div>
              </div>

              {/* Düzenleme Formu */}
              {editingRoute && editingRoute.id === r.id && (
                <form action={updateRoute} className="border-t border-amber-100 bg-amber-50/50 p-4 grid grid-cols-2 gap-3">
                  <h3 className="col-span-2 text-sm font-bold text-amber-700">Rotayı Düzenle</h3>
                  <input type="hidden" name="id" value={r.id} aria-hidden="true" />
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`edit-from-${r.id}`} className="text-xs font-semibold text-gray-600">Nereden</label>
                    <input id={`edit-from-${r.id}`} name="fromLocation" defaultValue={r.fromLocation} title="Başlangıç noktası" className="border p-2 rounded text-sm" required />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`edit-to-${r.id}`} className="text-xs font-semibold text-gray-600">Nereye</label>
                    <input id={`edit-to-${r.id}`} name="toLocation" defaultValue={r.toLocation} title="Varış noktası" className="border p-2 rounded text-sm" required />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`edit-price-${r.id}`} className="text-xs font-semibold text-gray-600">Sabit Ücret ($)</label>
                    <input id={`edit-price-${r.id}`} name="price" type="number" step="0.1" defaultValue={r.priceUsd} title="Sabit ücret" className="border p-2 rounded text-sm" required />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`edit-vtype-${r.id}`} className="text-xs font-semibold text-gray-600">Araç Tipi</label>
                    <select id={`edit-vtype-${r.id}`} name="vehicleType" title="Araç Tipi" defaultValue={r.vehicleType} className="border p-2 rounded text-sm" required>
                      <option value="Mercedes Vito">Mercedes Vito</option>
                      <option value="Mercedes Sprinter">Mercedes Sprinter</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 bg-amber-500 text-white p-2 rounded-lg font-bold hover:bg-amber-600 transition text-sm">
                      Kaydet
                    </button>
                    <a href="/admin/routes" className="flex-1 text-center bg-gray-200 text-gray-700 p-2 rounded-lg font-bold hover:bg-gray-300 transition text-sm">
                      İptal
                    </a>
                  </div>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
