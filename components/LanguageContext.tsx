"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation"; 

// ✅ ÇÖZÜM: TypeScript'e Weglot'u tanıtıyoruz
declare global {
  interface Window {
    Weglot: any;
  }
}

type LanguageContextType = {
  language: string;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "tr", 
  changeLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState("tr");
  const pathname = usePathname(); 

  // Dil Değiştirme (Elle Seçilirse)
  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("delf_lang", lang);
      if (window.Weglot) {
        window.Weglot.switchTo(lang);
      }
    }
  };

  useEffect(() => {
    // SENKRONİZASYON FONKSİYONU
    const syncLanguage = () => {
      if (typeof window !== "undefined") {
        // 1. Önce Hafızaya Bak (En güvenilir kaynak)
        const savedLang = localStorage.getItem("delf_lang");

        if (savedLang) {
          // Hafızadaki dili uygula
          setLanguage(savedLang);
          
          // Weglot farklı telden çalıyorsa onu hizaya getir
          if (window.Weglot && window.Weglot.getCurrentLang() !== savedLang) {
            window.Weglot.switchTo(savedLang);
          }
        } else {
            // Hafıza boşsa Weglot ne bulduysa onu kullan
             if (window.Weglot && window.Weglot.getCurrentLang) {
                const wLang = window.Weglot.getCurrentLang();
                setLanguage(wLang);
                localStorage.setItem("delf_lang", wLang);
             }
        }
      }
    };

    // Weglot Yüklendiğinde
    if (typeof window !== "undefined") {
        if (window.Weglot) {
            syncLanguage();
        } else {
            window.addEventListener("load", syncLanguage);
        }
    }

    // URL DEĞİŞTİĞİNDE (Sayfalar arası gezinti)
    // Biraz agresif davranıp 1 saniye boyunca sürekli kontrol ediyoruz
    const interval = setInterval(syncLanguage, 200);
    setTimeout(() => clearInterval(interval), 2000);

    return () => clearInterval(interval);

  }, [pathname]); 

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};