"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "delfvip_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm leading-relaxed text-gray-300">
          <span className="text-white font-bold">🍪 Çerez Politikası</span>{" "}
          Bu site; analitik (Google Analytics) ve çeviri (Weglot) amaçlı çerezler kullanmaktadır.
          Devam ederek{" "}
          <Link href="/privacy" className="underline text-amber-400 hover:text-amber-300">
            Gizlilik Politikamızı
          </Link>{" "}
          kabul etmiş sayılırsınız.
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-sm font-bold px-4 py-2 rounded-xl border border-slate-600 hover:border-slate-400 transition-colors"
          >
            Reddet
          </button>
          <button
            onClick={accept}
            className="text-sm font-bold px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 transition-colors"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
