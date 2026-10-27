import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function NotFoundPage() {
  useEffect(() => {
    document.title = '404: Dojo Extraviado | Ninja House'
    window.scrollTo(0, 0)
  }, [])

  const programs = [
    { name: 'Animes y Ramen', path: '/programa/animes-y-ramen', color: '#10B981', emoji: '🍜' },
    { name: 'Over Head', path: '/programa/overhead', color: '#38BDF8', emoji: '🤼' },
    { name: 'Frikis de M', path: '/programa/frikis-de-m', color: '#22C55E', emoji: '🎮' },
    { name: 'Maldito Plástico', path: '/programa/maldito-plastico', color: '#F97316', emoji: '🛒' },
    { name: 'Cine Infarto', path: '/programa/cine-infarto', color: '#EF4444', emoji: '🎬' },
    { name: 'El Plano Oscuro', path: '/programa/el-plano-oscuro', color: '#A855F7', emoji: '🕯️' },
  ]

  return (
    <div className="min-h-screen bg-ninja-black text-white flex items-center justify-center pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(184,40,40,0.12) 0%, transparent 70%)',
          filter: 'blur(130px)'
        }}
      />
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        
        {/* Shuriken / 404 Badge */}
        <motion.div
          initial={{ scale: 0.8, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="inline-flex items-center justify-center mb-6"
        >
          <span className="text-7xl sm:text-9xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-ninja-red via-ninja-green to-white drop-shadow-[0_0_35px_rgba(184,40,40,0.4)]">
            404
          </span>
        </motion.div>

        <h1 className="text-2xl sm:text-4xl font-display font-black text-white mb-3">
          ¡Te Has Perdido en las Sombras!
        </h1>
        <p className="text-white/50 text-sm sm:text-base font-body max-w-lg mx-auto mb-8">
          La habitación del dojo a la que intentas ingresar fue ocultada por técnicas ninja o ya no existe. Elige un camino para regresar:
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            to="/"
            className="px-6 py-3.5 rounded-xl bg-ninja-green text-ninja-black font-display font-black text-sm tracking-wider uppercase hover:bg-ninja-green/90 transition-all shadow-lg shadow-ninja-green/20"
          >
            🏠 Volver a la Entrada Principal
          </Link>
          <Link
            to="/contacto"
            className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-display font-bold text-sm tracking-wider uppercase hover:bg-white/10 hover:border-white/20 transition-all"
          >
            ✉️ Reportar un Error
          </Link>
        </div>

        {/* Quick jump to programs */}
        <div className="border-t border-white/10 pt-8">
          <h2 className="text-xs font-display font-bold uppercase tracking-widest text-white/40 mb-4">
            O salta directamente a tu programa favorito:
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {programs.map((p) => (
              <Link
                key={p.path}
                to={p.path}
                className="p-3 rounded-xl bg-ninja-card border border-white/5 hover:border-white/20 text-xs font-display font-bold text-white/80 hover:text-white transition-all flex items-center justify-center gap-2 group"
              >
                <span>{p.emoji}</span>
                <span className="group-hover:underline">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
