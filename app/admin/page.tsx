"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Delf VIP - Yönetim Paneli</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 bg-white border border-gray-200 px-4 py-2 rounded-xl transition-colors"
          >
            <LogOut size={16} /> Çıkış Yap
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Araç Yönetimi Kartı */}
          <Link href="/admin/vehicles" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-amber-500">
            <h2 className="text-xl font-bold mb-2 text-gray-700">🚗 Araç Yönetimi</h2>
            <p className="text-gray-500 text-sm">Araç ekle, fiyatları ve kapasiteleri düzenle.</p>
          </Link>

          {/* Sabit Rota Yönetimi Kartı */}
          <Link href="/admin/routes" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
            <h2 className="text-xl font-bold mb-2 text-gray-700">📍 Sabit Rotalar</h2>
            <p className="text-gray-500 text-sm">Havalimanı gibi popüler rotalara sabit fiyat belirle.</p>
          </Link>

          {/* Fiyat Çarpanları Kartı */}
          <Link href="/admin/multipliers" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
            <h2 className="text-xl font-bold mb-2 text-gray-700">📈 Fiyat Çarpanları</h2>
            <p className="text-gray-500 text-sm">Saatlik (4h, 8h, 12h) kiralama çarpanlarını ayarla.</p>
          </Link>

          {/* Rezervasyonlar Kartı */}
          <Link href="/admin/reservations" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500">
            <h2 className="text-xl font-bold mb-2 text-gray-700">📋 Rezervasyonlar</h2>
            <p className="text-gray-500 text-sm">Gelen tüm rezervasyonları görüntüle ve durumlarını yönet.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}