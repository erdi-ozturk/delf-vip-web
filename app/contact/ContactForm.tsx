"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [fields, setFields] = useState({
    firstName: "", lastName: "", email: "", subject: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Bir hata oluştu.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setFields({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    } catch {
      setErrorMsg("Bağlantı hatası. Lütfen tekrar deneyin.");
      setStatus("error");
    }
  };

  const inputCls = "w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-amber-500 transition-colors text-sm";

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <CheckCircle2 className="text-green-500" size={48} />
        <h3 className="text-xl font-bold text-slate-900">Mesajınız İletildi!</h3>
        <p className="text-gray-500 text-sm">En kısa sürede size dönüş yapacağız.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-bold text-amber-600 hover:underline"
        >
          Yeni mesaj gönder
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text" placeholder="Adınız" required
          className={inputCls} value={fields.firstName} onChange={set("firstName")}
        />
        <input
          type="text" placeholder="Soyadınız" required
          className={inputCls} value={fields.lastName} onChange={set("lastName")}
        />
      </div>
      <input
        type="email" placeholder="E-Posta Adresiniz" required
        className={inputCls} value={fields.email} onChange={set("email")}
      />
      <input
        type="text" placeholder="Konu"
        className={inputCls} value={fields.subject} onChange={set("subject")}
      />
      <textarea
        rows={4} placeholder="Mesajınız..." required
        className={inputCls + " resize-none"}
        value={fields.message} onChange={set("message")}
      />

      {status === "error" && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm font-bold px-4 py-3 rounded-xl">
          <AlertCircle size={16} className="shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
      >
        {status === "loading" ? "Gönderiliyor..." : <><Send size={18} /> Gönder</>}
      </button>
    </form>
  );
}
