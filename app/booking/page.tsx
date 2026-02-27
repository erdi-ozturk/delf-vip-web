"use client"
import { sendGAEvent } from '@next/third-parties/google'
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {
  Users, Briefcase, ArrowRight, MapPin, Calendar,
  Lock, Plane, HandMetal, ThumbsUp, Star, Loader2,
  Edit2, ArrowRightLeft, X, Search, History, AlertCircle, Clock, PhoneCall
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

  // Autocomplete suggestions
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([]);
  const [showPickupSug, setShowPickupSug] = useState(false);
  const [showDropoffSug, setShowDropoffSug] = useState(false);

  // Client-side mesafe hesabı (sunucu key'inde referrer kısıtlaması var)
  const [clientDistanceKm, setClientDistanceKm] = useState<number | null>(null);
  const [isGoogleMapsReady, setIsGoogleMapsReady] = useState(false);
  const distanceMatrixServiceRef = useRef<any>(null);

  const isDataReady = !isEditing && isFromValid && isToValid && from && to && date !== null && (isRoundTrip ? returnDate !== null : true);

  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropoffInputRef = useRef<HTMLInputElement>(null);
  const startDatePickerRef = useRef<any>(null);
  const returnDatePickerRef = useRef<any>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);

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

  // Google Maps servislerini yükle (bir kez)
  useEffect(() => {
    if (autocompleteServiceRef.current) return;
    const waitForGoogle = setInterval(() => {
      if (window.google?.maps?.places?.AutocompleteService) {
        clearInterval(waitForGoogle);
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        const div = document.createElement("div");
        placesServiceRef.current = new window.google.maps.places.PlacesService(div);
        distanceMatrixServiceRef.current = new window.google.maps.DistanceMatrixService();
        setIsGoogleMapsReady(true);
      }
    }, 100);
    return () => clearInterval(waitForGoogle);
  }, []);

  // Adresler değişince mesafeyi tarayıcıdan hesapla (sunucu key'i referrer kısıtlı)
  // isGoogleMapsReady da dependency'de: Maps geç yüklenirse sayfa URL param'larıyla açıldığında da tetiklenir
  // ignore flag: React StrictMode'da effect 2x çalışır; stale callback'lerin state'i bozmasını engeller
  useEffect(() => {
    let ignore = false;
    if (!isGoogleMapsReady || !fromFullAddress || !toFullAddress || !isFromValid || !isToValid) {
      if (isGoogleMapsReady && (!fromFullAddress || !toFullAddress)) setClientDistanceKm(null);
      return () => { ignore = true; };
    }
    distanceMatrixServiceRef.current.getDistanceMatrix(
      {
        origins: [fromFullAddress],
        destinations: [toFullAddress],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response: any, status: string) => {
        if (ignore) return;
        if (status === "OK") {
          const meters = response?.rows?.[0]?.elements?.[0]?.distance?.value;
          if (typeof meters === "number") {
            console.log(`[DistanceMatrix] ${Math.round(meters / 1000)} km`);
            setClientDistanceKm(Math.round(meters / 1000));
          } else {
            setClientDistanceKm(null);
          }
        } else {
          console.warn(`[DistanceMatrix] status=${status}`);
          setClientDistanceKm(null);
        }
      }
    );
    return () => { ignore = true; };
  }, [fromFullAddress, toFullAddress, isFromValid, isToValid, isGoogleMapsReady]);

  const getPredictions = (value: string, setSugs: (s: any[]) => void, setShow: (b: boolean) => void) => {
    if (!value || value.length < 2 || !autocompleteServiceRef.current) {
      setSugs([]); setShow(false); return;
    }
    autocompleteServiceRef.current.getPlacePredictions(
      { input: value, componentRestrictions: { country: "tr" } },
      (predictions: any[] | null, status: string) => {
        if (status === "OK" && predictions?.length) {
          setSugs(predictions); setShow(true);
        } else { setSugs([]); setShow(false); }
      }
    );
  };

  const selectPlace = (
    prediction: any,
    setLoc: (s: string) => void,
    setFull: (s: string) => void,
    setValid: (b: boolean) => void,
    setShow: (b: boolean) => void,
    setSugs: (s: any[]) => void,
    clearErr: () => void
  ) => {
    const name = prediction.structured_formatting?.main_text || prediction.description;
    setLoc(name);
    setFull("");
    setValid(false);
    setShow(false); setSugs([]);
    clearErr();
    placesServiceRef.current?.getDetails(
      { placeId: prediction.place_id, fields: ["formatted_address", "name"] },
      (place: any, status: string) => {
        if (status === "OK" && place) {
          const placeName = place.name || "";
          const placeAddr = place.formatted_address || "";
          setFull(placeName && placeAddr ? `${placeName} ${placeAddr}` : placeName || placeAddr);
          setValid(true);
        }
      }
    );
  };

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
                                <MapPin className={`absolute left-3 top-3.5 z-10 ${errors.from ? 'text-red-500' : 'text-green-600'}`} size={18} />
                                <div className={`absolute left-9 top-1.5 text-[9px] font-bold uppercase z-10 pointer-events-none ${errors.from ? 'text-red-400' : 'text-gray-400'}`}>NEREDEN</div>
                                <input
                                  ref={pickupInputRef}
                                  type="text"
                                  defaultValue={from}
                                  onChange={(e) => {
                                    setFrom(e.target.value);
                                    setIsFromValid(false);
                                    if(e.target.value) setErrors(p => ({...p, from: false}));
                                    getPredictions(e.target.value, setPickupSuggestions, setShowPickupSug);
                                  }}
                                  onBlur={() => setTimeout(() => setShowPickupSug(false), 150)}
                                  className={`w-full pl-9 pt-4 pb-2 text-sm font-bold text-slate-900 border rounded-xl outline-none transition-all ${errors.from ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`}
                                  placeholder="Konum seçiniz"
                                />
                                {showPickupSug && pickupSuggestions.length > 0 && (
                                  <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden">
                                    {pickupSuggestions.map((pred) => (
                                      <li key={pred.place_id}
                                        onMouseDown={(e) => { e.preventDefault(); selectPlace(pred, setFrom, setFromFullAddress, setIsFromValid, setShowPickupSug, setPickupSuggestions, () => setErrors(p => ({...p, from: false}))); }}
                                        className="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm border-b border-gray-50 last:border-0 flex items-center gap-3"
                                      >
                                        <MapPin size={14} className="text-amber-500 shrink-0" />
                                        <div>
                                          <div className="font-medium text-slate-800">{pred.structured_formatting?.main_text}</div>
                                          <div className="text-xs text-gray-400">{pred.structured_formatting?.secondary_text}</div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </div>

                            <div className="relative group">
                                <MapPin className={`absolute left-3 top-3.5 z-10 ${errors.to ? 'text-red-500' : 'text-blue-600'}`} size={18} />
                                <div className={`absolute left-9 top-1.5 text-[9px] font-bold uppercase z-10 pointer-events-none ${errors.to ? 'text-red-400' : 'text-gray-400'}`}>NEREYE</div>
                                <input
                                  ref={dropoffInputRef}
                                  type="text"
                                  defaultValue={to}
                                  onChange={(e) => {
                                    setTo(e.target.value);
                                    setIsToValid(false);
                                    if(e.target.value) setErrors(p => ({...p, to: false}));
                                    getPredictions(e.target.value, setDropoffSuggestions, setShowDropoffSug);
                                  }}
                                  onBlur={() => setTimeout(() => setShowDropoffSug(false), 150)}
                                  className={`w-full pl-9 pt-4 pb-2 text-sm font-bold text-slate-900 border rounded-xl outline-none transition-all ${errors.to ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-amber-500'}`}
                                  placeholder="Konum seçiniz"
                                />
                                {showDropoffSug && dropoffSuggestions.length > 0 && (
                                  <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden">
                                    {dropoffSuggestions.map((pred) => (
                                      <li key={pred.place_id}
                                        onMouseDown={(e) => { e.preventDefault(); selectPlace(pred, setTo, setToFullAddress, setIsToValid, setShowDropoffSug, setDropoffSuggestions, () => setErrors(p => ({...p, to: false}))); }}
                                        className="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm border-b border-gray-50 last:border-0 flex items-center gap-3"
                                      >
                                        <MapPin size={14} className="text-amber-500 shrink-0" />
                                        <div>
                                          <div className="font-medium text-slate-800">{pred.structured_formatting?.main_text}</div>
                                          <div className="text-xs text-gray-400">{pred.structured_formatting?.secondary_text}</div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
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
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                      <div className="w-full md:w-1/3 bg-gray-100 animate-pulse h-48 md:h-auto min-h-[160px]" />
                      <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                          <div className="h-6 bg-gray-100 animate-pulse rounded-lg w-2/3" />
                          <div className="flex gap-2">
                            <div className="h-6 bg-gray-100 animate-pulse rounded-lg w-16" />
                            <div className="h-6 bg-gray-100 animate-pulse rounded-lg w-16" />
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {[1,2,3,4].map(j => <div key={j} className="h-4 bg-gray-100 animate-pulse rounded" />)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 pt-4 gap-4">
                          <div className="flex gap-2">
                            {[1,2,3,4].map(j => <div key={j} className="h-10 w-16 bg-gray-100 animate-pulse rounded-lg" />)}
                          </div>
                          <div className="h-10 w-24 bg-amber-100 animate-pulse rounded-xl" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            ) : (
                <div className="space-y-6">
                        {vehicles.map((v) => (
                        <VehicleCard
                        key={v.id}
                        vehicle={v}
                        rates={rates}
                        isRoundTrip={Boolean(isRoundTrip)}
                        bookingType={bookingType}
                        duration={duration}
                        onSelect={handleSelect}
                        isDataReady={Boolean(isDataReady)}
                        pickup={[from, fromFullAddress].filter(Boolean).join(" ")}
                        dropoff={[to, toFullAddress].filter(Boolean).join(" ")}
                        clientDistanceKm={clientDistanceKm}
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

function VehicleCard({
  vehicle,
  rates,
  isRoundTrip,
  bookingType,
  duration,
  onSelect,
  isDataReady,
  pickup,
  dropoff,
  clientDistanceKm,
}: {
  vehicle: any,
  rates: any,
  isRoundTrip: boolean,
  bookingType: string,
  duration: string,
  onSelect: any,
  isDataReady: boolean,
  pickup: string,
  dropoff: string,
  clientDistanceKm: number | null,
}) {
    const [currency, setCurrency] = useState<"TRY" | "USD" | "EUR" | "GBP">("TRY");
    const symbols = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" };
    const [apiPriceUsd, setApiPriceUsd] = useState<number | null>(null);
    const [priceStatus, setPriceStatus] = useState<"loading" | "found" | "unavailable">("loading");
    const [priceSource, setPriceSource] = useState<string | null>(null);
    const [priceDistanceKm, setPriceDistanceKm] = useState<number | null>(null);

    useEffect(() => {
      if (!isDataReady || !pickup || !dropoff || pickup === "Konum Belirtilmedi" || dropoff === "Konum Belirtilmedi") return;
      setPriceStatus("loading");
      setApiPriceUsd(null);
      setPriceSource(null);
      setPriceDistanceKm(null);
      const controller = new AbortController();
      const params = new URLSearchParams({
        vehicle: vehicle.name,
        type: bookingType,
        pickup,
        dropoff,
        roundTrip: isRoundTrip ? "true" : "false",
        duration,
        ...(clientDistanceKm !== null ? { distanceKm: String(clientDistanceKm) } : {}),
      });
      fetch(`/api/calculate-price?${params}`, { signal: controller.signal })
        .then(r => r.json())
        .then(data => {
          console.log(`[VehicleCard] ${vehicle.name} | source=${data.source} | route=${data.route ?? '-'} | priceUsd=${data.priceUsd} | distanceKm=${data.distanceKm ?? '-'}`);
          // source=base → hesaplanamadı (taban fiyat fallback), gerçek fiyat değil
          if (data.priceUsd && data.source !== "base") {
            setApiPriceUsd(data.priceUsd);
            setPriceSource(data.source);
            setPriceDistanceKm(data.distanceKm ?? null);
            setPriceStatus("found");
          } else {
            setPriceStatus("unavailable");
          }
        })
        .catch(err => { if (err.name !== "AbortError") setPriceStatus("unavailable"); });
      return () => controller.abort();
    }, [vehicle.name, bookingType, pickup, dropoff, isRoundTrip, duration, isDataReady, clientDistanceKm]);

    const finalUsdPrice = apiPriceUsd ?? 0;
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
                    {!isDataReady ? (
                        /* Form doldurulmadı */
                        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4"><div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-100 w-full flex-1 text-xs font-bold"><AlertCircle size={18} /> Fiyat görmek için lütfen tüm alanları seçiniz.</div><button onClick={() => onSelect(vehicle.name, "0 TL")} className="bg-gray-200 text-gray-600 font-bold py-3 px-6 rounded-xl text-sm whitespace-nowrap">Seç <ArrowRight size={16} className="inline ml-1"/></button></div>
                    ) : priceStatus === "loading" ? (
                        /* Fiyat hesaplanıyor — skeleton */
                        <div className="w-full flex items-center justify-between gap-4 animate-pulse">
                            <div className="flex gap-2">
                                {[1,2,3,4].map(i => <div key={i} className="h-10 w-16 bg-gray-100 rounded-lg" />)}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-24 bg-gray-100 rounded-lg hidden md:block" />
                                <div className="h-10 w-24 bg-amber-100 rounded-xl" />
                            </div>
                        </div>
                    ) : priceStatus === "found" ? (
                        /* Fiyat bulundu */
                        <>
                            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2 w-full sm:w-auto">
                                {(['TRY', 'USD', 'EUR', 'GBP'] as const).map((cur) => (
                                    <button key={cur} onClick={() => setCurrency(cur)} className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg border transition-all ${currency === cur ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-amber-400'}`}>
                                        <span className="text-[10px] font-medium opacity-80">{cur}</span><span className="text-xs font-bold whitespace-nowrap">{prices[cur]} {symbols[cur]}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                                <div className="text-right hidden md:block"><span className="block text-2xl font-bold text-slate-900 leading-none">{selectedPriceStr}</span><span className="text-[10px] text-gray-400">{priceSource === "distance" && priceDistanceKm ? `~${priceDistanceKm} km · Tahmini fiyat` : "Toplam Fiyat"}</span></div>
                                <button onClick={() => onSelect(vehicle.name, selectedPriceStr)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-sm whitespace-nowrap">Seç <ArrowRight size={16} className="inline ml-1"/></button>
                            </div>
                        </>
                    ) : (
                        /* Özel güzergah — fiyat hesaplanamadı */
                        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 w-full flex-1 text-xs font-bold">
                                <PhoneCall size={16} className="shrink-0" />
                                <span>Özel güzergah — Fiyat için: <a href="tel:+905441459199" className="underline">+90 544 145 91 99</a></span>
                            </div>
                            <button onClick={() => onSelect(vehicle.name, "Teklif")} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-sm whitespace-nowrap">Seç <ArrowRight size={16} className="inline ml-1"/></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}