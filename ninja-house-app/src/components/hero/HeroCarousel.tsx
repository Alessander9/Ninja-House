import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { scheduleData, getSmartStatus } from '../../data/schedule'
import { programLogoMap } from '../../data/programThemes'

// Custom hero artwork for hero carousel slides
const heroImageMap: Record<string, string> = {
  'animes-y-ramen': '/assets/ANIMESRAMEN9PM.webp',
  'overhead': '/assets/OVERHEAD9PM.webp',
  'frikisdem': '/assets/FRIKIS9PM.webp',
  'freakuencia-m': '/assets/FRIKIS9PM.webp',
  'maldito-plastico': '/assets/malditoPlastico.webp',
  'cine-infarto': '/assets/CINEINFARTO9PM.webp',
  'plan-oscuro': '/assets/heros/ELPLANO9PM.webp',
  'el-plano-oscuro': '/assets/heros/ELPLANO9PM.webp',
}

// Programas que ya tienen el horario integrado en el arte gráfico del logo
const showsWithIntegratedSchedule = [
  'animes-y-ramen',
  'overhead',
  'frikisdem',
  'freakuencia-m',
  'maldito-plastico',
  'cine-infarto',
  'plan-oscuro',
]

// Orden exacto de los 6 slides del hero
const orderedShowIds = [
  'animes-y-ramen',
  'overhead',
  'frikisdem',
  'maldito-plastico',
  'cine-infarto',
  'plan-oscuro',
]

