"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Users, Star, ArrowRight, Info } from "lucide-react"
import { useLanguage } from "@/components/LanguageContext"

interface Tour {
  id: string
  title: string
  location: string
  image: string
  duration: string
  rating: string
  priceUsd: number
  tags: string
  bookingType: string
  bookingDuration: string
  pickupAddr: string
  pickupName: string
  dropoffAddr: string
  dropoffName: string
  vehicle: string
  passengers: string
  roundTrip: boolean
}

interface ToursGridProps {
  tours: Tour[]
}

export default function ToursGrid({ tours }: ToursGridProps) {
  const { language } = useLanguage()

  const [tryRate, setTryRate] = useState(36)
  const SAFETY_MARGIN = 1.05

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=TRY")
        const data = await res.json()
        if (data?.rates?.TRY) {
          setTryRate(data.rates.TRY * SAFETY_MARGIN)
        }
      } catch {
        // varsayılan değer kullanılır
      }
    }
    fetchRate()
  }, [])

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tours.map((tour) => {
        const price = `$${tour.priceUsd}`
        const priceTry = Math.round(tour.priceUsd * tryRate)
        const tagList = tour.tags ? tour.tags.split(",").map((t) => t.trim()).filter(Boolean) : []

        const checkoutParams = new URLSearchParams({
          tourFixed: "true",
          type: tour.bookingType,
          duration: tour.bookingDuration,
          pickup: tour.pickupAddr,
          pickupName: tour.pickupName,
          dropoff: tour.dropoffAddr,
          dropoffName: tour.dropoffName,
          vehicle: tour.vehicle,
          price: `$${tour.priceUsd}`,
          passengers: tour.passengers,
          ...(tour.roundTrip ? { roundTrip: "true" } : {}),
        }).toString()

        return (
          <div
            key={tour.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 border border-gray-100 hover:border-amber-200 flex flex-col"
          >
            <div className="h-64 relative overflow-hidden bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60 z-10"></div>
              <Image
                src={tour.image}
                alt={tour.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                unoptimized={true}
              />
              <div className="absolute top-4 left-4 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <MapPin size={12} className="text-amber-400" /> {tour.location}
              </div>
              <div className="absolute top-4 right-4 z-20 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg">
                <Star size={12} fill="currentColor" /> {tour.rating}
              </div>
              <div className="absolute bottom-4 left-4 z-20 text-white">
                <div className="flex gap-2 text-xs font-medium mb-1 opacity-90">
                  {tagList.map((tag, i) => (
                    <span key={i} className="bg-white/20 px-2 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                  {tour.title}
                </h3>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-amber-500" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={16} className="text-amber-500" />
                  <span>Özel Araç</span>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Tahsis Ücreti</p>
                  <p className="text-2xl font-bold text-slate-900">{price}</p>
                  <p className="text-[10px] text-gray-400">
                    <span>{language === "tr" ? "Yaklaşık" : "Approx"} </span>
                    <span className="notranslate">{priceTry}₺</span>
                  </p>
                </div>
                <Link
                  href={`/checkout?${checkoutParams}`}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 group-hover:bg-amber-600"
                >
                  Rezervasyon Yap <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
