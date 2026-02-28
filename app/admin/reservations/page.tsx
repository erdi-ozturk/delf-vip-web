import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { Phone, MapPin, Calendar, Car, User, CheckCircle, XCircle, Clock, Download, Search, MessageCircle } from "lucide-react";
import DeleteButton from "../components/DeleteButton";
import AdminShell from "../components/AdminShell";
import Link from "next/link";

const PAGE_SIZE = 20;

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:       { label: "Yeni",      color: "bg-blue-100 text-blue-700" },
  confirmed: { label: "Onaylandı", color: "bg-green-100 text-green-700" },
  cancelled: { label: "İptal",     color: "bg-red-100 text-red-700" },
};

function formatWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 11) return "90" + digits.slice(1);
  if (digits.length === 10) return "90" + digits;
  return digits;
}

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}) {
  const { status, search, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));

  const where: Record<string, unknown> = {};
  if (status && ["new", "confirmed", "cancelled"].includes(status)) {
    where.status = status;
  }
  if (search?.trim()) {
    const q = search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
    ];
  }

  const [reservations, total] = await Promise.all([
    db.reservation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.reservation.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  async function updateStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const newStatus = formData.get("status") as string;
    if (!id || !["new", "confirmed", "cancelled"].includes(newStatus)) return;
    await db.reservation.update({ where: { id }, data: { status: newStatus } });
    revalidatePath("/admin/reservations");
    revalidatePath("/admin");
  }

  async function deleteReservation(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await db.reservation.delete({ where: { id } });
    revalidatePath("/admin/reservations");
    revalidatePath("/admin");
  }

  function buildUrl(params: { status?: string; search?: string; page?: string }) {
    const sp = new URLSearchParams();
    if (params.status) sp.set("status", params.status);
    if (params.search) sp.set("search", params.search);
    if (params.page && params.page !== "1") sp.set("page", params.page);
    const str = sp.toString();
    return `/admin/reservations${str ? `?${str}` : ""}`;
  }

  return (
    <AdminShell>
      <div className="p-8">
        <div className="max-w-5xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Rezervasyonlar</h1>
              <p className="text-sm text-slate-500 mt-1">{total} rezervasyon</p>
            </div>
            <a
              href="/api/admin/export"
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-amber-400 hover:text-amber-600 transition-all"
            >
              <Download size={15} />
              CSV İndir
            </a>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Status tabs */}
            <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
              {[
                { value: "",          label: "Tümü" },
                { value: "new",       label: "Yeni" },
                { value: "confirmed", label: "Onaylı" },
                { value: "cancelled", label: "İptal" },
              ].map(({ value, label }) => (
                <Link
                  key={value}
                  href={buildUrl({ status: value || undefined, search: search || undefined })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    (status ?? "") === value
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Search */}
            <form method="GET" action="/admin/reservations" className="flex-1 min-w-[200px] max-w-xs">
              {status && <input type="hidden" name="status" value={status} />}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  name="search"
                  defaultValue={search ?? ""}
                  placeholder="Ad veya telefon ara..."
                  className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 transition-all"
                />
              </div>
            </form>
          </div>

          {/* List */}
          {reservations.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
              <p className="text-gray-400 font-bold text-lg">Rezervasyon bulunamadı</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {reservations.map((r) => {
                  const st = STATUS_LABELS[r.status] ?? STATUS_LABELS.new;
                  const formattedDate = new Date(r.createdAt).toLocaleString("tr-TR", {
                    day: "numeric", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  });
                  const waNumber = formatWhatsApp(r.phone);
                  const waMsg = encodeURIComponent(`Merhaba ${r.name}, DELF VIP rezervasyonunuz hakkında bilgi vermek istiyoruz.`);

                  return (
                    <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      {/* Card header */}
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
                          <p className="font-bold text-slate-900 flex items-center gap-2">
                            <User size={14} className="text-amber-500" /> {r.name}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <a href={`tel:${r.phone}`} className="text-sm text-blue-600 font-bold flex items-center gap-1.5 hover:underline">
                              <Phone size={13} /> {r.phone}
                            </a>
                            <a
                              href={`https://wa.me/${waNumber}?text=${waMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                            >
                              <MessageCircle size={12} /> WhatsApp
                            </a>
                          </div>
                          {r.email && <p className="text-xs text-gray-500">{r.email}</p>}
                        </div>

                        {/* Rota */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rota</p>
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className="text-green-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-slate-900 leading-snug">{r.pickupName || r.pickupAddr}</p>
                              {r.pickupName && r.pickupName !== r.pickupAddr && (
                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{r.pickupAddr}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className="text-red-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-slate-900 leading-snug">{r.dropoffName || r.dropoffAddr}</p>
                              {r.dropoffName && r.dropoffName !== r.dropoffAddr && (
                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{r.dropoffAddr}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Detaylar */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Detaylar</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.bookingType === "hourly" ? "bg-purple-100 text-purple-700" : "bg-sky-100 text-sky-700"}`}>
                              {r.bookingType === "hourly" ? "⏱ Saatlik Tahsis" : "🚗 Transfer"}
                            </span>
                            {r.duration && r.bookingType === "hourly" && (
                              <span className="text-[10px] font-semibold text-gray-500">{r.duration}</span>
                            )}
                          </div>
                          <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Car size={14} className="text-amber-500" /> {r.vehicle}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Calendar size={14} />
                            {r.date
                              ? new Date(r.date).toLocaleString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })
                              : "-"}
                          </p>
                          <p className="text-sm font-bold text-green-600">{r.price} · {r.passengers} kişi</p>
                          {r.note && <p className="text-xs text-gray-400 italic">Not: {r.note}</p>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/30 flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-bold text-gray-400 mr-2">Durum:</span>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {currentPage > 1 && (
                    <Link
                      href={buildUrl({ status: status || undefined, search: search || undefined, page: String(currentPage - 1) })}
                      className="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-amber-400 hover:text-amber-600 transition-all"
                    >
                      ← Önceki
                    </Link>
                  )}
                  <span className="text-sm text-slate-500 px-2">
                    {currentPage} / {totalPages} · {total} toplam
                  </span>
                  {currentPage < totalPages && (
                    <Link
                      href={buildUrl({ status: status || undefined, search: search || undefined, page: String(currentPage + 1) })}
                      className="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-amber-400 hover:text-amber-600 transition-all"
                    >
                      Sonraki →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
