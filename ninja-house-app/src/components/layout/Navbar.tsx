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
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || location.pathname !== '/'
          ? 'bg-ninja-black/95 backdrop-blur-xl border-b border-red-600/20 shadow-lg shadow-black/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.img
              src="/assets/NinjaLOGO.png"
              alt="Ninja House"
              className="h-10 w-auto object-contain"
              whileHover={{ scale: 1.08, rotate: -3 }}
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
                className={`relative px-4 py-2 text-sm font-display font-bold transition-colors duration-200 group ${
                  location.pathname === link.href ? 'text-red-500' : 'text-white/70 hover:text-red-500'
                }`}
              >
                {link.label}
                <motion.span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 origin-left`}
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
                  style={{ transitionDelay: `${i * 0.05}s` }}
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
