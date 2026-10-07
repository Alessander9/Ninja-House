import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Real SVG brand icons
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 0C5.378 0 0 5.378 0 12s5.378 12 12 12 12-5.378 12-12S18.622 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.3-1.4-5.2-1.7-8.6-.9-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 3.7-.8 7-.5 9.6 1.1.3.1.4.5.3.8zm1.5-3.3c-.3.4-.8.5-1.2.3-2.6-1.6-6.6-2.1-9.7-1.1-.5.2-1-.1-1.1-.6-.2-.5.1-1 .6-1.1 3.6-1.1 8-.6 11 1.2.4.2.5.8.3 1.2zM19 10.2C15.8 8.3 10.4 8.1 7.3 9c-.5.2-1-.1-1.2-.6-.2-.5.1-1 .6-1.2 3.6-1.1 9.5-.9 13.2 1.3.5.3.6.9.3 1.4-.3.4-.9.6-1.2.3z"/>
  </svg>
)

const TwitchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const socials = [
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@ninjahouseshow',
    description: 'Nuestra sede principal. Shows completos, shorts virales y directos diarios.',
    Icon: YouTubeIcon,
    color: '#FF0000',
    bg: 'rgba(255,0,0,0.06)',
    border: 'rgba(255,0,0,0.22)',
    borderHover: '#FF0000',
    stat: '85K+ Suscriptores',
    statSub: 'En Vivo 9:00 PM',
    href: 'https://www.youtube.com/channel/UCF2hgWHhLQx3ZJDsnKU8gZg?sub_confirmation=1',
    cta: 'Suscribirse',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@ninjahouseshow',
    description: 'Detrás de cámaras, clips exclusivos y novedades del dojo.',
    Icon: InstagramIcon,
    color: '#E1306C',
    bg: 'rgba(225,48,108,0.06)',
    border: 'rgba(225,48,108,0.2)',
    borderHover: '#E1306C',
    stat: 'Contenido diario',
    statSub: 'Stories y Reels',
    href: 'https://instagram.com/ninjahouseshow',
    cta: 'Seguir',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@ninjahouseshow',
    description: 'Los momentos más freaks, divertidos y virales del show.',
    Icon: TikTokIcon,
    color: '#69C9D0',
    bg: 'rgba(105,201,208,0.06)',
    border: 'rgba(105,201,208,0.2)',
    borderHover: '#69C9D0',
    stat: 'Clips semanales',
    statSub: 'Formato corto',
    href: 'https://tiktok.com/@ninjahouseshow',
    cta: 'Seguir',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'NinjaHouseshow',
    description: 'Comunidad expandida con discusiones, memes y transmisiones.',
    Icon: FacebookIcon,
    color: '#1877F2',
    bg: 'rgba(24,119,242,0.06)',
    border: 'rgba(24,119,242,0.2)',
    borderHover: '#1877F2',
    stat: 'Comunidad Facebook',
    statSub: 'Publicaciones y Updates',
    href: 'https://facebook.com/NinjaHouseshow',
    cta: 'Seguir',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    handle: 'ninjahouseshow',
    description: 'Escucha todos nuestros episodios en formato podcast donde quieras.',
    Icon: SpotifyIcon,
    color: '#1ED760',
    bg: 'rgba(30,215,96,0.06)',
    border: 'rgba(30,215,96,0.2)',
    borderHover: '#1ED760',
    stat: 'Episodios completos',
    statSub: 'Podcast de audio',
    href: 'https://podcasters.spotify.com/pod/show/ninjahouseshow',
    cta: 'Escuchar',
  },
  {
    id: 'twitch',
    name: 'Twitch',
    handle: 'ninjahouseshow',
    description: 'Streams semanales interactivos con chat en vivo de la comunidad.',
    Icon: TwitchIcon,
    color: '#9146FF',
    bg: 'rgba(145,70,255,0.06)',
    border: 'rgba(145,70,255,0.2)',
    borderHover: '#9146FF',
    stat: 'Transmisión en vivo',
    statSub: 'Streams de comunidad',
    href: 'https://twitch.tv/ninjahouseshow',
    cta: 'Seguir',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    handle: '@ninjahouseshow',
    description: 'Opiniones rápidas, noticias de última hora y memes al instante.',
    Icon: XIcon,
    color: '#ffffff',
    bg: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.12)',
    borderHover: '#ffffff',
    stat: 'Updates al minuto',
    statSub: 'Hilos y opiniones',
    href: 'https://twitter.com/ninjahouseshow',
    cta: 'Seguir',
  },
]

export function SocialSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.social-card',
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.08,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.socials-grid', start: 'top 80%' },
        }
      )
      gsap.fromTo(
        '.social-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="social" ref={sectionRef} className="py-24 px-4 bg-ninja-dark relative overflow-hidden">
      <div className="absolute inset-0 halftone-bg opacity-15 pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(103,185,70,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="social-title text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-ninja-green/10 border border-ninja-green/30 rounded-full text-ninja-green font-display font-bold text-xs tracking-widest mb-4">
            🌐 REDES SOCIALES
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2">
            Síguenos en{' '}
            <span className="text-ninja-green" style={{ textShadow: '0 0 30px rgba(103,185,70,0.4)' }}>
              Todas
            </span>
          </h2>
          <p className="text-white/40 mt-3 font-body max-w-xl mx-auto">
            Estamos en todas las plataformas. Elige la tuya y únete al dojo.
          </p>
        </div>

        {/* Grid 7 cards */}
        <div className="socials-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {socials.map((s) => (
            <motion.a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card group relative rounded-2xl p-5 flex flex-col gap-4 cursor-pointer overflow-hidden"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
              whileHover={{
                y: -8,
                scale: 1.03,
                boxShadow: `0 0 35px ${s.color}28, 0 20px 40px rgba(0,0,0,0.5)`,
                borderColor: s.color,
                transition: { duration: 0.22 },
              }}
            >
              {/* Top glow on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `linear-gradient(to bottom, ${s.color}18, transparent)` }}
              />

              {/* Icon */}
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${s.color}18`, color: s.color }}
                whileHover={{ rotate: [-5, 5, -3, 0], scale: 1.15 }}
                transition={{ duration: 0.35 }}
              >
                <s.Icon />
              </motion.div>

              {/* Info */}
              <div>
                <h3 className="font-display font-black text-sm leading-tight text-white">{s.name}</h3>
                <p className="font-display text-[10px] font-bold mt-0.5 opacity-80" style={{ color: s.color }}>
                  {s.handle}
                </p>
              </div>

              <p className="text-white/35 text-[11px] font-body leading-relaxed flex-1">{s.description}</p>

              {/* Stats */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-black font-display" style={{ color: s.color }}>
                  {s.stat}
                </span>
                <span className="text-white/25 text-[10px] font-body">{s.statSub}</span>
              </div>

              {/* CTA */}
              <motion.div
                className="w-full py-2 rounded-lg text-center text-xs font-bold font-display opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ backgroundColor: `${s.color}18`, color: s.color, border: `1px solid ${s.color}30` }}
              >
                {s.cta} →
              </motion.div>

              {/* Bottom glow bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-50"
                style={{ background: `linear-gradient(to right, transparent, ${s.color}, transparent)` }}
              />
            </motion.a>
          ))}
        </div>

        {/* Instagram banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          // className="mt-12 rounded-2xl overflow-hidden border border-white/8"
        >
          {/*
          <img
            src="/assets/banner 2.jpg"
            alt="Ninja House en redes sociales"
            className="w-full h-auto object-cover max-h-72 object-top"
          />
          */}
        </motion.div>
      </div>
    </section>
  )
}
