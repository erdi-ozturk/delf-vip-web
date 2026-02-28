"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tr } from 'date-fns/locale';
import {
  MapPin, Calendar, Users, Search,
  ArrowRightLeft, Clock, History, CheckCircle2, Plane, AlertCircle, ChevronDown,
  Shield, Zap, Car, PhoneCall, Award, BadgeCheck, ArrowRight, Route
} from "lucide-react";

declare global {
  interface Window {
    google: any;
  }
}

// --- ORTAK TARİH BUTONU ---
// @ts-ignore
const DateInputButton = forwardRef(({ value, onClick, label, icon: Icon, isPlaceholder, hasError }, ref: any) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="flex flex-col justify-center h-full w-full pl-12 pr-2 text-left outline-none group bg-transparent relative"
  >
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${hasError ? 'text-red-500' : 'text-slate-900'}`}>
          <Icon size={18} className={isPlaceholder && !hasError ? "text-gray-400" : (hasError ? "text-red-500" : "text-slate-900")} />
      </div>
      <span className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 block ${hasError ? 'text-red-400' : 'text-gray-400'}`}>{label}</span>
      <div className={`text-xs md:text-sm font-bold truncate leading-tight h-5 flex items-center ${isPlaceholder ? 'text-gray-300' : 'text-slate-900'}`}>
          {value || "Tarih Seç"}
      </div>
  </button>
));
DateInputButton.displayName = "DateInputButton";


