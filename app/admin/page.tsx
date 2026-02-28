import AdminShell from "./components/AdminShell";
import Link from "next/link";
import { db } from "../lib/db";
import { ClipboardList, MapPin, Car, Clock, TrendingUp, CalendarCheck, ArrowRight } from "lucide-react";

function parsePrice(price: string): number {
  const match = price.match(/\d+(?:\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

function detectCurrency(prices: string[]): string {
  for (const p of prices) {
    if (p.includes("€")) return "€";
    if (p.includes("$")) return "$";
    if (p.includes("£")) return "£";
    if (p.includes("₺")) return "₺";
  }
  return "€";
}

export default async function AdminDashboard() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoISO = sevenDaysAgo.toISOString();

  const [totalRes, newRes, confirmedRes, routeCount, vehicleCount, confirmedPrices, recentReservations, upcomingTransfers] = await Promise.all([
    db.reservation.count(),
    db.reservation.count({ where: { status: "new" } }),
    db.reservation.count({ where: { status: "confirmed" } }),
    db.fixedRoute.count(),
    db.vehicle.count(),
    db.reservation.findMany({ where: { status: "confirmed" }, select: { price: true } }),
    db.reservation.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.reservation.findMany({
      where: {
        status: { not: "cancelled" },
        date: { gte: sevenDaysAgoISO },
      },
      orderBy: { date: "asc" },
      take: 8,
    }),
  ]);

  const totalRevenue = confirmedPrices.reduce((sum, r) => sum + parsePrice(r.price), 0);
  const currency = detectCurrency(confirmedPrices.map((r) => r.price));

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const statusLabels: Record<string, string> = {
    new: "Yeni", confirmed: "Onaylandı", cancelled: "İptal",
  };

  return (
    <AdminShell>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Genel Bakış</h1>
          <p className="text-sm text-slate-500 mt-1">Delf VIP yönetim paneline hoş geldiniz</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Toplam</p>
            <p className="text-3xl font-bold text-slate-900">{totalRes}</p>
            <p className="text-xs text-slate-500 mt-1">rezervasyon</p>
          </div>
          <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-5">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">Bekleyen</p>
            <p className="text-3xl font-bold text-blue-600">{newRes}</p>
            <p className="text-xs text-blue-400 mt-1">onay bekliyor</p>
          </div>
          <div className="bg-green-50/50 rounded-2xl border border-green-100 p-5">
            <p className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Onaylanan</p>
            <p className="text-3xl font-bold text-green-600">{confirmedRes}</p>
            <p className="text-xs text-green-500 mt-1">onaylandı</p>
          </div>
          <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-5">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-3">Gelir</p>
            <p className="text-3xl font-bold text-amber-600">
              {currency}{Math.round(totalRevenue).toLocaleString("tr-TR")}
            </p>
            <p className="text-xs text-amber-500 mt-1">onaylı toplam</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Upcoming transfers */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CalendarCheck size={16} className="text-amber-500" />
                <h2 className="font-bold text-slate-900">Son & Yaklaşan Transferler</h2>
              </div>
              <Link href="/admin/reservations" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
                Tümünü gör →
              </Link>
            </div>
            {upcomingTransfers.length === 0 ? (
              <div className="px-6 py-10 text-center text-slate-400 text-sm">
                Son 7 günde transfer yok
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {upcomingTransfers.map((r) => {
                  let transferDate = "-";
                  try {
                    transferDate = new Date(r.date).toLocaleString("tr-TR", {
                      day: "numeric", month: "short",
                      hour: "2-digit", minute: "2-digit",
                    });
                  } catch {}
                  return (
                    <div key={r.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-center">
                          <Clock size={15} className="text-amber-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{r.name}</p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {r.pickupName || r.pickupAddr} <ArrowRight size={10} className="inline" /> {r.dropoffName || r.dropoffAddr}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-900">{transferDate}</p>
                          <p className="text-xs text-green-600 font-semibold">{r.price}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[r.status] ?? statusColors.new}`}>
                          {statusLabels[r.status] ?? "Yeni"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <Link href="/admin/reservations" className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:border-amber-400 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                <ClipboardList size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">Rezervasyonlar</p>
                <p className="text-xs text-slate-500">{newRes} yeni bekliyor</p>
              </div>
            </Link>
            <Link href="/admin/routes" className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:border-amber-400 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">Sabit Rotalar</p>
                <p className="text-xs text-slate-500">{routeCount} rota tanımlı</p>
              </div>
            </Link>
            <Link href="/admin/vehicles" className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:border-amber-400 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Car size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">Araç Filosu</p>
                <p className="text-xs text-slate-500">{vehicleCount} araç kayıtlı</p>
              </div>
            </Link>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <TrendingUp size={18} className="text-green-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Onaylanan Gelir</p>
                <p className="text-xs font-bold text-green-600">{currency}{Math.round(totalRevenue).toLocaleString("tr-TR")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent reservations */}
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Son Rezervasyonlar</h2>
            <Link href="/admin/reservations" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
              Tümünü gör →
            </Link>
          </div>
          {recentReservations.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400 text-sm">Henüz rezervasyon yok</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentReservations.map((r) => (
                <div key={r.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{r.name}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {r.pickupName || r.pickupAddr} → {r.dropoffName || r.dropoffAddr}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-sm text-slate-900">{r.price}</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[r.status] ?? statusColors.new}`}>
                      {statusLabels[r.status] ?? "Yeni"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
