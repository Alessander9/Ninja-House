import { Link } from 'react-router-dom'
import { metricsData } from '../data/metrics'
import { programsData } from '../data/programs'
import { motion } from 'framer-motion'

// Shared Animation Variants for a professional feel
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
} as const

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
} as const

export function MediaKitPage() {
  const handlePrint = () => {
    window.print()
  }

  // Filter out Lanzalo for commercial consistency
  const activePrograms = programsData.filter((p) => p.id !== 'lanzalo')

  return (
    <div className="min-h-screen bg-ninja-black text-white pt-28 pb-20 relative overflow-hidden print:bg-white print:text-black print:pt-4 print:pb-4">
      
      {/* Background decoration (hidden during print) */}
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none print:hidden z-0" />
      <div 
        className="absolute top-0 left-0 w-[550px] h-[550px] pointer-events-none rounded-full print:hidden z-0"
        style={{ background: 'radial-gradient(circle, rgba(103,185,70,0.05) 0%, transparent 70%)', filter: 'blur(100px)' }}
      />
      <div 
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none rounded-full print:hidden z-0"
        style={{ background: 'radial-gradient(circle, rgba(176,26,25,0.05) 0%, transparent 70%)', filter: 'blur(90px)' }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Navigation & Controls (hidden during print) */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8 print:hidden"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white font-display text-sm font-bold group transition-colors">
            <span className="text-ninja-green group-hover:text-white group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Volver al Inicio</span>
          </Link>
          <button 
            onClick={handlePrint}
            className="px-5 py-2.5 bg-ninja-green text-ninja-black font-display font-black text-xs rounded-xl hover:scale-105 transition-all cursor-pointer shadow-lg shadow-ninja-green/15 relative overflow-hidden group/btn"
          >
            <span className="relative z-10">🖨️ IMPRIMIR / PDF</span>
            <span className="absolute inset-0 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left bg-white/10 z-0" />
          </button>
        </motion.div>

        {/* Brand Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-16 pb-8 border-b border-white/[0.08] print:border-black/20 print:mb-8"
        >
          <div className="text-center md:text-left">
            <img 
              src="/assets/NinjaLOGO.png" 
              alt="Ninja House Logo" 
              className="h-16 w-auto object-contain mx-auto md:mx-0 mb-4 print:h-12"
            />
            <h1 className="font-display font-black text-4xl md:text-5xl tracking-tight uppercase">
              Media Kit <span className="text-ninja-green print:text-black">2026</span>
            </h1>
            <p className="text-white/40 print:text-black/60 font-body text-xs md:text-sm mt-1">
              Ninja House Show — Ecosistema de influencia geek y entretenimiento en vivo.
            </p>
          </div>
          <div className="text-center md:text-right flex flex-col gap-1 print:text-right">
            <span className="text-[10px] font-display font-black tracking-widest text-white/40 print:text-black/45 uppercase">Contacto Comercial</span>
            <a href="mailto:Contacto@ninjahouseshow.com" className="text-ninja-green print:text-black font-display font-bold hover:underline">
              Contacto@ninjahouseshow.com
            </a>
          </div>
        </motion.div>

        {/* Global Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 print:mb-10 print:grid-cols-3 print:gap-4"
        >
          {[
            { title: 'Audiencia Multiplataforma', value: '+169K', label: 'Seguidores consolidados', desc: 'Comunidad integrada y participativa' },
            { title: 'Alcance Mensual', value: '+1.2M', label: 'Impactos orgánicos', desc: 'Impresiones y reproducciones de video' },
            { title: 'Horas de Emisión', value: '10 Horas', label: 'En Vivo Semanales', desc: '5 transmisiones en horario prime' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              variants={fadeInUpVariants}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-white/[0.015] border border-white/[0.05] print:bg-neutral-100 print:border-neutral-200 flex flex-col gap-2 shadow-lg transition-all duration-300 text-center sm:text-left items-center sm:items-start"
            >
              <span className="text-white/40 print:text-black/50 text-[9px] font-display font-black uppercase tracking-wider">
                {stat.title}
              </span>
              <span 
                className="font-display font-black text-3xl md:text-4xl text-ninja-green print:text-black"
                style={{ textShadow: '0 0 20px rgba(103,185,70,0.15)' }}
              >
                {stat.value}
              </span>
              <span className="text-white font-display font-bold text-xs print:text-black">{stat.label}</span>
              <span className="text-white/30 print:text-black/45 text-[10px] font-body leading-normal">{stat.desc}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Platforms breakdown */}
        <div className="mb-16 print:mb-10 text-center md:text-left">
          <h2 className="font-display font-black text-xl md:text-2xl mb-8 uppercase tracking-wider print:text-black print:mb-4">
            Métricas por Plataforma
          </h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4"
          >
            {metricsData.map((metric) => (
              <motion.div 
                key={metric.id}
                variants={fadeInUpVariants}
                whileHover={{
                  y: -6,
                  borderColor: `${metric.color}66`,
                  boxShadow: `0 10px 25px -10px ${metric.color}25`
                }}
                className="p-6 rounded-2xl bg-white/[0.015] border border-white/[0.05] print:bg-neutral-100 print:border-neutral-200 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 shadow-lg group text-center md:text-left items-center md:items-start"
              >
                {/* Platform colored bar indicator (hidden in print) */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] print:hidden" style={{ backgroundColor: metric.color }} />
                
                <div className="flex flex-col sm:flex-row sm:justify-between items-center w-full gap-1">
                  <span className="text-[10px] font-display font-black tracking-widest uppercase" style={{ color: metric.color }}>
                    {metric.platform}
                  </span>
                  <span className="text-[10px] font-mono text-white/30 print:text-black/50">{metric.handle}</span>
                </div>

                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="font-display font-black text-3xl text-white print:text-black">
                    {metric.value.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-white/40 print:text-black/50 font-display font-bold uppercase tracking-wider">Seguidores</span>
                </div>

                <p className="text-white/45 print:text-black/60 text-xs md:text-sm font-body leading-relaxed text-center md:text-left">
                  {metric.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Section 3: Programs (Responsive Grid in Screen, Table in Print) */}
        <div className="mb-16 border-t border-white/[0.08] print:border-black/15 pt-12 print:pt-6 print:mb-10">
          <h2 className="font-display font-black text-xl md:text-2xl mb-8 uppercase tracking-wider print:text-black print:mb-4">
            Programación y Segmentos
          </h2>

          {/* SCREEN ONLY GRID VIEW */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden"
          >
            {activePrograms.map((prog) => (
              <motion.div
                key={prog.id}
                variants={fadeInUpVariants}
                whileHover={{ y: -6, borderColor: `${prog.color}66` }}
                className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.05] flex flex-col gap-4 relative overflow-hidden transition-all duration-300 shadow-md"
              >
                {/* Show indicator top line */}
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: prog.color }} />

                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl select-none">{prog.emoji}</span>
                    <span className="font-display font-black text-base text-white tracking-wide">{prog.title}</span>
                  </div>
                  <span className="text-[9px] font-display font-black px-2 py-0.5 rounded bg-white/5 text-white/50 tracking-wider">
                    {prog.day} @ 9:00 PM
                  </span>
                </div>

                <div className="flex flex-col gap-1 border-t border-b border-white/[0.05] py-3 text-[10px] font-display text-white/40">
                  <div>Categoría: <span className="text-white font-bold">{prog.category}</span></div>
                  <div>Hosts: <span className="text-white font-bold">{prog.talents.join(', ')}</span></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-display font-bold uppercase tracking-wider text-white/30">Target Principal</span>
                  <span className="text-xs font-display font-black" style={{ color: prog.color }}>{prog.segment}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* PRINT ONLY TABLE VIEW */}
          <div className="hidden print:block">
            <table className="w-full text-left text-xs text-black border-collapse">
              <thead>
                <tr className="border-b-2 border-black/20 text-black/50 font-display font-black text-[9px] uppercase tracking-wider">
                  <th className="pb-2 pr-4">Programa</th>
                  <th className="pb-2 px-4">Día / Hora</th>
                  <th className="pb-2 px-4">Categoría</th>
                  <th className="pb-2 px-4 text-right">Audiencia Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {activePrograms.map((prog) => (
                  <tr key={prog.id} className="text-black/80 font-body">
                    <td className="py-3 pr-4 font-display font-bold text-black">
                      {prog.emoji} {prog.title}
                    </td>
                    <td className="py-3 px-4">
                      {prog.day} @ 9:00 PM
                    </td>
                    <td className="py-3 px-4 text-black/60">
                      {prog.category}
                    </td>
                    <td className="py-3 px-4 text-right font-display font-bold text-black/90">
                      {prog.segment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commercial value proposal */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-white/[0.01] border border-white/[0.05] print:bg-neutral-100 print:border-neutral-200 flex flex-col gap-6 text-center md:text-left shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/0 to-red-600/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <h3 className="font-display font-black text-lg md:text-xl text-white print:text-black uppercase tracking-wider">
            Propuesta de valor para auspiciadores
          </h3>
          <p className="text-white/50 print:text-black/70 text-xs md:text-sm font-body leading-relaxed max-w-3xl">
            Ninja House Show no es un canal tradicional; es un punto de encuentro interactivo. Nuestra audiencia no solo consume, sino que comenta activamente y participa directamente en la construcción de cada transmisión. Te ofrecemos integraciones orgánicas de marca, branded content especializado y activaciones de alto impacto que garantizan un engagement superior frente a campañas publicitarias tradicionales.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start print:hidden">
            <Link 
              to="/contacto" 
              className="px-6 py-3 bg-ninja-green text-ninja-black font-display font-black text-xs rounded-xl hover:scale-105 transition-all shadow-lg shadow-ninja-green/10 relative overflow-hidden group/btn"
            >
              <span className="relative z-10">💼 Solicitar Tarifario Comercial</span>
              <span className="absolute inset-0 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left bg-white/10 z-0" />
            </Link>
            <a 
              href="mailto:Contacto@ninjahouseshow.com" 
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-display font-bold text-xs rounded-xl transition-all"
            >
              ✉️ Enviar correo directo
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
