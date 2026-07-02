import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { scheduleData, getSmartStatus } from '../../data/schedule'
import { programLogoMap } from '../../data/programThemes'

// Build slides from real schedule data + a hero intro slide
const scheduleSlides = scheduleData.map((show) => ({
  id: show.id,
  type: 'show' as const,
  tag: `${show.emoji} ${show.category.toUpperCase()}`,
  day: show.day,
  time: show.timeDisplay,
  title: show.title,
  subtitle: show.description,
  image: programLogoMap[show.id] ?? show.image,
  accentColor: show.color,
  bgGradient: `radial-gradient(ellipse at 65% 40%, ${show.color}28 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(90,40,122,0.2) 0%, transparent 50%)`,
  cta: { label: '▶ Ver Canal', href: 'https://www.youtube.com/channel/UCF2hgWHhLQx3ZJDsnKU8gZg' },
  ctaSecondary: { label: '👁️ Ver Detalle', href: `/programa/${show.id}` },
}))

const heroIntroSlide = {
  id: 'hero-intro',
  type: 'hero' as const,
  tag: '🥷 NINJA HOUSE — CANAL OFICIAL',
  day: '',
  time: '',
  title: 'Contenido Geek',
  subtitle: 'Gaming, anime, cultura pop y coleccionables. En vivo de lunes a viernes a las 9PM. ¡Únete al dojo ninja!',
  image: '/assets/NinjaLOGO.png',
  accentColor: '#B01A19',
  bgGradient: 'radial-gradient(ellipse at 70% 40%, rgba(183,31,29,0.28) 0%, transparent 55%), radial-gradient(ellipse at 20% 70%, rgba(176,26,25,0.14) 0%, transparent 50%)',
  cta: { label: '▶ Suscríbete', href: 'https://www.youtube.com/channel/UCF2hgWHhLQx3ZJDsnKU8gZg' },
  ctaSecondary: { label: '📺 Programas', href: '/programas' },
}

const allSlides = [heroIntroSlide, ...scheduleSlides]

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0, scale: 0.96 }),
}

const statusConfig = {
  live:       { label: '🔴 EN VIVO AHORA', bg: 'bg-red-600',          blink: true },
  'next-live':{ label: '🔜 PRÓXIMO EN VIVO', bg: 'bg-ninja-purple',    blink: false },
  today:      { label: '⚡ HOY',             bg: 'bg-ninja-green',     blink: false },
  upcoming:   { label: '🕐 PRÓXIMAMENTE',    bg: 'bg-ninja-yellow/90', blink: false },
  finished:   { label: '✓ FINALIZADO',       bg: 'bg-white/20',        blink: false },
}

