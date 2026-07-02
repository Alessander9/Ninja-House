import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface LoadingScreenProps {
  isLoading: boolean
}

const loadingMessages = [
  "INICIALIZANDO PLATAFORMA...",
  "CARGANDO CONTENIDO EXCLUSIVO...",
  "CONECTANDO CON SERVIDORES DE EMISIÓN...",
  "ESTABLECIENDO CONEXIÓN SEGURA...",
  "PREPARANDO EXPERIENCIA PRIME TIME..."
]

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [progress, setProgress] = useState(12)
  const [activeMessage, setActiveMessage] = useState(loadingMessages[0])

  useEffect(() => {
    if (!isLoading) return

    setProgress(12)
    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 95) return 95
        return Math.min(95, current + 2 + Math.random() * 6)
      })
    }, 120)

    return () => window.clearInterval(interval)
  }, [isLoading])

  // Sync loading state messages with loading percentage
  useEffect(() => {
    if (progress < 30) {
      setActiveMessage(loadingMessages[0])
    } else if (progress < 55) {
      setActiveMessage(loadingMessages[1])
    } else if (progress < 75) {
      setActiveMessage(loadingMessages[2])
    } else if (progress < 90) {
      setActiveMessage(loadingMessages[3])
    } else {
      setActiveMessage(loadingMessages[4])
    }
  }, [progress])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-[#070709] text-white flex items-center justify-center"
        >
          {/* Subtle Ambient Backlight Glow */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 45%, rgba(176,26,25,0.12) 0%, transparent 40%)',
            }}
          />

          {/* Minimalist Tech Outline Border */}
          <div className="absolute inset-8 rounded-[2rem] border border-white/[0.02] pointer-events-none z-10" />

          {/* Central Logo Container */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center max-w-sm w-full px-6"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Logo Wrapper with elegant slow elements */}
            <div className="relative flex items-center justify-center mb-12">
              
              {/* Outer Slow Ambient Ring */}
              <motion.div
                className="absolute h-[280px] w-[280px] rounded-full border border-white/[0.03]"
                animate={{ rotate: 360 }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              />

              {/* Inner Soft Gradient Ring */}
              <motion.div
                className="absolute h-[240px] w-[240px] rounded-full border border-dashed border-red-600/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              />

              {/* Logo Backdrop Glow */}
              <motion.div 
                className="absolute h-[140px] w-[140px] rounded-full bg-red-600/5 blur-xl"
                animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Official Logo */}
              <motion.img
                src="/assets/NinjaLOGO.png"
                alt="Ninja House"
                className="relative z-10 h-32 w-32 object-contain select-none pointer-events-none"
                style={{ filter: 'drop-shadow(0 4px 20px rgba(176,26,25,0.25))' }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* Sincronized Loader UI */}
            <div className="w-full flex flex-col gap-3.5">
              
              {/* Monospaced Professional Loading text */}
              <div className="text-center font-mono text-[9px] tracking-[0.25em] text-white/50 h-4 select-none">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeMessage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeMessage}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Ultrafine minimalist progress bar */}
              <div className="h-[2px] overflow-hidden rounded-full bg-white/[0.04]">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #b01a19 0%, #dc2626 100%)',
                    boxShadow: '0 0 10px rgba(176,26,25,0.3)',
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              </div>

              {/* Progress percentages */}
              <div className="flex items-center justify-between font-display text-[9px] font-bold uppercase tracking-[0.25em] text-white/20 select-none">
                <span>SYSTEM LOADING</span>
                <span>{progress}%</span>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
