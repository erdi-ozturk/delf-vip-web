"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mobil menü açılınca arkaplan kaydırmayı durdur
  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

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
              {/* Dil Seçici */}
              <LanguageSwitcher />
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

                {/* Mobil Dil Seçici */}
                <div className="flex justify-center items-center py-2">
                  <LanguageSwitcher />
                </div>

                <div className="flex flex-col gap-4 w-full mt-4">
                  <Link href="https://wa.me/905441459199" target="_blank" onClick={() => setIsMobileMenuOpen(false)} className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-4 rounded-xl font-bold text-center shadow-lg">WhatsApp Destek</Link>
                </div>
            </div>
          </div>
        )}
      </header>

    </>
  )
}