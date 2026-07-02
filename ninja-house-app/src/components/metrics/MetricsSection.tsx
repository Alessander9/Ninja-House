import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { metricsData } from '../../data/metrics'

gsap.registerPlugin(ScrollTrigger)

// Real platform SVG icons
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
)
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
  </svg>
)
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M8 5v14l11-7z"/>
  </svg>
)
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
)

const metricIcons: Record<string, React.ComponentType> = {
  'yt-subs': YouTubeIcon,
  'yt-videos': PlayIcon,
  'yt-views': EyeIcon,
  'ig-followers': InstagramIcon,
  'tiktok-followers': TikTokIcon,
  'fb-followers': FacebookIcon,
}

function AnimatedCounter({ end, suffix, color }: { end: number; suffix: string; color: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!inView) return
    let raf: number
    const startTime = performance.now()
    const duration = 2200
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      setCount(Math.floor(easeOut(t) * end))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setCount(end)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, end])

  return (
    <span ref={ref} className="tabular-nums" style={{ color }}>
      {count}{suffix}
      <span className="text-2xl">+</span>
    </span>
  )
}

export function MetricsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.metric-card',
        { y: 60, opacity: 0, scale: 0.88 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: 0.12,
          duration: 0.75,
          ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '.metrics-grid', start: 'top 80%' },
        }
      )
      gsap.fromTo(
        '.metrics-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="metrics"
      ref={sectionRef}
      className="py-28 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #151515 0%, rgba(183,31,29,0.05) 50%, #151515 100%)' }}
    >
      {/* Decorative BG */}
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(176,26,25,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(170,11,10,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="metrics-title text-center mb-20">
          <span className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-600/30 rounded-full text-red-500 font-display font-bold text-xs tracking-widest mb-4">
            📊 AUTORIDAD NINJA
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2">
            Números que{' '}
            <span className="text-red-500" style={{ textShadow: '0 0 35px rgba(176,26,25,0.45)' }}>
              Hablan
            </span>
          </h2>
          <p className="text-white/40 mt-4 font-body max-w-lg mx-auto text-base">
            La comunidad ninja crece cada día. Cifras reales, impacto real.
          </p>
        </div>

        {/* Metrics grid — centered to match the 4 cards */}
        <div className="metrics-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto justify-center">
          {metricsData.map((metric, i) => {
            const IconComponent = metricIcons[metric.id]
            return (
              <motion.div
                key={metric.id}
                className="metric-card group relative"
                whileHover={{ y: -8, scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              >
                {/* Card */}
                <div
                  className="relative h-full rounded-2xl overflow-hidden flex flex-col p-6 gap-4 items-center text-center lg:items-start lg:text-left"
                  style={{
                    background: `linear-gradient(145deg, ${metric.color}0d 0%, rgba(21,21,21,0.95) 60%)`,
                    border: `1px solid ${metric.color}25`,
                    boxShadow: `0 4px 24px rgba(0,0,0,0.4)`,
                  }}
                >
                  {/* Glowing top edge */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(to right, transparent, ${metric.color}80, transparent)` }}
                  />

                  {/* Icon wrapper */}
                  <motion.div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${metric.color}18`,
                      color: metric.color,
                      boxShadow: `0 0 20px ${metric.color}20`,
                    }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.4 }}
                  >
                    {IconComponent && <IconComponent />}
                  </motion.div>

                  {/* Platform label */}
                  <div className="flex items-center justify-center lg:justify-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metric.color }} />
                    <span className="text-xs font-display font-bold tracking-widest" style={{ color: `${metric.color}aa` }}>
                      {metric.platform.toUpperCase()}
                    </span>
                  </div>

                  {/* Counter — large & bold */}
                  <div className="w-full">
                    <p className="font-display font-black text-4xl leading-none tracking-tight">
                      <AnimatedCounter end={metric.value} suffix={metric.suffix} color={metric.color} />
                    </p>
                    <p className="text-white font-display font-bold text-sm mt-1">{metric.label}</p>
                    <p className="text-white/30 text-xs font-body mt-0.5">{metric.description}</p>
                  </div>

                  {/* Trend indicator */}
                  <div
                    className="flex items-center justify-center lg:justify-start gap-1.5 mt-auto pt-3 border-t w-full"
                    style={{ borderColor: `${metric.color}18` }}
                  >
                    <motion.span
                      className="text-xs font-bold"
                      style={{ color: metric.color }}
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ↑ Creciendo
                    </motion.span>
                  </div>

                  {/* Hover glow overlay */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${metric.color}10 0%, transparent 60%)` }}
                  />

                  {/* Hover border glow */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: `inset 0 0 0 1px ${metric.color}50, 0 0 30px ${metric.color}20` }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/30 text-sm font-body mb-4">
            Únete a la comunidad ninja más grande de la región
          </p>
          <motion.a
            href="https://www.youtube.com/channel/UCF2hgWHhLQx3ZJDsnKU8gZg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-ninja-green text-ninja-black font-display font-black text-base rounded-xl"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(103,185,70,0.5)', y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>▶</span>
            <span>Suscríbete en YouTube</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
