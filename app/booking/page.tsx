"use client"
import { sendGAEvent } from '@next/third-parties/google'
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { 
  Users, Briefcase, ArrowRight, MapPin, Calendar, 
  Lock, Plane, HandMetal, ThumbsUp, Star, Loader2, 
  Edit2, ArrowRightLeft, X, Search, History, AlertCircle, Clock 
} from "lucide-react"
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
import { tr } from 'date-fns/locale';

declare global {
  interface Window {
    google: any;
  }
}

// Araç Verileri
const vehicles = [
  { id: 1, name: "Mercedes-Benz Vito VIP", type: "Premium Minivan", image: "/vehicles/vito.png", capacity: "6", luggage: "6", basePriceUsd: 55, badge: "En Çok Tercih Edilen" },
  { id: 2, name: "Mercedes-Benz Sprinter", type: "Large Group Van", image: "/vehicles/sprinter.png", capacity: "16", luggage: "12", basePriceUsd: 110, badge: "" },
  { id: 3, name: "S-Class Maybach", type: "Luxury Sedan", image: "/vehicles/sclass.png", capacity: "3", luggage: "2", basePriceUsd: 275, badge: "Lüks Seçim" }
]

const formatDisplayDate = (dateString: string | null) => {
  if (!dateString) return "Seçilmedi";
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
     return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  }
  return dateString;
}

