import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const location = useLocation()
  
  // Format: 51977745003 for Peru (+51 977 745 003)
  const phone = '51977745003'
  const message = encodeURIComponent('¡Hola Ninja House! 🥷 Quisiera más información sobre los programas y oportunidades en el canal.')
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`

  useEffect(() => {
    // Whenever the route changes, start hidden while content loads
    setIsVisible(false)

    const checkVisibility = () => {
      // 1. Check Hero visibility (hide if user is still in the hero section)
      let inHero = false
      const heroElement = 
        document.querySelector('[data-hero="true"]') ||
        document.getElementById('hero') ||
        document.querySelector('.hero-section')

      if (heroElement) {
        const rect = heroElement.getBoundingClientRect()
        inHero = rect.bottom > 120
      } else {
        const scrollY = window.scrollY || document.documentElement.scrollTop
        inHero = scrollY < 450
      }

      // 2. Check Footer visibility (hide if footer enters viewport to avoid covering artwork/elements)
      let inFooter = false
      const footerElement = document.querySelector('footer')
      if (footerElement) {
        const fRect = footerElement.getBoundingClientRect()
        // If the top of the footer is within or above the viewport bottom margin
        inFooter = fRect.top < (window.innerHeight - 30) && fRect.bottom > 0
      }

      setIsVisible(!inHero && !inFooter)
    }

    // Run check initially and shortly after DOM paint
    checkVisibility()
    const timer1 = setTimeout(checkVisibility, 150)
    const timer2 = setTimeout(checkVisibility, 400)

    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility, { passive: true })
    
    // Also hook to Lenis scroll if available
    const lenis = (window as any).lenis
    if (lenis) {
      lenis.on('scroll', checkVisibility)
    }

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
      if (lenis) {
        lenis.off('scroll', checkVisibility)
      }
    }
  }, [location.pathname])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          aria-label="Contacto por WhatsApp"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3"
        >
          {/* Tooltip / Bubble */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: isHovered ? 1 : 0.92, x: 0, scale: 1 }}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-ninja-black/90 border border-[#25D366]/40 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.8)] backdrop-blur-md pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-xs font-display font-bold text-white tracking-wide">
              Chatea con el <span className="text-[#25D366]">Dojo</span>
            </span>
          </motion.div>

          {/* WhatsApp Action Button */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp (+51 977 745 003)"
            className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-ninja-black/90 p-1.5 shadow-[0_10px_30px_rgba(37,211,102,0.4)] border border-[#25D366]/40 cursor-pointer group backdrop-blur-md"
            whileHover={{ scale: 1.12, rotate: 4 }}
            whileTap={{ scale: 0.92 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Pulsing Radar Ring */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-25 animate-ping pointer-events-none" />

            {/* Geek WhatsApp Logo Image */}
            <img
              src="/assets/wsp_logo_geek.png"
              alt="WhatsApp Ninja Dojo"
              className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(37,211,102,0.5)] transition-transform duration-300 group-hover:scale-110"
            />
          </motion.a>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
