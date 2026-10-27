import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ElasticReel } from '../ui/ElasticReel'
import type { ElasticReelItem, ElasticReelHandle } from '../ui/ElasticReel'
import { scheduleData } from '../../data/schedule'

const SHOW_ARTWORK: Record<string, { image: string; tag: string; host: string }> = {
  'animes-y-ramen': {
    image: '/assets/ANIMESRAMEN9PM.webp',
    tag: '🍜 ANIME & CULTURA POP',
    host: 'Charrita Peruana & Ale Romero',
  },
  'overhead': {
    image: '/assets/OVERHEAD9PM.webp',
    tag: '🌐 LUCHA LIBRE WRESTLING',
    host: 'Umano Mc, Luis Ríos & Hitman',
  },
  'frikisdem': {
    image: '/assets/FRIKIS9PM.webp',
    tag: '⚡ MEMES & ACTUALIDAD',
    host: 'Darranque, Luis Ríos, Umano & Rafomagia',
  },
  'maldito-plastico': {
    image: '/assets/malditoPlastico.webp',
    tag: '🧸 COLECCIONISMO & FIGURAS',
    host: 'Markollectibles, Gianco & Rafomagia',
  },
  'cine-infarto': {
    image: '/assets/CINEINFARTO9PM.webp',
    tag: '🎬 CINE, MISTERIO & TERROR',
    host: 'Carmen Bathory & José Manco',
  },
  'plan-oscuro': {
    image: '/assets/ELPLANO9PM.webp',
    tag: '🕯️ CASOS OSCUROS & ENIGMAS',
    host: 'Equipo El Plano Oscuro',
  },
}

const ORDERED_IDS = [
  'animes-y-ramen',
  'overhead',
  'frikisdem',
  'maldito-plastico',
  'cine-infarto',
  'plan-oscuro',
]

export function LiveNowSection() {
  const reelRef = useRef<ElasticReelHandle>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Map programs to ElasticReelItem array
  const reelItems = useMemo<ElasticReelItem[]>(() => {
    return ORDERED_IDS.map((id) => {
      const show = scheduleData.find((s) => s.id === id)
      const artwork = SHOW_ARTWORK[id]
      const title = show?.title === 'Plan Oscuro' ? 'El Plano Oscuro' : (show?.title ?? id)
      return {
        src: artwork?.image ?? show?.image ?? '/assets/NinjaLOGO.png',
        alt: title,
        title: `${show?.shortDay ?? ''} • ${title}`,
        subtitle: `${show?.day ?? ''} a las ${show?.timeDisplay ?? '9:00 PM'}`,
        focus: 0.5,
      }
    })
  }, [])

  const selectedShowId = ORDERED_IDS[selectedIndex] ?? ORDERED_IDS[0]
  const currentShow = scheduleData.find((s) => s.id === selectedShowId)
  const displayTitle = currentShow?.title === 'Plan Oscuro' ? 'El Plano Oscuro' : (currentShow?.title ?? '')

  return (
    <section id="live" className="relative py-24 px-4 overflow-hidden bg-ninja-black">
      {/* Dynamic atmospheric glow based on selected show */}
      <motion.div
        key={`glow-${selectedShowId}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.22 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 pointer-events-none blur-[120px]"
        style={{
          background: `radial-gradient(ellipse 65% 55% at 50% 50%, ${currentShow?.color ?? '#DC2626'} 0%, transparent 75%)`,
        }}
      />

      {/* Grid lines background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-display font-black tracking-widest uppercase mb-4 backdrop-blur-md"
            style={{
              color: currentShow?.color ?? '#DC2626',
              borderColor: `${currentShow?.color ?? '#DC2626'}40`,
              backgroundColor: `${currentShow?.color ?? '#DC2626'}15`,
            }}
          >
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: currentShow?.color ?? '#DC2626' }} />
            <span>PRÓXIMO EN VIVO • DOCK ELÁSTICO</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase"
          >
            Parrilla Semanal <span style={{ color: currentShow?.color ?? '#DC2626' }}>9:00 PM</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/65 text-sm sm:text-base font-body mt-2.5 leading-relaxed"
          >
            Explora los 6 programas estelares en vivo. Haz hover, desliza o haz clic en cualquier barra para expandir su arte oficial.
          </motion.p>
        </div>

        {/* Day Selector Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {ORDERED_IDS.map((id, index) => {
            const show = scheduleData.find((s) => s.id === id)
            const isSelected = selectedIndex === index
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSelectedIndex(index)
                  reelRef.current?.open(index)
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-display font-black tracking-wider transition-all duration-200 border ${
                  isSelected
                    ? 'text-white shadow-lg scale-105'
                    : 'text-white/50 border-white/10 bg-white/[0.02] hover:text-white hover:border-white/20'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${show?.color ?? '#DC2626'}35`,
                        borderColor: show?.color ?? '#DC2626',
                        boxShadow: `0 0 20px ${show?.color ?? '#DC2626'}40`,
                      }
                    : {}
                }
              >
                {show?.shortDay} • {show?.title === 'Plan Oscuro' ? 'El Plano Oscuro' : show?.title}
              </button>
            )
          })}
        </div>

        {/* ── React Bits Pro: Elastic Reel Canvas Dock ── */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#181818]/90 to-[#0e0e0e]/95 p-3 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.85)]">
          <div className="w-full h-[460px] sm:h-[500px] lg:h-[540px] relative">
            <ElasticReel
              ref={reelRef}
              items={reelItems}
              defaultOpen={0}
              barWidth={56}
              barHeight={0.62}
              gap={12}
              radius={16}
              magnify={2.3}
              lift={1.2}
              influence={220}
              align="center"
              openSize={0.76}
              openAspect={1.25}
              elasticity={0.35}
              autoplay="sweep"
              speed={1.2}
              interval={4}
              pauseOnHover={true}
              draggable={true}
              wheel={true}
              captions={true}
              labels={true}
              backgroundColor="transparent"
              onOpen={(_: ElasticReelItem, index: number) => setSelectedIndex(index)}
              onClose={() => {}}
              className="w-full h-full"
            />
          </div>

          {/* Active Show Context Bar under Reel */}
          <AnimatePresence mode="wait">
            {currentShow && (
              <motion.div
                key={currentShow.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 px-2 sm:px-4"
              >
                <div className="flex items-center gap-3 text-center md:text-left">
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: currentShow.color, boxShadow: `0 0 12px ${currentShow.color}` }}
                  />
                  <div>
                    <h3 className="text-white font-display font-black text-base sm:text-lg">
                      {displayTitle}
                      <span className="text-white/40 font-normal text-xs sm:text-sm ml-2">
                        {currentShow.day}s a las {currentShow.timeDisplay}
                      </span>
                    </h3>
                    <p className="text-white/60 text-xs font-body max-w-xl line-clamp-1">
                      {currentShow.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <a
                    href="https://www.youtube.com/channel/UCF2hgWHhLQx3ZJDsnKU8gZg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-xl text-xs font-display font-black text-black transition-all duration-200 shadow-md flex items-center gap-1.5"
                    style={{ backgroundColor: currentShow.color }}
                  >
                    ▶ Ver en Vivo
                  </a>
                  <Link
                    to={`/programa/${currentShow.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-display font-bold text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    Detalle
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default LiveNowSection
 