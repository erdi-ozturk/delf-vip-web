import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DeleteButton from "../components/DeleteButton";
import AdminShell from "../components/AdminShell";
import { Users, DollarSign } from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  capacity: string;
  pricePerKm: number;
  basePriceUsd: number;
}

const INPUT = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 transition-all placeholder:text-slate-400";
const LABEL = "block text-xs font-semibold text-slate-600 mb-1.5";

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

    await db.vehicle.update({ where: { id }, data: { name, basePriceUsd: basePrice, pricePerKm, capacity } });
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
    <AdminShell>
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Araç Filosu</h1>
          <p className="text-sm text-slate-500 mt-1">Araç fiyatlarını ve kapasitelerini yönetin</p>
        </div>

        {/* ADD FORM */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="font-bold text-slate-900 mb-5">Yeni Araç Ekle</h2>
          <form action={addVehicle} className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="new-name" className={LABEL}>Araç Adı</label>
              <input id="new-name" name="name" placeholder="Mercedes-Benz Vito VIP" className={INPUT} required />
            </div>
            <div>
              <label htmlFor="new-cap" className={LABEL}>Kapasite</label>
              <input id="new-cap" name="capacity" placeholder="6 Kişi" className={INPUT} required />
            </div>
            <div>
              <label htmlFor="new-base" className={LABEL}>Açılış Ücreti ($)</label>
              <input id="new-base" name="basePrice" type="number" step="0.1" min="0" placeholder="55" className={INPUT} required />
            </div>
            <div>
              <label htmlFor="new-km" className={LABEL}>KM Başı Ücret ($)</label>
              <input id="new-km" name="pricePerKm" type="number" step="0.1" min="0" placeholder="1.5" className={INPUT} required />
            </div>
            <button type="submit" className="col-span-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
              Aracı Kaydet
            </button>
          </form>
        </div>

        {/* VEHICLE LIST */}
        <div>
          <h2 className="font-bold text-slate-900 mb-4">Kayıtlı Araçlar <span className="text-slate-400 font-normal">({vehicles.length})</span></h2>

          {vehicles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
              Henüz araç eklenmemiş
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Araç</span>
                <span>Açılış</span>
                <span>KM Başı</span>
                <span></span>
              </div>

              <div className="divide-y divide-slate-50">
                {vehicles.map((v: Vehicle) => (
                  <div key={v.id}>
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-4 items-center">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{v.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Users size={11} /> {v.capacity}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">${v.basePriceUsd}</span>
                      <span className="text-sm text-slate-500">${v.pricePerKm}/km</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/admin/vehicles?edit=${v.id}`}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                        >
                          Düzenle
                        </a>
                        <form action={deleteVehicle}>
                          <input type="hidden" name="id" value={v.id} aria-hidden="true" />
                          <DeleteButton message={`"${v.name}" silinsin mi?`} />
                        </form>
                      </div>
                    </div>

                    {/* Edit form */}
                    {editingVehicle?.id === v.id && (
                      <form action={updateVehicle} className="border-t border-amber-100 bg-amber-50/40 px-5 py-4 grid grid-cols-2 gap-3">
                        <p className="col-span-2 text-xs font-bold text-amber-700 mb-1">Aracı Düzenle</p>
                        <input type="hidden" name="id" value={v.id} aria-hidden="true" />
                        <div>
                          <label className={LABEL}>Araç Adı</label>
                          <input name="name" defaultValue={v.name} title="Araç Adı" className={INPUT} required />
                        </div>
                        <div>
                          <label className={LABEL}>Kapasite</label>
                          <input name="capacity" defaultValue={v.capacity} title="Kapasite" className={INPUT} required />
                        </div>
                        <div>
                          <label className={LABEL}>Açılış Ücreti ($)</label>
                          <input name="basePrice" type="number" step="0.1" defaultValue={v.basePriceUsd} title="Açılış Ücreti" className={INPUT} required />
                        </div>
                        <div>
                          <label className={LABEL}>KM Başı Ücret ($)</label>
                          <input name="pricePerKm" type="number" step="0.1" defaultValue={v.pricePerKm} title="KM Başı Ücret" className={INPUT} required />
                        </div>
                        <div className="col-span-2 flex gap-2">
                          <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg text-sm transition-all">
                            Kaydet
                          </button>
                          <a href="/admin/vehicles" className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg text-sm transition-all">
                            İptal
                          </a>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