const allSlides = orderedShowIds
  .map((id) => scheduleData.find((show) => show.id === id))
  .filter((show): show is (typeof scheduleData)[0] => Boolean(show))
  .map((show) => ({
    id: show.id,
    type: 'show' as const,
    tag: `${show.emoji} ${show.category.toUpperCase()}`,
    day: show.day,
    time: show.timeDisplay,
    title: show.title,
    subtitle: show.description,
    image: heroImageMap[show.id] ?? (programLogoMap[show.id] ?? show.image),
    video: show.video,
    accentColor: show.color,
    bgGradient: `radial-gradient(ellipse at 65% 40%, ${show.color}28 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(90,40,122,0.2) 0%, transparent 50%)`,
    cta: { label: '▶ Ver Canal', href: 'https://www.youtube.com/channel/UCF2hgWHhLQx3ZJDsnKU8gZg' },
    ctaSecondary: { label: '👁️ Ver Detalle', href: `/programa/${show.id}` },
  }))

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
      className="relative w-full overflow-hidden rounded-3xl min-h-[470px] lg:min-h-[430px] xl:min-h-[465px]"
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
          className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden"
          style={{
            background: `${slide.bgGradient}, #151515`,
            border: `1px solid ${slide.accentColor}35`,
            borderRadius: '24px',
          }}
        >
          {/* Halftone overlay */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle, ${slide.accentColor}30 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-10 items-center h-full px-6 py-6 lg:px-12 lg:py-8">

            {/* LEFT: Text & Brand - Centered in harmony with logo */}
            <div className="flex flex-col gap-2.5 lg:gap-3 w-full text-center items-center max-w-xl mx-auto lg:mx-0">
              
              {/* Tag + Status badge */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap items-center justify-center gap-2"
              >
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-bold tracking-widest border backdrop-blur-md"
                  style={{ color: slide.accentColor, backgroundColor: `${slide.accentColor}25`, borderColor: `${slide.accentColor}45` }}
                >
                  {slide.tag}
                </span>

                {/* Smart status badge for show slides */}
                {statusCfg && (
                  <motion.span
                    className={`px-2.5 py-1 text-xs font-bold font-display rounded-full text-white tracking-wider backdrop-blur-md shadow-lg ${statusCfg.bg}`}
                    animate={statusCfg.blink ? { opacity: [1, 0.4, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {statusCfg.label}
                  </motion.span>
                )}
              </motion.div>

              {/* Day + Time badge (show slides only) - Omitido en programas con horario ya integrado en el arte */}
              {isShowSlide && slide.day && !showsWithIntegratedSchedule.includes(slide.id) && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 }}
                  className="flex items-center justify-center gap-2"
                >
                  <div
                    className="px-3 py-1 rounded-lg text-xs font-display font-black tracking-widest backdrop-blur-md"
                    style={{ backgroundColor: `${slide.accentColor}25`, color: slide.accentColor, border: `1px solid ${slide.accentColor}35` }}
                  >
                    {slide.day.toUpperCase()}
                  </div>
                  <span className="text-white/60 text-xs font-display font-bold">@ {slide.time}</span>
                </motion.div>
              )}

              {/* Giant Show Logo placed BETWEEN Schedule and Title - Centered */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="w-full flex items-center justify-center my-1.5"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`${
                    showsWithIntegratedSchedule.includes(slide.id)
                      ? 'max-h-[160px] sm:max-h-[190px] lg:max-h-[220px] xl:max-h-[240px]'
                      : 'max-h-[150px] sm:max-h-[180px] lg:max-h-[210px] xl:max-h-[230px]'
                  } w-auto object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)]`}
                />
              </motion.div>

              {/* Title (Ocultado/Comentado para todos los slides ya que el logo ya tiene el nombre del show) */}
              {/*
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="font-display font-black text-3xl lg:text-4xl xl:text-5xl leading-tight text-white text-center"
                style={{ textShadow: `0 2px 25px rgba(0,0,0,0.8), 0 0 40px ${slide.accentColor}45` }}
              >
                <span style={{ color: slide.accentColor }}>{slide.title}</span>
              </motion.h2>
              */}

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="text-white/80 font-body text-xs sm:text-[13px] lg:text-sm leading-relaxed max-w-md text-center drop-shadow-md my-1"
              >
                {slide.subtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                className="flex items-center justify-center gap-3 pt-2 w-full"
              >
                <motion.a
                  href={slide.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm transition-all duration-250 shadow-xl flex items-center justify-center"
                  style={{ backgroundColor: slide.accentColor, color: '#151515' }}
                  whileHover={{ scale: 1.05, y: -2, boxShadow: `0 0 30px ${slide.accentColor}80` }}
                  whileTap={{ scale: 0.97 }}
                >
                  {slide.cta.label}
                </motion.a>
                <motion.a
                  href={slide.ctaSecondary.href}
                  className="px-6 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm text-white border border-white/20 bg-black/40 backdrop-blur-md hover:border-white/50 hover:bg-black/60 transition-all duration-250 shadow-lg flex items-center justify-center"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {slide.ctaSecondary.label}
                </motion.a>
              </motion.div>
            </div>

            {/* RIGHT: Compact Video Player (if video available) OR Image Poster (if no video) */}
            <div className="hidden lg:flex items-center justify-center relative flex-shrink-0 mb-2 lg:mb-0 w-full max-w-[560px]">
              {/* Glow blob */}
              <motion.div
                className="absolute w-64 h-64 lg:w-96 lg:h-96 rounded-full pointer-events-none blur-[60px] lg:blur-[90px]"
                style={{ background: `radial-gradient(circle, ${slide.accentColor}45 0%, transparent 70%)` }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {slide.video ? (
                <motion.div
                  key={`video-box-${current}`}
                  className="relative z-10 w-full aspect-video rounded-3xl overflow-hidden border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-black"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    boxShadow: `0 25px 60px rgba(0,0,0,0.85), 0 0 45px ${slide.accentColor}50`,
                    borderColor: `${slide.accentColor}65`,
                  }}
                >
                  <video
                    src={slide.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    style={{ transform: 'translateZ(0)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              ) : (
                <motion.img
                  key={`img-${current}`}
                  src={slide.image}
                  alt={slide.title}
                  loading="lazy"
                  className="relative z-10 max-w-[160px] max-h-[140px] lg:max-w-[320px] lg:max-h-[320px] w-full object-contain drop-shadow-2xl"
                  initial={{ opacity: 0, scale: 0.82, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ filter: `drop-shadow(0 0 28px ${slide.accentColor}55)` }}
                />
              )}
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
