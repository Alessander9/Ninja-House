import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface LoadingScreenProps {
  isLoading: boolean
}

const geekNinjaLoadingMessages = [
  "🥷 DESENVAINANDO KATANAS & AFILANDO SHURIKENS...",
  "🍜 PREPARANDO EL RAMEN SAGRADO DEL DOJO...",
  "⚡ CONCENTRANDO CHAKRA & PODER SAIYAJIN...",
  "🎲 TIRANDO INICIATIVA D20 EN EL CAMPO DE BATALLA...",
  "🔥 JUTSU DE TRANSMISIÓN NINJA ACTIVADO: ¡ENTRANDO AL DOJO!"
]

// 9 Sacred Shinobi Seals (Kuji-Kiri)
const kujiKiriSeals = [
  { kanji: '臨', label: 'RIN', title: 'Poder' },
  { kanji: '兵', label: 'PYO', title: 'Energía' },
  { kanji: '闘', label: 'TOH', title: 'Armonía' },
  { kanji: '者', label: 'SHA', title: 'Curación' },
  { kanji: '皆', label: 'KAI', title: 'Premonición' },
  { kanji: '陣', label: 'JIN', title: 'Estrategia' },
  { kanji: '列', label: 'RETSU', title: 'Espacio' },
  { kanji: '在', label: 'ZAI', title: 'Control' },
  { kanji: '前', label: 'ZEN', title: 'Iluminación' },
]

const geekPillars = [
  { label: 'ANIME & MANGA', icon: '🍜', color: '#8B5CF6' },
  { label: 'GAMING & WRESTLING', icon: '🎮', color: '#3B82F6' },
  { label: 'COLECCIONABLES & TOYS', icon: '🧸', color: '#F97316' },
  { label: 'CINE DE TERROR & POP', icon: '🎬', color: '#EF4444' },
  { label: 'ROL & D&D EN VIVO', icon: '🎲', color: '#EC4899' },
]

function ShurikenSvg({ className = "w-6 h-6", glow = false }: { className?: string; glow?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={`${className} ${glow ? 'filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : ''}`}
    >
      {/* 4-point aerodynamic curved Shuriken */}
      <path d="M 50 10 C 52 28 62 38 80 40 C 62 42 52 52 50 70 C 48 52 38 42 20 40 C 38 38 48 28 50 10 Z" fill="#b01a19" />
      <path d="M 50 20 C 51 32 58 39 70 40 C 58 41 51 48 50 60 C 49 48 42 41 30 40 C 42 39 49 32 50 20 Z" fill="#ef4444" />
      <path d="M 20 20 C 35 25 45 35 50 50 C 35 55 25 65 20 80 C 15 65 5 55 0 50 C 15 45 15 35 20 20 Z" transform="rotate(45 50 50)" fill="#dc2626" opacity="0.85" />
      {/* Central center circle */}
      <circle cx="50" cy="50" r="8" fill="#070709" stroke="#ef4444" strokeWidth="2" />
      <circle cx="50" cy="50" r="3" fill="#ffffff" />
    </svg>
  )
}

