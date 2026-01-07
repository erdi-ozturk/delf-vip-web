"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Globe, ChevronDown, Phone } from "lucide-react"
import { useCurrency } from "@/components/CurrencyContext"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const currencyRef = useRef<HTMLDivElement>(null)

  const { currency, setCurrency } = useCurrency()

  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
          
          <Link href="/" onClick={scrollToTop} className="flex items-center group z-50 relative">
            <Image 
              src="/logo2.png" 
              alt="DELF VIP Logo" 
              width={200}
              height={70}
              className="object-contain h-12 md:h-20 w-auto group-hover:scale-105 transition-transform duration-300"
              priority         
            />
          </Link>

          {/* --- MASAÜSTÜ MENÜ --- */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6 text-sm font-bold text-slate-700">
              <Link href="/" onClick={scrollToTop} className="hover:text-amber-600 transition-colors">Anasayfa</Link>
              <Link href="/tours" className="hover:text-amber-600 transition-colors">Gezi Transferleri</Link>
              <Link href="/services" className="hover:text-amber-600 transition-colors">Hizmetler</Link>
              <Link href="/about" className="hover:text-amber-600 transition-colors">Hakkımızda</Link>
              <Link href="/contact" className="hover:text-amber-600 transition-colors">İletişim</Link>
            </nav>

            <div className="flex items-center gap-3">
              
              {/* YENİ: Weglot Buraya Gelecek (Masaüstü İçin) */}
              {/* min-w ekledik ki kutu kapanmasın */}
              <div id="weglot_here" className="weglot-nav-item min-w-[60px] flex items-center justify-center"></div>

              {/* Para Birimi */}
              <div className="relative" ref={currencyRef}>
                <button 
                    onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                    className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-amber-600 bg-gray-100 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                >
                    <Globe size={16} /> {currency} <ChevronDown size={14} className={`transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`}/>
                </button>
                
                {isCurrencyOpen && (
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-1 z-[60] animate-in fade-in slide-in-from-top-2">
                        <button onClick={() => { setCurrency('EUR'); setIsCurrencyOpen(false); }} className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-amber-50 rounded-lg flex items-center justify-between ${currency === 'EUR' ? 'text-amber-600 bg-amber-50' : 'text-slate-600'}`}>
                            <span>€ EUR</span>
                        </button>
                        <button onClick={() => { setCurrency('USD'); setIsCurrencyOpen(false); }} className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-amber-50 rounded-lg flex items-center justify-between ${currency === 'USD' ? 'text-amber-600 bg-amber-50' : 'text-slate-600'}`}>
                            <span>$ USD</span>
                        </button>
                        <button onClick={() => { setCurrency('TRY'); setIsCurrencyOpen(false); }} className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-amber-50 rounded-lg flex items-center justify-between ${currency === 'TRY' ? 'text-amber-600 bg-amber-50' : 'text-slate-600'}`}>
                            <span>₺ TRY</span>
                        </button>
                    </div>
                )}
              </div>

              <Link 
                href="/booking" 
                className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-slate-800 hover:shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                Rezervasyon
              </Link>
            </div>
          </div>

          <button 
            className="md:hidden text-slate-900 p-2 z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menüyü Aç" 
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>

        {/* --- MOBİL MENÜ --- */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-[100] flex flex-col h-screen w-screen md:hidden overflow-y-auto">
            <div className="flex items-center justify-between px-4 h-20 border-b border-gray-100 shrink-0">
                 <Link href="/" onClick={scrollToTop}>
                    <Image src="/logo2.png" alt="DELF VIP" width={150} height={50} className="object-contain h-10 w-auto"/>
                 </Link>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-900 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" aria-label="Menüyü Kapat">
                    <X size={28} />
                 </button>
            </div>

            <div className="flex flex-col p-6 gap-6 items-center justify-center flex-1">
                <nav className="flex flex-col gap-6 text-xl font-bold text-slate-900 text-center w-full">
                <Link href="/" onClick={scrollToTop} className="py-2 border-b border-gray-50 hover:text-amber-600">Anasayfa</Link>
                <Link href="/tours" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-50 hover:text-amber-600">Gezi Transferleri</Link>
                <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-50 hover:text-amber-600">Hizmetler</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-50 hover:text-amber-600">Hakkımızda</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-amber-600">İletişim</Link>
                </nav>

                {/* YENİ: Weglot Buraya Gelecek (Mobil İçin) */}
                <div id="weglot_mobile_here" className="min-h-[40px] flex justify-center items-center"></div>

                <div className="flex gap-2 justify-center w-full border-t border-gray-100 pt-6">
                    <button onClick={() => setCurrency('EUR')} className={`px-4 py-2 rounded-lg font-bold border transition-colors ${currency === 'EUR' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900 border-gray-200'}`}>€ EUR</button>
                    <button onClick={() => setCurrency('USD')} className={`px-4 py-2 rounded-lg font-bold border transition-colors ${currency === 'USD' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900 border-gray-200'}`}>$ USD</button>
                    <button onClick={() => setCurrency('TRY')} className={`px-4 py-2 rounded-lg font-bold border transition-colors ${currency === 'TRY' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900 border-gray-200'}`}>₺ TRY</button>
                </div>

                <div className="flex flex-col gap-4 w-full mt-4">
                  <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)} className="bg-slate-900 text-white py-4 rounded-xl font-bold text-center shadow-lg">Rezervasyon Yap</Link>
                  <Link href="https://wa.me/905441459199" target="_blank" onClick={() => setIsMobileMenuOpen(false)} className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-4 rounded-xl font-bold text-center shadow-lg">WhatsApp Destek</Link>
                </div>
            </div>
          </div>
        )}
      </header>

      {/* WhatsApp Butonu (Artık altında bir şey kalmadı) */}
      <Link
        href="https://wa.me/905441459199"
        target="_blank"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl shadow-green-500/40 transition-all hover:-translate-y-1 hover:scale-110 flex items-center justify-center animate-bounce-slow"
        aria-label="WhatsApp"
      >
        <Phone size={28} fill="currentColor" className="text-white" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      </Link>
    </>
  )
}