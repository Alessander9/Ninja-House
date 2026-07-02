import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { collectiblesData } from '../../data/collectibles'

gsap.registerPlugin(ScrollTrigger)

export function CollectiblesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.collectibles-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' } }
      )
      gsap.fromTo('.collectible-card',
        { y: 60, opacity: 0, scale: 0.93 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: 0.15,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="collectibles" ref={sectionRef} className="py-24 px-4 bg-ninja-dark relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 halftone-bg opacity-15 pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(103,185,70,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="collectibles-title text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-ninja-green/10 border border-ninja-green/30 rounded-full text-ninja-green font-display font-bold text-xs tracking-widest mb-4">
            🛍️ EDICIÓN LIMITADA
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2">
            Dojo <span className="text-ninja-green" style={{ textShadow: '0 0 30px rgba(103,185,70,0.4)' }}>Drops</span>
          </h2>
          <p className="text-white/40 mt-3 font-body max-w-xl mx-auto">
            Coleccionables oficiales y drops de ropa exclusiva del Dojo. Diseños únicos creados para verdaderos ninjas del entretenimiento.
          </p>
        </div>

        {/* Cards Grid */}
        <div ref={cardsRef} className="collectibles-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {collectiblesData.map((item) => {
            return (
              <div key={item.id} className="collectible-card block h-full">
                <motion.div
                  className="group relative rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col bg-ninja-black/90 border border-white/5"
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    boxShadow: `0 0 40px ${item.color}20, 0 20px 40px rgba(0,0,0,0.6)`,
                    borderColor: item.color,
                    transition: { duration: 0.22 },
                  }}
                >
                  {/* Category overlay */}
                  <span
                    className="absolute top-4 left-4 z-20 text-[10px] font-bold font-display px-2.5 py-1 rounded-lg tracking-widest uppercase"
                    style={{ color: item.color, backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}
                  >
                    {item.category}
                  </span>

                  {/* Image container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-900 flex-shrink-0 border-b border-white/5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-ninja-black via-transparent to-transparent opacity-80"
                    />
                  </div>

                  {/* Card Info */}
                  <div className="p-6 flex flex-col gap-4 flex-1">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase font-display"
                        style={{
                          backgroundColor: item.status === 'available' ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)',
                          color: item.status === 'available' ? '#22C55E' : '#F97316',
                          border: item.status === 'available' ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(249,115,22,0.2)'
                        }}
                      >
                        {item.status === 'available' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping" />}
                        {item.statusDisplay}
                      </span>
                      <span className="text-white font-display font-black text-lg">
                        {item.price}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-black text-white text-xl leading-tight group-hover:text-ninja-green transition-colors duration-200">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/40 text-xs font-body leading-relaxed flex-1">
                      {item.description}
                    </p>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] font-display font-bold text-white/30 group-hover:text-white/50 transition-colors">
                        {item.status === 'available' ? 'Comprar ahora' : 'Próximamente'}
                      </span>
                      <motion.div
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 group-hover:border-white/30"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-white text-xs font-bold">→</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Top line accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(to right, ${item.color}, ${item.color}30, transparent)` }}
                  />

                  {/* Hover bottom radial */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% 120%, ${item.color}15 0%, transparent 70%)` }}
                  />
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
