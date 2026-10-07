import { motion } from 'framer-motion'
import { useState } from 'react'

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)
  
  // Format: 51977745003 for Peru (+51 977 745 003)
  const phone = '51977745003'
  const message = encodeURIComponent('¡Hola Ninja House! 🥷 Quisiera más información sobre los programas y oportunidades en el canal.')
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`

  return (
    <aside aria-label="Contacto por WhatsApp" className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
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
    </aside>
  )
}