export default function BookingSelectionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const bookingType = searchParams.get("type") || "transfer"; 
  const initialDuration = searchParams.get("duration") || "4 Saat";
  const pickupAddr = searchParams.get("pickup") || "Konum Belirtilmedi";
  const pickupName = searchParams.get("pickupName") || pickupAddr;
  const dropoffAddr = searchParams.get("dropoff") || "Konum Belirtilmedi";
  const dropoffName = searchParams.get("dropoffName") || dropoffAddr;

  const [from, setFrom] = useState(pickupName === "Konum Belirtilmedi" ? "" : pickupName);
  const [to, setTo] = useState(dropoffName === "Konum Belirtilmedi" ? "" : dropoffName);
  const [fromFullAddress, setFromFullAddress] = useState(pickupAddr);
  const [toFullAddress, setToFullAddress] = useState(dropoffAddr);
  const [duration, setDuration] = useState(initialDuration);
  const [isFromValid, setIsFromValid] = useState(pickupName !== "Konum Belirtilmedi");
  const [isToValid, setIsToValid] = useState(dropoffName !== "Konum Belirtilmedi");
  const [date, setDate] = useState<Date | null>(searchParams.get("date") ? new Date(searchParams.get("date")!) : null);
  const [returnDate, setReturnDate] = useState<Date | null>(searchParams.get("returnDate") ? new Date(searchParams.get("returnDate")!) : null);
  const [passengers, setPassengers] = useState(searchParams.get("passengers") || "1");
  const [isRoundTrip, setIsRoundTrip] = useState(searchParams.get("roundTrip") === "true");
  const [isEditing, setIsEditing] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);
  const [rates, setRates] = useState({ USD: 1, EUR: 0.92, TRY: 35, GBP: 0.79 });
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState({ from: false, to: false, date: false, returnDate: false });

  const [isStartTimeMode, setIsStartTimeMode] = useState(false);
  const [isReturnTimeMode, setIsReturnTimeMode] = useState(false);

  const isDataReady = !isEditing && isFromValid && isToValid && from && to && date !== null && (isRoundTrip ? returnDate !== null : true);

  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropoffInputRef = useRef<HTMLInputElement>(null);
  const startDatePickerRef = useRef<any>(null);
  const returnDatePickerRef = useRef<any>(null);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY,EUR,GBP');
        const data = await res.json();
        if (data && data.rates) {
          setRates({ USD: 1, TRY: data.rates.TRY * 1.02, EUR: data.rates.EUR * 1.02, GBP: data.rates.GBP * 1.02 });
        }
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    }
    fetchRates();
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    const waitForGoogle = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
            clearInterval(waitForGoogle);
            initAutocomplete();
        }
    }, 100);
    // İlçe/şehir bilgisini ekleyerek kısa ama anlamlı bir isim oluşturur
    const buildDisplayName = (place: any): string => {
      const name = place.name || "";
      const components: any[] = place.address_components || [];
      const district = components.find((c: any) =>
        c.types.includes("sublocality_level_1") ||
        c.types.includes("administrative_area_level_2")
      )?.long_name;
      const city = components.find((c: any) =>
        c.types.includes("locality") ||
        c.types.includes("administrative_area_level_1")
      )?.long_name;
      if (!name) return place.formatted_address || "";
      if (city && name.toLowerCase().includes(city.toLowerCase())) return name;
      const suffix = district && city ? `${district}/${city}` : city;
      return suffix ? `${name}, ${suffix}` : name;
    };

    const initAutocomplete = () => {
      const options = { componentRestrictions: { country: "tr" } };
      if (pickupInputRef.current) {
         const fromAutocomplete = new window.google.maps.places.Autocomplete(pickupInputRef.current, options);
         fromAutocomplete.addListener("place_changed", () => {
            const place = fromAutocomplete.getPlace();
            if (!place.geometry) { setIsFromValid(false); return; }
            setFrom(buildDisplayName(place));
            setFromFullAddress(place.formatted_address || "");
            setIsFromValid(true); setErrors(prev => ({...prev, from: false}));
         });
      }
      if (dropoffInputRef.current) {
         const toAutocomplete = new window.google.maps.places.Autocomplete(dropoffInputRef.current, options);
         toAutocomplete.addListener("place_changed", () => {
            const place = toAutocomplete.getPlace();
            if (!place.geometry) { setIsToValid(false); return; }
            setTo(buildDisplayName(place));
            setToFullAddress(place.formatted_address || "");
            setIsToValid(true); setErrors(prev => ({...prev, to: false}));
         });
      }
    };
    return () => clearInterval(waitForGoogle);
  }, [isEditing]);

  const handleStartSelect = (d: Date | null) => {
    if (!d) return;
    setErrors(prev => ({...prev, date: false}));
    if (!isStartTimeMode) {
      setDate(d);
      setIsStartTimeMode(true);
    } else {
      setDate(d);
      setIsStartTimeMode(false);
      startDatePickerRef.current?.setOpen(false);
    }
  };

  const handleReturnSelect = (d: Date | null) => {
    if (!d) return;
    setErrors(prev => ({...prev, returnDate: false}));
    if (!isReturnTimeMode) {
      setReturnDate(d);
      setIsReturnTimeMode(true);
    } else {
      setReturnDate(d);
      setIsReturnTimeMode(false);
      returnDatePickerRef.current?.setOpen(false);
    }
  };

  const handleUpdateSearch = () => {
    let newErrors = {
        from: !from || from.trim() === "" || from === "Konum Belirtilmedi",
        to: !to || to.trim() === "" || to === "Konum Belirtilmedi",
        date: !date,
        returnDate: (bookingType === 'transfer' && isRoundTrip) ? !returnDate : false
    };
    if (!isFromValid) newErrors.from = true;
    if (!isToValid) newErrors.to = true;
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
        setFormMessage("Lütfen konumları ve tarihleri eksik alanları doldurunuz.");
        return; 
    }
    setFormMessage(null);
    setIsEditing(false); 
    const params = new URLSearchParams();
    params.set("type", bookingType);
    params.set("pickup", fromFullAddress || from);
    params.set("pickupName", from); 
    params.set("dropoff", toFullAddress || to);
    params.set("dropoffName", to);
    if (bookingType === 'transfer') {
        params.set("roundTrip", isRoundTrip ? "true" : "false");
        if (isRoundTrip && returnDate) params.set("returnDate", returnDate.toISOString());
    } else { params.set("duration", duration); }
    if (date) params.set("date", date.toISOString());
    params.set("passengers", passengers);
    router.push(`/booking?${params.toString()}`);
  };

  // ✅ DÜZELTİLEN: toggleEditing Fonksiyonu (Dışarı çıkarıldı ve butona bağlandı)
  const toggleEditing = () => {
    if (!isEditing) {
      sendGAEvent({ event: 'edit_search_clicked' });
    }
    setIsEditing(!isEditing);
  };

  const handleSelect = (vehicleName: string, finalPrice: string) => {
    // ✅ GA: Takip Kodu
    sendGAEvent({ event: 'vehicle_selected', value: vehicleName, price: finalPrice });

    if (!isDataReady) {
        setErrors({
            from: !isFromValid || !from || from === "Konum Belirtilmedi",
            to: !isToValid || !to || to === "Konum Belirtilmedi",
            date: !date,
            returnDate: (bookingType === 'transfer' && isRoundTrip) ? !returnDate : false
        });
        setFormMessage("Lütfen tüm alanları geçerli şekilde doldurunuz.");
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return; 
    }
    const params = new URLSearchParams({ 
        type: bookingType, pickup: fromFullAddress || from, pickupName: from, 
        dropoff: toFullAddress || to, dropoffName: to,
        date: date ? date.toISOString() : "", vehicle: vehicleName, price: finalPrice, passengers: passengers
    });
    if (bookingType === 'hourly') params.set("duration", duration);
    if (bookingType === 'transfer' && isRoundTrip && returnDate) params.set("returnDate", returnDate.toISOString());
    params.set("roundTrip", isRoundTrip ? "true" : "false");
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center gap-12 text-sm font-medium">
            <div className="flex items-center gap-2 text-gray-400"><span className="w-6 h-6 rounded-full border flex items-center justify-center">1</span><span className="hidden md:inline">Arama</span></div>
            <div className="w-8 h-[1px] bg-gray-300 hidden md:block"></div>
            <div className="flex items-center gap-2 text-amber-600 font-bold"><span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-600 flex items-center justify-center text-amber-700">2</span><span>Araç Seçimi</span></div>
            <div className="w-8 h-[1px] bg-gray-300 hidden md:block"></div>
            <div className="flex items-center gap-2 text-gray-400"><span className="w-6 h-6 rounded-full border flex items-center justify-center">3</span><span className="hidden md:inline">Ödeme</span></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* REZERVASYON KARTI (order-1 ile mobilde üste alındı) */}
        <div className="lg:col-span-1 lg:mt-14 order-1 lg:order-2"> 
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky lg:top-24 overflow-visible">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900">Rezervasyon</h3>
                    {/* ✅ DÜZELTİLEN: toggleEditing buraya bağlandı */}
                    <button onClick={toggleEditing} className={`text-sm font-bold flex items-center gap-1 ${isEditing ? 'text-red-500' : 'text-amber-600'}`}>
                        {isEditing ? <><X size={16}/> İptal</> : <><Edit2 size={14} /> Düzenle</>}
                    </button>
                </div>

                <div className="p-6">
                    {isEditing ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {formMessage && (
                                <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2 animate-pulse">
                                    <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" /><p className="text-xs font-bold text-red-600 leading-tight">{formMessage}</p>
                                </div>
                            )}
                            <div className="relative group">
                                <MapPin className={`absolute left-3 top-3.5 ${errors.from ? 'text-red-500' : 'text-green-600'}`} size={18} />
                                <div className={`absolute left-9 top-1.5 text-[9px] font-bold uppercase ${errors.from ? 'text-red-400' : 'text-gray-400'}`}>NEREDEN</div>
                                <input ref={pickupInputRef} type="text" defaultValue={from} onChange={(e) => { setFrom(e.target.value); setIsFromValid(false); if(e.target.value) setErrors(p => ({...p, from: false})); }} className={`w-full pl-9 pt-4 pb-2 text-sm font-bold text-slate-900 border rounded-xl outline-none transition-all ${errors.from ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`} placeholder="Konum seçiniz" />
                            </div>

                            <div className="relative group">
                                <MapPin className={`absolute left-3 top-3.5 ${errors.to ? 'text-red-500' : 'text-blue-600'}`} size={18} />
                                <div className={`absolute left-9 top-1.5 text-[9px] font-bold uppercase ${errors.to ? 'text-red-400' : 'text-gray-400'}`}>NEREYE</div>
                                <input ref={dropoffInputRef} type="text" defaultValue={to} onChange={(e) => { setTo(e.target.value); setIsToValid(false); if(e.target.value) setErrors(p => ({...p, to: false})); }} className={`w-full pl-9 pt-4 pb-2 text-sm font-bold text-slate-900 border rounded-xl outline-none transition-all ${errors.to ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`} placeholder="Konum seçiniz" />
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <div className={`absolute left-3 top-3 z-10 ${errors.date ? 'text-red-500' : 'text-slate-900'}`}><Calendar size={16}/></div>
                                    <div className={`absolute left-9 top-1.5 text-[8px] font-bold uppercase z-10 ${errors.date ? 'text-red-400' : 'text-gray-400'}`}>TARİH</div>
                                    <DatePicker 
                                        ref={startDatePickerRef} 
                                        selected={date} 
                                        onChange={handleStartSelect} 
                                        showTimeSelect={isStartTimeMode}
                                        showTimeSelectOnly={isStartTimeMode}
                                        timeIntervals={30} 
                                        timeCaption="SAAT" 
                                        dateFormat={isStartTimeMode ? "HH:mm" : "d MMM yyyy HH:mm"}
                                        locale={tr} 
                                        portalId="root-portal"
                                        shouldCloseOnSelect={false}
                                        className={`w-full pl-9 pt-4 pb-2 text-xs font-bold text-slate-900 border rounded-xl outline-none ${errors.date ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} 
                                        placeholderText="Seç" 
                                        popperPlacement="bottom-start" 
                                    />
                                </div>
                                {bookingType === 'transfer' && (
                                    <div className={`flex-1 relative transition-all duration-300 ${!isRoundTrip ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`}>
                                        <div className={`absolute left-3 top-3 z-10 ${errors.returnDate ? 'text-red-500' : 'text-slate-900'}`}><History size={16}/></div>
                                        <div className={`absolute left-9 top-1.5 text-[8px] font-bold uppercase z-10 ${errors.returnDate ? 'text-red-400' : 'text-gray-400'}`}>DÖNÜŞ</div>
                                        <DatePicker 
                                            ref={returnDatePickerRef} 
                                            selected={returnDate} 
                                            onChange={handleReturnSelect} 
                                            showTimeSelect={isReturnTimeMode}
                                            showTimeSelectOnly={isReturnTimeMode}
                                            timeIntervals={30} 
                                            timeCaption="SAAT" 
                                            dateFormat={isReturnTimeMode ? "HH:mm" : "d MMM yyyy HH:mm"}
                                            locale={tr} 
                                            disabled={!isRoundTrip} 
                                            portalId="root-portal"
                                            shouldCloseOnSelect={false}
                                            className={`w-full pl-9 pt-4 pb-2 text-xs font-bold border rounded-xl outline-none transition-colors 
                                              ${errors.returnDate ? 'border-red-500 bg-red-50' : !isRoundTrip ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-white border-gray-200 text-slate-900'}`} 
                                            placeholderText={!isRoundTrip ? "-" : "Seç"} 
                                            popperPlacement="bottom-end" 
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {bookingType === 'hourly' ? (
                                     <div className="flex-1 border border-gray-200 rounded-xl p-2 relative flex flex-col justify-center">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1 text-center">SÜRE</label>
                                        <select value={duration} onChange={(e) => setDuration(e.target.value)} className="text-sm font-bold text-slate-900 text-center outline-none bg-transparent appearance-none cursor-pointer">
                                            <option value="4 Saat">4 Saat</option><option value="8 Saat">8 Saat</option><option value="10 Saat">10 Saat</option><option value="12 Saat">12 Saat</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div className="flex-1 border border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-amber-400 transition-colors" onClick={() => setIsRoundTrip(!isRoundTrip)}>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase">GİDİŞ-DÖNÜŞ</span>
                                        <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors duration-300 ${isRoundTrip ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isRoundTrip ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex-1 border border-gray-200 rounded-xl p-2 relative">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1 text-center">YOLCU</span>
                                    <select value={passengers} onChange={(e) => setPassengers(e.target.value)} className="w-full text-sm font-bold text-slate-900 text-center outline-none bg-transparent appearance-none cursor-pointer">
                                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Kişi</option>)}
                                    </select>
                                </div>
                                <button onClick={handleUpdateSearch} className="flex-1 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all"><Search size={24} /></button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="relative pl-6 border-l-2 border-gray-100 space-y-6">
                                <div className="relative">
                                    <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${from ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'}`}></div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">NEREDEN</span>
                                    <p className={`text-sm font-bold leading-tight ${from ? 'text-slate-900' : 'text-red-500'}`}>{from || "Seçilmedi"}</p>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pickupAddr}</p>
                                </div>
                                <div className="relative">
                                    <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${to ? 'bg-blue-100 border-blue-500' : 'bg-red-100 border-red-500'}`}></div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">NEREYE</span>
                                    <p className={`text-sm font-bold leading-tight ${to ? 'text-slate-900' : 'text-red-500'}`}>{to || "Seçilmedi"}</p>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{dropoffAddr}</p>
                                </div>
                            </div>
                            <div className="h-px bg-gray-100 w-full"></div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center"><div className="flex items-center gap-3 text-gray-600"><Calendar size={18} /><span className="text-sm font-medium">Tarih</span></div><span className="text-sm font-bold text-slate-900 text-right">{formatDisplayDate(date ? date.toISOString() : null)}</span></div>
                                {bookingType === 'transfer' && isRoundTrip && <div className="flex justify-between items-center"><div className="flex items-center gap-3 text-gray-600"><History size={18} /><span className="text-sm font-medium">Dönüş</span></div><span className={`text-sm font-bold text-right ${returnDate ? 'text-slate-900' : 'text-red-500'}`}>{returnDate ? formatDisplayDate(returnDate.toISOString()) : "Seçilmedi"}</span></div>}
                                {bookingType === 'hourly' && <div className="flex justify-between items-center"><div className="flex items-center gap-3 text-gray-600"><Clock size={18} /><span className="text-sm font-medium">Süre</span></div><span className="text-sm font-bold text-slate-900">{duration}</span></div>}
                                <div className="flex justify-between items-center"><div className="flex items-center gap-3 text-gray-600"><Users size={18} /><span className="text-sm font-medium">Yolcu</span></div><span className="text-sm font-bold text-slate-900">{passengers} Kişi</span></div>
                                
                                <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-2">
                                    <div className="flex items-center gap-3 text-gray-600"><ArrowRightLeft size={18} /><span className="text-sm font-medium">Transfer Tipi</span></div>
                                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
                                        {bookingType === 'hourly' ? 'Saatlik Tahsis' : (isRoundTrip ? 'Gidiş-Dönüş' : 'Tek Yön')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* ARAÇ LİSTESİ (order-2 ile mobilde alta alındı) */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            <h2 className="text-2xl font-bold text-slate-900">Araç Seçenekleri ({bookingType === 'hourly' ? 'Saatlik Tahsis' : 'Transfer'})</h2>
            {isLoading ? (
                <div className="space-y-6">{[1, 2, 3].map((i) => (<div key={i} className="h-64 bg-white rounded-2xl animate-pulse"></div>))}</div>
            ) : (
                <div className="space-y-6">
                        {vehicles.map((v) => (
                        <VehicleCard 
                        key={v.id} 
                        vehicle={v} 
                        rates={rates} 
                        // Her iki değeri de Boolean() içine alarak kesinleştiriyoruz
                        isRoundTrip={Boolean(isRoundTrip)} 
                        bookingType={bookingType} 
                        duration={duration} 
                        onSelect={handleSelect} 
                        isDataReady={Boolean(isDataReady)} // 👈 BURAYI BU ŞEKİLDE GÜNCELLE
                        />
                    ))}
                </div>
            )}
        </div>

      </div>
      <div id="root-portal"></div>
    </div>
  )
}

// ✅ DÜZELTİLEN: VehicleCard parametreleri güncellendi ve fiyat hesaplama eklendi
function VehicleCard({ 
  vehicle, 
  rates, 
  isRoundTrip, 
  bookingType, 
  duration, 
  onSelect, 
  isDataReady 
}: { 
  vehicle: any, 
  rates: any, 
  isRoundTrip: boolean, 
  bookingType: string, 
  duration: string, 
  onSelect: any, 
  isDataReady: boolean 
}) {
    const [currency, setCurrency] = useState<"TRY" | "USD" | "EUR" | "GBP">("TRY");
    const symbols = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" };
    
    // ✅ Fiyat hesaplama mantığı eklendi
    let finalUsdPrice = vehicle.basePriceUsd;

    if (bookingType === 'transfer') {
      finalUsdPrice = isRoundTrip ? vehicle.basePriceUsd * 2 : vehicle.basePriceUsd;
    } else {
      // Saatlik tahsis çarpanları
      const multipliers: Record<string, number> = {
        "4 Saat": 1,
        "8 Saat": 1.8,
        "10 Saat": 2.2,
        "12 Saat": 2.5
      };
      finalUsdPrice = vehicle.basePriceUsd * (multipliers[duration] || 1);
    }

    const prices = { 
      TRY: Math.round(finalUsdPrice * rates.TRY), 
      EUR: Math.round(finalUsdPrice * rates.EUR), 
      USD: Math.round(finalUsdPrice), 
      GBP: Math.round(finalUsdPrice * rates.GBP) 
    }
    const selectedPriceStr = `${prices[currency]} ${symbols[currency]}`

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-all group">
            <div className="relative w-full md:w-1/3 bg-gray-50 p-6 flex items-center justify-center">
                <Image src={vehicle.image} alt={vehicle.name} width={300} height={200} className="object-contain group-hover:scale-105 transition-transform duration-500" unoptimized/>
                {vehicle.badge && <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex gap-1"><Star size={10} fill="currentColor"/> {vehicle.badge}</div>}
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{vehicle.name}</h3>
                    <div className="flex gap-3 mt-2 mb-4"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1"><Users size={12}/> {vehicle.capacity}</span><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1"><Briefcase size={12}/> {vehicle.luggage}</span></div>
                    <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500 mb-4"><div className="flex items-center gap-1.5"><Lock size={12} className="text-green-500"/> Sabit Fiyat</div><div className="flex items-center gap-1.5"><Plane size={12} className="text-blue-500"/> Uçuş Takibi</div><div className="flex items-center gap-1.5"><HandMetal size={12} className="text-amber-500"/> VIP Karşılama</div><div className="flex items-center gap-1.5"><ThumbsUp size={12} className="text-purple-500"/> Ücretsiz İptal</div></div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-4">
                    {isDataReady ? (
                        <>
                            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2 w-full sm:w-auto">
                                {(['TRY', 'USD', 'EUR', 'GBP'] as const).map((cur) => (
                                    <button key={cur} onClick={() => setCurrency(cur)} className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg border transition-all ${currency === cur ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-amber-400'}`}>
                                        <span className="text-[10px] font-medium opacity-80">{cur}</span><span className="text-xs font-bold whitespace-nowrap">{prices[cur]} {symbols[cur]}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                                <div className="text-right hidden md:block"><span className="block text-2xl font-bold text-slate-900 leading-none">{selectedPriceStr}</span><span className="text-[10px] text-gray-400">Toplam Fiyat</span></div>
                                <button onClick={() => onSelect(vehicle.name, selectedPriceStr)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-sm whitespace-nowrap">Seç <ArrowRight size={16} className="inline ml-1"/></button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4"><div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-100 w-full flex-1 text-xs font-bold"><AlertCircle size={18} /> Fiyat görmek için lütfen tüm alanları seçiniz.</div><button onClick={() => onSelect(vehicle.name, "0 TL")} className="bg-gray-200 text-gray-600 font-bold py-3 px-6 rounded-xl text-sm whitespace-nowrap">Seç <ArrowRight size={16} className="inline ml-1"/></button></div>
                    )}
                </div>
            </div>
        </div>
    )
}