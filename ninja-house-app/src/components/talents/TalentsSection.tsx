import { useState } from 'react'
import { motion } from 'framer-motion'
import { programsData } from '../../data/programs'

interface Talent {
  name: string
  programId: string
  programName: string
  color: string
  emoji: string
}

export function TalentsSection() {
  const [selectedProgram, setSelectedProgram] = useState<string>('all')

  // Generate unique list of talents with their respective programs
  const allTalents: Talent[] = []
  programsData.forEach((prog) => {
    prog.talents.forEach((t) => {
      // Avoid duplicate listing if any talent host is in multiple shows
      // but associate them with program info
      allTalents.push({
        name: t,
        programId: prog.id,
        programName: prog.title,
        color: prog.color,
        emoji: prog.emoji,
      })
    })
  })

  // Filter based on selected program tab
  const filteredTalents = selectedProgram === 'all'
    ? allTalents
    : allTalents.filter((t) => t.programId === selectedProgram)

  // Get initials of host
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <section id="talents" className="py-24 px-4 bg-ninja-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
      <div 
        className="absolute top-1/2 left-1/4 w-[500px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(103,185,70,0.06) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-ninja-green/10 border border-ninja-green/30 rounded-full text-ninja-green font-display font-bold text-xs tracking-widest mb-4">
            🎙️ TALENTOS EN PANTALLA
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2">
            El Equipo{' '}
            <span className="text-ninja-green" style={{ textShadow: '0 0 30px rgba(103,185,70,0.4)' }}>
              Ninja
            </span>
          </h2>
          <p className="text-white/40 mt-3 font-body max-w-xl mx-auto text-sm md:text-base">
            Conoce a los creadores, especialistas y conductores que dan vida a cada transmisión y conectan con la comunidad.
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedProgram('all')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all border ${
              selectedProgram === 'all'
                ? 'bg-ninja-green border-ninja-green text-ninja-black shadow-lg shadow-ninja-green/20'
                : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Todos
          </button>
          {programsData.map((prog) => (
            <button
              key={prog.id}
              onClick={() => setSelectedProgram(prog.id)}
              className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all border ${
                selectedProgram === prog.id
                  ? 'text-white shadow-lg'
                  : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
              style={{
                backgroundColor: selectedProgram === prog.id ? prog.color : undefined,
                borderColor: selectedProgram === prog.id ? prog.color : undefined,
                color: selectedProgram === prog.id ? '#151515' : undefined,
                boxShadow: selectedProgram === prog.id ? `0 4px 15px ${prog.color}44` : undefined
              }}
            >
              {prog.title}
            </button>
          ))}
        </div>

        {/* Talents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTalents.map((talent, index) => (
            <motion.div
              key={`${talent.name}-${talent.programId}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="p-6 rounded-2xl bg-ninja-card border border-white/5 hover:border-white/10 transition-all flex flex-col items-center text-center gap-4 group relative overflow-hidden"
              whileHover={{ y: -8 }}
            >
              {/* Program Accent line */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: talent.color }}
              />

              {/* Avatar structure - Placeholder prepared for real pictures */}
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center font-display font-black text-2xl relative overflow-hidden shadow-xl border border-white/10 transition-transform group-hover:scale-105 duration-300"
                style={{ 
                  background: `radial-gradient(circle, ${talent.color}33 0%, rgba(21,21,21,0.9) 100%)`,
                  color: talent.color,
                  boxShadow: `0 8px 24px ${talent.color}15`
                }}
              >
                {/* Simulated photo layout */}
                <span className="relative z-10">{getInitials(talent.name)}</span>
                
                {/* Grid Overlay effect to make it feel tech/geek */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                
                {/* Pulse circle on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full"
                  style={{ border: `2px solid ${talent.color}` }}
                />
              </div>

              {/* Info */}
              <div>
                <h4 className="font-display font-black text-base text-white group-hover:text-ninja-green transition-colors leading-tight">
                  {talent.name}
                </h4>
                
                {/* Program Badge */}
                <span 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-display font-bold mt-3 border"
                  style={{ 
                    backgroundColor: `${talent.color}11`, 
                    borderColor: `${talent.color}33`,
                    color: talent.color 
                  }}
                >
                  <span>{talent.emoji}</span>
                  <span>{talent.programName}</span>
                </span>
              </div>

              {/* Hover effect overlays */}
              <div 
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at center 30%, ${talent.color}05 0%, transparent 60%)`
                }}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
