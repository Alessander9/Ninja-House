import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { investmentBenefits, sponsorFormats } from '../data/investment'
import { programsData } from '../data/programs'
import { motion, AnimatePresence } from 'framer-motion'

// Shared Animation Configurations
const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
} as const

const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
} as const

// Chat templates for live stream simulation
const chatTemplates = [
  { user: 'GamerGeek99', text: '¡Qué buen overlay de sponsor! 🚀', color: '#3B82F6' },
  { user: 'OtakuLover', text: 'Esperando el programa de hoy 🍜 ninja hype!', color: '#8B5CF6' },
  { user: 'SponsorWatcher', text: 'La marca patrocinadora combina genial con el set.', color: '#10B981' },
  { user: 'Coleccionista_33', text: '¿Dónde consigo el merchandising auspiciado? 🧸', color: '#F59E0B' },
  { user: 'NinjaFanatic', text: 'Esta comunidad siempre activa, ¡me encanta! 🔥', color: '#EF4444' },
  { user: 'BrandConnect', text: 'Ninja House tiene la mejor llegada geek.', color: '#EC4899' },
  { user: 'RamenFan', text: 'El programa del lunes promete muchísimo!', color: '#14B8A6' },
  { user: 'WrestleKing', text: 'Secciones dinámicas y sin publicidad intrusiva. ¡Bien ahí!', color: '#6366F1' }
]

const budgetSteps = ['Por definir', 'Bajo (Prueba)', 'Medio', 'Alto', 'Corporativo']
const budgetLabels = [
  'Hablemos',
  'Bajo (< $500)',
  'Medio ($500 - $1.5K)',
  'Alto ($1.5K - $5K)',
  'Corp. (> $5K)'
]

const interestTypeOptions = [
  'Auspicio de Programa',
  'Menciones en Vivo',
  'Product Placement',
  'Branded Content',
  'Campaña Completa',
  'Inversión / Alianza'
]

