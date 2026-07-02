import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { programsData } from '../data/programs'
import ScrollStack, { ScrollStackItem } from '../components/ui/ScrollStack'

// Filter tags configuration mapping
const categories = [
  { label: 'Todos', value: 'all' },
  { label: 'Anime', value: 'Anime' },
  { label: 'Wrestling', value: 'Wrestling' },
  { label: 'Cultura Pop', value: 'Cultura' },
  { label: 'Coleccionismo', value: 'Coleccionismo' },
  { label: 'Cine', value: 'Cine' }
]

// Show-specific color overrides
const hoverColorMap: Record<string, string> = {
  'animes-y-ramen': '#7C3AED',     // Morado
  'overhead': '#2563EB',            // Azul
  'freakuencia-m': '#16A34A',       // Verde
  'maldito-plastico': '#EA580C',    // Naranja
  'cine-infarto': '#DC2626',        // Rojo
}

const hiddenProgramIds = new Set(['lanzalo'])

export function ProgramsPage() {
  const [selectedCat, setSelectedCat] = useState('all')

  // Hide scrollbar on programs subpage to restrict interaction to mouse wheel / trackpad scrolling
  useEffect(() => {
    document.documentElement.classList.add('no-scrollbar')
    document.body.classList.add('no-scrollbar')
    return () => {
      document.documentElement.classList.remove('no-scrollbar')
      document.body.classList.remove('no-scrollbar')
    }
  }, [])

  const availablePrograms = programsData
    .filter((prog) => !hiddenProgramIds.has(prog.id))
    .sort((a, b) => a.dayIndex - b.dayIndex)
  const filteredPrograms = selectedCat === 'all'
    ? availablePrograms
    : availablePrograms.filter((prog) => {
        const cat = prog.category.toLowerCase()
        if (selectedCat === 'Anime' && cat.includes('anime')) return true
        if (selectedCat === 'Wrestling' && cat.includes('lucha')) return true
        if (selectedCat === 'Cultura' && cat.includes('cultura pop')) return true
        if (selectedCat === 'Coleccionismo' && cat.includes('coleccionismo')) return true
        if (selectedCat === 'Cine' && cat.includes('cine')) return true
        return false
      })

  return (
    <div className="min-h-screen bg-ninja-black text-white pt-28 pb-20 relative overflow-hidden">
      {/* Background glow effects */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(103,185,70,0.08) 0%, transparent 70%)', filter: 'blur(90px)' }}
      />
      <div 
        className="absolute top-1/2 left-0 w-[400px] h-[400px] pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(176,26,25,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <div className="absolute inset-0 halftone-bg opacity-15 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumb / Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white font-display text-sm font-bold mb-8 group">
          <span className="text-ninja-green group-hover:text-white transition-colors">←</span>
          <span>Volver al Inicio</span>
        </Link>

        {/* Hero Section */}
        <div className="mb-14 text-center">
          <span className="inline-block px-4 py-1.5 bg-ninja-green/10 border border-ninja-green/30 rounded-full text-ninja-green font-display font-bold text-xs tracking-widest mb-4">
            📺 PARRILLA DIGITAL
          </span>
          <h1 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight">
            Programas de <span className="text-ninja-green">Ninja House</span>
          </h1>
          <p className="text-white/40 mt-4 font-body max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Cinco producciones activas transmitidas en vivo. Explora por categoría, conoce a los hosts y descubre el enfoque de cada show.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCat(cat.value)}
              className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs md:text-sm transition-all border ${
                selectedCat === cat.value
                  ? 'bg-ninja-green border-ninja-green text-ninja-black shadow-lg shadow-ninja-green/20'
                  : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Programs Scroll Stack Container */}
        <ScrollStack
          useWindowScroll={true}
          key={selectedCat}
          itemDistance={80}
          itemScale={0.02}
          itemStackDistance={35}
          stackPosition="15%"
          baseScale={0.9}
          rotationAmount={0.5}
          blurAmount={1}
        >
          {filteredPrograms.map((prog) => {
            const programUrlId = prog.slug
            const showColor = hoverColorMap[prog.id] || prog.color
            return (
              <ScrollStackItem key={prog.id}>
                {/* Visual card content */}
                <div 
                  className="w-full h-full min-h-[22rem] md:min-h-[28rem] flex flex-col md:flex-row relative z-10 border overflow-hidden transition-[border-color,box-shadow,background-color] duration-300 rounded-[24px]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(20,20,20,0.98) 0%, rgba(10,10,10,0.99) 100%)',
                    borderColor: `${showColor}30`,
                    boxShadow: `0 20px 45px rgba(0,0,0,0.6)`,
                    WebkitMaskImage: '-webkit-radial-gradient(white, white)'
                  }}
                >
                  {/* Top color accent strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 z-20"
                    style={{ background: `linear-gradient(to right, ${showColor}, ${showColor}30, transparent)` }}
                  />

                  {/* Left Column: Poster Image */}
                  <Link
                    to={`/programa/${programUrlId}`}
                    className="w-full md:w-2/5 relative min-h-[8.5rem] md:min-h-full overflow-hidden bg-neutral-900 border-b md:border-b-0 md:border-r border-white/5 flex-shrink-0 cursor-pointer block"
                    style={{
                      transform: 'translate3d(0, 0, 0)',
                      WebkitTransform: 'translate3d(0, 0, 0)',
                      WebkitMaskImage: '-webkit-radial-gradient(white, white)'
                    }}
                  >
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-full object-cover md:transition-transform md:duration-700 md:hover:scale-105"
                      style={{
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/85 via-black/20 to-transparent" />
                    
                    {/* Day / Schedule tag */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6">
                      <span 
                        className="px-2.5 py-1 md:px-3.5 md:py-1.5 rounded-lg text-[9px] md:text-xs font-display font-black tracking-widest text-white shadow-lg"
                        style={{ backgroundColor: showColor }}
                      >
                        {prog.day.toUpperCase()}
                      </span>
                    </div>

                    {/* Emoji Overlay */}
                    <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-black/60 w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center border border-white/10 text-xl md:text-2xl backdrop-blur-sm shadow-xl">
                      {prog.emoji}
                    </div>
                  </Link>

                  {/* Right Column: Content Details */}
                  <div className="flex-1 p-4 md:p-8 flex flex-col gap-2.5 md:gap-5 justify-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] md:text-[10px] font-display font-bold uppercase tracking-widest" style={{ color: showColor }}>
                        {prog.category}
                      </span>
                      <Link to={`/programa/${programUrlId}`} className="group/title">
                        <h3 className="font-display font-black text-2xl md:text-4xl text-white tracking-tight leading-none transition-colors group-hover/title:text-red-500" style={{ textShadow: `0 0 35px ${showColor}40` }}>
                          {prog.title}
                        </h3>
                      </Link>
                    </div>

                    <p className="text-white/60 text-xs md:text-sm font-body leading-relaxed max-w-xl line-clamp-2 md:line-clamp-none">
                      {prog.description}
                    </p>

                    {/* Details table list */}
                    <div className="flex flex-wrap gap-2 py-2 border-t border-b border-white/5 text-[10px] md:text-sm font-display font-bold">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg border border-white/5">
                        <span className="text-white/40">⏰ Horario:</span>
                        <span className="text-white">{prog.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg border border-white/5 max-w-xs">
                        <span className="text-white/40">🎙️ Talentos:</span>
                        <span className="text-white truncate">{prog.talents.join(', ')}</span>
                      </div>
                    </div>

                    {/* Bottom link button */}
                    <div className="pt-1 flex flex-wrap gap-4">
                      <Link
                        to={`/programa/${programUrlId}`}
                        className="px-5 py-2 md:px-6 md:py-3 rounded-xl font-display font-black text-[10px] md:text-xs text-center border transition-all text-white flex items-center justify-center gap-2 hover:scale-105"
                        style={{ borderColor: `${showColor}aa`, backgroundColor: `${showColor}15` }}
                      >
                        <span>Ver detalles y episodios</span>
                        <span style={{ color: showColor }}>→</span>
                      </Link>
                    </div>
                  </div>

                  {/* Scanline CRT overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
                      mixBlendMode: 'multiply',
                    }}
                  />
                  
                  {/* Subtle color glow back gradient */}
                  <div 
                    className="absolute bottom-0 right-0 w-80 h-80 opacity-20 pointer-events-none rounded-full"
                    style={{ background: `radial-gradient(circle, ${showColor} 0%, transparent 70%)`, filter: 'blur(50px)' }}
                  />
                </div>
              </ScrollStackItem>
            )
          })}
        </ScrollStack>

      </div>
    </div>
  )
}
