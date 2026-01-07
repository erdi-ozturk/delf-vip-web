import Link from "next/link"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-bold text-amber-500 opacity-50">404</h1>
      <h2 className="text-3xl font-bold text-white mt-4">Sayfa Bulunamadı</h2>
      <p className="text-gray-400 mt-2 max-w-md">
        Aradığınız rota haritamızda bulunmuyor. Yanlış bir yola sapmış olabilirsiniz.
      </p>
      
      <Link 
        href="/" 
        className="mt-8 bg-white text-slate-900 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-amber-500 hover:text-white transition-all"
      >
        <Home size={20} /> Anasayfaya Dön
      </Link>
    </div>
  )
}