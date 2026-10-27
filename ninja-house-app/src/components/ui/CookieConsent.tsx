import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('ninja_cookie_consent')
      if (!consent) {
        // Show after 1.2s delay for a smoother intro
        const timer = setTimeout(() => {
          setIsVisible(true)
        }, 1200)
        return () => clearTimeout(timer)
      }
    } catch {
      // LocalStorage might be disabled in private mode
      setIsVisible(false)
    }
  }, [])

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('ninja_cookie_consent', 'all')
    } catch {}
    setIsVisible(false)
  }

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem('ninja_cookie_consent', 'essential')
    } catch {}
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 pointer-events-auto"
        >
          <div className="p-5 sm:p-6 rounded-2xl bg-[#141414]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Subtle top edge glow */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-ninja-green via-ninja-red to-ninja-green opacity-70" />

            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl select-none">🍪</span>
              <div>
                <h3 className="font-display font-black text-sm text-white tracking-wide">
                  Cookies & Privacidad en Ninja House
                </h3>
                <p className="text-xs text-white/60 font-body mt-1 leading-relaxed">
                  Usamos cookies esenciales para mantener tu sesión activa y analizar anónimamente el rendimiento de nuestras transmisiones y directos.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-4">
              <button
                onClick={handleAcceptAll}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-ninja-green text-ninja-black font-display font-black text-xs uppercase tracking-wider hover:bg-ninja-green/90 transition-all shadow-md shadow-ninja-green/20"
              >
                Aceptar Todas
              </button>
              <button
                onClick={handleAcceptEssential}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white/80 font-display font-bold text-xs uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all"
              >
                Solo Necesarias
              </button>
            </div>

            {/* Legal Link */}
            <div className="mt-3 text-center sm:text-left">
              <Link
                to="/privacidad"
                onClick={() => setIsVisible(false)}
                className="text-[11px] text-white/40 hover:text-ninja-green transition-colors font-body underline underline-offset-2"
              >
                Conoce más en nuestra Política de Privacidad
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
