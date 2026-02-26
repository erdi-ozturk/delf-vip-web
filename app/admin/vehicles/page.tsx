import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DeleteButton from "../components/DeleteButton";

interface Vehicle {
  id: string;
  name: string;
  capacity: string;
  pricePerKm: number;
  basePriceUsd: number;
}

export default async function AdminVehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const vehicles = await db.vehicle.findMany();
  const editingVehicle = edit ? vehicles.find((v: Vehicle) => v.id === edit) : null;

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
      data: { name, image: "/vehicles/vito.png", basePriceUsd: basePrice, pricePerKm, capacity, luggage: "4" },
    });
    revalidatePath("/admin/vehicles");
  }

  async function updateVehicle(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const name = (formData.get("name") as string)?.trim();
    const basePrice = parseFloat(formData.get("basePrice") as string);
    const pricePerKm = parseFloat(formData.get("pricePerKm") as string);
    const capacity = (formData.get("capacity") as string)?.trim();

    if (!id || !name || name.length > 100) return;
    if (!capacity || capacity.length > 50) return;
    if (isNaN(basePrice) || basePrice < 0 || basePrice > 10000) return;
    if (isNaN(pricePerKm) || pricePerKm < 0 || pricePerKm > 1000) return;

    await db.vehicle.update({
      where: { id },
      data: { name, basePriceUsd: basePrice, pricePerKm, capacity },
    });
    redirect("/admin/vehicles");
  }

  async function deleteVehicle(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await db.vehicle.delete({ where: { id } });
    revalidatePath("/admin/vehicles");
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Araç Filosu Yönetimi</h1>
        <a href="/admin" className="text-sm font-bold text-gray-500 hover:text-gray-800 border border-gray-200 bg-white px-4 py-2 rounded-xl transition-colors">
          ← Panele Dön
        </a>
      </div>

      {/* ARAÇ EKLEME FORMU */}
      <form action={addVehicle} className="bg-white p-6 rounded-xl shadow-sm border mb-10 grid grid-cols-2 gap-4">
        <h2 className="col-span-2 font-bold text-lg text-gray-700">Yeni Araç Ekle</h2>
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
        {vehicles.length === 0 && <p className="text-gray-500">Henüz araç eklenmemiş.</p>}
        {vehicles.map((v: Vehicle) => (
          <div key={v.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {/* Araç bilgisi + butonlar */}
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="font-bold text-lg">{v.name}</p>
                <p className="text-sm text-gray-500">Kapasite: {v.capacity} | KM: ${v.pricePerKm}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-green-600 text-xl">${v.basePriceUsd}</p>
                <a
                  href={`/admin/vehicles?edit=${v.id}`}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                >
                  Düzenle
                </a>
                <form action={deleteVehicle}>
                  <input type="hidden" name="id" value={v.id} aria-hidden="true" />
                  <DeleteButton message={`"${v.name}" silinsin mi?`} />
                </form>
              </div>
            </div>

            {/* Düzenleme Formu (sadece seçili araç için açılır) */}
            {editingVehicle && editingVehicle.id === v.id && (
              <form action={updateVehicle} className="border-t border-amber-100 bg-amber-50/50 p-4 grid grid-cols-2 gap-3">
                <h3 className="col-span-2 text-sm font-bold text-amber-700">Aracı Düzenle</h3>
                <input type="hidden" name="id" value={v.id} aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  <label htmlFor={`edit-name-${v.id}`} className="text-xs font-semibold text-gray-600">Araç Adı</label>
                  <input id={`edit-name-${v.id}`} name="name" defaultValue={v.name} title="Araç Adı" className="border p-2 rounded text-sm" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor={`edit-cap-${v.id}`} className="text-xs font-semibold text-gray-600">Kapasite</label>
                  <input id={`edit-cap-${v.id}`} name="capacity" defaultValue={v.capacity} title="Kapasite" className="border p-2 rounded text-sm" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor={`edit-base-${v.id}`} className="text-xs font-semibold text-gray-600">Açılış Ücreti ($)</label>
                  <input id={`edit-base-${v.id}`} name="basePrice" type="number" step="0.1" defaultValue={v.basePriceUsd} title="Açılış Ücreti" className="border p-2 rounded text-sm" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor={`edit-km-${v.id}`} className="text-xs font-semibold text-gray-600">KM Başı Ücret ($)</label>
                  <input id={`edit-km-${v.id}`} name="pricePerKm" type="number" step="0.1" defaultValue={v.pricePerKm} title="KM Başı Ücret" className="border p-2 rounded text-sm" required />
                </div>
                <div className="col-span-2 flex gap-2">
                  <button type="submit" className="flex-1 bg-amber-500 text-white p-2 rounded-lg font-bold hover:bg-amber-600 transition text-sm">
                    Kaydet
                  </button>
                  <a href="/admin/vehicles" className="flex-1 text-center bg-gray-200 text-gray-700 p-2 rounded-lg font-bold hover:bg-gray-300 transition text-sm">
                    İptal
                  </a>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
