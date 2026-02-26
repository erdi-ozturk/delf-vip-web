"use client"

import { useEffect } from 'react'
import Script from "next/script"

export default function WeglotScript() {
  
  useEffect(() => {
    // Weglot kütüphanesinin yüklenmesini bekle
    const checkWeglot = setInterval(() => {
        // @ts-ignore
        if (window.Weglot) {
            clearInterval(checkWeglot); // Yüklendiği an kontrolü durdur
            
            try {
                // @ts-ignore
                window.Weglot.initialize({
                    api_key: process.env.NEXT_PUBLIC_WEGLOT_API_KEY || '',
                    original_language: 'tr',
                    destination_languages: 'en,ar',
                    hide_switcher: false,
                    switchers: [
                        {
                            target: "#weglot_here",
                            style: {
                                full_name: false,
                                with_name: true,
                                is_dropdown: true,
                                with_flags: true
                            }
                        }
                    ]
                });
            } catch (e) {
                console.error("Weglot başlatılamadı:", e);
            }
        }
    }, 100); // 100 milisaniyede bir kontrol et

    // Temizlik
    return () => clearInterval(checkWeglot);
  }, [])

  return (
    <Script
      src="https://cdn.weglot.com/weglot.min.js"
      strategy="afterInteractive"
    />
  )
}