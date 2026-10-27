import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { HeroCarousel } from './HeroCarousel'

// Helper animated counter component for the hero metrics with delay
function HeroCounter({ targetValue, suffix, color, start }: { targetValue: number; suffix: string; color: string; start: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return

    const startTime = performance.now()
    const duration = 2000 // 2 seconds counting duration
    const easeOutQuad = (t: number) => t * (2 - t)

    let rafId: number
    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const currentVal = Math.floor(easeOutQuad(progress) * targetValue)
      
      setCount(currentVal)

      if (progress < 1) {
        rafId = requestAnimationFrame(animate)
      } else {
        setCount(targetValue)
      }
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [start, targetValue])

  return (
    <span className="tabular-nums" style={{ color, textShadow: `0 0 20px ${color}50` }}>
      {count}
      {suffix}
    </span>
  )
}

export function HeroSection() {
  const topRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [startCount, setStartCount] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ 
        defaults: { ease: 'power3.out' },
        delay: 2.9 // Delay animations until the loader finishes and fades out
      })
      
      tl.fromTo('.hero-badge',
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.45 }
      )
      .fromTo('.hero-top-text',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.55 },
        '-=0.15'
      )
      .fromTo(carouselRef.current,
        { opacity: 0, y: 25, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.75 },
        '-=0.2'
      )
      .fromTo('.hero-stats',
        { opacity: 0, y: 15 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.06, 
          duration: 0.45,
          onStart: () => setStartCount(true)
        },
        '-=0.15'
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      data-hero="true"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16 pb-6"
      style={{
        background: 'radial-gradient(ellipse at 70% 30%, rgba(183,31,29,0.22) 0%, transparent 55%), radial-gradient(ellipse at 20% 70%, rgba(176,26,25,0.1) 0%, transparent 50%), #151515',
      }}
    >
      {/* CSS Particle dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 28 }).map((_, i) => {
          const colors = ['#B01A19', '#BD211F', '#C75A58']
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${(i % 3) + 1}px`,
                height: `${(i % 3) + 1}px`,
                left: `${(i * 37 + 5) % 98}%`,
                top: `${(i * 53 + 10) % 95}%`,
                backgroundColor: colors[i % 3],
                opacity: 0.12 + (i % 4) * 0.05,
                animation: `float ${4 + (i % 4)}s ease-in-out ${i * 0.3}s infinite alternate`,
              }}
            />
          )
        })}
      </div>

      {/* Halftone */}
      <div className="absolute inset-0 halftone-bg opacity-25 pointer-events-none" />

      {/* Diagonal lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #B01A19 0, #B01A19 1px, transparent 0, transparent 50%)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Top: Redesigned header with "La única NERDwork de YouTube" & Auto-subscribe CTA */}
        <div ref={topRef} className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4 text-center lg:text-left">
          <div className="flex flex-col gap-1.5 max-w-3xl">
            <div className="hero-badge opacity-0 flex items-center justify-center lg:justify-start gap-2">
              <motion.span
                className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-red-600/10 border border-red-600/30 rounded-full text-red-500 font-display font-bold text-[11px] tracking-widest backdrop-blur-md"
                animate={{ boxShadow: ['0 0 0px rgba(176,26,25,0)', '0 0 16px rgba(176,26,25,0.3)', '0 0 0px rgba(176,26,25,0)'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <motion.span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                NINJA HOUSE — CANAL OFICIAL
              </motion.span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/[0.04] border border-white/10 rounded-full text-white/60 font-display font-bold text-[10.5px] tracking-wider">
                🔴 LUN A SÁB 9PM
              </span>
            </div>

            <h1 className="hero-top-text opacity-0 font-display font-black text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] leading-tight text-white tracking-tight">
              La única{' '}
              <span
                className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300 font-black tracking-wide"
                style={{ filter: 'drop-shadow(0 0 25px rgba(239,68,68,0.55))' }}
              >
                NERDwork
              </span>{' '}
              de YouTube
            </h1>

            <p className="hero-top-text opacity-0 text-white/65 text-xs sm:text-sm font-body max-w-2xl leading-relaxed">
              Gaming · Anime · Cultura Pop · Coleccionismo · Misterio · <span className="text-red-400 font-semibold">En vivo cada semana</span> desde el dojo ninja.
            </p>
          </div>

          {/* Direct Auto-subscribe button */}
          <motion.div
            className="hero-top-text opacity-0 flex-shrink-0 pt-1 lg:pt-0"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <a
              href="https://www.youtube.com/channel/UCF2hgWHhLQx3ZJDsnKU8gZg?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-display font-black text-xs sm:text-sm text-white bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-500 hover:to-red-600 shadow-[0_0_25px_rgba(220,38,38,0.45)] hover:shadow-[0_0_35px_rgba(220,38,38,0.7)] border border-red-400/30 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 text-white transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Suscribirme al Canal</span>
            </a>
          </motion.div>
        </div>

        {/* Carousel with compact zoom-out perspective */}
        <div ref={carouselRef} className="opacity-0 mb-6 min-h-[470px] lg:min-h-[430px] xl:min-h-[465px] w-full">
          <HeroCarousel />
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-x-10 gap-y-4 pt-4 border-t border-white/[0.03]">
          {[
            { targetValue: 85, suffix: 'K+', label: 'Suscriptores', color: '#B01A19' },
            { targetValue: 12, suffix: 'M+', label: 'Reproducciones', color: '#BD211F' },
            { targetValue: 420, suffix: '+', label: 'Videos', color: '#C75A58' },
            { targetValue: 45, suffix: 'K+', label: 'En Instagram', color: '#AA0B0A' },
          ].map((s) => (
            <div key={s.label} className="hero-stats opacity-0 text-center lg:text-left">
              <p className="font-display font-black text-2xl">
                <HeroCounter targetValue={s.targetValue} suffix={s.suffix} color={s.color} start={startCount} />
              </p>
              <p className="text-white/35 text-xs font-body">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex flex-col items-center mt-10 gap-2"
        >
          <span className="text-white/15 text-xs font-display tracking-widest">SCROLL</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-red-600 to-transparent"
            animate={{ scaleY: [1, 0.4, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </section>
  )
}
