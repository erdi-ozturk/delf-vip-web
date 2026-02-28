"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, MapPin, Car, ClipboardList, LogOut, Map } from "lucide-react";

const navItems = [
  { href: "/admin",              label: "Genel Bakış",    icon: LayoutDashboard, exact: true },
  { href: "/admin/reservations", label: "Rezervasyonlar", icon: ClipboardList },
  { href: "/admin/routes",       label: "Sabit Rotalar",  icon: MapPin },
  { href: "/admin/vehicles",     label: "Araç Filosu",    icon: Car },
  { href: "/admin/tours",        label: "Turlar",         icon: Map },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-slate-900 flex flex-col sticky top-0 h-screen">
        <div className="px-5 pt-6 pb-5 border-b border-slate-800">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Admin Panel</p>
          <p className="text-white font-bold text-xl tracking-tight">Delf VIP</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all"
          >
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