// Animated Equalizer component
const Equalizer = ({ color }: { color: string }) => {
  return (
    <div className="flex items-end gap-0.5 h-5 px-2 bg-black/40 backdrop-blur-md rounded border border-white/10 select-none">
      {[1, 2, 3, 4, 5].map((bar) => {
        const duration = 0.4 + bar * 0.08
        return (
          <motion.div
            key={bar}
            animate={{
              height: ['20%', '85%', '40%', '95%', '20%']
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="rounded-t-sm"
            style={{ 
              backgroundColor: color,
              width: '2px',
              boxShadow: `0 0 6px ${color}`
            }}
          />
        )
      })}
    </div>
  )
}

// Custom dropdown component for Terminal/Cyberpunk select menus
function CustomDropdown({
  label,
  options,
  selectedValue,
  onSelect,
  isOpen,
  setIsOpen,
  color
}: {
  label: string
  options: string[]
  selectedValue: string
  onSelect: (val: string) => void
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  color: string
}) {
  return (
    <div className="flex flex-col gap-1.5 font-mono text-xs relative">
      <label className="text-white/40 uppercase font-black text-[10px] tracking-wider">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 text-white text-xs text-left focus:outline-none flex justify-between items-center transition-all hover:bg-white/[0.04] font-sans cursor-pointer"
        style={{ borderColor: isOpen ? color : 'rgba(255,255,255,0.1)' }}
      >
        <span>{selectedValue}</span>
        <span 
          className="transition-transform duration-300 text-[8px] text-white/40" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-[60px] z-50 rounded-xl bg-[#0c0c0e] border border-white/10 shadow-2xl max-h-[220px] overflow-y-auto no-scrollbar backdrop-blur-xl"
          >
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onSelect(option)
                  setIsOpen(false)
                }}
                className="px-4 py-2.5 hover:bg-white/[0.03] text-white/70 hover:text-white transition-colors cursor-pointer text-xs font-sans"
              >
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Custom component to detect if element is in view for single animations
function FadeInUpContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ROI Calculator panel component
function RoiConsole({ budget, interestType, color }: { budget: string; interestType: string; color: string }) {
  let reach = '25K - 60K imp.'
  let presence = '1 mención'
  let score = 'Est. ROI: A+'
  
  if (budget === 'Bajo (Prueba)') {
    reach = '20K - 50K imp.'
    presence = 'Mención en chat'
    score = 'CTR: 1.8%'
  } else if (budget === 'Medio') {
    reach = '120K - 250K imp.'
    presence = '2 Menciones'
    score = 'CTR: 2.9%'
  } else if (budget === 'Alto') {
    reach = '400K - 900K imp.'
    presence = 'Mención + Logo'
    score = 'CTR: 3.5%'
  } else if (budget === 'Corporativo') {
    reach = '1.5M - 3.5M+ imp.'
    presence = 'Campaña 360°'
    score = 'CTR: 4.8%'
  } else {
    reach = 'Por definir'
    presence = 'A medida'
    score = 'Hablemos'
  }

  if (interestType === 'Branded Content' && budget !== 'Por definir') {
    presence = 'Show Especial'
  } else if (interestType === 'Product Placement' && budget !== 'Por definir') {
    presence = 'Presencia Set'
  }

  return (
    <div 
      className="p-4 rounded-xl bg-white/[0.015] border transition-all duration-500"
      style={{ borderColor: `${color}25` }}
    >
      <div className="flex items-center justify-between text-[9px] font-display font-black text-white/40 uppercase tracking-widest mb-3">
        <span>Consola de Impacto Estimado</span>
        <span style={{ color }}>ANALYSIS_CALCULATOR</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="flex flex-col gap-0.5 p-2 rounded bg-black/35 border border-white/[0.02]">
          <span className="text-[8px] font-display font-bold text-white/40 uppercase">Alcance</span>
          <span className="font-display font-black text-[10px] sm:text-[11px] text-white truncate" title={reach}>{reach}</span>
        </div>
        <div className="flex flex-col gap-0.5 p-2 rounded bg-black/35 border border-white/[0.02]">
          <span className="text-[8px] font-display font-bold text-white/40 uppercase">Presencia</span>
          <span className="font-display font-black text-[10px] sm:text-[11px] text-white truncate" title={presence}>{presence}</span>
        </div>
        <div className="flex flex-col gap-0.5 p-2 rounded bg-black/35 border border-white/[0.02]">
          <span className="text-[8px] font-display font-bold text-white/40 uppercase">Rendimiento</span>
          <span className="font-display font-black text-[10px] sm:text-[11px] truncate" style={{ color }} title={score}>{score}</span>
        </div>
      </div>
    </div>
  )
}

export function InvestPage() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    role: '',
    email: '',
    phone: '',
    interestType: 'Auspicio de Programa',
    program: 'Todos / General',
    budget: 'Por definir',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [highlightForm, setHighlightForm] = useState(false)
  const [budgetIndex, setBudgetIndex] = useState(0)
  
  // Custom dropdown open states
  const [isOpenInterest, setIsOpenInterest] = useState(false)
  const [isOpenProgram, setIsOpenProgram] = useState(false)

  // Scroll detection for Mobile Floating Previews
  const [showFloatingPreview, setShowFloatingPreview] = useState(false)

  // Interactive console states
  const [selectedProgramId, setSelectedProgramId] = useState('general')
  const [viewersCount, setViewersCount] = useState(1243)
  const [chatMessages, setChatMessages] = useState<Array<{ id: number; user: string; text: string; color: string }>>([
    { id: 1, user: 'NinjaAdmin', text: 'Consola de patrocinio inicializada. ¡Bienvenidos!', color: '#67B946' },
    { id: 2, user: 'GamerGeek99', text: '¡Qué buen overlay de sponsor! 🚀', color: '#3B82F6' },
    { id: 3, user: 'OtakuLover', text: 'Esperando el programa de hoy 🍜 ninja hype!', color: '#8B5CF6' }
  ])
  const [activeBenefitId, setActiveBenefitId] = useState('geek-influence')

  // Chat tracking state to prevent message spamming
  const [welcomedCompany, setWelcomedCompany] = useState('')
  const [welcomedName, setWelcomedName] = useState('')

  const selectRef = useRef<HTMLSelectElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Filter out Lanzalo for active commercial sponsors
  const activePrograms = programsData.filter((p) => p.id !== 'lanzalo')
  
  // Active Theme / Visual details mapping (fallback to General mode if selectedProgramId is 'general')
  const currentProgram = selectedProgramId === 'general' ? {
    id: 'general',
    title: 'Todos / General',
    emoji: '🥷',
    color: '#67B946',
    day: 'Lunes a Viernes',
    talents: ['Equipo Ninja'],
    segment: 'Comunidad Geek Global',
    sponsorText: 'Auspicia Ninja House Show y conecta de forma transversal con toda nuestra audiencia en redes y transmisiones.',
    image: ''
  } : activePrograms.find((p) => p.id === selectedProgramId) || activePrograms[0]

  // Track scroll state for mobile preview anchor
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        setShowFloatingPreview(window.scrollY > 380)
      } else {
        setShowFloatingPreview(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Live simulation effects (Viewers and chat list)
  useEffect(() => {
    const intervalViewers = setInterval(() => {
      setViewersCount((prev) => prev + Math.floor(Math.random() * 9) - 4)
    }, 3000)

    const intervalChat = setInterval(() => {
      const template = chatTemplates[Math.floor(Math.random() * chatTemplates.length)]
      setChatMessages((prev) => {
        const next = [...prev, { id: Date.now(), ...template }]
        return next.slice(-6)
      })
    }, 2500)

    return () => {
      clearInterval(intervalViewers)
      clearInterval(intervalChat)
    }
  }, [])

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Reactive chat welcome for Company name
  useEffect(() => {
    const trimmedCompany = form.company.trim()
    if (!trimmedCompany || trimmedCompany === welcomedCompany) return
    
    const timer = setTimeout(() => {
      setChatMessages((prev) => {
        const msgId = Date.now()
        const newMsg = {
          id: msgId,
          user: '⚡ [SYSTEM]',
          text: `¡Damos la bienvenida a ${trimmedCompany} que se conecta a la consola! 🥷✨`,
          color: '#67B946'
        }
        return [...prev.slice(-5), newMsg]
      })
      setWelcomedCompany(trimmedCompany)
    }, 1500)

    return () => clearTimeout(timer)
  }, [form.company, welcomedCompany])

  // Reactive chat greet for contact Name
  useEffect(() => {
    const firstName = form.name.trim().split(' ')[0]
    if (!firstName || form.name.trim() === welcomedName) return

    const timer = setTimeout(() => {
      setChatMessages((prev) => {
        const msgId = Date.now()
        const newMsg = {
          id: msgId,
          user: 'GamerGeek99',
          text: `¡Hola ${firstName}! ¡Un gusto saludarte en la consola de Ninja House! 👋`,
          color: '#3B82F6'
        }
        return [...prev.slice(-5), newMsg]
      })
      setWelcomedName(form.name.trim())
    }, 2000)

    return () => clearTimeout(timer)
  }, [form.name, welcomedName])

  // Sync index to form budget string
  useEffect(() => {
    setForm((prev) => ({ ...prev, budget: budgetSteps[budgetIndex] }))
  }, [budgetIndex])

  const handleSponsorSelect = (programId: string, programTitle: string) => {
    setSelectedProgramId(programId)
    setForm((prev) => ({ ...prev, program: programTitle }))
  }

  const handleApplyClick = () => {
    setHighlightForm(true)
    setTimeout(() => setHighlightForm(false), 2500)

    const element = document.getElementById('commercial-contract-form')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    setTimeout(() => {
      selectRef.current?.focus()
    }, 850)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    const subject = encodeURIComponent(`Ninja House Negocios - Alianza de ${form.company}`)
    const body = encodeURIComponent(
      `Nombre del contacto: ${form.name}\n` +
      `Empresa/Marca: ${form.company}\n` +
      `Cargo: ${form.role}\n` +
      `Email: ${form.email}\n` +
      `Teléfono: ${form.phone || 'No especificado'}\n` +
      `Tipo de interés: ${form.interestType}\n` +
      `Programa de interés: ${form.program}\n` +
      `Presupuesto aproximado: ${form.budget}\n\n` +
      `Mensaje/Propuesta:\n${form.message}`
    )

    setTimeout(() => {
      window.location.href = `mailto:Contacto@ninjahouseshow.com?subject=${subject}&body=${body}`
      setSubmitted(false)
      setForm({
        name: '',
        company: '',
        role: '',
        email: '',
        phone: '',
        interestType: 'Auspicio de Programa',
        program: 'Todos / General',
        budget: 'Por definir',
        message: ''
      })
      setBudgetIndex(0)
    }, 3000)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  }

  const programOptions = ['Todos / General', ...activePrograms.map((p) => p.title)]

  return (
    <div className="min-h-screen bg-ninja-black text-white pt-24 pb-12 relative overflow-hidden">
      
      {/* Techno overlay patterns */}
      <div className="absolute inset-0 halftone-bg opacity-[0.08] pointer-events-none z-0" />
      
      {/* Dynamic theme colored backing glow spot */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-10 pointer-events-none transition-all duration-1000 ease-out z-0"
        style={{
          top: '20%',
          left: '10%',
          background: `radial-gradient(circle, ${currentProgram.color} 0%, transparent 70%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Top bar control navigation */}
        <div className="flex justify-between items-center border-b border-white/[0.08] pb-6 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white font-display text-xs font-black uppercase tracking-widest transition-colors duration-300 group">
            <span className="text-red-500 group-hover:-translate-x-1.5 transition-transform duration-300">←</span>
            <span>SALIR DE CONSOLA</span>
          </Link>
          <div className="flex items-center gap-4 text-[10px] font-display font-black text-white/40 tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              STATUS: ONLINE
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">NINJA-HOUSE-PORTAL_v2.0</span>
          </div>
        </div>

        {/* Cinematic Split Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ==================== LEFT FIXED INTERACTIVE DASHBOARD ==================== */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-6">
            
            {/* Control Panel Outer Wrapper */}
            <div 
              className="p-4 rounded-2xl bg-[#0b0b0e] border transition-all duration-700 ease-out shadow-2xl relative overflow-hidden"
              style={{
                borderColor: `${currentProgram.color}25`,
                boxShadow: `0 20px 40px -15px ${currentProgram.color}15`
              }}
            >
              {/* Corner tech lines decoration */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: currentProgram.color }} />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: currentProgram.color }} />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: currentProgram.color }} />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: currentProgram.color }} />

              {/* Streaming Simulator Screen */}
              <div className="aspect-video rounded-xl bg-ninja-black relative border border-white/[0.08] overflow-hidden group shadow-inner">
                
                {/* Tech scanlines effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10" />

                {/* Simulated live video stream backdrop */}
                <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#0d0d0f] overflow-hidden">
                  
                  {/* High Fidelity Show Screenshot Backdrop blurred */}
                  {selectedProgramId !== 'general' && currentProgram.image && (
                    <motion.img 
                      key={currentProgram.id}
                      src={currentProgram.image}
                      alt=""
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.22 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 w-full h-full object-cover blur-[3px] pointer-events-none"
                    />
                  )}

                  {/* General Mode Radar visualizer */}
                  {selectedProgramId === 'general' && (
                    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                      {[1, 2, 3].map((radar) => (
                        <motion.div
                          key={radar}
                          className="absolute rounded-full border border-ninja-green/30"
                          style={{ width: 130, height: 130 }}
                          animate={{
                            scale: [1, 2.5],
                            opacity: [0.45, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: radar * 0.8,
                            ease: 'easeOut'
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="absolute inset-0 opacity-15" style={{
                    backgroundImage: `radial-gradient(ellipse at center, ${currentProgram.color}33 0%, transparent 80%)`
                  }} />
                  
                  {/* Cyberpunk abstract grid backdrop */}
                  <svg className="w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* Host avatar mock outlines with tooltips (Hidden in general mode) */}
                  {selectedProgramId !== 'general' && (
                    <div className="absolute bottom-3 left-3 flex gap-2 z-20">
                      {currentProgram.talents.map((host, idx) => (
                        <div key={idx} className="relative group/host cursor-pointer">
                          <div 
                            className="w-9 h-9 rounded-full border-2 bg-ninja-black/90 flex items-center justify-center text-[10px] font-display font-black shadow-md hover:scale-110 transition-transform duration-300 select-none text-white/95"
                            style={{ borderColor: currentProgram.color }}
                          >
                            {getInitials(host)}
                          </div>
                          {/* Tooltip */}
                          <div className="absolute bottom-11 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/95 border border-white/10 text-[8px] font-display font-black text-white whitespace-nowrap opacity-0 pointer-events-none group-hover/host:opacity-100 transition-opacity duration-300 z-30 tracking-wider">
                            HOST: {host}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Floating show themed neon logo or text */}
                  <motion.div
                    key={currentProgram.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.85 }}
                    transition={{ type: 'spring', stiffness: 120 }}
                    className="flex flex-col items-center gap-1 z-10 text-center select-none"
                  >
                    {selectedProgramId === 'general' ? (
                      <>
                        <img 
                          src="/assets/NinjaLOGO.png" 
                          alt="Ninja House" 
                          className="h-16 w-auto object-contain filter drop-shadow-[0_0_15px_#67B946] mb-1" 
                        />
                        <span className="font-display font-black text-[10px] text-ninja-green tracking-widest uppercase">
                          ALIANZA GLOBAL
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl filter drop-shadow-lg">{currentProgram.emoji}</span>
                        <span 
                          className="font-display font-black text-lg tracking-wider uppercase" 
                          style={{ color: currentProgram.color, textShadow: `0 0 20px ${currentProgram.color}80` }}
                        >
                          {currentProgram.title}
                        </span>
                      </>
                    )}
                  </motion.div>

                  {/* Physical Product Placement simulation visualizer */}
                  {budgetIndex >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute bottom-3 right-16 z-20 flex flex-col items-center select-none cursor-help group/placement"
                    >
                      <div 
                        className="w-10 h-10 bg-neutral-900 border rounded-lg flex items-center justify-center text-[7px] text-white/90 font-black font-mono shadow-xl relative overflow-hidden" 
                        style={{ borderColor: currentProgram.color }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: currentProgram.color }} />
                        <span className="truncate max-w-[34px] uppercase">{form.company || 'SPONSOR'}</span>
                      </div>
                      <span className="text-[6px] font-display font-black text-white/60 tracking-wider mt-1 uppercase bg-black/60 px-1 py-0.5 rounded border border-white/5">
                        Product Set
                      </span>
                      {/* Tooltip explanation */}
                      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded bg-black/95 border border-white/10 text-[8px] font-body text-white/70 whitespace-nowrap opacity-0 pointer-events-none group-hover/placement:opacity-100 transition-opacity duration-300 z-30 leading-snug">
                        Simulación física de <span className="text-white font-bold">Product Placement</span> en mesa.
                      </div>
                    </motion.div>
                  )}

                </div>

                {/* Live Stream Overlay Simulator Zone (The commercial preview) */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
                  <div className="flex gap-2 items-center">
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-display font-black text-[9px] uppercase tracking-widest animate-pulse">
                      🔴 LIVE
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white font-display text-[9px] uppercase tracking-wider border border-white/10">
                      👁️ {viewersCount}
                    </span>
                  </div>

                  {/* Dynamic Brand Logo Placement Mock */}
                  <motion.div
                    animate={{
                      boxShadow: [`0 0 10px ${currentProgram.color}20`, `0 0 25px ${currentProgram.color}60`, `0 0 10px ${currentProgram.color}20`]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="px-3 py-1.5 rounded-lg border backdrop-blur-md text-right bg-black/80 flex flex-col items-end gap-0.5 max-w-[150px]"
                    style={{ borderColor: `${currentProgram.color}88` }}
                  >
                    <span className="text-[7px] font-display font-black text-white/50 tracking-widest uppercase">SPONSOR ACTIVO</span>
                    <span className="text-[9px] font-display font-black tracking-wide text-white truncate w-full uppercase">
                      {form.company || '[TU MARCA AQUÍ]'}
                    </span>
                  </motion.div>
                </div>

                {/* Equalizer overlay on simulator base */}
                <div className="absolute bottom-3 right-3 z-20 flex gap-2 items-center">
                  <Equalizer color={currentProgram.color} />
                  <div className="px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-display font-bold text-white/70 tracking-wider">
                    FEED EN VIVO
                  </div>
                </div>
              </div>

              {/* Chat Simulator Box */}
              <div className="mt-4 rounded-xl bg-black/40 border border-white/[0.06] p-3 flex flex-col gap-2.5 min-h-[160px]">
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-2 text-[9px] font-display font-black text-white/40 uppercase tracking-widest">
                  <span>Chat en vivo de la comunidad</span>
                  <span className="flex items-center gap-1 text-green-500">
                    <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                    CONECTADO
                  </span>
                </div>
                
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[110px] text-xs font-body no-scrollbar font-sans">
                  <AnimatePresence>
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col sm:flex-row sm:items-start gap-1 leading-snug"
                      >
                        <span className="font-display font-bold text-[10px] sm:text-xs select-none" style={{ color: msg.color }}>
                          {msg.user}:
                        </span>
                        <span className="text-white/80">{msg.text}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={chatEndRef} />
                </div>
              </div>
            </div>

            {/* Dynamic ROI Estimator Panel */}
            <RoiConsole budget={form.budget} interestType={form.interestType} color={currentProgram.color} />

            {/* Quick Sponsorship Actions Info */}
            <div className="p-4 rounded-xl bg-white/[0.015] border border-white/[0.06] text-xs font-body text-white/50 leading-relaxed flex flex-col gap-2">
              <div className="flex gap-2 items-center text-white font-display font-bold">
                <span>💡</span>
                <span>¿Sabías que...?</span>
              </div>
              <p>
                Al escribir tu nombre o empresa en el formulario (a la derecha), los fans y el sistema en el chat de arriba te saludarán en tiempo real. ¡Pruébalo!
              </p>
            </div>

          </div>

          {/* ==================== RIGHT CONTENT NARRATIVE PANEL ==================== */}
          <div className="lg:col-span-7 flex flex-col gap-16">
            
            {/* SECTION 1: Welcome & Pitch */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerStagger}
              className="flex flex-col gap-4 text-center lg:text-left items-center lg:items-start"
            >
              <motion.span 
                variants={slideUpVariants}
                className="px-3 py-1 bg-red-600/10 border border-red-500/20 text-red-500 font-display font-black text-[10px] tracking-widest uppercase rounded-full w-fit mx-auto lg:mx-0"
              >
                🎮 ALLIANCE PORTAL
              </motion.span>
              <motion.h2 
                variants={slideUpVariants}
                className="font-display font-black text-4xl md:text-5xl text-white tracking-tight uppercase"
              >
                CONSOLA DE AUSPICIO DE <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">NINJA HOUSE</span>
              </motion.h2>
              <motion.p 
                variants={slideUpVariants}
                className="text-white/80 font-display font-bold text-lg md:text-xl leading-relaxed text-center lg:text-left"
              >
                Conecta tu marca con la comunidad más leal, activa y apasionada por la cultura geek y el entretenimiento digital.
              </motion.p>
              <motion.p 
                variants={slideUpVariants}
                className="text-white/40 font-body text-sm md:text-base leading-relaxed text-center lg:text-left"
              >
                Entra directamente al livestreaming de forma orgánica. Con cinco producciones semanales activas transmitidas en horario prime, Ninja House ofrece integraciones de marca interactivas que escapan de los bloqueos de publicidad convencional.
              </motion.p>
            </motion.div>

            {/* SECTION 2: Why Geek Culture Accordion */}
            <div className="border-t border-white/[0.08] pt-12">
              <FadeInUpContainer>
                <h3 className="font-display font-black text-2xl text-white uppercase tracking-wider mb-2">
                  ¿Por qué invertir en cultura geek?
                </h3>
                <p className="text-white/40 font-body text-xs md:text-sm mb-8">
                  Haz clic en cada pilar para explorar cómo canalizamos la atención de nuestra audiencia.
                </p>
              </FadeInUpContainer>

              <div className="flex flex-col gap-3">
                {investmentBenefits.map((b) => {
                  const isActive = activeBenefitId === b.id
                  return (
                    <div 
                      key={b.id}
                      onClick={() => setActiveBenefitId(b.id)}
                      className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col gap-2 relative overflow-hidden ${
                        isActive 
                          ? 'bg-white/[0.02] border-white/20' 
                          : 'bg-white/[0.005] border-white/[0.04] hover:bg-white/[0.01] hover:border-white/10'
                      }`}
                    >
                      {/* Left color bar indicator for active */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeBenefitBorder"
                          className="absolute left-0 top-0 bottom-0 w-[3px] bg-red-500" 
                        />
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <span className="text-2xl select-none">{b.icon}</span>
                          <span className="font-display font-black text-sm md:text-base text-white tracking-wide">{b.title}</span>
                        </div>
                        <span className="text-xs font-display text-white/30 font-bold uppercase select-none">
                          {isActive ? 'EXPANDIDO' : 'LEER MÁS'}
                        </span>
                      </div>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <p className="text-white/50 text-xs md:text-sm font-body leading-relaxed pt-2 border-t border-white/[0.05] mt-1">
                              {b.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* SECTION 3: The Showroom Selector */}
            <div className="border-t border-white/[0.08] pt-12">
              <FadeInUpContainer>
                <h3 className="font-display font-black text-2xl text-white uppercase tracking-wider mb-2">
                  La Parrilla Activa (Catálogo Comercial)
                </h3>
                <p className="text-white/40 font-body text-xs md:text-sm mb-8">
                  Selecciona un programa para simular su integración de marca en la consola del stream y solicitar auspicio directo.
                </p>
              </FadeInUpContainer>

              <div className="flex flex-col gap-4">
                {/* General sponsorship button/card */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleSponsorSelect('general', 'Todos / General')}
                  className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer relative overflow-hidden transition-all duration-300 ${
                    selectedProgramId === 'general'
                      ? 'bg-white/[0.02] border-white/20'
                      : 'bg-white/[0.005] border-white/[0.04] hover:bg-white/[0.01]'
                  }`}
                  style={{
                    borderColor: selectedProgramId === 'general' ? '#67B94666' : 'rgba(255,255,255,0.04)',
                    boxShadow: selectedProgramId === 'general' ? '0 10px 25px -10px rgba(103,185,70,0.25)' : 'none'
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-ninja-green" />
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-3xl p-2.5 rounded-lg bg-white/5 flex items-center justify-center select-none">🥷</span>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-black text-base text-white tracking-wide">Todos / Campaña General</span>
                        <span className="text-[8px] font-display font-bold px-2 py-0.5 rounded uppercase text-white/50 bg-white/5 tracking-wider">
                          Lunes a Viernes
                        </span>
                      </div>
                      <p className="text-white/40 text-xs font-body leading-relaxed max-w-lg mt-0.5">
                        Auspicio global distribuido a lo largo de toda nuestra programación semanal con alta rotación de banners y menciones integradas.
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-stretch gap-2.5 sm:text-right border-t sm:border-t-0 border-white/[0.05] pt-3 sm:pt-0">
                    <div className="flex-1 text-[10px] font-display text-white/50 flex flex-col gap-0.5 justify-center">
                      <div>Host: <span className="text-white font-bold">Equipo Ninja</span></div>
                      <div>Target: <span className="font-bold text-ninja-green">Geek Global</span></div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSponsorSelect('general', 'Todos / General')
                        handleApplyClick()
                      }}
                      className="px-4 py-2 rounded-lg font-display font-black text-[10px] text-center border uppercase transition-all duration-300 text-white bg-white/5 hover:bg-white/10 cursor-pointer border-ninja-green/60"
                    >
                      Auspiciar
                    </button>
                  </div>
                </motion.div>

                {/* Specific active programs */}
                {activePrograms.map((prog) => {
                  const isSelected = selectedProgramId === prog.id
                  return (
                    <motion.div
                      key={prog.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleSponsorSelect(prog.id, prog.title)}
                      className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer relative overflow-hidden transition-all duration-300 ${
                        isSelected 
                          ? 'bg-white/[0.02] border-white/20' 
                          : 'bg-white/[0.005] border-white/[0.04] hover:bg-white/[0.01]'
                      }`}
                      style={{
                        borderColor: isSelected ? `${prog.color}66` : 'rgba(255,255,255,0.04)',
                        boxShadow: isSelected ? `0 10px 25px -10px ${prog.color}25` : 'none'
                      }}
                    >
                      {/* Interactive banner color top */}
                      <div className="absolute top-0 left-0 right-0 h-[2.5px]" style={{ backgroundColor: prog.color }} />

                      <div className="flex items-start gap-4 flex-1">
                        <span className="text-3xl p-2.5 rounded-lg bg-white/5 flex items-center justify-center select-none">
                          {prog.emoji}
                        </span>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-black text-base text-white tracking-wide">{prog.title}</span>
                            <span className="text-[8px] font-display font-bold px-2 py-0.5 rounded uppercase text-white/50 bg-white/5 tracking-wider">
                              {prog.day} @ 9:00 PM
                            </span>
                          </div>
                          <p className="text-white/40 text-xs font-body leading-relaxed max-w-lg mt-0.5">
                            {prog.sponsorText}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-stretch gap-2.5 sm:text-right border-t sm:border-t-0 border-white/[0.05] pt-3 sm:pt-0">
                        <div className="flex-1 text-[10px] font-display text-white/50 flex flex-col gap-0.5 justify-center">
                          <div>Host: <span className="text-white font-bold">{prog.talents.join(', ')}</span></div>
                          <div>Target: <span className="font-bold" style={{ color: prog.color }}>{prog.segment}</span></div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSponsorSelect(prog.id, prog.title)
                            handleApplyClick()
                          }}
                          className="px-4 py-2 rounded-lg font-display font-black text-[10px] text-center border uppercase transition-all duration-300 text-white bg-white/5 hover:bg-white/10 cursor-pointer"
                          style={{ borderColor: `${prog.color}99` }}
                        >
                          Auspiciar
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* SECTION 4: Collaboration Formats Panel */}
            <div className="border-t border-white/[0.08] pt-12">
              <FadeInUpContainer>
                <h3 className="font-display font-black text-2xl text-white uppercase tracking-wider mb-2">
                  Formatos de Colaboración
                </h3>
                <p className="text-white/40 font-body text-xs md:text-sm mb-8">
                  Formatos dinámicos diseñados para encajar en el formato de entretenimiento en vivo.
                </p>
              </FadeInUpContainer>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sponsorFormats.map((f) => (
                  <div 
                    key={f.id}
                    className="p-5 rounded-xl bg-white/[0.005] border border-white/[0.04] hover:border-red-500/20 hover:bg-white/[0.01] transition-all duration-300 flex flex-col gap-3 relative overflow-hidden group shadow-lg"
                  >
                    <span className="text-[8px] font-display font-black text-red-500 tracking-wider uppercase bg-red-500/10 px-2 py-1.5 rounded border border-red-500/15 w-fit">
                      {f.badge}
                    </span>
                    <h4 className="font-display font-black text-xs md:text-sm text-white">{f.title}</h4>
                    <p className="text-white/40 text-xs font-body leading-relaxed">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: Contact Contract Form (Cyberpunk Terminal Style) */}
            <div id="commercial-contract-form" className="border-t border-white/[0.08] pt-12">
              <FadeInUpContainer>
                <h3 className="font-display font-black text-2xl text-white uppercase tracking-wider mb-2">
                  Propuesta Alianza Comercial
                </h3>
                <p className="text-white/40 font-body text-xs md:text-sm mb-10">
                  Establece el canal comercial. Completa la consola de solicitud comercial a continuación.
                </p>
              </FadeInUpContainer>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="terminal-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 rounded-2xl bg-black border border-green-500/30 text-left font-mono text-xs md:text-sm shadow-2xl flex flex-col gap-4 min-h-[380px] justify-center relative overflow-hidden"
                  >
                    {/* Simulated terminal lines */}
                    <div className="text-green-500 font-bold mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                      <span>[NINJA-NET] CONEXIÓN ESTABLECIDA CON ÉXITO</span>
                    </div>
                    <div className="text-white/70">
                      <p className="mb-2">{`> INITIALIZING HANDSHAKE PROTOCOL... DONE.`}</p>
                      <p className="mb-2">{`> ENCRYPTING COMMERCIAL INTEREST DATA... DONE.`}</p>
                      <p className="mb-6 text-green-400">{`> REDIRECTING ENVELOPE TO: Contacto@ninjahouseshow.com`}</p>
                      <p className="mb-6 text-white/50">{`> POR FAVOR, ENVÍA EL CORREO CORREO GENERADO PARA FINALIZAR.`}</p>
                    </div>

                    <div className="flex items-center gap-3 text-white/40 font-sans">
                      <span>Abriendo gestor de correo</span>
                      <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-transparent animate-spin" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="terminal-form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-6 md:p-8 rounded-2xl bg-[#0b0b0d] border backdrop-blur-xl flex flex-col gap-6 text-left relative overflow-hidden shadow-2xl transition-all duration-700 ${
                      highlightForm ? 'border-red-500 shadow-[0_0_35px_rgba(220,38,38,0.2)]' : 'border-white/[0.06]'
                    }`}
                  >
                    {/* Terminal header line decoration */}
                    <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 text-[9px] font-display font-black text-white/30 uppercase tracking-widest">
                      <span>FORMULARIO DE ALIANZA (CONTRATO)</span>
                      <span>SECURE_CONNECTION</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5 font-mono text-xs">
                        <label className="text-white/40 uppercase font-black text-[10px] tracking-wider">{`[01] NOMBRE COMPLETO >`}</label>
                        <input
                          type="text"
                          required
                          placeholder="Tu nombre y apellido"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 text-white placeholder-white/20 text-xs focus:outline-none focus:border-red-500 focus:bg-white/[0.04] transition-all font-sans"
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5 font-mono text-xs">
                        <label className="text-white/40 uppercase font-black text-[10px] tracking-wider">{`[02] EMAIL CORPORATIVO >`}</label>
                        <input
                          type="email"
                          required
                          placeholder="correo@empresa.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 text-white placeholder-white/20 text-xs focus:outline-none focus:border-red-500 focus:bg-white/[0.04] transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Company */}
                      <div className="flex flex-col gap-1.5 font-mono text-xs">
                        <label className="text-white/40 uppercase font-black text-[10px] tracking-wider">{`[03] MARCA / EMPRESA >`}</label>
                        <input
                          type="text"
                          required
                          placeholder="Marca"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 text-white placeholder-white/20 text-xs focus:outline-none focus:border-red-500 focus:bg-white/[0.04] transition-all font-sans"
                        />
                      </div>

                      {/* Role */}
                      <div className="flex flex-col gap-1.5 font-mono text-xs">
                        <label className="text-white/40 uppercase font-black text-[10px] tracking-wider">{`[04] CARGO >`}</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Gerente de Marketing"
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          className="px-4 py-3 rounded-lg bg-white/[0.02] border border-white/10 text-white placeholder-white/20 text-xs focus:outline-none focus:border-red-500 focus:bg-white/[0.04] transition-all font-sans"
                        />
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-1.5 font-mono text-xs">
                        <label className="text-white/40 uppercase font-black text-[10px] tracking-wider">{`[05] TELEFONO (OPC.) >`}</label>
                        <input
                          type="text"
                          placeholder="+51 987..."
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="px-4 py-3 rounded-lg bg-white/[0.02] border border-white/10 text-white placeholder-white/20 text-xs focus:outline-none focus:border-red-500 focus:bg-white/[0.04] transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Interest Type Custom Dropdown */}
                      <CustomDropdown
                        label="[06] Tipo de interés >"
                        options={interestTypeOptions}
                        selectedValue={form.interestType}
                        onSelect={(val) => setForm((prev) => ({ ...prev, interestType: val }))}
                        isOpen={isOpenInterest}
                        setIsOpen={(val) => {
                          setIsOpenInterest(val)
                          if (val) setIsOpenProgram(false)
                        }}
                        color={currentProgram.color}
                      />

                      {/* Program selection Custom Dropdown */}
                      <CustomDropdown
                        label="[07] Programa target >"
                        options={programOptions}
                        selectedValue={form.program}
                        onSelect={(val) => {
                          setForm((prev) => ({ ...prev, program: val }))
                          const match = activePrograms.find((p) => p.title === val)
                          setSelectedProgramId(match ? match.id : 'general')
                        }}
                        isOpen={isOpenProgram}
                        setIsOpen={(val) => {
                          setIsOpenProgram(val)
                          if (val) setIsOpenInterest(false)
                        }}
                        color={currentProgram.color}
                      />
                    </div>

                    {/* SECTION: Custom Cyberpunk Budget Slider */}
                    <div className="flex flex-col gap-3 font-mono text-xs mt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-white/40 uppercase font-black text-[10px] tracking-wider">{`[08] PRESUPUESTO ESTIMADO >`}</label>
                        <span className="font-sans font-bold text-xs uppercase" style={{ color: currentProgram.color }}>
                          {budgetLabels[budgetIndex]}
                        </span>
                      </div>
                      
                      <div className="relative mt-2 px-1">
                        <input 
                          type="range"
                          min="0"
                          max="4"
                          step="1"
                          value={budgetIndex}
                          onChange={(e) => setBudgetIndex(parseInt(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
                          style={{
                            accentColor: currentProgram.color
                          }}
                        />
                        <div className="flex justify-between text-[7px] text-white/30 uppercase font-bold mt-2.5 font-display select-none">
                          <span>Por definir</span>
                          <span>Bajo</span>
                          <span>Medio</span>
                          <span>Alto</span>
                          <span>Corporativo</span>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5 font-mono text-xs mt-2">
                      <label className="text-white/40 uppercase font-black text-[10px] tracking-wider">{`[09] NOTA DE PROPUESTA (DETALLES) >`}</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe tus metas de auspicio, metas comerciales, productos..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="px-4 py-3 rounded-lg bg-white/[0.02] border border-white/10 text-white placeholder-white/20 text-xs focus:outline-none focus:border-red-500 focus:bg-white/[0.04] transition-all resize-none font-sans"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={submitted}
                      className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-display font-black text-xs md:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/10 relative overflow-hidden group tracking-widest uppercase font-mono mt-2"
                    >
                      {submitted ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-transparent animate-spin" />
                          <span>SENDING ALLIANCE REQUEST...</span>
                        </>
                      ) : (
                        <>
                          <span>⚡ COMPILAR ALLIANCE_REQUEST.EXE</span>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>

      {/* MOBILE ONLY STICKY MINI-PLAYER DOCK */}
      <AnimatePresence>
        {showFloatingPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="fixed bottom-4 right-4 z-50 w-40 aspect-video rounded-xl bg-[#0c0c0e] border shadow-2xl overflow-hidden cursor-pointer flex items-center justify-center group pointer-events-auto print:hidden"
            style={{ borderColor: `${currentProgram.color}88` }}
          >
            {/* Blurred Backdrop image */}
            {selectedProgramId !== 'general' && currentProgram.image && (
              <img 
                src={currentProgram.image} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[2px] pointer-events-none"
              />
            )}
            
            {/* Live Indicator inside mobile dock */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-1 py-0.5 rounded text-[7px] font-display font-black uppercase text-red-500 border border-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              PREVIEW
            </div>

            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <span className="text-xl filter drop-shadow-md">{currentProgram.emoji}</span>
              <span className="text-[7px] font-display font-black truncate max-w-[85px] uppercase text-white/95 tracking-wide">
                {form.company || 'TU MARCA'}
              </span>
            </div>
            
            {/* Hover overlay text */}
            <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-[7px] font-display font-black tracking-wider uppercase text-white">
              Volver a Consola ↑
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
