import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DeleteButton from "../components/DeleteButton";
import AdminShell from "../components/AdminShell";
import { ArrowRight } from "lucide-react";

interface FixedRoute {
  id: string;
  fromLocation: string;
  toLocation: string;
  priceUsd: number;
  vehicleType: string;
}

const INPUT = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 transition-all placeholder:text-slate-400";
const LABEL = "block text-xs font-semibold text-slate-600 mb-1.5";

const VEHICLE_OPTIONS = ["Vito", "Sprinter", "S-Class"];

export default async function AdminRoutesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const routes = await db.fixedRoute.findMany({ orderBy: { vehicleType: "asc" } });
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

    await db.fixedRoute.update({ where: { id }, data: { fromLocation, toLocation, priceUsd: price, vehicleType } });
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
    <AdminShell>
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Sabit Rotalar</h1>
          <p className="text-sm text-slate-500 mt-1">Popüler güzergahlar için sabit fiyat tanımlayın</p>
        </div>

        {/* ADD FORM */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="font-bold text-slate-900 mb-5">Yeni Rota Ekle</h2>
          <form action={addRoute} className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="new-from" className={LABEL}>Nereden</label>
              <input id="new-from" name="fromLocation" placeholder="İstanbul Havalimanı" className={INPUT} required />
            </div>
            <div>
              <label htmlFor="new-to" className={LABEL}>Nereye</label>
              <input id="new-to" name="toLocation" placeholder="Taksim" className={INPUT} required />
            </div>
            <div>
              <label htmlFor="new-price" className={LABEL}>Sabit Ücret ($)</label>
              <input id="new-price" name="price" type="number" step="0.1" min="0" placeholder="60" className={INPUT} required />
            </div>
            <div>
              <label htmlFor="new-vehicle" className={LABEL}>Araç Tipi</label>
              <select id="new-vehicle" name="vehicleType" className={INPUT} required>
                {VEHICLE_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <button type="submit" className="col-span-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
              Rotayı Kaydet
            </button>
          </form>
        </div>

        {/* ROUTE LIST */}
        <div>
          <h2 className="font-bold text-slate-900 mb-4">Kayıtlı Rotalar <span className="text-slate-400 font-normal">({routes.length})</span></h2>

          {routes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
              Henüz rota eklenmemiş
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Güzergah</span>
                <span>Araç</span>
                <span>Fiyat</span>
                <span></span>
              </div>

              <div className="divide-y divide-slate-50">
                {routes.map((r: FixedRoute) => (
                  <div key={r.id}>
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-4 items-center">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-slate-900 text-sm truncate">{r.fromLocation}</span>
                        <ArrowRight size={14} className="text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-900 text-sm truncate">{r.toLocation}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full whitespace-nowrap">{r.vehicleType}</span>
                      <span className="font-bold text-slate-900 text-sm whitespace-nowrap">${r.priceUsd}</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/admin/routes?edit=${r.id}`}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                        >
                          Düzenle
                        </a>
                        <form action={deleteRoute}>
                          <input type="hidden" name="id" value={r.id} aria-hidden="true" />
                          <DeleteButton message={`"${r.fromLocation} → ${r.toLocation}" silinsin mi?`} />
                        </form>
                      </div>
                    </div>

                    {/* Edit form */}
                    {editingRoute?.id === r.id && (
                      <form action={updateRoute} className="border-t border-amber-100 bg-amber-50/40 px-5 py-4 grid grid-cols-2 gap-3">
                        <p className="col-span-2 text-xs font-bold text-amber-700 mb-1">Rotayı Düzenle</p>
                        <input type="hidden" name="id" value={r.id} aria-hidden="true" />
                        <div>
                          <label className={LABEL}>Nereden</label>
                          <input name="fromLocation" defaultValue={r.fromLocation} title="Nereden" className={INPUT} required />
                        </div>
                        <div>
                          <label className={LABEL}>Nereye</label>
                          <input name="toLocation" defaultValue={r.toLocation} title="Nereye" className={INPUT} required />
                        </div>
                        <div>
                          <label className={LABEL}>Sabit Ücret ($)</label>
                          <input name="price" type="number" step="0.1" defaultValue={r.priceUsd} title="Sabit Ücret" className={INPUT} required />
                        </div>
                        <div>
                          <label className={LABEL}>Araç Tipi</label>
                          <select name="vehicleType" defaultValue={r.vehicleType} title="Araç Tipi" className={INPUT} required>
                            {VEHICLE_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        <div className="col-span-2 flex gap-2">
                          <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg text-sm transition-all">
                            Kaydet
                          </button>
                          <a href="/admin/routes" className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg text-sm transition-all">
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
