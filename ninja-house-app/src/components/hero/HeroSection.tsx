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
  const logoRef = useRef<HTMLImageElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [startCount, setStartCount] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ 
        defaults: { ease: 'power3.out' },
        delay: 2.9 // Delay animations until the loader finishes and fades out
      })
      
      tl.fromTo(logoRef.current,
        { y: -50, opacity: 0, scale: 0.7 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9 }
      )
      .fromTo('.hero-badge',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.3'
      )
      .fromTo('.hero-top-text',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.7 },
        '-=0.2'
      )
      .fromTo(carouselRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 },
        '-=0.3'
      )
      .fromTo('.hero-stats',
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.08, 
          duration: 0.5,
          onStart: () => setStartCount(true)
        },
        '-=0.2'
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-10"
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

        {/* Top: Logo + badge + text */}
        <div ref={topRef} className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-10">

          {/* Logo */}
          <img
            ref={logoRef}
            src="/assets/NinjaLOGO.png"
            alt="Ninja House"
            className="h-24 w-auto object-contain opacity-0 flex-shrink-0"
            style={{ filter: 'drop-shadow(0 0 24px rgba(176,26,25,0.45))' }}
          />

          {/* Text column */}
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <div className="hero-badge opacity-0">
              <motion.span
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 border border-red-600/30 rounded-full text-red-500 font-display font-bold text-xs tracking-widest"
                animate={{ boxShadow: ['0 0 0px rgba(176,26,25,0)', '0 0 16px rgba(176,26,25,0.3)', '0 0 0px rgba(176,26,25,0)'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <motion.span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                NINJA HOUSE — CANAL OFICIAL
              </motion.span>
            </div>

            <h1 className="hero-top-text opacity-0 font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-tight">
              <span className="text-white">Contenido</span>{' '}
              <span className="text-red-500" style={{ textShadow: '0 0 40px rgba(176,26,25,0.45)' }}>Geek</span>{' '}
              <span className="text-white">Sin</span>{' '}
              <span className="text-red-100" style={{ textShadow: '0 0 40px rgba(199,90,88,0.4)' }}>Filtros</span>
            </h1>

            <p className="hero-top-text opacity-0 text-white/55 text-sm sm:text-base md:text-lg font-body max-w-4xl leading-relaxed">
              Gaming · Anime · Cultura Pop · Reviews · Comunidad · <span className="text-red-500 font-semibold">En vivo cada semana</span> desde Ninja House.
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div ref={carouselRef} className="opacity-0 mb-10 min-h-[540px] lg:min-h-[440px]">
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
