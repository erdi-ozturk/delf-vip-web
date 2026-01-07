"use client"

import React, { useState, useRef, useEffect } from "react"
import { MapPin, Calendar, Clock, Users, ArrowRight, Building2, Plane, LucideIcon } from "lucide-react"

// --- TİP TANIMLAMALARI ---
interface LocationInputProps {
  icon: LucideIcon
  placeholder: string
  value: string
  onChange: (value: string) => void
}

// --- GOOGLE LOCATION INPUT ---
function LocationInput({ icon: Icon, placeholder, value, onChange }: LocationInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, []) 

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    onChange(text) 
    
    if (text.length > 2) { 
      setIsOpen(true)
      try {
        const res = await fetch(`/api/places?q=${text}`)
        const predictions = await res.json()
        setResults(Array.isArray(predictions) ? predictions : [])
      } catch (error) {
        setResults([])
      }
    } else {
      setIsOpen(false)
    }
  }

  const handleSelect = (description: string) => {
    onChange(description)
    setIsOpen(false)
  }

  const getGoogleIcon = (types: string[]) => {
    if (types?.includes("airport")) return <Plane size={14} className="text-blue-600"/>
    if (types?.includes("lodging") || types?.includes("hotel")) return <Building2 size={14} className="text-amber-500"/>
    return <MapPin size={14} className="text-gray-400"/>
  }

  return (
    <div className="relative group" ref={wrapperRef}>
      <Icon className="absolute left-4 top-3.5 text-amber-500 z-10" size={18} />
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={handleInput}
        autoComplete="off"
        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none text-gray-700 font-medium transition-all"
        required
      />
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50">
          {results.length > 0 ? (
            results.map((item: any) => (
              <button
                key={item.place_id}
                type="button"
                onClick={() => handleSelect(item.description)}
                className="w-full text-left px-4 py-3 hover:bg-amber-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
              >
                <div className="bg-gray-100 p-2 rounded-full min-w-[32px] flex items-center justify-center">
                  {getGoogleIcon(item.types)}
                </div>
                <span className="text-sm font-bold text-gray-800 truncate">
                    {item.structured_formatting?.main_text || item.description}
                </span>
              </button>
            ))
          ) : null}
        </div>
      )}
    </div>
  )
}

// --- ANA FORM ---
export default function BookingForm() {
  const [tripType, setTripType] = useState("tek-yon")
  
  // YENİ: Bugünün tarihini al (YYYY-MM-DD formatında)
  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    passengers: "1"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      date: formData.date,
      time: formData.time,
      passengers: formData.passengers,
      type: tripType
    }).toString()

    window.location.href = `/booking?${params}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md ml-auto border border-amber-100 relative z-20">
      
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button type="button" onClick={() => setTripType("tek-yon")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${tripType === "tek-yon" ? "bg-white text-slate-900 shadow-md" : "text-gray-500"}`}>Tek Yön</button>
        <button type="button" onClick={() => setTripType("gidis-donus")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${tripType === "gidis-donus" ? "bg-white text-slate-900 shadow-md" : "text-gray-500"}`}>Gidiş - Dönüş</button>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-1">Transferini Planla</h3>
      <p className="text-gray-500 text-xs mb-6">Lüks araçlarla konforlu yolculuk.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <LocationInput 
            icon={MapPin} 
            placeholder="Alınış Noktası"
            value={formData.from}
            onChange={(val) => setFormData(prev => ({ ...prev, from: val }))}
          />
          <LocationInput 
            icon={MapPin} 
            placeholder="Varış Noktası"
            value={formData.to}
            onChange={(val) => setFormData(prev => ({ ...prev, to: val }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-3.5 text-amber-500" size={16} />
            
            {/* GÜNCELLENDİ: min={today} eklendi */}
            <input 
                type="date" 
                name="date"
                min={today} // GEÇMİŞ TARİH SEÇİMİNİ ENGELLER
                required 
                aria-label="Tarih Seçiniz"
                className="w-full pl-10 pr-2 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none text-sm text-gray-700" 
                onChange={handleChange} 
            />
          </div>
          <div className="relative">
            <Clock className="absolute left-3 top-3.5 text-amber-500" size={16} />
            <input 
                type="time" 
                name="time"
                required 
                aria-label="Saat Seçiniz"
                className="w-full pl-10 pr-2 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none text-sm text-gray-700" 
                onChange={handleChange} 
            />
          </div>
        </div>

        <div className="relative">
           <Users className="absolute left-4 top-3.5 text-amber-500" size={18} />
           <select 
                name="passengers"
                aria-label="Yolcu Sayısı"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none text-gray-700 appearance-none" 
                onChange={handleChange}
                value={formData.passengers}
            >
             <option value="1">1-6 Yolcu (Vito)</option>
             <option value="7+">7-16 Yolcu (Sprinter)</option>
           </select>
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2">
          Rezervasyon Yap <ArrowRight size={20}/>
        </button>
      </form>
    </div>
  )
}