import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

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
  const location = useLocation()
  const isAnimeRamen = location.pathname.includes('animes-y-ramen')
  const isOverhead = location.pathname.includes('overhead') || location.pathname.includes('over-head')
  const isFrikis = location.pathname.includes('frikis-de-m') || location.pathname.includes('frikisdem') || location.pathname.includes('freakuencia')
  const isPlastico = location.pathname.includes('maldito-plastico') || location.pathname.includes('malditoplastico')
  const isCineInfarto = location.pathname.includes('cine-infarto') || location.pathname.includes('cineinfarto')
  const isPlanoOscuro = location.pathname.includes('el-plano-oscuro') || location.pathname.includes('plan-oscuro') || location.pathname.includes('lado-oscuro')

  const programConfig = isAnimeRamen ? {
    logo: '/assets/animesRamen_logo.webp',
    alt: 'Animes y Ramen',
    logoDropShadow: 'drop-shadow-[0_4px_16px_rgba(198,162,230,0.35)]',
    title: <>ANIMES <span className="text-[#C6A2E6]">& RAMEN</span></>,
    tagline: 'Dojo Otaku Oficial',
    desc: 'El espacio definitivo de Ninja House dedicado al anime, ramen, cultura japonesa y debates sin filtro con Charrita & Ale.',
    statusDot: 'bg-[#C6A2E6]',
    statusText: 'DOJO: 🌸 EN VIVO LUNES 9:00 PM',
    accentColor: '#C6A2E6',
    hoverTextClass: 'hover:text-[#C6A2E6]',
    topButtonText: 'Subir al Dojo 🍜',
    copyright: 'Animes y Ramen · Ninja House',
    liveNotice: '🌸 Transmisiones oficiales en vivo por YouTube cada lunes.',
  } : isOverhead ? {
    logo: '/assets/OVERHEAD_LOGO.png',
    alt: 'Over Head',
    logoDropShadow: 'drop-shadow-[0_4px_16px_rgba(37,99,235,0.4)]',
    title: <>OVER <span className="text-[#2563EB]">HEAD</span></>,
    tagline: 'Dojo Wrestling Oficial',
    desc: 'El espacio definitivo de Ninja House dedicado a la lucha libre, WWE, rivalidades y combates históricos con Umano, Gianco y Luchito.',
    statusDot: 'bg-[#2563EB]',
    statusText: 'DOJO: 🤼 EN VIVO MARTES 9:00 PM',
    accentColor: '#38BDF8',
    hoverTextClass: 'hover:text-[#38BDF8]',
    topButtonText: 'Subir al Ring 🤼',
    copyright: 'Over Head · Ninja House',
    liveNotice: '🤼 Transmisiones oficiales en vivo por YouTube cada martes.',
  } : isFrikis ? {
    logo: '/assets/FrikisDeM_Logo.png',
    alt: 'Frikis de M',
    logoDropShadow: 'drop-shadow-[0_4px_16px_rgba(22,163,74,0.4)]',
    title: <>FRIKIS <span className="text-[#22C55E]">DE M</span></>,
    tagline: 'Dojo Pop & Memes Oficial',
    desc: 'Cultura pop, memes, actualidad geek, noticias virales y anécdotas sin filtro con Camu, Umano, D’arranque, Rafomagia y Luchito.',
    statusDot: 'bg-[#22C55E]',
    statusText: 'DOJO: 🎮 EN VIVO MIÉRCOLES 9:00 PM',
    accentColor: '#22C55E',
    hoverTextClass: 'hover:text-[#22C55E]',
    topButtonText: 'Subir al Feed 🎮',
    copyright: 'Frikis de M · Ninja House',
    liveNotice: '🎮 Transmisiones oficiales en vivo por YouTube cada miércoles.',
  } : isPlastico ? {
    logo: '/assets/MALDITOPLASTICO_LOGO.png',
    alt: 'Maldito Plástico',
    logoDropShadow: 'drop-shadow-[0_4px_16px_rgba(234,88,12,0.4)]',
    title: <>MALDITO <span className="text-[#EA580C]">PLÁSTICO</span></>,
    tagline: 'Dojo Coleccionismo Oficial',
    desc: 'Coleccionismo, figuras de acción, unboxings, rarezas y nostalgia de juguetes con Markollectibles, Gianco Condemarín y Rafomagia.',
    statusDot: 'bg-[#EA580C]',
    statusText: 'DOJO: 🛒 EN VIVO JUEVES 9:00 PM',
    accentColor: '#F97316',
    hoverTextClass: 'hover:text-[#F97316]',
    topButtonText: 'Subir a la Vitrina 🛒',
    copyright: 'Maldito Plástico · Ninja House',
    liveNotice: '🛒 Transmisiones oficiales en vivo por YouTube cada jueves.',
  } : isCineInfarto ? {
    logo: '/assets/CINEINFARTO_LOGO.png',
    alt: 'Cine Infarto',
    logoDropShadow: 'drop-shadow-[0_4px_16px_rgba(220,38,38,0.45)]',
    title: <>CINE <span className="text-[#DC2626]">INFARTO</span></>,
    tagline: 'Dojo Terror & Cine Oficial',
    desc: 'Cine de terror, suspenso, teorías y análisis de películas de culto visto por amantes del género con Carmen Bathory y Andrés Manco.',
    statusDot: 'bg-[#DC2626]',
    statusText: 'DOJO: 🎬 EN VIVO VIERNES 9:00 PM',
    accentColor: '#EF4444',
    hoverTextClass: 'hover:text-[#EF4444]',
    topButtonText: 'Subir a la Sala 🎬',
    copyright: 'Cine Infarto · Ninja House',
    liveNotice: '🎬 Transmisiones oficiales en vivo por YouTube cada viernes.',
  } : isPlanoOscuro ? {
    logo: '/assets/PLAN_OSCURO_LOGO.webp',
    alt: 'El Plano Oscuro',
    logoDropShadow: 'drop-shadow-[0_4px_16px_rgba(217,119,6,0.45)]',
    title: <>EL PLANO <span className="text-[#F59E0B]">OSCURO</span></>,
    tagline: 'Dojo Misterio & Paranormal Oficial',
    desc: 'Fenómenos paranormales, terror, leyendas, tarot y misterio espiritual con Adriana Larrea (Mar de Luna) y Sandra (La Suma Sacerdotisa).',
    statusDot: 'bg-[#F59E0B]',
    statusText: 'DOJO: 🔮 EN VIVO DOMINGO 9:00 PM',
    accentColor: '#F59E0B',
    hoverTextClass: 'hover:text-[#F59E0B]',
    topButtonText: 'Subir al Altar 🔮',
    copyright: 'El Plano Oscuro · Ninja House',
    liveNotice: '🔮 Transmisiones oficiales en vivo por YouTube cada domingo.',
  } : null

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('contacto@ninjahouse.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className={`relative ${
      isAnimeRamen
        ? 'bg-[#08050e] border-t border-[#C6A2E6]/25'
        : isOverhead
        ? 'bg-[#050814] border-t border-[#2563EB]/35'
        : isFrikis
        ? 'bg-[#0a0514] border-t border-emerald-500/30'
        : isPlastico
        ? 'bg-[#0b0604] border-t border-orange-500/35'
        : isCineInfarto
        ? 'bg-[#0a0507] border-t border-red-600/35'
        : isPlanoOscuro
        ? 'bg-[#080503] border-t border-amber-600/35'
        : 'bg-ninja-black border-t border-white/5'
    } pt-20 sm:pt-24 pb-12 px-6 sm:px-10 overflow-hidden`}>
      
      {/* ── CUSTOM FOOTER ARTWORK FOR OVERHEAD (100% ESTIRADO EN TODO EL FOOTER) ── */}
      {isOverhead && (
        <>
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
            <img
              src="/assets/heros/OVERHEADFOOTER.webp"
              alt="Overhead Footer"
              className="w-full h-full object-cover object-right-bottom block"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Degradado para que los textos a la izquierda sean 100% legibles */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent md:w-3/4 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ninja-black via-ninja-black/75 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>

          {/* Subtle Ambient Glows */}
          <div
            className="absolute bottom-0 right-0 w-[550px] h-[450px] pointer-events-none rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
          
          {/* Top Wrestling Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#FBBF24]" />
        </>
      )}

      {/* ── CUSTOM FOOTER ARTWORK FOR FRIKIS DE M (100% ESTIRADO EN TODO EL FOOTER) ── */}
      {isFrikis && (
        <>
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
            <img
              src="/assets/frikifooter.webp"
              alt="Frikis de M Footer"
              className="w-full h-full object-cover object-right-bottom block"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Degradado para que los textos a la izquierda sean 100% legibles */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0514]/95 via-[#0a0514]/80 to-transparent md:w-3/4 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ninja-black via-ninja-black/70 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>

          {/* Subtle Ambient Glows */}
          <div
            className="absolute bottom-0 right-0 w-[550px] h-[450px] pointer-events-none rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.18) 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
          
          {/* Top Ninja Green & Purple Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#A855F7]" />
        </>
      )}

      {/* ── CUSTOM FOOTER ARTWORK FOR ANIMES Y RAMEN (100% ESTIRADO EN TODO EL FOOTER) ── */}
      {isAnimeRamen && (
        <>
          {/* Imagen de fondo cubriendo todo el footer */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
            <img
              src="/assets/footer_ramen.webp"
              alt="Animes & Ramen Footer"
              className="w-full h-full object-cover object-right-bottom block"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Degradado para que los textos a la izquierda sean 100% legibles */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent md:w-3/4 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ninja-black via-ninja-black/70 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>

          {/* Subtle Ambient Glows */}
          <div
            className="absolute bottom-0 right-0 w-[550px] h-[450px] pointer-events-none rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(198,162,230,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
          
          {/* Top Sakura Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C6A2E6] via-[#F2ADD1] to-[#F1D090]" />
        </>
      )}

      {/* ── CUSTOM FOOTER ARTWORK FOR MALDITO PLÁSTICO (100% ESTIRADO EN TODO EL FOOTER) ── */}
      {isPlastico && (
        <>
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
            <img
              src="/assets/plasticofooter.webp"
              alt="Maldito Plástico Footer"
              className="w-full h-full object-cover object-right block"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Degradado para que los textos a la izquierda sean 100% legibles */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0604]/95 via-[#0b0604]/80 to-transparent md:w-3/4 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ninja-black via-ninja-black/70 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>

          {/* Subtle Ambient Glows */}
          <div
            className="absolute bottom-0 right-0 w-[550px] h-[450px] pointer-events-none rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
          
          {/* Top Comic Orange & Amber Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#EF4444]" />
        </>
      )}

      {/* ── CUSTOM FOOTER ARTWORK FOR CINE INFARTO (100% ESTIRADO EN TODO EL FOOTER) ── */}
      {isCineInfarto && (
        <>
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
            <img
              src="/assets/infartoFooter_opt.webp"
              alt="Cine Infarto Footer"
              className="w-full h-full object-cover object-right block"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Degradado para que los textos a la izquierda sean 100% legibles */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0507]/95 via-[#0a0507]/80 to-transparent md:w-3/4 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ninja-black via-ninja-black/70 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>

          {/* Subtle Ambient Glows */}
          <div
            className="absolute bottom-0 right-0 w-[550px] h-[450px] pointer-events-none rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
          
          {/* Top Crimson & Horror Red Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C]" />
        </>
      )}

      {/* ── CUSTOM FOOTER ARTWORK FOR EL PLANO OSCURO (100% ESTIRADO EN TODO EL FOOTER) ── */}
      {isPlanoOscuro && (
        <>
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
            <img
              src="/assets/oscurofooter.webp"
              alt="El Plano Oscuro Footer"
              className="w-full h-full object-cover object-right block"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Degradado para que los textos a la izquierda sean 100% legibles */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080503]/95 via-[#080503]/80 to-transparent md:w-3/4 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ninja-black via-ninja-black/70 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>

          {/* Subtle Ambient Glows */}
          <div
            className="absolute bottom-0 right-0 w-[550px] h-[450px] pointer-events-none rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(234,179,8,0.18) 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
          
          {/* Top Mystic Gold & Occult Amber Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#78350F]" />
        </>
      )}

      {!isAnimeRamen && !isOverhead && !isFrikis && !isPlastico && !isCineInfarto && !isPlanoOscuro && (
        <>
          {/* Default Glow Effects */}
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] pointer-events-none rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(103,185,70,0.06) 0%, transparent 70%)', filter: 'blur(70px)' }} />
          <div className="absolute top-0 left-0 w-[300px] h-[300px] pointer-events-none rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(90,40,122,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

          {/* Diagonal Line Design Accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-ninja-green via-ninja-purple to-ninja-yellow opacity-40" />
        </>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Contenido del Footer dentro de la imagen */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${programConfig ? 'lg:grid-cols-3 max-w-4xl mr-auto' : 'lg:grid-cols-4'} gap-10 md:gap-12 mb-16`}>
          
          {/* Column 1: Brand & Logo */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <motion.img
                src={programConfig ? programConfig.logo : '/assets/NinjaLOGO.png'}
                alt={programConfig ? programConfig.alt : 'Ninja House'}
                className={`${programConfig ? `${programConfig.logoDropShadow} h-14 sm:h-16 max-w-[190px]` : 'h-16'} w-auto object-contain`}
                whileHover={{ scale: 1.05, rotate: -3 }}
              />
              <div>
                <span className="font-display font-black text-xl text-white tracking-widest block leading-tight">
                  {programConfig ? programConfig.title : (
                    <>NINJA <span className="text-red-600">HOUSE</span></>
                  )}
                </span>
                <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-display">
                  {programConfig ? programConfig.tagline : 'Dojo Geek Oficial'}
                </span>
              </div>
            </div>
            <p className="text-white/50 text-xs font-body leading-relaxed max-w-sm">
              {programConfig
                ? programConfig.desc
                : 'Tu canal de referencia sobre gaming, anime, cultura pop y coleccionables. Sin filtros, con la mejor comunidad.'}
            </p>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mt-2">
              <motion.span 
                className={`w-2 h-2 rounded-full ${programConfig ? programConfig.statusDot : 'bg-ninja-green'}`}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[10px] font-display font-bold text-white/70 tracking-wider">
                {programConfig ? programConfig.statusText : 'DOJO STATUS: ONLINE'}
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-display font-black text-sm text-white tracking-widest uppercase mb-6 relative w-fit">
              {programConfig ? 'Explorar' : 'Navegación'}
              <span 
                className="absolute -bottom-1 left-0 w-8 h-0.5 rounded-full"
                style={{ backgroundColor: programConfig ? programConfig.accentColor : '#10B981' }}
              />
            </h4>
            <ul className="flex flex-col gap-3 font-display text-sm text-white/55">
              {[
                { label: 'Inicio', href: '/' },
                { label: 'Ver todos los programas', href: '/programas' },
                { label: 'Animes y Ramen (Lunes)', href: '/programa/animes-y-ramen' },
                { label: 'Over Head (Martes)', href: '/programa/overhead' },
                { label: 'Frikis de M (Miércoles)', href: '/programa/frikis-de-m' },
                { label: 'Maldito Plástico (Jueves)', href: '/programa/maldito-plastico' },
                { label: 'Cine Infarto (Viernes)', href: '/programa/cine-infarto' },
                { label: 'El Plano Oscuro (Domingo)', href: '/programa/el-plano-oscuro' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="hover:pl-2 transition-all duration-300 inline-flex items-center gap-1 group text-white/60 hover:text-white"
                  >
                    <span 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: programConfig ? programConfig.accentColor : '#10B981' }}
                    >›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Dojo */}
          <div>
            <h4 className="font-display font-black text-sm text-white tracking-widest uppercase mb-6 relative w-fit">
              {programConfig ? 'Auspicios & Contacto' : 'Contacto Dojo'}
              <span 
                className="absolute -bottom-1 left-0 w-8 h-0.5 rounded-full"
                style={{ backgroundColor: programConfig ? programConfig.accentColor : '#F59E0B' }}
              />
            </h4>
            <p className="text-white/40 text-xs font-body leading-relaxed mb-4">
              {programConfig
                ? `¿Quieres auspiciar ${programConfig.alt} o proponer alguna colaboración especial? ¡Escríbenos directamente!`
                : '¿Quieres colaborar o tienes alguna propuesta para el canal? ¡Escríbenos directamente!'}
            </p>
            
            {/* Copy Email Button */}
            <button
              onClick={handleCopyEmail}
              className="flex items-center justify-between w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl transition-all duration-300 text-left font-display group hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex flex-col">
                <span className="text-[10px] text-white/30 tracking-wider">EMAIL OFICIAL</span>
                <span className="text-xs text-white/80 font-bold transition-colors group-hover:text-white">
                  contacto@ninjahouse.com
                </span>
              </div>
              <span 
                className="text-xs font-bold"
                style={{ color: programConfig ? programConfig.accentColor : '#10B981' }}
              >
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
            <p className="text-white/40 text-xs font-body">
              © {new Date().getFullYear()} {programConfig ? `${programConfig.copyright}. Todos los derechos reservados.` : 'Ninja House. Todos los derechos reservados.'}
            </p>
            <p className="text-[10px] text-white/25 mt-1 font-body">
              {programConfig ? programConfig.liveNotice : 'Desarrollado con estética urbana & neón geek.'}
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
                  borderColor: programConfig ? programConfig.accentColor : s.color, 
                  color: programConfig ? programConfig.accentColor : s.color, 
                  boxShadow: `0 0 15px ${programConfig ? programConfig.accentColor + '50' : s.color + '40'}`,
                  backgroundColor: programConfig ? programConfig.accentColor + '15' : `${s.color}10` 
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 transition-all text-xs font-display text-white/60 hover:text-white hover:border-white/20 hover:bg-white/10 group"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{programConfig ? programConfig.topButtonText : 'Subir al Dojo'}</span>
            <motion.span 
              className="inline-block"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ color: programConfig ? programConfig.accentColor : '#10B981' }}
            >
              ▲
            </motion.span>
          </motion.button>
        </div>

      </div>
    </footer>
  )
}
