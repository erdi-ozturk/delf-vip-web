"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Currency = 'EUR' | 'USD' | 'TRY'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (c: Currency) => void
  convertPrice: (basePrice: number) => { price: number, symbol: string }
  exchangeRates: { EUR: number, USD: number, TRY: number }
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // DEĞİŞİKLİK BURADA: Varsayılan durumu 'USD' yaptık.
  const [currency, setCurrency] = useState<Currency>('USD')
  
  // Yedek Kurlar (Dolar Bazlı)
  const [rates, setRates] = useState({
    USD: 1,    
    EUR: 0.92, 
    TRY: 43.50 
  })

  // Güncel Kurları API'den Çekme (DOLAR BAZLI)
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,TRY')
        
        if (!res.ok) throw new Error("Kur verisi alınamadı")

        const data = await res.json()
        
        setRates({
          USD: 1,
          EUR: data.rates.EUR,
          TRY: data.rates.TRY
        })
        
        console.log("Güncel Dolar kurları çekildi:", data.rates)

      } catch (error) {
        console.error("Döviz hatası, yedek kurlar devrede.", error)
      }
    }

    fetchRates()
  }, [])

  // Fiyat Dönüştürme
  const convertPrice = (basePrice: number) => {
    const currentRate = rates[currency] || 1 
    
    const price = Math.round(basePrice * currentRate)
    
    let symbol = '$' 
    if (currency === 'EUR') symbol = '€'
    if (currency === 'TRY') symbol = '₺'
    
    return { price, symbol }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, exchangeRates: rates }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error('useCurrency error')
  return context
}