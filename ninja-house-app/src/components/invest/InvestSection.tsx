import { Link } from 'react-router-dom'
import { investmentBenefits, sponsorFormats } from '../../data/investment'

export function InvestSection() {
  // Take first 3 benefits and first 3 formats for the home section preview
  const benefitsPreview = investmentBenefits.slice(0, 3)
  const formatsPreview = sponsorFormats.slice(0, 3)

  return (
    <section id="invest-section" className="py-24 px-4 bg-ninja-dark relative overflow-hidden">
      {/* Decorative Halftone Background */}
      <div className="absolute inset-0 halftone-bg opacity-15 pointer-events-none" />
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(176,26,25,0.1) 0%, transparent 70%)',
          filter: 'blur(90px)'
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(90,40,122,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-600/30 rounded-full text-red-500 font-display font-bold text-xs tracking-widest mb-4">
            💼 AUSPICIOS & MARCAS
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2 leading-tight">
            Lleva tu Marca al{' '}
            <span className="text-red-500" style={{ textShadow: '0 0 30px rgba(176,26,25,0.45)' }}>
              Universo Geek
            </span>
          </h2>
          <p className="text-white/40 mt-4 font-body max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Tu marca no necesita interrumpir la conversación. Necesita formar parte de ella. Conectamos productos, experiencias y campañas con una comunidad activa.
          </p>
        </div>

        {/* Two-Column Pitch Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Panel: Pitch Copy */}
          <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
            <h3 className="font-display font-black text-2xl md:text-3xl text-white">
              ¿Por qué anunciar en <span className="text-red-500">Ninja House Show</span>?
            </h3>
            <p className="text-white/60 text-sm md:text-base font-body leading-relaxed">
              Ninja House conecta productos, experiences y campañas con una comunidad geek activa que comenta, comparte, consume, colecciona y participa cada semana en horario prime time.
            </p>
            <p className="text-white/60 text-sm md:text-base font-body leading-relaxed">
              Con presencia multiplataforma, seis programas en vivo y una audiencia segmentada por intereses, Ninja House es un canal estratégico para marcas que quieren entrar al universo geek con credibilidad, contenido y comunidad.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4 w-full">
              <Link 
                to="/invierte"
                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-display font-black text-sm rounded-xl transition-all shadow-lg hover:scale-105"
                style={{ boxShadow: '0 0 25px rgba(176,26,25,0.3)' }}
              >
                🤝 Quiero ser auspiciador
              </Link>
              <Link 
                to="/media-kit"
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-display font-bold text-sm rounded-xl transition-all"
              >
                📊 Ver Media Kit Comercial
              </Link>
            </div>
          </div>

          {/* Right Panel: Value Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefitsPreview.map((benefit) => (
              <div 
                key={benefit.id}
                className="p-5 rounded-2xl bg-ninja-card border border-white/5 hover:border-red-500/20 transition-all flex flex-col gap-3 group"
              >
                <span className="text-3xl bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </span>
                <h4 className="font-display font-black text-sm text-white">{benefit.title}</h4>
                <p className="text-white/40 text-xs font-body leading-relaxed">{benefit.description}</p>
              </div>
            ))}
            <div className="p-5 rounded-2xl bg-red-600/5 border border-red-500/10 flex flex-col justify-center items-center text-center gap-2">
              <span className="text-2xl text-red-500">📈</span>
              <h4 className="font-display font-black text-sm text-white">Y mucho más...</h4>
              <p className="text-white/40 text-xs font-body leading-relaxed">
                6 programas semanales altamente segmentados.
              </p>
              <Link to="/invierte" className="text-xs font-display font-bold text-red-500 hover:underline mt-1">
                Conocer todos los pilares →
              </Link>
            </div>
          </div>
        </div>

        {/* Sponsor Formats Highlight */}
        <div className="border-t border-white/5 pt-16">
          <h3 className="font-display font-black text-xl text-center text-white/80 mb-10 tracking-widest uppercase">
            Formatos Comerciales Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formatsPreview.map((format) => (
              <div 
                key={format.id}
                className="p-6 rounded-2xl bg-gradient-to-br from-ninja-card to-neutral-900 border border-white/5 hover:border-red-500/20 transition-all flex flex-col gap-4 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-3 bg-red-600/10 text-red-500 font-display font-bold text-[9px] tracking-wider rounded-bl-xl uppercase border-l border-b border-red-500/15">
                  {format.badge}
                </div>
                <h4 className="font-display font-black text-base text-white mt-2 group-hover:text-red-500 transition-colors">
                  {format.title}
                </h4>
                <p className="text-white/40 text-xs md:text-sm font-body leading-relaxed">
                  {format.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/invierte" className="font-display font-bold text-sm text-white/50 hover:text-red-500 hover:underline transition-all">
              Explorar todos los formatos comerciales (Branded Content, Menciones, Placement...) y auspiciar →
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
