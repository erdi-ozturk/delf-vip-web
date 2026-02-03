"use client";
import { useState } from "react";
import { useLanguage } from "./LanguageContext"; // Context'i çağır

const languages = [
  { code: "tr", name: "TR", flag: "https://flagcdn.com/w40/tr.png" },
  { code: "en", name: "EN", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "de", name: "DE", flag: "https://flagcdn.com/w40/de.png" },
  { code: "ru", name: "RU", flag: "https://flagcdn.com/w40/ru.png" },
  { code: "ar", name: "AR", flag: "https://flagcdn.com/w40/sa.png" },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Context'ten dili ve değiştirme fonksiyonunu al
  const { language, changeLanguage } = useLanguage();

  const handleSelect = (langCode: string) => {
    changeLanguage(langCode); // Global fonksiyonu çalıştır
    setIsOpen(false);
    
    // Garanti olsun diye sayfayı hafifçe yenile (Weglot DOM hatasını önler)
    // Eğer SPA hissiyatı bozulmasın dersen bu satırı silebilirsin ama kalması daha güvenli.
    setTimeout(() => {
        window.location.reload();
    }, 100);
  };

  const activeFlag = languages.find((l) => l.code === language)?.flag || languages[0].flag;
  const activeName = languages.find((l) => l.code === language)?.name || "TR";

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-slate-700 text-sm font-bold border border-transparent hover:border-gray-300"
      >
        <img 
            src={activeFlag} 
            alt={activeName} 
            className="w-5 h-auto object-cover rounded-sm shadow-sm"
        />
        <span>{activeName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl py-2 border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                language === lang.code ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"
              }`}
            >
              <img 
                src={lang.flag} 
                alt={lang.name} 
                className="w-6 h-auto object-cover rounded-sm shadow-sm"
              />
              <span className="text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
      
      {isOpen && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
}