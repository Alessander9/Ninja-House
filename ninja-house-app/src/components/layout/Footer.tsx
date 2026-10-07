import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'

// SVG Social Icons
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.378 0 0 5.378 0 12s5.378 12 12 12 12-5.378 12-12S18.622 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.3-1.4-5.2-1.7-8.6-.9-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 3.7-.8 7-.5 9.6 1.1.3.1.4.5.3.8zm1.5-3.3c-.3.4-.8.5-1.2.3-2.6-1.6-6.6-2.1-9.7-1.1-.5.2-1-.1-1.1-.6-.2-.5.1-1 .6-1.1 3.6-1.1 8-.6 11 1.2.4.2.5.8.3 1.2zM19 10.2C15.8 8.3 10.4 8.1 7.3 9c-.5.2-1-.1-1.2-.6-.2-.5.1-1 .6-1.2 3.6-1.1 9.5-.9 13.2 1.3.5.3.6.9.3 1.4-.3.4-.9.6-1.2.3z"/>
  </svg>
)

const TwitchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const socials = [
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCF2hgWHhLQx3ZJDsnKU8gZg?sub_confirmation=1', Icon: YouTubeIcon, color: '#FF0000' },
  { label: 'Instagram', href: 'https://instagram.com/ninjahouseshow', Icon: InstagramIcon, color: '#E1306C' },
  { label: 'TikTok', href: 'https://tiktok.com/@ninjahouseshow', Icon: TikTokIcon, color: '#69C9D0' },
  { label: 'Facebook', href: 'https://facebook.com/NinjaHouseshow', Icon: FacebookIcon, color: '#1877F2' },
  { label: 'Spotify', href: 'https://podcasters.spotify.com/pod/show/ninjahouseshow', Icon: SpotifyIcon, color: '#1ED760' },
  { label: 'Twitch', href: 'https://twitch.tv/ninjahouseshow', Icon: TwitchIcon, color: '#9146FF' },
  { label: 'Twitter/X', href: 'https://twitter.com/ninjahouseshow', Icon: XIcon, color: '#ffffff' },
]

export function Footer() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('contacto@ninjahouse.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-ninja-black border-t border-white/5 pt-20 pb-10 px-6 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(103,185,70,0.06) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(90,40,122,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Diagonal Line Design Accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-ninja-green via-ninja-purple to-ninja-yellow opacity-40" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Logo */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <motion.img
                src="/assets/NinjaLOGO.png"
                alt="Ninja House"
                className="h-16 w-auto object-contain"
                whileHover={{ scale: 1.05, rotate: -3 }}
              />
              <div>
                <span className="font-display font-black text-xl text-white tracking-widest block leading-tight">
                  NINJA <span className="text-red-600">HOUSE</span>
                </span>
                <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-display">
                  Dojo Geek Oficial
                </span>
              </div>
            </div>
            <p className="text-white/40 text-xs font-body leading-relaxed max-w-sm">
              Tu canal de referencia sobre gaming, anime, cultura pop y coleccionables. Sin filtros, con la mejor comunidad.
            </p>
            
            {/* Dojo Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mt-2">
              <motion.span 
                className="w-2 h-2 rounded-full bg-ninja-green"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[10px] font-display font-bold text-white/60 tracking-wider">
                DOJO STATUS: ONLINE
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-display font-black text-sm text-white tracking-widest uppercase mb-6 relative w-fit">
              Navegación
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-ninja-green rounded-full" />
            </h4>
            <ul className="flex flex-col gap-3 font-display text-sm text-white/55">
              {[
                { label: 'Inicio', href: '#hero' },
                // { label: 'Dojo Drops', href: '#collectibles' },
                { label: 'Programas', href: '#programs' },
                { label: 'Métricas de Autoridad', href: '#metrics' },
                { label: 'Redes Sociales', href: '#social' }
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="hover:text-ninja-green hover:pl-2 transition-all duration-300 inline-flex items-center gap-1 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-ninja-green">›</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Shows */}
          <div>
            <h4 className="font-display font-black text-sm text-white tracking-widest uppercase mb-6 relative w-fit">
              Nuestros Shows
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-ninja-purple rounded-full" />
            </h4>
            <ul className="flex flex-col gap-3 font-display text-sm text-white/55">
              {[
                { label: '🍜 Lunes: Animes y Ramen', href: '/programa/animes-y-ramen' },
                { label: '🌐 Martes: Overhead', href: '/programa/overhead' },
                { label: '🎙️ Miércoles: FrikisDeM', href: '/programa/frikisdem' },
                { label: '🧸 Jueves: Maldito Plástico', href: '/programa/maldito-plastico' },
                { label: '🎬 Viernes: Cine Infarto', href: '/programa/cine-infarto' },
                { label: '🕯️ Sábado: Plan Oscuro', href: '/programa/plan-oscuro' }
              ].map((show) => (
                <li key={show.label}>
                  <Link 
                    to={show.href} 
                    className="hover:text-ninja-purple hover:pl-2 transition-all duration-300 inline-block"
                  >
                    {show.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact / Newsletter */}
          <div>
            <h4 className="font-display font-black text-sm text-white tracking-widest uppercase mb-6 relative w-fit">
              Contacto Dojo
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-ninja-yellow rounded-full" />
            </h4>
            <p className="text-white/40 text-xs font-body leading-relaxed mb-4">
              ¿Quieres colaborar o tienes alguna propuesta para el canal? ¡Escríbenos directamente!
            </p>
            
            {/* Copy Email Button */}
            <button
              onClick={handleCopyEmail}
              className="flex items-center justify-between w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-ninja-green/50 hover:bg-ninja-green/5 rounded-xl transition-all duration-300 text-left font-display group"
            >
              <div className="flex flex-col">
                <span className="text-[10px] text-white/30 tracking-wider">EMAIL DE CONTACTO</span>
                <span className="text-xs text-white/80 font-bold group-hover:text-ninja-green transition-colors">
                  contacto@ninjahouse.com
                </span>
              </div>
              <span className="text-xs text-ninja-green font-bold">
                {copied ? '¡Copiado!' : 'Copiar'}
              </span>
            </button>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom row: copyright, socials, back to top */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-white/30 text-xs font-body">
              © {new Date().getFullYear()} Ninja House. Todos los derechos reservados.
            </p>
            <p className="text-[10px] text-white/20 mt-1 font-body">
              Desarrollado con estética urbana & neón geek.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 transition-all"
                whileHover={{ 
                  scale: 1.15, 
                  rotate: 8, 
                  borderColor: s.color, 
                  color: s.color,
                  boxShadow: `0 0 15px ${s.color}40`,
                  backgroundColor: `${s.color}10` 
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              >
                <s.Icon />
              </motion.a>
            ))}
          </div>

          {/* Back to top */}
          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-ninja-green/50 hover:bg-ninja-green/5 transition-all text-xs font-display text-white/60 hover:text-ninja-green group"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Subir al Dojo</span>
            <motion.span 
              className="inline-block"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ▲
            </motion.span>
          </motion.button>

        </div>
      </div>
    </footer>
  )
}
