import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scheduleData, getSmartStatus } from '../../data/schedule'

gsap.registerPlugin(ScrollTrigger)

import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const statusConfig = {
  live: {
    label: '🔴 EN VIVO',
    textColor: '#ffffff',
    bg: 'rgba(220,38,38,0.85)',
    border: 'rgba(239,68,68,0.6)',
    cardBg: 'rgba(239,68,68,0.06)',
    pulse: true,
    glow: '0 0 25px rgba(239,68,68,0.3)',
  },
  'next-live': {
    label: '🔜 PRÓXIMO EN VIVO',
    textColor: '#ffffff',
    bg: 'rgba(90,40,122,0.85)',
    border: 'rgba(90,40,122,0.7)',
    cardBg: 'rgba(90,40,122,0.1)',
    pulse: true,
    glow: '0 0 25px rgba(90,40,122,0.35)',
  },
  today: {
    label: '⚡ HOY',
    textColor: '#151515',
    bg: '#67B946',
    border: 'rgba(103,185,70,0.6)',
    cardBg: 'rgba(103,185,70,0.07)',
    pulse: false,
    glow: '0 0 20px rgba(103,185,70,0.25)',
  },
  upcoming: {
    label: '🕐 PRÓXIMAMENTE',
    textColor: '#151515',
    bg: 'rgba(246,216,83,0.85)',
    border: 'rgba(246,216,83,0.2)',
    cardBg: 'rgba(30,30,30,0.9)',
    pulse: false,
    glow: 'none',
  },
  finished: {
    label: '✓ FINALIZADO',
    textColor: 'rgba(255,255,255,0.5)',
    bg: 'rgba(255,255,255,0.08)',
    border: 'rgba(255,255,255,0.05)',
    cardBg: 'rgba(21,21,21,0.7)',
    pulse: false,
    glow: 'none',
  },
}

export function ScheduleSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.schedule-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' } }
      )
      gsap.fromTo('.schedule-card',
        { y: 70, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const today = new Date().getDay()
  const isWeekend = today === 0 || today === 6

  return (
    <section id="schedule" ref={sectionRef} className="py-24 px-4 bg-ninja-dark relative overflow-hidden">
      <div className="absolute inset-0 halftone-bg opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(176,26,25,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Header */}
        <div className="schedule-title text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-600/30 rounded-full text-red-500 font-display font-bold text-xs tracking-widest mb-4">
            📅 PROGRAMACIÓN SEMANAL
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2">
            La Parrilla{' '}
            <span className="text-red-500" style={{ textShadow: '0 0 30px rgba(176,26,25,0.4)' }}>Ninja</span>
          </h2>
          <p className="text-white/40 mt-3 font-body max-w-xl mx-auto">
            De lunes a viernes a las <span className="text-red-500 font-semibold">9:00 PM</span>.
            Las etiquetas se actualizan automáticamente según el día y la hora.
          </p>
          {isWeekend && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full"
            >
              <motion.span className="w-2 h-2 rounded-full bg-red-500 inline-block"
                animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <span className="text-red-500 font-display font-bold text-xs tracking-wider">
                FIN DE SEMANA — VOLVEMOS EL LUNES CON ANIMES Y RAMEN
              </span>
            </motion.div>
          )}
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {scheduleData.map((program) => {
            const status = getSmartStatus(program)
            const cfg = statusConfig[status]
            const isFinished = status === 'finished'
            const isActive = status === 'live' || status === 'next-live' || status === 'today'
            const programUrlId = program.title.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')

            return (
              <Link
                key={program.id}
                to={`/programa/${programUrlId}`}
                className="schedule-card relative block"
              >
                <motion.div
                  className="h-full"
                  whileHover={!isFinished ? { y: -8, scale: 1.03 } : {}}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                >
                  <div
                    className={`relative h-full min-h-[520px] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${isFinished ? 'opacity-50' : ''}`}
                    style={{
                      background: cfg.cardBg,
                      border: `1px solid ${cfg.border}`,
                      boxShadow: cfg.glow !== 'none' ? cfg.glow : undefined,
                    }}
                  >
                  {/* Pulsing border overlay for active states */}
                  {cfg.pulse && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ border: `1px solid ${cfg.border}` }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  )}

                  {/* Show Image */}
                  <div className="relative w-full overflow-hidden" style={{ height: '200px' }}>
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: isFinished ? 'grayscale(60%) brightness(0.7)' : 'brightness(0.9)' }}
                    />
                    {/* Image gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(21,21,21,0.95) 100%)' }}
                    />
                    {/* Status badge over image */}
                    <div className="absolute top-3 left-3">
                      <motion.span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] xl:text-[11px] font-display font-black tracking-wider shadow-lg whitespace-nowrap"
                        style={{ backgroundColor: cfg.bg, color: cfg.textColor }}
                        animate={cfg.pulse ? { scale: [1, 1.04, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {cfg.label}
                      </motion.span>
                    </div>
                    {/* Active glow on image */}
                    {isActive && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ boxShadow: `inset 0 0 35px ${program.color}35` }}
                      />
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    {/* Day + Time */}
                    <div className="flex items-center justify-between">
                      <span
                        className="font-display font-black text-sm tracking-widest"
                        style={{ color: program.color }}
                      >
                        {program.shortDay}
                      </span>
                      <span className="text-white/40 text-xs font-body font-semibold">
                        {program.timeDisplay}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full" style={{ background: `linear-gradient(to right, ${program.color}50, transparent)` }} />

                    {/* Emoji + Title */}
                    <div className="flex items-start gap-2.5">
                      <motion.span
                        className="text-2xl flex-shrink-0"
                        animate={!isFinished ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {program.emoji}
                      </motion.span>
                      <h3 className="font-display font-black text-white text-lg leading-tight tracking-tight">
                        {program.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-white/40 text-xs sm:text-sm font-body leading-relaxed line-clamp-3 flex-1">
                      {program.description}
                    </p>

                    {/* Category tag */}
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold font-display w-fit"
                      style={{ backgroundColor: `${program.color}18`, color: program.color }}
                    >
                      {program.category}
                    </span>
                  </div>

                  {/* Top accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(to right, ${program.color}, ${program.color}60, transparent)` }}
                  />
                </div>
              </motion.div>
            </Link>
          )
        })}
        </div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          // className="mt-12 rounded-2xl overflow-hidden border border-white/8"
        >
          <img src="/assets/programacionH1.png" alt="Programación semanal Ninja House" className="w-full h-auto object-cover" />
        </motion.div>
      </div>
    </section>
  )
}