function KunaiSvg({ className = "w-4 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 100" fill="currentColor" className={className}>
      {/* Kunai Blade */}
      <polygon points="15,0 28,45 15,55 2,45" fill="#ef4444" />
      <polygon points="15,5 23,43 15,50 7,43" fill="#ffffff" opacity="0.3" />
      {/* Kunai Handle */}
      <rect x="12" y="55" width="6" height="30" fill="#333333" rx="1" />
      {/* Red Cord Wrapped Handle */}
      <line x1="12" y1="62" x2="18" y2="60" stroke="#b01a19" strokeWidth="2" />
      <line x1="12" y1="70" x2="18" y2="68" stroke="#b01a19" strokeWidth="2" />
      <line x1="12" y1="78" x2="18" y2="76" stroke="#b01a19" strokeWidth="2" />
      {/* Ring at bottom */}
      <circle cx="15" cy="92" r="7" fill="none" stroke="#ef4444" strokeWidth="3" />
    </svg>
  )
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [progress, setProgress] = useState(12)
  const [activeMessage, setActiveMessage] = useState(geekNinjaLoadingMessages[0])

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
    if (progress < 25) {
      setActiveMessage(geekNinjaLoadingMessages[0])
    } else if (progress < 50) {
      setActiveMessage(geekNinjaLoadingMessages[1])
    } else if (progress < 72) {
      setActiveMessage(geekNinjaLoadingMessages[2])
    } else if (progress < 90) {
      setActiveMessage(geekNinjaLoadingMessages[3])
    } else {
      setActiveMessage(geekNinjaLoadingMessages[4])
    }
  }, [progress])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{
            y: '100%',
            transition: {
              duration: 1.05,
              ease: [0.76, 0, 0.24, 1],
            }
          }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-[#070709] text-white flex flex-col items-center justify-center select-none shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        >
          {/* Top Curtain Edge Laser Light */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_25px_#dc2626] z-50 pointer-events-none" />

          {/* Cyberpunk Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(#ef4444 1px, transparent 1px), linear-gradient(90deg, #ef4444 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Deep Red Radial Atmosphere & Smoke effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(176,26,25,0.25) 0%, rgba(90,10,10,0.1) 42%, transparent 70%)',
            }}
          />

          {/* HUD Corner Accents (Geek Ninja Shinobi Interface) */}
          <div className="absolute top-6 left-6 hidden md:flex items-center gap-2.5 font-mono text-[10px] text-white/40 tracking-[0.2em]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <ShurikenSvg className="w-4 h-4 text-red-500" />
            </motion.div>
            <span className="text-red-500 font-bold">[ SHINOBI PROTOCOL ]</span>
            <span>// DOJO CORE v2.4</span>
          </div>

          <div className="absolute top-6 right-6 hidden md:flex items-center gap-3 font-mono text-[10px] text-white/40 tracking-[0.2em]">
            <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-600/40 text-red-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              CHAKRA: 100%
            </span>
            <span className="text-white/60">KATANA: PREPARADA ⚔️</span>
          </div>

          <div className="absolute bottom-6 left-6 hidden md:flex items-center gap-2 font-mono text-[10px] text-white/30 tracking-[0.2em]">
            <span className="text-red-500">忍</span>
            <span>NINJA HOUSE CANAL OFICIAL</span>
            <span>•</span>
            <span className="text-white/50">LUN-VIE 9:00 PM</span>
          </div>

          <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-2 font-mono text-[10px] text-white/30 tracking-[0.2em]">
            <span>60 FPS</span>
            <span>•</span>
            <span className="text-red-400 font-bold">JUTSU EN PROCESO...</span>
          </div>

          {/* Central Logo & Ninja Orbits */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center max-w-xl w-full px-6"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              y: -50,
              scale: 0.92,
              transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Logo Centerpiece with Shurikens & Kanji Seal Rings */}
            <div className="relative flex items-center justify-center mb-10 sm:mb-14">
              
              {/* 1. Orbiting Shurikens Circle (Outer Layer) */}
              <motion.div
                className="absolute h-[420px] w-[420px] sm:h-[510px] sm:w-[510px] rounded-full border border-red-600/10 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              >
                {/* 4 Shurikens on Cardinal Points */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                    <ShurikenSvg className="w-7 h-7 text-red-500" glow />
                  </motion.div>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                    <ShurikenSvg className="w-7 h-7 text-red-500" glow />
                  </motion.div>
                </div>
                <div className="absolute -left-3 top-1/2 -translate-y-1/2">
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                    <ShurikenSvg className="w-7 h-7 text-red-500" glow />
                  </motion.div>
                </div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2">
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                    <ShurikenSvg className="w-7 h-7 text-red-500" glow />
                  </motion.div>
                </div>
              </motion.div>

              {/* 2. Middle Ring: 9 Ninja Kuji-Kiri Kanji Seals */}
              <motion.div
                className="absolute h-[340px] w-[340px] sm:h-[420px] sm:w-[420px] rounded-full border border-dashed border-red-600/25 pointer-events-none flex items-center justify-center"
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              >
                {kujiKiriSeals.map((seal, i) => {
                  const angle = (i * 360) / kujiKiriSeals.length
                  const radius = 170 // radius in px
                  const x = radius * Math.cos((angle * Math.PI) / 180)
                  const y = radius * Math.sin((angle * Math.PI) / 180)
                  return (
                    <div
                      key={seal.kanji}
                      className="absolute text-red-500/40 font-mono font-bold text-xs"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      {seal.kanji}
                    </div>
                  )
                })}
              </motion.div>

              {/* 3. Deep Crimson Chakra Aura */}
              <motion.div 
                className="absolute top-6 sm:top-7 h-[240px] w-[240px] sm:h-[300px] sm:w-[300px] rounded-full bg-red-600/20 blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* 4. Katana Slash Light Effect (Diagonal flash) */}
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.5 }}
              >
                <div className="w-[180%] h-0.5 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-45 translate-x-[-40%] translate-y-[146px] shadow-[0_0_15px_#ffffff]" />
              </motion.div>

              {/* 5. Top Shinobi Dojo Seal Tag */}
              <div className="absolute -top-7 z-20 px-3 py-1 rounded-full bg-black/60 border border-red-600/30 backdrop-blur-md flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-[0.25em] text-red-400 pointer-events-none">
                <span>⚔️</span>
                <span>忍 SHINOBI DOJO 影</span>
                <span>⚔️</span>
              </div>

              {/* 6. Official Ninja House Giant Logo */}
              <motion.img
                src="/assets/NinjaLOGO.png"
                alt="Ninja House"
                className="relative z-10 top-6 sm:top-7 h-52 w-52 sm:h-64 sm:w-64 md:h-72 md:w-72 object-contain select-none pointer-events-none drop-shadow-[0_0_45px_rgba(176,26,25,0.6)]"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* Geek / Ninja Show Pillars Badge Ribbon */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6 max-w-md">
              {geekPillars.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-[9.5px] font-display font-bold tracking-wider text-white/70 backdrop-blur-md shadow-md"
                  style={{ borderColor: `${item.color}30` }}
                >
                  <span>{item.icon}</span>
                  <span style={{ color: item.color }}>{item.label}</span>
                </span>
              ))}
            </div>

            {/* Synchronized Geek/Ninja Chakra Loading UI */}
            <div className="w-full flex flex-col gap-3.5 max-w-sm sm:max-w-md">
              
              {/* Monospaced Dynamic Ninja Loading Message */}
              <div className="text-center font-mono text-[11px] tracking-[0.16em] text-red-400 h-5 select-none font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeMessage}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeMessage}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Kunai Framed Chakra Progress Bar */}
              <div className="flex items-center gap-2.5">
                <KunaiSvg className="w-3.5 h-6 text-red-500 rotate-90 flex-shrink-0" />
                
                <div className="relative flex-1 h-[7px] overflow-hidden rounded-full bg-white/[0.05] border border-red-600/30 p-[1px] shadow-[0_0_15px_rgba(220,38,38,0.25)]">
                  <motion.div
                    className="h-full rounded-full relative"
                    style={{
                      background: 'linear-gradient(90deg, #7f1d1d 0%, #dc2626 50%, #f87171 100%)',
                      boxShadow: '0 0 16px rgba(239,68,68,0.8)',
                    }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    {/* Energy Pulse on Progress Lead */}
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full blur-[1px] shadow-[0_0_8px_#ffffff]" />
                  </motion.div>
                </div>

                <KunaiSvg className="w-3.5 h-6 text-red-500 -rotate-90 flex-shrink-0" />
              </div>

              {/* Progress percentages & Shinobi status */}
              <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 select-none px-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-red-500">⚔️</span> CHAKRA DOJO
                </span>
                <span className="text-red-400 font-black">{progress}% CARGADO</span>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
