import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { Phone, MapPin, Calendar, Car, User, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import DeleteButton from "../components/DeleteButton";
import AdminShell from "../components/AdminShell";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:       { label: "Yeni",      color: "bg-blue-100 text-blue-700" },
  confirmed: { label: "Onaylandı", color: "bg-green-100 text-green-700" },
  cancelled: { label: "İptal",     color: "bg-red-100 text-red-700" },
};

export default async function AdminReservationsPage() {
  const reservations = await db.reservation.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function updateStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    if (!id || !["new", "confirmed", "cancelled"].includes(status)) return;
    await db.reservation.update({ where: { id }, data: { status } });
    revalidatePath("/admin/reservations");
  }

  async function deleteReservation(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await db.reservation.delete({ where: { id } });
    revalidatePath("/admin/reservations");
  }

  return (
    <AdminShell>
    <div className="p-8">
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Rezervasyonlar</h1>
          <p className="text-sm text-slate-500 mt-1">Toplam {reservations.length} rezervasyon</p>
        </div>

        {reservations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
            <p className="text-gray-400 font-bold text-lg">Henüz rezervasyon yok</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((r) => {
              const st = STATUS_LABELS[r.status] ?? STATUS_LABELS.new;
              const formattedDate = new Date(r.createdAt).toLocaleString("tr-TR", {
                day: "numeric", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              });

              return (
                <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Üst başlık */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${st.color}`}>
                        {st.label}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> {formattedDate}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-gray-300">#{r.id.slice(-8)}</span>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Müşteri */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Müşteri</p>
                      <p className="font-bold text-slate-900 flex items-center gap-2"><User size={14} className="text-amber-500" /> {r.name}</p>
                      <a href={`tel:${r.phone}`} className="text-sm text-blue-600 font-bold flex items-center gap-2 hover:underline">
                        <Phone size={14} /> {r.phone}
                      </a>
                      {r.email && <p className="text-xs text-gray-500">{r.email}</p>}
                    </div>

                    {/* Rota */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rota</p>
                      <p className="text-sm font-bold text-slate-900 flex items-start gap-2">
                        <MapPin size={14} className="text-green-500 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{r.pickupName || r.pickupAddr}</span>
                      </p>
                      <p className="text-sm font-bold text-slate-900 flex items-start gap-2">
                        <MapPin size={14} className="text-red-500 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{r.dropoffName || r.dropoffAddr}</span>
                      </p>
                    </div>

                    {/* Detaylar */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Detaylar</p>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Car size={14} className="text-amber-500" /> {r.vehicle}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar size={14} /> {r.date ? new Date(r.date).toLocaleString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : "-"}
                      </p>
                      <p className="text-sm font-bold text-green-600">{r.price} · {r.passengers} kişi</p>
                      {r.note && <p className="text-xs text-gray-400 italic">Not: {r.note}</p>}
                    </div>
                  </div>

                  {/* Durum Güncelleme + Sil */}
                  <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/30 flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-gray-400 mr-2">Durumu değiştir:</span>
                    <form action={updateStatus} className="contents">
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value="confirmed" />
                      <button type="submit" className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                        <CheckCircle size={13} /> Onayla
                      </button>
                    </form>
                    <form action={updateStatus} className="contents">
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value="cancelled" />
                      <button type="submit" className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
                        <XCircle size={13} /> İptal Et
                      </button>
                    </form>
                    <form action={updateStatus} className="contents">
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value="new" />
                      <button type="submit" className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                        <Clock size={13} /> Yeni'ye Al
                      </button>
                    </form>
                    <div className="ml-auto">
                      <form action={deleteReservation}>
                        <input type="hidden" name="id" value={r.id} aria-hidden="true" />
                        <DeleteButton message={`${r.name} adlı müşterinin rezervasyonu silinsin mi? Bu işlem geri alınamaz.`} />
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </AdminShell>
  );
}
