import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useLocation } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

type NavLink = {
  label: string
  href: string
  isAnchor: boolean
  anchorId?: string
}

const navLinks: NavLink[] = [
  { label: 'Inicio', href: '/', isAnchor: false },
  // { label: 'Drops', href: '/#collectibles', isAnchor: true, anchorId: 'collectibles' },
  { label: 'Programas', href: '/programas', isAnchor: false },
  { label: 'Contacto', href: '/contacto', isAnchor: false },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const location = useLocation()

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -80',
        onEnter: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
      })
    })
    return () => ctx.revert()
  }, [])

  // Close mobile menu on path changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (link.isAnchor && location.pathname === '/') {
      e.preventDefault()
      const element = document.getElementById(link.anchorId || '')
      if (element) {
        const lenis = (window as any).lenis
        if (lenis) {
          lenis.scrollTo(element, { offset: -70, duration: 1.2 })
        } else {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  const isAnimeRamen = location.pathname.includes('animes-y-ramen')
  const isOverhead = location.pathname.includes('overhead') || location.pathname.includes('over-head')
  const isFrikis = location.pathname.includes('frikis-de-m') || location.pathname.includes('frikisdem') || location.pathname.includes('freakuencia')
  const isPlastico = location.pathname.includes('maldito-plastico') || location.pathname.includes('malditoplastico')
  const isCineInfarto = location.pathname.includes('cine-infarto') || location.pathname.includes('cineinfarto')
  const isPlanoOscuro = location.pathname.includes('el-plano-oscuro') || location.pathname.includes('plan-oscuro') || location.pathname.includes('lado-oscuro')

  const currentProgram = isAnimeRamen ? {
    name: 'Animes y Ramen',
    logo: '/assets/animesRamen_logo.webp',
    accentColor: '#C6A2E6',
    borderClass: 'border-[#C6A2E6]/25',
    logoClass: 'h-10 sm:h-11',
  } : isOverhead ? {
    name: 'Over Head',
    logo: '/assets/OVERHEAD_LOGO.png',
    accentColor: '#38BDF8',
    borderClass: 'border-[#2563EB]/25',
    logoClass: 'h-10 sm:h-11',
  } : isFrikis ? {
    name: 'Frikis de M',
    logo: '/assets/FrikisDeM_Logo.png',
    accentColor: '#22C55E',
    borderClass: 'border-emerald-500/25',
    logoClass: 'h-10 sm:h-11',
  } : isPlastico ? {
    name: 'Maldito Plástico',
    logo: '/assets/MALDITOPLASTICO_LOGO.png',
    accentColor: '#F97316',
    borderClass: 'border-orange-500/25',
    logoClass: 'h-10 sm:h-11',
  } : isCineInfarto ? {
    name: 'Cine Infarto',
    logo: '/assets/CINEINFARTO_LOGO.png',
    accentColor: '#EF4444',
    borderClass: 'border-red-600/25',
    logoClass: 'h-10 sm:h-11',
  } : isPlanoOscuro ? {
    name: 'El Plano Oscuro',
    logo: '/assets/PLAN_OSCURO_LOGO.webp',
    accentColor: '#F59E0B',
    borderClass: 'border-amber-500/25',
    logoClass: 'h-10 sm:h-11',
  } : null

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        currentProgram
          ? `bg-black/40 backdrop-blur-md border-b ${currentProgram.borderClass} shadow-md shadow-black/25`
          : scrolled || location.pathname !== '/'
          ? 'bg-ninja-black/45 backdrop-blur-md border-b border-white/10 shadow-md shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.img
              src={currentProgram ? currentProgram.logo : '/assets/NinjaLOGO.png'}
              alt={currentProgram ? `${currentProgram.name} — Ninja House` : 'Ninja House'}
              className={`${currentProgram ? `${currentProgram.logoClass} max-w-[170px] sm:max-w-[210px]` : 'h-8 sm:h-9'} w-auto object-contain drop-shadow-md`}
              whileHover={{ scale: 1.06, rotate: -2 }}
              transition={{ type: 'spring', stiffness: 400 }}
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className="relative px-4 py-1.5 text-sm font-display font-bold transition-colors duration-200 group text-white/70 hover:text-white"
                style={{
                  color: location.pathname === link.href ? (currentProgram?.accentColor || '#EF4444') : undefined
                }}
              >
                <span>{link.label}</span>
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
                  style={{ backgroundColor: currentProgram?.accentColor || '#DC2626' }}
                  initial={{ scaleX: location.pathname === link.href ? 1 : 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <motion.span
              className="block w-6 h-0.5 bg-white"
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-white"
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-white"
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-ninja-black/98 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-4 py-6 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={(e) => {
                    handleLinkClick(e, link)
                    setMenuOpen(false)
                  }}
                  className={`px-4 py-3 font-display font-semibold text-lg border-b border-white/5 transition-colors ${
                    location.pathname === link.href ? 'text-red-500' : 'text-white/80 hover:text-red-500'
                  }`}
                  style={{ 
                    transitionDelay: `${i * 0.05}s`,
                    color: location.pathname === link.href && currentProgram ? currentProgram.accentColor : undefined
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
