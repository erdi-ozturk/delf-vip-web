"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tr } from 'date-fns/locale';
import { 
  MapPin, Calendar, Users, Search, 
  ArrowRightLeft, Clock, History, CheckCircle2, Plane, AlertCircle, ChevronDown 
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

  const startDatePickerRef = useRef<any>(null);
  const returnDatePickerRef = useRef<any>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  // 🔥 GOOGLE MAPS BAĞLANTISI (GÜNCELLENDİ: GARANTİLİ YÖNTEM)
  useEffect(() => {
    // Google Maps API'nin yüklenmesini bekle
    const waitForGoogle = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
            clearInterval(waitForGoogle);
            initAutocomplete();
        }
    }, 100); // 100ms'de bir kontrol et

    const initAutocomplete = () => {
      const options = { componentRestrictions: { country: "tr" } };

      if (fromInputRef.current) {
         // Önceki listenerları temizle (tekrar tekrar çalışmasın)
         const newNode = fromInputRef.current.cloneNode(true);
         if(fromInputRef.current.parentNode) fromInputRef.current.parentNode.replaceChild(newNode, fromInputRef.current);
         // @ts-ignore
         fromInputRef.current = newNode;

         // Yeni Autocomplete bağla
         const fromAutocomplete = new window.google.maps.places.Autocomplete(fromInputRef.current as HTMLInputElement, options);
         fromAutocomplete.addListener("place_changed", () => {
            const place = fromAutocomplete.getPlace();
            const shortName = place.name || place.formatted_address;
            const fullAddr = place.formatted_address || "";
            setFromLocation(shortName);
            setFromFullAddress(fullAddr); 
            setErrors(prev => ({...prev, from: false}));
            if(fromInputRef.current) fromInputRef.current.value = shortName;
         });
      }

      if (toInputRef.current) {
         // Önceki listenerları temizle
         const newNode = toInputRef.current.cloneNode(true);
         if(toInputRef.current.parentNode) toInputRef.current.parentNode.replaceChild(newNode, toInputRef.current);
         // @ts-ignore
         toInputRef.current = newNode;

         const toAutocomplete = new window.google.maps.places.Autocomplete(toInputRef.current as HTMLInputElement, options);
         toAutocomplete.addListener("place_changed", () => {
            const place = toAutocomplete.getPlace();
            const shortName = place.name || place.formatted_address;
            const fullAddr = place.formatted_address || "";
            setToLocation(shortName);
            setToFullAddress(fullAddr);
            setErrors(prev => ({...prev, to: false}));
            if(toInputRef.current) toInputRef.current.value = shortName;
         });
      }
    };

    // Temizlik
    return () => clearInterval(waitForGoogle);
  }, [activeTab]); 

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

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* Script kaldırıldı, Layout.tsx'e taşındı */}
      <div id="root-portal" className="relative z-[9999]"></div>

      <section className="relative min-h-[850px] lg:h-[950px] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/cars/istanbul-chauffer-vip.avif" alt="VIP Transfer" fill className="object-cover brightness-[0.4]" priority />
        </div>

        <div className="relative z-10 w-full px-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-6 leading-tight drop-shadow-lg">
            Ayrıcalıklı Yolculuk <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Tek Bir Dokunuşla.</span>
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
              <div className={`w-full lg:flex-1 shrink-0 border rounded-2xl transition-all group h-24 min-w-[200px] relative overflow-hidden ${errors.from ? 'border-red-500 bg-red-50 shadow-md' : 'border-gray-200 bg-white hover:border-amber-400 hover:shadow-lg'}`}>
                 <input 
                    ref={fromInputRef} 
                    type="text" 
                    placeholder="Havalimanı, Otel..." 
                    className="absolute inset-0 w-full h-full bg-transparent outline-none text-xs md:text-sm font-bold text-slate-900 placeholder:text-gray-300 pl-12 pt-4 pb-3 z-10 cursor-pointer"
                    onChange={(e) => {
                        setFromLocation(e.target.value);
                        setFromFullAddress("");
                        if(e.target.value) setErrors(prev => ({...prev, from: false}));
                    }} 
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
              </div>

              {activeTab === 'transfer' && (
                <div className="hidden lg:flex items-center justify-center -mx-3 z-10">
                   <button className="w-8 h-8 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-400 hover:rotate-180 transition-all">
                      <ArrowRightLeft size={14} />
                   </button>
                </div>
              )}

              {/* 2. NEREYE */}
              <div className={`w-full lg:flex-1 shrink-0 border rounded-2xl transition-all group h-24 min-w-[200px] relative overflow-hidden ${errors.to ? 'border-red-500 bg-red-50 shadow-md' : 'border-gray-200 bg-white hover:border-amber-400 hover:shadow-lg'}`}>
                 <input 
                    ref={toInputRef} 
                    type="text" 
                    placeholder="Varış Noktası..." 
                    className="absolute inset-0 w-full h-full bg-transparent outline-none text-xs md:text-sm font-bold text-slate-900 placeholder:text-gray-300 pl-12 pt-4 pb-3 z-10 cursor-pointer"
                    onChange={(e) => {
                        setToLocation(e.target.value);
                        setToFullAddress("");
                        if(e.target.value) setErrors(prev => ({...prev, to: false}));
                    }} 
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
    </main>
  );
}