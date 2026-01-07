export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
      {/* Logo Animasyonu */}
      <div className="relative w-32 h-32 animate-pulse">
        {/* Buraya kendi logonun yolunu yaz */}
        <img src="/logo-new.png" alt="Loading" className="object-contain w-full h-full" />
      </div>
      
      {/* Dönen Çember */}
      <div className="mt-8 flex items-center gap-2">
        <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-slate-900 rounded-full animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
  )
}