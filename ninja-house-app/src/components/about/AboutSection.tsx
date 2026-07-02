import { motion } from 'framer-motion'

export function AboutSection() {
  const cards = [
    {
      title: 'Contenido Geek',
      desc: 'Anime, manga, wrestling, cine, series, coleccionables y cultura pop en un solo lugar.',
      icon: '🎮',
      color: '#B01A19' // Rojo base
    },
    {
      title: 'Comunidad Activa',
      desc: 'Una audiencia comprometida que comenta, debate, comparte, compra y participa en vivo.',
      icon: '🔥',
      color: '#BD211F' // Rojo acento
    },
    {
      title: 'Programas en Vivo',
      desc: 'Seis espacios semanales en horario prime time, con debate, talentos y sintonía en tiempo real.',
      icon: '🎙️',
      color: '#C75A58' // Rojo claro apagado
    },
    {
      title: 'Conexión con Marcas',
      desc: 'Una plataforma lista para integrar campañas, patrocinios, unboxings y experiencias comerciales.',
      icon: '📈',
      color: '#AA0B0A' // Rojo oscuro
    }
  ]

  return (
    <section id="about" className="py-24 px-4 bg-ninja-dark relative overflow-hidden">
      {/* Halftone and radial background highlights */}
      <div className="absolute inset-0 halftone-bg opacity-15 pointer-events-none" />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(176,26,25,0.06) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-600/30 rounded-full text-red-500 font-display font-bold text-xs tracking-widest mb-4">
            🥷 EL TEMPLO GEEK
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2 leading-none">
            ¿Qué es{' '}
            <span className="text-red-500" style={{ textShadow: '0 0 35px rgba(176,26,25,0.45)' }}>
              Ninja House
            </span>
            ?
          </h2>
          <p className="text-white/60 mt-6 font-body text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            Ninja House es una plataforma de influencia geek que produce y amplifica contenido sobre anime, coleccionables, lucha libre, cine y cultura pop. Conectamos marcas con una comunidad activa y altamente comprometida de fans y coleccionistas a través de formatos virales, programas en vivo y experiencias digitales.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <motion.div
              key={card.title}
              className="p-6 rounded-2xl bg-ninja-card border border-white/5 flex flex-col gap-4 relative overflow-hidden group"
              whileHover={{ y: -8, borderColor: `${card.color}50` }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Highlight top bar with card color */}
              <div 
                className="absolute top-0 left-0 right-0 h-1" 
                style={{ backgroundColor: card.color }}
              />

              {/* Icon */}
              <span className="text-3xl bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {card.icon}
              </span>

              {/* Title */}
              <h3 className="font-display font-black text-lg text-white">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-white/40 text-xs md:text-sm font-body leading-relaxed">
                {card.desc}
              </p>

              {/* Subtle background glow on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${card.color}05 0%, transparent 70%)`
                }}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