export function HeroCarousel() {
  const [[current, direction], setSlide] = useState([0, 0])
  const [isPaused, setIsPaused] = useState(false)
  const [dragStart, setDragStart] = useState(0)

  const paginate = useCallback((newDir: number) => {
    setSlide(([cur]) => [(cur + newDir + allSlides.length) % allSlides.length, newDir])
  }, [])

  useEffect(() => {
    if (isPaused) return
    const t = setInterval(() => paginate(1), 5500)
    return () => clearInterval(t)
  }, [isPaused, paginate])

  const slide = allSlides[current]
  const isShowSlide = slide.type === 'show'
  const showStatus = isShowSlide
    ? getSmartStatus(scheduleData.find(s => s.id === slide.id)!)
    : null
  const statusCfg = showStatus ? statusConfig[showStatus] : null

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl min-h-[540px] lg:min-h-[440px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragStart={(_, info) => setDragStart(info.point.x)}
          onDragEnd={(_, info) => {
            if (Math.abs(info.point.x - dragStart) > 55) paginate(info.point.x < dragStart ? 1 : -1)
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{
            background: `${slide.bgGradient}, #151515`,
            border: `1px solid ${slide.accentColor}25`,
            borderRadius: '16px',
          }}
        >
          {/* Halftone overlay */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle, ${slide.accentColor}30 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 items-center h-full px-5 py-7 lg:px-12 lg:py-9">

            {/* LEFT: Text */}
            <div className="flex flex-col gap-3 lg:gap-4 w-full text-center lg:text-left items-center lg:items-start">
              {/* Tag + Status badge */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-2"
              >
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-bold tracking-widest border"
                  style={{ color: slide.accentColor, backgroundColor: `${slide.accentColor}18`, borderColor: `${slide.accentColor}35` }}
                >
                  {slide.tag}
                </span>

                {/* Smart status badge for show slides */}
                {statusCfg && (
                  <motion.span
                    className={`px-2.5 py-1 text-xs font-bold font-display rounded-full text-white tracking-wider ${statusCfg.bg}`}
                    animate={statusCfg.blink ? { opacity: [1, 0.4, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {statusCfg.label}
                  </motion.span>
                )}
              </motion.div>

              {/* Day + Time badge (show slides only) */}
              {isShowSlide && slide.day && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 }}
                  className="flex items-center justify-center lg:justify-start gap-2"
                >
                  <div
                    className="px-3 py-1 rounded-lg text-xs font-display font-black tracking-widest"
                    style={{ backgroundColor: `${slide.accentColor}20`, color: slide.accentColor }}
                  >
                    {slide.day.toUpperCase()}
                  </div>
                  <span className="text-white/35 text-xs font-display font-bold">@ {slide.time}</span>
                </motion.div>
              )}

              {/* Mobile-only Show Image (placed between schedule and title) */}
              <div className="flex lg:hidden items-center justify-center relative flex-shrink-0 my-2">
                {/* Glow blob */}
                <motion.div
                  className="absolute w-40 h-40 rounded-full pointer-events-none blur-[40px]"
                  style={{ background: `radial-gradient(circle, ${slide.accentColor}35 0%, transparent 70%)` }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.img
                  key={`img-mob-${current}`}
                  src={slide.image}
                  alt={slide.title}
                  loading="lazy"
                  className="relative z-10 max-w-[140px] max-h-[120px] w-full object-contain drop-shadow-2xl"
                  initial={{ opacity: 0, scale: 0.82, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ filter: `drop-shadow(0 0 28px ${slide.accentColor}55)` }}
                />
              </div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="font-display font-black text-3xl lg:text-5xl leading-tight text-white"
                style={{ textShadow: `0 0 40px ${slide.accentColor}30` }}
              >
                <span style={{ color: slide.accentColor }}>{slide.title}</span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="text-white/55 font-body text-[12.5px] lg:text-sm leading-relaxed max-w-md text-center lg:text-left"
              >
                {slide.subtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 w-full"
              >
                <motion.a
                  href={slide.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl font-display font-black text-xs lg:text-sm transition-all duration-250"
                  style={{ backgroundColor: slide.accentColor, color: '#151515' }}
                  whileHover={{ scale: 1.05, y: -2, boxShadow: `0 0 25px ${slide.accentColor}60` }}
                  whileTap={{ scale: 0.97 }}
                >
                  {slide.cta.label}
                </motion.a>
                <motion.a
                  href={slide.ctaSecondary.href}
                  className="px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl font-display font-bold text-xs lg:text-sm text-white/65 border border-white/15 hover:border-white/40 hover:text-white transition-all duration-250"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {slide.ctaSecondary.label}
                </motion.a>
              </motion.div>
            </div>

            {/* RIGHT: Show Image */}
            <div className="hidden lg:flex items-center justify-center relative flex-shrink-0 mb-2 lg:mb-0">
              {/* Glow blob */}
              <motion.div
                className="absolute w-40 h-40 lg:w-72 lg:h-72 rounded-full pointer-events-none blur-[40px] lg:blur-[60px]"
                style={{ background: `radial-gradient(circle, ${slide.accentColor}35 0%, transparent 70%)` }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.img
                key={`img-${current}`}
                src={slide.image}
                alt={slide.title}
                loading="lazy"
                className="relative z-10 max-w-[140px] max-h-[120px] lg:max-w-[280px] lg:max-h-[280px] w-full object-contain drop-shadow-2xl"
                initial={{ opacity: 0, scale: 0.82, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ filter: `drop-shadow(0 0 28px ${slide.accentColor}55)` }}
              />
            </div>
          </div>

          {/* Bottom accent */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
            style={{ background: `linear-gradient(to right, transparent, ${slide.accentColor}, transparent)` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {(['left', 'right'] as const).map((side) => (
        <button
          key={side}
          onClick={() => paginate(side === 'left' ? -1 : 1)}
          className={`absolute ${side === 'left' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-xl text-white/70 hover:text-white hover:bg-black/80 hover:border-white/30 transition-all backdrop-blur-sm`}
          aria-label={side === 'left' ? 'Anterior' : 'Siguiente'}
        >
          {side === 'left' ? '‹' : '›'}
        </button>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
        {allSlides.map((s, i) => (
          <button key={s.id} onClick={() => setSlide([i, i > current ? 1 : -1])} aria-label={`Slide ${i + 1}`}>
            <motion.div
              className="rounded-full"
              animate={{
                width: i === current ? 22 : 6,
                height: 6,
                backgroundColor: i === current ? slide.accentColor : 'rgba(255,255,255,0.25)',
              }}
              transition={{ duration: 0.28 }}
            />
          </button>
        ))}
      </div>

      {/* Progress bar */}
      {!isPaused && (
        <motion.div
          key={`bar-${current}`}
          className="absolute top-0 left-0 h-0.5 z-20 rounded-full"
          style={{ background: slide.accentColor, boxShadow: `0 0 8px ${slide.accentColor}` }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5.5, ease: 'linear' }}
        />
      )}
    </div>
  )
}