export default function Home() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("transfer"); 
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  
  // -- VERİLER --
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [fromFullAddress, setFromFullAddress] = useState("");
  const [toFullAddress, setToFullAddress] = useState("");

  const [passengers, setPassengers] = useState("1");
  const [duration, setDuration] = useState("4 Saat");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const [isStartTimeMode, setIsStartTimeMode] = useState(false);
  const [isReturnTimeMode, setIsReturnTimeMode] = useState(false);
  
  // 🔥 VALIDATION STATE
  const [errors, setErrors] = useState({
      from: false,
      to: false,
      date: false,
      returnDate: false
  });

  // Autocomplete suggestions
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [showFromSug, setShowFromSug] = useState(false);
  const [showToSug, setShowToSug] = useState(false);

  const startDatePickerRef = useRef<any>(null);
  const returnDatePickerRef = useRef<any>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);

  // 🔥 GOOGLE MAPS — PlaceAutocompleteElement kullanılmayan yeni API
  useEffect(() => {
    if (autocompleteServiceRef.current) return;
    const waitForGoogle = setInterval(() => {
      if (window.google?.maps?.places?.AutocompleteService) {
        clearInterval(waitForGoogle);
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        const div = document.createElement("div");
        placesServiceRef.current = new window.google.maps.places.PlacesService(div);
      }
    }, 100);
    return () => clearInterval(waitForGoogle);
  }, []);

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
    inputRef: React.RefObject<HTMLInputElement | null>,
    setShow: (b: boolean) => void,
    setSugs: (s: any[]) => void,
    clearErr: () => void
  ) => {
    const name = prediction.structured_formatting?.main_text || prediction.description;
    setLoc(name);
    setFull("");
    setShow(false); setSugs([]);
    if (inputRef.current) inputRef.current.value = name;
    clearErr();
    placesServiceRef.current?.getDetails(
      { placeId: prediction.place_id, fields: ["formatted_address", "name"] },
      (place: any, status: string) => {
        if (status === "OK") {
          // Zone matching için yer adını (ör. "Istanbul Airport (IST)") da ekle
          const placeName = place?.name || "";
          const placeAddr = place?.formatted_address || "";
          setFull(placeName && placeAddr ? `${placeName} ${placeAddr}` : placeName || placeAddr);
        }
      }
    );
  };

  // --- MANTIK ---
  const handleStartSelect = (date: Date | null) => {
    if (!date) return;
    setErrors(prev => ({...prev, date: false}));
    if (!isStartTimeMode) {
        setStartDate(date);
        setIsStartTimeMode(true); 
    } else {
        setStartDate(date);
        setIsStartTimeMode(false);
        startDatePickerRef.current?.setOpen(false);
    }
  };

  const handleReturnSelect = (date: Date | null) => {
    if (!date) return;
    setErrors(prev => ({...prev, returnDate: false}));
    if (!isReturnTimeMode) {
        setReturnDate(date);
        setIsReturnTimeMode(true);
    } else {
        setReturnDate(date);
        setIsReturnTimeMode(false);
        returnDatePickerRef.current?.setOpen(false);
    }
  };

  const handleSearch = () => {
    const currentFrom = fromLocation || fromInputRef.current?.value || "";
    const currentTo = toLocation || toInputRef.current?.value || "";

    const newErrors = {
        from: !currentFrom,
        to: !currentTo,
        date: !startDate,
        returnDate: isRoundTrip && !returnDate
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
        return;
    }

    const params = new URLSearchParams();
    params.set("type", activeTab);
    const finalPickupAddr = fromFullAddress || currentFrom;
    params.set("pickup", finalPickupAddr);
    params.set("pickupName", currentFrom);
    
    const finalDropoffAddr = toFullAddress || currentTo;
    params.set("dropoff", finalDropoffAddr);
    params.set("dropoffName", currentTo);

    if (activeTab === "transfer") {
      params.set("roundTrip", isRoundTrip ? "true" : "false");
      if (isRoundTrip && returnDate) params.set("returnDate", returnDate.toISOString());
    } else {
      params.set("duration", duration);
    }
    if (startDate) params.set("date", startDate.toISOString());
    params.set("passengers", passengers);
    router.push(`/booking?${params.toString()}`);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.delfvip.com/#business",
        "name": "DELF VIP Transfer",
        "url": "https://www.delfvip.com",
        "telephone": "+905441459199",
        "email": "info@delfvip.com",
        "description": "İstanbul Havalimanı ve Sabiha Gökçen Havalimanı için 7/24 lüks VIP transfer hizmeti. Mercedes Vito araçlarla konforlu, güvenli ve sabit fiyatlı yolculuk.",
        "image": "https://www.delfvip.com/og-image.jpg",
        "priceRange": "$$",
        "currenciesAccepted": "TRY, USD, EUR, GBP",
        "paymentAccepted": "Cash, Credit Card",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "İstanbul Havalimanı Yolu Üzeri",
          "addressLocality": "Arnavutköy",
          "addressRegion": "İstanbul",
          "postalCode": "34275",
          "addressCountry": "TR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 41.2063,
          "longitude": 28.7260
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        },
        "availableLanguage": ["Turkish", "English", "Arabic"],
        "sameAs": [
          "https://www.facebook.com",
          "https://www.instagram.com"
        ]
      },
      {
        "@type": "Service",
        "@id": "https://www.delfvip.com/#service",
        "name": "VIP Havalimanı Transfer",
        "provider": { "@id": "https://www.delfvip.com/#business" },
        "serviceType": "Airport Transfer",
        "areaServed": [
          { "@type": "City", "name": "İstanbul", "sameAs": "https://www.wikidata.org/wiki/Q406" },
          { "@type": "Country", "name": "Turkey", "sameAs": "https://www.wikidata.org/wiki/Q43" }
        ],
        "description": "İstanbul Havalimanı (IST) ve Sabiha Gökçen (SAW) transferleri için Mercedes Vito araçlarla lüks VIP ulaşım hizmeti.",
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Script kaldırıldı, Layout.tsx'e taşındı */}
      <div id="root-portal" className="relative z-[9999]"></div>

      <section className="relative min-h-[850px] lg:h-[950px] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/cars/istanbul-chauffer-vip.avif" alt="İstanbul VIP Transfer - DELF VIP Şoförlü Mercedes Vito" fill className="object-cover brightness-[0.4]" priority />
        </div>

        <div className="relative z-10 w-full px-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-6 leading-tight drop-shadow-lg">
            İstanbul VIP Transfer & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Şoförlü Araç Kiralama</span>
          </h1>

          <div className="w-full max-w-[1350px] bg-white rounded-3xl shadow-2xl relative animate-in fade-in slide-in-from-bottom-10 duration-700 overflow-visible">
            {/* TABS */}
            <div className="flex border-b border-gray-100 px-6 pt-6 gap-8 overflow-x-auto">
              {['transfer', 'hourly'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm md:text-base font-bold flex items-center gap-2 transition-all relative whitespace-nowrap capitalize ${activeTab === tab ? 'text-slate-900 border-b-4 border-amber-500' : 'text-gray-400 hover:text-gray-600'}`}>
                    {tab === 'transfer' ? <Plane size={18} /> : <History size={18} />}
                    {tab === 'transfer' ? 'Transfer' : 'Saatlik Kirala'}
                  </button>
              ))}
            </div>

            {/* --- FORM KUTULARI --- */}
            <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-5 items-center lg:items-stretch">
              
              {/* 1. NEREDEN */}
              <div className={`w-full lg:flex-1 shrink-0 border rounded-2xl transition-all group h-24 min-w-[200px] relative ${errors.from ? 'border-red-500 bg-red-50 shadow-md' : 'border-gray-200 bg-white hover:border-amber-400 hover:shadow-lg'}`}>
                 <input
                    ref={fromInputRef}
                    type="text"
                    placeholder="Havalimanı, Otel..."
                    className="absolute inset-0 w-full h-full bg-transparent outline-none text-xs md:text-sm font-bold text-slate-900 placeholder:text-gray-400 pl-12 pt-4 pb-3 z-10 cursor-text rounded-2xl"
                    onChange={(e) => {
                        setFromLocation(e.target.value);
                        setFromFullAddress("");
                        if(e.target.value) setErrors(prev => ({...prev, from: false}));
                        getPredictions(e.target.value, setFromSuggestions, setShowFromSug);
                    }}
                    onBlur={() => setTimeout(() => setShowFromSug(false), 150)}
                 />
                 <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-0 ${errors.from ? 'text-red-500' : 'text-green-600'}`}>
                    {errors.from ? <AlertCircle size={20}/> : <MapPin size={20} />}
                 </div>
                 <label className={`absolute top-3 left-12 text-[9px] font-bold uppercase tracking-wider pointer-events-none z-0 ${errors.from ? 'text-red-400' : 'text-gray-400'}`}>
                    NEREDEN
                 </label>
                 <div className="absolute bottom-3 left-12 right-4 text-[10px] text-gray-400 truncate pointer-events-none z-0">
                    {fromFullAddress || (errors.from ? <span className="text-red-400 font-bold">Lütfen konum seçiniz</span> : "Şehir, İlçe veya Mahalle Seçiniz")}
                 </div>
                 {showFromSug && fromSuggestions.length > 0 && (
                   <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden">
                     {fromSuggestions.map((pred) => (
                       <li key={pred.place_id}
                         onMouseDown={(e) => { e.preventDefault(); selectPlace(pred, setFromLocation, setFromFullAddress, fromInputRef, setShowFromSug, setFromSuggestions, () => setErrors(prev => ({...prev, from: false}))); }}
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

              {activeTab === 'transfer' && (
                <div className="flex items-center justify-center lg:-mx-3 z-10 w-full lg:w-auto">
                   <button
                     type="button"
                     aria-label="Nereden ve nereye alanlarını değiştir"
                     onClick={() => {
                       const tempLocation = fromLocation;
                       const tempFullAddress = fromFullAddress;
                       setFromLocation(toLocation);
                       setFromFullAddress(toFullAddress);
                       setToLocation(tempLocation);
                       setToFullAddress(tempFullAddress);
                       if (fromInputRef.current) fromInputRef.current.value = toLocation;
                       if (toInputRef.current) toInputRef.current.value = tempLocation;
                     }}
                     className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-amber-500 hover:border-amber-400 transition-all rounded-full px-4 py-2 lg:w-8 lg:h-8 lg:p-0 lg:justify-center text-xs font-semibold lg:hover:rotate-180"
                   >
                      <ArrowRightLeft size={14} />
                      <span className="lg:hidden">Güzergahı Değiştir</span>
                   </button>
                </div>
              )}

              {/* 2. NEREYE */}
              <div className={`w-full lg:flex-1 shrink-0 border rounded-2xl transition-all group h-24 min-w-[200px] relative ${errors.to ? 'border-red-500 bg-red-50 shadow-md' : 'border-gray-200 bg-white hover:border-amber-400 hover:shadow-lg'}`}>
                 <input
                    ref={toInputRef}
                    type="text"
                    placeholder="Varış Noktası..."
                    className="absolute inset-0 w-full h-full bg-transparent outline-none text-xs md:text-sm font-bold text-slate-900 placeholder:text-gray-400 pl-12 pt-4 pb-3 z-10 cursor-text rounded-2xl"
                    onChange={(e) => {
                        setToLocation(e.target.value);
                        setToFullAddress("");
                        if(e.target.value) setErrors(prev => ({...prev, to: false}));
                        getPredictions(e.target.value, setToSuggestions, setShowToSug);
                    }}
                    onBlur={() => setTimeout(() => setShowToSug(false), 150)}
                 />
                 <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-0 ${errors.to ? 'text-red-500' : 'text-blue-600'}`}>
                    {errors.to ? <AlertCircle size={20}/> : <MapPin size={20} />}
                 </div>
                 <label className={`absolute top-3 left-12 text-[9px] font-bold uppercase tracking-wider pointer-events-none z-0 ${errors.to ? 'text-red-400' : 'text-gray-400'}`}>
                    NEREYE
                 </label>
                 <div className="absolute bottom-3 left-12 right-4 text-[10px] text-gray-400 truncate pointer-events-none z-0">
                    {toFullAddress || (errors.to ? <span className="text-red-400 font-bold">Lütfen varış noktası seçiniz</span> : "Varış Noktası Seçiniz")}
                 </div>
                 {showToSug && toSuggestions.length > 0 && (
                   <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden">
                     {toSuggestions.map((pred) => (
                       <li key={pred.place_id}
                         onMouseDown={(e) => { e.preventDefault(); selectPlace(pred, setToLocation, setToFullAddress, toInputRef, setShowToSug, setToSuggestions, () => setErrors(prev => ({...prev, to: false}))); }}
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

              {/* 3. TARİH ALANI */}
              {(!isRoundTrip || activeTab !== 'transfer') ? (
                  // TEK TARİH
                  <div className={`w-full lg:flex-[0.7] shrink-0 border rounded-2xl transition-all h-24 relative min-w-[150px]
                      ${errors.date 
                          ? 'border-red-500 bg-red-50 shadow-md z-20' 
                          : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-amber-400 hover:shadow-lg z-10'
                      }`}
                  >
                     <DatePicker
                        ref={startDatePickerRef}
                        selected={startDate}
                        onChange={handleStartSelect}
                        showTimeSelect={isStartTimeMode} 
                        showTimeSelectOnly={isStartTimeMode} 
                        timeIntervals={30}
                        timeCaption="SAAT"
                        dateFormat="d MMMM, HH:mm"
                        locale={tr}
                        minDate={new Date()}
                        shouldCloseOnSelect={false}
                        popperContainer={({ children }) => (<div style={{ zIndex: 99999 }}>{children}</div>)}
                        popperPlacement="bottom-start"
                        // @ts-ignore
                        customInput={<DateInputButton label="TARİH & SAAT" icon={errors.date ? AlertCircle : Calendar} isPlaceholder={!startDate} hasError={errors.date} />}
                        onInputClick={() => setIsStartTimeMode(false)}
                        onClickOutside={() => setIsStartTimeMode(false)}
                        wrapperClassName="w-full h-full"
                     />
                  </div>
              ) : (
                  // ÇİFT TARİH
                  <div className="w-full lg:flex-[1.4] shrink-0 h-24 flex items-stretch relative min-w-[280px]">
                      
                      {/* SOL KUTU */}
                      <div className={`flex-1 relative transition-all duration-200 border rounded-l-2xl rounded-r-none
                          ${errors.date 
                              ? 'border-red-500 bg-red-50 z-30' 
                              : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-amber-400 hover:z-20 z-10'
                          }`}
                      >
                          <DatePicker
                            ref={startDatePickerRef}
                            selected={startDate}
                            onChange={handleStartSelect}
                            showTimeSelect={isStartTimeMode}
                            showTimeSelectOnly={isStartTimeMode}
                            timeIntervals={30}
                            timeCaption="SAAT"
                            dateFormat="d MMM, HH:mm"
                            locale={tr}
                            minDate={new Date()}
                            shouldCloseOnSelect={false}
                            popperContainer={({ children }) => (<div style={{ zIndex: 99999 }}>{children}</div>)}
                            popperPlacement="bottom-start"
                            // @ts-ignore
                            customInput={<DateInputButton label="GİDİŞ" icon={errors.date ? AlertCircle : Calendar} isPlaceholder={!startDate} hasError={errors.date} />}
                            onInputClick={() => setIsStartTimeMode(false)}
                            wrapperClassName="w-full h-full"
                          />
                      </div>

                      {/* SAĞ KUTU */}
                      <div className={`flex-1 relative transition-all duration-200 border -ml-[1px] rounded-r-2xl rounded-l-none
                          ${errors.returnDate 
                              ? 'border-red-500 bg-red-50 z-30' 
                              : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-amber-400 hover:z-20 z-10'
                          }`}
                      >
                          <DatePicker
                            ref={returnDatePickerRef}
                            selected={returnDate}
                            onChange={handleReturnSelect}
                            showTimeSelect={isReturnTimeMode}
                            showTimeSelectOnly={isReturnTimeMode}
                            timeIntervals={30}
                            timeCaption="SAAT"
                            dateFormat="d MMM, HH:mm"
                            locale={tr}
                            minDate={startDate || new Date()}
                            shouldCloseOnSelect={false}
                            popperContainer={({ children }) => (<div style={{ zIndex: 99999 }}>{children}</div>)}
                            popperPlacement="bottom-end"
                            // @ts-ignore
                            customInput={<DateInputButton label="DÖNÜŞ" icon={errors.returnDate ? AlertCircle : History} isPlaceholder={!returnDate} hasError={errors.returnDate} />}
                            onInputClick={() => setIsReturnTimeMode(false)}
                            wrapperClassName="w-full h-full"
                          />
                      </div>
                  </div>
              )}

              {/* 4. YOLCU & (GİDİŞ-DÖNÜŞ / SÜRE) */}
              <div className="flex gap-2 w-full lg:w-auto h-24 shrink-0">
                 
                 {/* SOL KUTUCUK */}
                 <div className="border border-gray-200 rounded-2xl px-2 flex flex-col justify-center items-center gap-1 hover:border-amber-400 transition-colors bg-white min-w-[80px] relative group">
                    {activeTab === 'transfer' ? (
                        <>
                            <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider text-center">GİDİŞ-DÖNÜŞ</label>
                            <button
                                onClick={() => setIsRoundTrip(!isRoundTrip)}
                                aria-label={isRoundTrip ? "Gidiş-dönüşü kapat" : "Gidiş-dönüşü aç"}
                                className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors duration-300 ${isRoundTrip ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isRoundTrip ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </button>
                        </>
                    ) : (
                        // SAATLİK MOD: SÜRE SEÇİMİ (Invisible Select)
                        <>
                            <select 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                onChange={(e) => setDuration(e.target.value)}
                                value={duration}
                            >
                                <option value="4 Saat">4 Saat</option>
                                <option value="8 Saat">8 Saat</option>
                                <option value="10 Saat">10 Saat</option>
                                <option value="12 Saat">12 Saat</option>
                            </select>
                            
                            {/* Görünen Kısım */}
                            <div className="flex flex-col justify-center items-center pointer-events-none w-full">
                                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider text-center flex items-center gap-1 mb-0.5">
                                    <Clock size={10}/> SÜRE
                                </label>
                                <span className="text-xs md:text-sm font-bold text-slate-900">{duration}</span>
                            </div>
                            
                            {/* Ok İkonu */}
                            <div className="absolute right-1 bottom-3 text-gray-300 pointer-events-none">
                                <ChevronDown size={10} />
                            </div>
                        </>
                    )}
                 </div>

                 {/* SAĞ KUTUCUK (KİŞİ SAYISI - Invisible Select) */}
                  <div className="border border-gray-200 rounded-2xl px-3 flex flex-col justify-center gap-1 hover:border-amber-400 transition-colors bg-white flex-1 lg:min-w-[100px] relative group">
                      
                      {/* Görünmez Select */}
                      <select 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                          onChange={(e) => setPassengers(e.target.value)}
                          value={passengers}
                      >
                           <option value="1">1 Kişi</option>
                           <option value="2">2 Kişi</option>
                           <option value="3">3-6 Kişi</option>
                           <option value="7">7+ Kişi</option>
                      </select>

                      {/* Görünen Kısım */}
                      <div className="flex flex-col justify-center w-full pointer-events-none">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">KİŞİ</label>
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-slate-900"/>
                            <span className="text-xs md:text-sm font-bold text-slate-900">{passengers} Kişi</span>
                          </div>
                      </div>

                      {/* Ok İkonu */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-amber-500 transition-colors z-0">
                          <ChevronDown size={14} />
                      </div>
                  </div>
              </div>

              {/* 5. BUTON */}
              <button onClick={handleSearch} className="w-full lg:w-24 h-24 shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex flex-col items-center justify-center gap-1 hover:-translate-y-1">
                  <Search size={28} />
                  <span className="text-[10px] font-bold lg:hidden">ARA</span>
              </button>
            </div>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-gray-300 font-medium">
             <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"><CheckCircle2 size={16} className="text-amber-400" /> Şoförlü Araç Tahsis</div>
             <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"><CheckCircle2 size={16} className="text-amber-400" /> Havalimanı Karşılama</div>
             <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"><CheckCircle2 size={16} className="text-amber-400" /> Güvenli Ödeme</div>
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "5.000+", label: "Mutlu Yolcu" },
            { value: "7/24",   label: "Kesintisiz Hizmet" },
            { value: "%100",   label: "Zamanında Karşılama" },
            { value: "3",      label: "Premium Araç Tipi" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-black text-slate-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-2 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== NASIL ÇALIŞIR? ===================== */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-50 px-4 py-1.5 rounded-full">3 Kolay Adım</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4">Nasıl Çalışır?</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Rezervasyonunuzdan karşılamaya kadar tüm süreç sizin için yönetilir.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Bağlantı çizgisi (masaüstü) */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-amber-200 z-0" />
            {[
              {
                step: "01",
                icon: <Search size={24} />,
                title: "Formu Doldurun",
                desc: "Nereden, nereye, tarih ve yolcu bilgilerini girerek fiyatınızı anında öğrenin.",
              },
              {
                step: "02",
                icon: <CheckCircle2 size={24} />,
                title: "Onayı Alın",
                desc: "Rezervasyonunuz alındıktan sonra WhatsApp üzerinden şoför bilgileri ve onay mesajı gönderilir.",
              },
              {
                step: "03",
                icon: <Car size={24} />,
                title: "Karşılanın",
                desc: "Şoförünüz isminizin yazılı olduğu tabelayla sizi çıkış kapısında bekler.",
              },
            ].map((item, i) => (
              <div key={i} className="relative z-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="text-xs font-black text-amber-400 tracking-widest">{item.step}</div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== NEDEN BİZ? ===================== */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-50 px-4 py-1.5 rounded-full">Fark Yaratan Detaylar</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4">Neden DELF VIP?</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Standart transfer değil, ayrıcalıklı bir deneyim sunuyoruz.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <BadgeCheck size={22} />, title: "Sabit Fiyat Garantisi",    desc: "Gizli ücret yok. Rezervasyon anında fiyatınız sabittir, trafik veya rota değişmez." },
              { icon: <Plane size={22} />,      title: "Uçuş Takibi",             desc: "Uçuş kodunuzu takip ediyoruz. Rötar durumunda şoförünüz sizi yine bekler." },
              { icon: <Shield size={22} />,     title: "Lisanslı Profesyoneller",  desc: "Tüm şoförlerimiz eğitimli, lisanslı ve güvenlik kontrollüdür." },
              { icon: <PhoneCall size={22} />,  title: "7/24 Destek",             desc: "Gece yarısı da olsa ulaşabileceğiniz bir ekip her zaman hazır." },
              { icon: <Users size={22} />,      title: "Ücretsiz Bebek Koltuğu",  desc: "Rezervasyonda belirtmeniz yeterli, bebek koltuğu ücretsiz eklenir." },
              { icon: <Zap size={22} />,        title: "Ücretsiz Bekleme",        desc: "Havalimanı karşılamalarında 1 saate kadar bekleme ücretsizdir." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ARAÇ FİLOSU ===================== */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-4 py-1.5 rounded-full">Premium Araçlar</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-4">Araç Filomuz</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">Her ihtiyaca uygun, özenle bakımlı premium araçlarla konforlu yolculuk.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: "/vehicles/vito.png",
                name: "Mercedes Vito",
                badge: "En Çok Tercih",
                capacity: "6 Yolcu",
                luggage: "6 Bavul",
                features: ["Klima", "USB Şarj", "Su İkramı"],
              },
              {
                img: "/vehicles/sprinter.png",
                name: "Mercedes Sprinter",
                badge: "Grup Transferi",
                capacity: "8 Yolcu",
                luggage: "8 Bavul",
                features: ["Klima", "USB Şarj", "Geniş İç Alan"],
              },
              {
                img: "/vehicles/sclass.png",
                name: "Mercedes S-Class",
                badge: "Ultra Lüks",
                capacity: "3 Yolcu",
                luggage: "3 Bavul",
                features: ["Deri Koltuk", "Masaj", "Minibar"],
              },
            ].map((v) => (
              <div key={v.name} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-all group">
                <div className="relative h-52 bg-slate-800">
                  <Image src={v.img} alt={v.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{v.badge}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-lg">{v.name}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Users size={13} /> {v.capacity}</span>
                    <span className="flex items-center gap-1"><Car size={13} /> {v.luggage}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {v.features.map(f => (
                      <span key={f} className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">{f}</span>
                    ))}
                  </div>
                  <a
                    href={`/booking?vehicle=${encodeURIComponent(v.name)}`}
                    className="mt-5 w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                  >
                    Fiyat Al <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== POPÜLER ROTALAR ===================== */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-50 px-4 py-1.5 rounded-full">Sık Tercih Edilenler</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4">Popüler Rotalar</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">İstanbul'un en çok talep gören transfer güzergahları.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { from: "İstanbul Havalimanı", to: "Taksim",         fromCode: "IST", icon: <Plane size={14}/> },
              { from: "İstanbul Havalimanı", to: "Sultanahmet",    fromCode: "IST", icon: <Plane size={14}/> },
              { from: "İstanbul Havalimanı", to: "Kadıköy",        fromCode: "IST", icon: <Plane size={14}/> },
              { from: "İstanbul Havalimanı", to: "Beşiktaş",       fromCode: "IST", icon: <Plane size={14}/> },
              { from: "Sabiha Gökçen",       to: "Taksim",         fromCode: "SAW", icon: <Plane size={14}/> },
              { from: "Sabiha Gökçen",       to: "Sultanahmet",    fromCode: "SAW", icon: <Plane size={14}/> },
            ].map((route) => (
              <a
                key={`${route.from}-${route.to}`}
                href={`/booking?pickup=${encodeURIComponent(route.from)}&pickupName=${encodeURIComponent(route.from)}&dropoff=${encodeURIComponent(route.to)}&dropoffName=${encodeURIComponent(route.to)}&type=transfer`}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-5 hover:border-amber-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    {route.icon}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">{route.fromCode}</div>
                    <div className="font-bold text-slate-900 text-sm leading-tight">{route.from}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Route size={16} className="text-amber-400 shrink-0" />
                  <div className="text-right">
                    <div className="font-bold text-slate-900 text-sm">{route.to}</div>
                    <div className="text-xs text-amber-500 font-medium group-hover:underline">Fiyat Al →</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 relative overflow-hidden">
        {/* Dekoratif arka plan */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_#f59e0b,_transparent_60%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <Award size={48} className="text-amber-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
            Ayrıcalıklı Transferinizi<br />
            <span className="text-amber-400">Hemen Planlayın</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            İstanbul Havalimanı ve Sabiha Gökçen'den 7/24 lüks transfer.<br />
            Anında fiyat, anında onay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/booking"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-xl shadow-amber-500/25 transition-all hover:-translate-y-1"
            >
              <Search size={20} /> Hemen Rezervasyon Yap
            </a>
            <a
              href="https://wa.me/905441459199"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all"
            >
              <PhoneCall size={20} /> WhatsApp&apos;tan Ulaşın
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}