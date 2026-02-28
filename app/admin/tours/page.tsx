import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DeleteButton from "../components/DeleteButton";
import AdminShell from "../components/AdminShell";
import { Star, Eye, EyeOff } from "lucide-react";

interface Tour {
  id: string;
  title: string;
  location: string;
  image: string;
  duration: string;
  rating: string;
  priceUsd: number;
  tags: string;
  bookingType: string;
  bookingDuration: string;
  pickupAddr: string;
  pickupName: string;
  dropoffAddr: string;
  dropoffName: string;
  vehicle: string;
  passengers: string;
  roundTrip: boolean;
  isActive: boolean;
  order: number;
}

const INPUT = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 transition-all placeholder:text-slate-400";
const LABEL = "block text-xs font-semibold text-slate-600 mb-1.5";

export default async function AdminToursPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const tours = await db.tour.findMany({ orderBy: { order: "asc" } });
  const editingTour = edit ? tours.find((t: Tour) => t.id === edit) : null;

  async function addTour(formData: FormData) {
    "use server";
    const title = (formData.get("title") as string)?.trim();
    const location = (formData.get("location") as string)?.trim();
    const image = (formData.get("image") as string)?.trim();
    const duration = (formData.get("duration") as string)?.trim();
    const rating = (formData.get("rating") as string)?.trim() || "5.0";
    const priceUsd = parseFloat(formData.get("priceUsd") as string);
    const tags = (formData.get("tags") as string)?.trim();
    const bookingType = (formData.get("bookingType") as string)?.trim() || "transfer";
    const bookingDuration = (formData.get("bookingDuration") as string)?.trim() || "";
    const pickupAddr = (formData.get("pickupAddr") as string)?.trim();
    const pickupName = (formData.get("pickupName") as string)?.trim();
    const dropoffAddr = (formData.get("dropoffAddr") as string)?.trim();
    const dropoffName = (formData.get("dropoffName") as string)?.trim();
    const vehicle = (formData.get("vehicle") as string)?.trim() || "Mercedes-Benz Vito VIP";
    const passengers = (formData.get("passengers") as string)?.trim() || "1";
    const roundTrip = formData.get("roundTrip") === "on";
    const isActive = formData.get("isActive") === "on";
    const order = parseInt(formData.get("order") as string) || 0;

    if (!title || title.length > 200) return;
    if (!location || location.length > 200) return;
    if (!image || image.length > 500) return;
    if (!duration || duration.length > 100) return;
    if (isNaN(priceUsd) || priceUsd < 0 || priceUsd > 100000) return;
    if (!pickupAddr || !pickupName || !dropoffAddr || !dropoffName) return;

    await db.tour.create({
      data: {
        title, location, image, duration, rating, priceUsd, tags,
        bookingType, bookingDuration, pickupAddr, pickupName,
        dropoffAddr, dropoffName, vehicle, passengers, roundTrip, isActive, order,
      },
    });
    revalidatePath("/admin/tours");
    revalidatePath("/tours");
  }

  async function updateTour(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const title = (formData.get("title") as string)?.trim();
    const location = (formData.get("location") as string)?.trim();
    const image = (formData.get("image") as string)?.trim();
    const duration = (formData.get("duration") as string)?.trim();
    const rating = (formData.get("rating") as string)?.trim() || "5.0";
    const priceUsd = parseFloat(formData.get("priceUsd") as string);
    const tags = (formData.get("tags") as string)?.trim();
    const bookingType = (formData.get("bookingType") as string)?.trim() || "transfer";
    const bookingDuration = (formData.get("bookingDuration") as string)?.trim() || "";
    const pickupAddr = (formData.get("pickupAddr") as string)?.trim();
    const pickupName = (formData.get("pickupName") as string)?.trim();
    const dropoffAddr = (formData.get("dropoffAddr") as string)?.trim();
    const dropoffName = (formData.get("dropoffName") as string)?.trim();
    const vehicle = (formData.get("vehicle") as string)?.trim() || "Mercedes-Benz Vito VIP";
    const passengers = (formData.get("passengers") as string)?.trim() || "1";
    const roundTrip = formData.get("roundTrip") === "on";
    const isActive = formData.get("isActive") === "on";
    const order = parseInt(formData.get("order") as string) || 0;

    if (!id || !title || title.length > 200) return;
    if (!location || location.length > 200) return;
    if (!image || image.length > 500) return;
    if (!duration || duration.length > 100) return;
    if (isNaN(priceUsd) || priceUsd < 0 || priceUsd > 100000) return;
    if (!pickupAddr || !pickupName || !dropoffAddr || !dropoffName) return;

    await db.tour.update({
      where: { id },
      data: {
        title, location, image, duration, rating, priceUsd, tags,
        bookingType, bookingDuration, pickupAddr, pickupName,
        dropoffAddr, dropoffName, vehicle, passengers, roundTrip, isActive, order,
      },
    });
    revalidatePath("/tours");
    redirect("/admin/tours");
  }

  async function deleteTour(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await db.tour.delete({ where: { id } });
    revalidatePath("/admin/tours");
    revalidatePath("/tours");
  }

  const TourForm = ({ tour, action, submitLabel }: {
    tour?: Tour;
    action: (fd: FormData) => Promise<void>;
    submitLabel: string;
  }) => (
    <form action={action} className="grid grid-cols-2 gap-4">
      {tour && <input type="hidden" name="id" value={tour.id} aria-hidden="true" />}

      {/* Temel Bilgiler */}
      <div className="col-span-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Temel Bilgiler</p>
      </div>
      <div className="col-span-2 md:col-span-1">
        <label className={LABEL}>Tur Başlığı *</label>
        <input name="title" defaultValue={tour?.title} placeholder="İstanbul Ulaşım & Tahsis" className={INPUT} required />
      </div>
      <div>
        <label className={LABEL}>Lokasyon (Kısa)</label>
        <input name="location" defaultValue={tour?.location} placeholder="Sultanahmet, İstanbul" className={INPUT} />
      </div>
      <div className="col-span-2">
        <label className={LABEL}>Görsel Yolu</label>
        <input name="image" defaultValue={tour?.image} placeholder="/images/tours/tur-adi.jpg" className={INPUT} />
      </div>
      <div>
        <label className={LABEL}>Süre (Görüntü)</label>
        <input name="duration" defaultValue={tour?.duration} placeholder="10 Saat (Araç Tahsis)" className={INPUT} required />
      </div>
      <div>
        <label className={LABEL}>Rating</label>
        <input name="rating" defaultValue={tour?.rating ?? "5.0"} placeholder="4.9" className={INPUT} />
      </div>
      <div>
        <label className={LABEL}>Fiyat (USD $) *</label>
        <input name="priceUsd" type="number" step="0.5" min="0" defaultValue={tour?.priceUsd} placeholder="150" className={INPUT} required />
      </div>
      <div>
        <label className={LABEL}>Etiketler (virgülle)</label>
        <input name="tags" defaultValue={tour?.tags} placeholder="Şoförlü Araç,Günlük,VIP" className={INPUT} />
      </div>

      {/* Checkout Parametreleri */}
      <div className="col-span-2 mt-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Checkout Parametreleri</p>
      </div>
      <div>
        <label className={LABEL}>Rezervasyon Tipi</label>
        <select name="bookingType" defaultValue={tour?.bookingType ?? "transfer"} className={INPUT}>
          <option value="transfer">Transfer</option>
          <option value="hourly">Saatlik Tahsis</option>
        </select>
      </div>
      <div>
        <label className={LABEL}>Tahsis Süresi (saatlik ise)</label>
        <input name="bookingDuration" defaultValue={tour?.bookingDuration} placeholder="10 Saat" className={INPUT} />
      </div>
      <div>
        <label className={LABEL}>Alınış Adresi</label>
        <input name="pickupAddr" defaultValue={tour?.pickupAddr} placeholder="İstanbul, Türkiye" className={INPUT} required />
      </div>
      <div>
        <label className={LABEL}>Alınış Kısa İsim</label>
        <input name="pickupName" defaultValue={tour?.pickupName} placeholder="İstanbul" className={INPUT} required />
      </div>
      <div>
        <label className={LABEL}>Varış Adresi</label>
        <input name="dropoffAddr" defaultValue={tour?.dropoffAddr} placeholder="Sapanca, Türkiye" className={INPUT} required />
      </div>
      <div>
        <label className={LABEL}>Varış Kısa İsim</label>
        <input name="dropoffName" defaultValue={tour?.dropoffName} placeholder="Sapanca & Maşukiye" className={INPUT} required />
      </div>
      <div>
        <label className={LABEL}>Araç</label>
        <input name="vehicle" defaultValue={tour?.vehicle ?? "Mercedes-Benz Vito VIP"} placeholder="Mercedes-Benz Vito VIP" className={INPUT} />
      </div>
      <div>
        <label className={LABEL}>Yolcu Sayısı</label>
        <input name="passengers" defaultValue={tour?.passengers ?? "1"} placeholder="1" className={INPUT} />
      </div>

      {/* Seçenekler */}
      <div className="col-span-2 mt-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Seçenekler</p>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="roundTrip" defaultChecked={tour?.roundTrip} className="w-4 h-4 rounded accent-amber-500" />
          <span className="text-sm font-semibold text-slate-700">Gidiş-Dönüş</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="isActive" defaultChecked={tour?.isActive ?? true} className="w-4 h-4 rounded accent-amber-500" />
          <span className="text-sm font-semibold text-slate-700">Yayında</span>
        </label>
      </div>
      <div>
        <label className={LABEL}>Görüntülenme Sırası</label>
        <input name="order" type="number" defaultValue={tour?.order ?? 0} className={INPUT} />
      </div>

      <div className="col-span-2">
        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
          {submitLabel}
        </button>
      </div>
    </form>
  );

  return (
    <AdminShell>
      <div className="p-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Tur Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-1">Turları ekle, düzenle veya kaldır. Değişiklikler anında /tours sayfasına yansır.</p>
        </div>

        {/* ADD FORM */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="font-bold text-slate-900 mb-5">Yeni Tur Ekle</h2>
          <TourForm action={addTour} submitLabel="Turu Kaydet" />
        </div>

        {/* TOUR LIST */}
        <div>
          <h2 className="font-bold text-slate-900 mb-4">
            Kayıtlı Turlar <span className="text-slate-400 font-normal">({tours.length})</span>
          </h2>

          {tours.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
              Henüz tur eklenmemiş
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Tur</span>
                <span>Fiyat</span>
                <span>Rating</span>
                <span>Durum</span>
                <span></span>
              </div>

              <div className="divide-y divide-slate-50">
                {tours.map((t: Tour) => (
                  <div key={t.id}>
                    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 items-center">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{t.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{t.location} · Sıra: {t.order}</p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm whitespace-nowrap">${t.priceUsd}</span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                        <Star size={11} fill="currentColor" /> {t.rating}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1 ${t.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                        {t.isActive ? <><Eye size={11} /> Yayında</> : <><EyeOff size={11} /> Pasif</>}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/admin/tours?edit=${t.id}`}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700 transition-colors whitespace-nowrap"
                        >
                          Düzenle
                        </a>
                        <form action={deleteTour}>
                          <input type="hidden" name="id" value={t.id} aria-hidden="true" />
                          <DeleteButton message={`"${t.title}" silinsin mi?`} />
                        </form>
                      </div>
                    </div>

                    {/* Inline edit form */}
                    {editingTour?.id === t.id && (
                      <div className="border-t border-amber-100 bg-amber-50/40 px-5 py-5">
                        <p className="text-xs font-bold text-amber-700 mb-4">Turu Düzenle</p>
                        <TourForm tour={t} action={updateTour} submitLabel="Değişiklikleri Kaydet" />
                        <a href="/admin/tours" className="block text-center mt-3 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                          İptal
                        </a>
                      </div>
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
