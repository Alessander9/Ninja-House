import { Link } from 'react-router-dom'
import { ContactSection } from '../components/contact/ContactSection'

export function ContactPage() {
  return (
    <div className="min-h-screen bg-ninja-black text-white pt-28 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 halftone-bg opacity-15 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Navigation */}
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white font-display text-sm font-bold mb-8 group">
          <span className="text-ninja-green group-hover:text-white transition-colors">←</span>
          <span>Volver al Inicio</span>
        </Link>

        {/* Contact section wrapper */}
        <div className="rounded-3xl bg-white/5 border border-white/5 shadow-2xl overflow-hidden backdrop-blur-md">
          <ContactSection />
        </div>

      </div>
    </div>
  )
}
