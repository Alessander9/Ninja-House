import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { programsData } from '../../data/programs'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const hoverColorMap: Record<string, string> = {
  'animes-y-ramen': '#7C3AED',     // Morado
  'overhead': '#2563EB',            // Azul
  'freakuencia-m': '#16A34A',       // Verde
  'maldito-plastico': '#EA580C',    // Naranja
  'cine-infarto': '#DC2626',        // Rojo
}

const hiddenProgramIds = new Set(['lanzalo'])

export function ProgramsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const orderedPrograms = programsData
    .filter((program) => !hiddenProgramIds.has(program.id))
    .sort((a, b) => a.dayIndex - b.dayIndex)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.program-card',
        { y: 60, opacity: 0, scale: 0.93 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.programs-grid', start: 'top 80%' },
        }
      )
      gsap.fromTo('.programs-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="programs" ref={sectionRef} className="py-24 px-4 bg-ninja-black relative overflow-hidden">
      {/* Background decoration with red glow */}
      <div
        className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(176,26,25,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="max-w-[1600px] mx-auto relative z-10 px-4 md:px-8">
        {/* Header */}
        <div className="programs-title text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-600/30 rounded-full text-red-500 font-display font-bold text-xs tracking-widest mb-4">
            🎮 NUESTROS PROGRAMAS
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2">
            5 Shows,{' '}
            <span className="text-red-500" style={{ textShadow: '0 0 30px rgba(176,26,25,0.5)' }}>
              1 Dojo
            </span>
          </h2>
          <p className="text-white/40 mt-3 font-body max-w-xl mx-auto">
            Lunes a viernes a las 9:00 PM. Cada programa tiene su propia vibra, todos tienen el sello ninja.
          </p>
        </div>

        {/* Grid adapted to 5 columns on large screens with wider container */}
        <div className="programs-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {orderedPrograms.map((program) => {
            const programUrlId = program.title.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            const hoverColor = hoverColorMap[program.id] || program.color
            return (
              <Link 
                key={program.id} 
                to={`/programa/${programUrlId}`}
                className="program-card block h-full"
              >
                <motion.div
                  className="group relative rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col"
                  style={{
                    background: `linear-gradient(160deg, ${program.color}0a 0%, rgba(21,21,21,0.98) 60%)`,
                    border: `1px solid ${program.color}20`,
                    '--hover-color': hoverColor,
                  } as React.CSSProperties}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    boxShadow: `0 0 35px ${hoverColor}35, 0 20px 40px rgba(0,0,0,0.5)`,
                    borderColor: hoverColor,
                    transition: { duration: 0.22 },
                  }}
                >
                  {/* Top bar */}
                  <div
                    className="h-1 w-full flex-shrink-0"
                    style={{ background: `linear-gradient(to right, ${program.color}, ${program.color}60, transparent)` }}
                  />

                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 flex-shrink-0">
                    <img 
                      src={program.image} 
                      alt={program.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div 
                      className="absolute inset-0" 
                      style={{
                        background: 'linear-gradient(to top, rgba(21, 21, 21, 1) 0%, rgba(21, 21, 21, 0.4) 40%, rgba(21, 21, 21, 0) 100%)'
                      }}
                    />
                    
                    {/* Category floating badge */}
                    <span
                      className="absolute bottom-3 left-3 text-[10px] font-bold font-display px-2 py-0.5 rounded tracking-wider uppercase"
                      style={{ color: program.color, backgroundColor: `${program.color}22`, border: `1px solid ${program.color}33` }}
                    >
                      {program.category}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    {/* Day badge & Time */}
                    <div className="flex items-center justify-between">
                      <motion.span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold font-display tracking-wider uppercase"
                        style={{ backgroundColor: `${program.color}15`, color: program.color, border: `1px solid ${program.color}25` }}
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        {program.badge}
                      </motion.span>
                      <span className="text-white/30 text-[11px] font-body font-semibold">
                        {program.time}
                      </span>
                    </div>

                    {/* Emoji + Title */}
                    <div className="flex items-start gap-2 mt-1">
                      <motion.span
                        className="text-2xl flex-shrink-0"
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                      >
                        {program.emoji}
                      </motion.span>
                      <h3 className="font-display font-black text-white text-base leading-tight group-hover:text-[var(--hover-color)] transition-colors duration-200">
                        {program.title}
                      </h3>
                    </div>

                    {/* Divider */}
                    <div
                      className="h-px w-full my-1"
                      style={{ background: `linear-gradient(to right, ${program.color}30, transparent)` }}
                    />

                    {/* Description */}
                    <p className="text-white/40 text-xs font-body leading-relaxed flex-1">
                      {program.description}
                    </p>

                    {/* CTA on hover */}
                    <div className="flex items-center justify-end mt-2 pt-2 border-t border-white/5">
                      <motion.span
                        className="text-xs font-bold font-display opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0"
                        style={{ color: hoverColor }}
                      >
                        Ver →
                      </motion.span>
                    </div>
                  </div>

                  {/* Bottom glow bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(to right, transparent, ${program.color}60, transparent)` }}
                  />

                  {/* Hover top radial */}
                  <div
                    className="absolute top-0 left-0 right-0 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% -20%, ${hoverColor}25 0%, transparent 70%)` }}
                  />
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
