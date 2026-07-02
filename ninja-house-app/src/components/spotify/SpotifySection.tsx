import { useState, useEffect } from 'react'

export function SpotifySection() {
  const [activeTab, setActiveTab] = useState<'music' | 'podcast'>('music')
  
  // Interactive dial hover states
  const [hoverBass, setHoverBass] = useState(false)
  const [hoverTreble, setHoverTreble] = useState(false)
  const [hoverGain, setHoverGain] = useState(false)

  // Cassette Deck states
  const [isTapePlaying, setIsTapePlaying] = useState(true)
  const [tapeRotation, setTapeRotation] = useState(0)
  const [vuNeedle, setVuNeedle] = useState(-55)

  // Active Tab Colors
  const activeColor = activeTab === 'music' ? '#a855f7' : '#67B946'

  // Bouncing cassette gears and VU needles loop
  useEffect(() => {
    let animFrame: number
    let time = 0
    
    const update = () => {
      time += 0.08
      
      if (isTapePlaying) {
        // Spin the reels
        setTapeRotation(r => (r + 1.6) % 360)
        
        // Bounce the VU needle simulating sound levels
        const noise = Math.sin(time * 2.2) * Math.cos(time * 0.95)
        const targetValue = -22 + noise * 22 // oscillates between -44 and 0
        setVuNeedle(prev => prev + (targetValue - prev) * 0.15)
      } else {
        // Needle drops back down to -55
        setVuNeedle(prev => Math.max(-55, prev - 1.8))
      }
      
      animFrame = requestAnimationFrame(update)
    }
    
    animFrame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animFrame)
  }, [isTapePlaying])

  // Needle coordinates calculations for VU L
  const angleRadL = ((90 - vuNeedle) * Math.PI) / 180
  const needleX_L = 50 + 32 * Math.cos(angleRadL)
  const needleY_L = 45 - 32 * Math.sin(angleRadL)

  // Needle coordinates calculations for VU R
  const rightNeedleAngle = vuNeedle + (isTapePlaying ? (Math.sin(Date.now() / 150) * 1.5) : 0)
  const angleRadR = ((90 - rightNeedleAngle) * Math.PI) / 180
  const needleX_R = 50 + 32 * Math.cos(angleRadR)
  const needleY_R = 45 - 32 * Math.sin(angleRadR)

  return (
    <section className="py-24 bg-[#0a0a0c] text-white relative overflow-hidden">
      
      {/* Abstract digital noise grids */}
      <div className="absolute inset-0 halftone-bg opacity-[0.06] pointer-events-none" />

      {/* Dynamic neon ambient glow */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full blur-[130px] opacity-10 pointer-events-none transition-colors duration-700"
        style={{
          top: '30%',
          right: '5%',
          background: `radial-gradient(circle, ${activeColor}4d 0%, transparent 70%)`
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{
          bottom: '10%',
          left: '5%',
          background: 'radial-gradient(circle, rgba(220,38,38,0.3) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Title Block */}
        <div className="text-center mb-10 max-w-2xl mx-auto flex flex-col items-center gap-3">
          <span 
            className="px-3 py-1 bg-white/[0.01] border text-purple-400 font-display font-black text-[10px] md:text-xs tracking-widest uppercase rounded-full transition-all duration-500"
            style={{ 
              borderColor: `${activeColor}33`, 
              color: activeColor,
              boxShadow: `0 0 15px ${activeColor}20`
            }}
          >
            🎵 NINJA MULTIMEDIA CONSOLE
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl text-white uppercase tracking-tight leading-tight">
            NINJA SHOW <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">SPOTIFY</span>
          </h2>
          <p className="text-white/40 font-body text-xs md:text-sm leading-relaxed">
            Sintoniza las producciones musicales y los episodios del podcast oficial de Ninja House en vivo directamente en tu navegador.
          </p>
        </div>

        {/* Console Channel Toggle Selector */}
        <div className="flex justify-center gap-4 mb-16 select-none">
          <button
            onClick={() => {
              setActiveTab('music')
              setIsTapePlaying(true)
            }}
            className={`px-5 py-2.5 rounded-xl font-display font-black text-xs tracking-wider uppercase border cursor-pointer transition-all duration-300 ${
              activeTab === 'music'
                ? 'bg-purple-600/10 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-white/[0.01] border-white/5 text-white/50 hover:text-white hover:border-white/20'
            }`}
          >
            🔊 BANDA SONORA
          </button>
          <button
            onClick={() => {
              setActiveTab('podcast')
              setIsTapePlaying(true)
            }}
            className={`px-5 py-2.5 rounded-xl font-display font-black text-xs tracking-wider uppercase border cursor-pointer transition-all duration-300 ${
              activeTab === 'podcast'
                ? 'bg-ninja-green/10 border-ninja-green text-ninja-green shadow-[0_0_15px_rgba(103,185,70,0.25)]'
                : 'bg-white/[0.01] border-white/5 text-white/50 hover:text-white hover:border-white/20'
            }`}
          >
            🎙️ NARRANDO CÓMICS
          </button>
        </div>

        {/* Dual Console Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* COLUMN 1: Official Player Cabinet (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Audio player housing frame */}
            <div 
              className="p-6 rounded-3xl bg-white/[0.015] border backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-700"
              style={{
                borderColor: `${activeColor}22`,
                boxShadow: `0 20px 45px -15px ${activeColor}15`,
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.012) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.012) 1px, transparent 1px)
                `,
                backgroundSize: '36px 36px',
                backgroundPosition: 'center'
              }}
            >
              {/* 4 Corner Chassis metallic Hex Screws */}
              <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-neutral-600 to-neutral-800 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]" />
              <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-neutral-600 to-neutral-800 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]" />
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-neutral-600 to-neutral-800 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]" />
              <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-neutral-600 to-neutral-800 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]" />

              {/* LED Status indicators */}
              <div className="absolute top-5 left-6 flex gap-2 items-center z-20">
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: activeColor }} />
                <span className="text-[7px] font-mono tracking-wider font-bold transition-colors duration-500" style={{ color: activeColor }}>
                  {activeTab === 'music' ? 'SPOTIFY_SONGS_ACTIVE' : 'SPOTIFY_PODCAST_ACTIVE'}
                </span>
              </div>
              <div className="absolute top-5 right-6 flex gap-1.5 items-center z-20 font-mono text-[7px] text-white/30 tracking-widest select-none">
                <span>OFFICIAL_PLAYER</span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-sm" />
              </div>

              {/* DYNAMIC CABINET SCREEN CONTAINER */}
              <div className="relative z-10 mt-6 rounded-2xl overflow-hidden bg-black border border-white/[0.08] h-[380px] shadow-[inset_0_4px_12px_rgba(0,0,0,0.85)] flex flex-col justify-between">
                
                {/* Scanline overlay for screen effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none z-20" />

                {/* CRT Glass glare reflection overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none z-30 opacity-[0.08] mix-blend-screen"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)'
                  }}
                />

                {isTapePlaying ? (
                  <iframe 
                    src={
                      activeTab === 'music'
                        ? 'https://open.spotify.com/embed/artist/5DZGlxw1RT4WCpNEHDb29f?utm_source=generator&theme=0'
                        : 'https://open.spotify.com/embed/show/0WboSmldhViXe56Mocs0cs?utm_source=generator&theme=0'
                    } 
                    width="100%" 
                    height="380" 
                    frameBorder="0" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    className="w-full relative z-10 transition-opacity duration-350"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#060609] relative p-8 select-none">
                    {/* Blinking red standby diode */}
                    <div className="w-16 h-16 rounded-full border border-dashed border-red-500/20 flex items-center justify-center mb-6 animate-pulse">
                      <span className="w-3.5 h-3.5 rounded-full bg-red-600 animate-ping" />
                    </div>
                    <div className="text-center flex flex-col gap-2 relative z-10">
                      <span className="font-mono text-[9px] text-red-500/80 tracking-widest font-black uppercase">
                        ⚠️ TAPE STANDBY / SIGNAL DISCONNECTED
                      </span>
                      <span className="font-display font-black text-xs text-white/50 uppercase tracking-wider">
                        CONEXIÓN DECK DETENIDA
                      </span>
                      <span className="font-mono text-[8px] text-white/30 tracking-wider">
                        [ PRESIONA PLAY EN EL DECK DERECHO PARA TRANSMITIR ]
                      </span>
                    </div>
                    {/* Subtle matrix-like grid in the background */}
                    <div className="absolute inset-0 bg-grid-white opacity-[0.015] pointer-events-none" />
                  </div>
                )}

              </div>

              {/* Analog mock dials at base */}
              <div className="relative z-10 mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 px-2">
                
                {/* Interactive Knobs */}
                <div className="flex gap-5">
                  
                  {/* BASS Dial */}
                  <div 
                    className="flex flex-col gap-1 items-center"
                    onMouseEnter={() => setHoverBass(true)}
                    onMouseLeave={() => setHoverBass(false)}
                  >
                    <div 
                      className="w-7 h-7 rounded-full border bg-gradient-to-b from-neutral-800 to-neutral-950 relative flex items-center justify-center shadow-md select-none transition-all duration-300 cursor-pointer"
                      style={{ 
                        transform: `rotate(${hoverBass ? -15 : -45}deg)`,
                        borderColor: hoverBass ? activeColor : 'rgba(255,255,255,0.18)',
                        boxShadow: hoverBass ? `0 0 8px ${activeColor}33` : 'none'
                      }}
                    >
                      <div 
                        className="w-0.5 h-3 absolute top-0.5 rounded-full transition-colors duration-300" 
                        style={{ backgroundColor: hoverBass ? activeColor : 'rgba(255,255,255,0.45)' }}
                      />
                    </div>
                    <span className="text-[5.5px] font-mono text-white/35 uppercase tracking-wider">BASS</span>
                    <span className="text-[5px] font-mono transition-colors duration-300 font-bold" style={{ color: hoverBass ? activeColor : 'rgba(255,255,255,0.18)' }}>
                      {hoverBass ? '+4.2 dB' : '+0.0 dB'}
                    </span>
                  </div>

                  {/* TREBLE Dial */}
                  <div 
                    className="flex flex-col gap-1 items-center"
                    onMouseEnter={() => setHoverTreble(true)}
                    onMouseLeave={() => setHoverTreble(false)}
                  >
                    <div 
                      className="w-7 h-7 rounded-full border bg-gradient-to-b from-neutral-800 to-neutral-950 relative flex items-center justify-center shadow-md select-none transition-all duration-300 cursor-pointer"
                      style={{ 
                        transform: `rotate(${hoverTreble ? 45 : 10}deg)`,
                        borderColor: hoverTreble ? activeColor : 'rgba(255,255,255,0.18)',
                        boxShadow: hoverTreble ? `0 0 8px ${activeColor}33` : 'none'
                      }}
                    >
                      <div 
                        className="w-0.5 h-3 absolute top-0.5 rounded-full transition-colors duration-300" 
                        style={{ backgroundColor: hoverTreble ? activeColor : 'rgba(255,255,255,0.45)' }}
                      />
                    </div>
                    <span className="text-[5.5px] font-mono text-white/35 uppercase tracking-wider">TREBLE</span>
                    <span className="text-[5px] font-mono transition-colors duration-300 font-bold" style={{ color: hoverTreble ? activeColor : 'rgba(255,255,255,0.18)' }}>
                      {hoverTreble ? '+2.8 dB' : '+0.0 dB'}
                    </span>
                  </div>

                  {/* GAIN Dial */}
                  <div 
                    className="flex flex-col gap-1 items-center"
                    onMouseEnter={() => setHoverGain(true)}
                    onMouseLeave={() => setHoverGain(false)}
                  >
                    <div 
                      className="w-7 h-7 rounded-full border bg-gradient-to-b from-neutral-800 to-neutral-950 relative flex items-center justify-center shadow-md select-none transition-all duration-300 cursor-pointer"
                      style={{ 
                        transform: `rotate(${hoverGain ? 125 : 90}deg)`,
                        borderColor: hoverGain ? activeColor : 'rgba(255,255,255,0.18)',
                        boxShadow: hoverGain ? `0 0 8px ${activeColor}33` : 'none'
                      }}
                    >
                      <div 
                        className="w-0.5 h-3 absolute top-0.5 rounded-full transition-colors duration-300" 
                        style={{ backgroundColor: hoverGain ? activeColor : 'rgba(255,255,255,0.45)' }}
                      />
                    </div>
                    <span className="text-[5.5px] font-mono text-white/35 uppercase tracking-wider">GAIN</span>
                    <span className="text-[5px] font-mono transition-colors duration-300 font-bold" style={{ color: hoverGain ? activeColor : 'rgba(255,255,255,0.18)' }}>
                      {hoverGain ? '+9.5 dB' : '+6.0 dB'}
                    </span>
                  </div>

                </div>

                {/* Console branding & printed serial */}
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1.5 font-display text-[9px] font-black transition-colors duration-500 select-none" style={{ color: activeColor }}>
                    <span>🥷</span>
                    <span className="tracking-widest">NINJA CONSOLE v2.0</span>
                  </div>
                  <span className="font-mono text-[4.5px] text-white/15 tracking-widest select-none">
                    MODEL: NH-PLAYER // REF: 5DZG-0WBO // ID: 9BC2
                  </span>
                </div>

              </div>

            </div>

            {/* CALL TO ACTION BUTTON: FOLLOW ON SPOTIFY */}
            <div className="mt-4">
              <a 
                href={activeTab === 'music' ? 'https://open.spotify.com/intl-es/artist/5DZGlxw1RT4WCpNEHDb29f' : 'https://open.spotify.com/show/0WboSmldhViXe56Mocs0cs'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl text-white font-display font-black text-xs md:text-sm tracking-widest text-center shadow-lg transition-all duration-300 uppercase flex items-center justify-center gap-2 select-none relative overflow-hidden group cursor-pointer border"
                style={{
                  backgroundColor: activeTab === 'music' ? '#7c3aed' : '#15803d',
                  borderColor: `${activeColor}44`,
                  boxShadow: `0 10px 25px -10px ${activeColor}55`
                }}
              >
                {/* Spotify SVG Icon */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-1.02-.336.073-.668-.14-.74-.477-.074-.337.14-.668.477-.74 3.85-.88 7.15-.5 9.81 1.13.294.18.385.564.206.86zm1.226-2.722c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.185-.41.124-.847-.11-.97-.52-.124-.412.11-.847.52-.97 3.66-1.112 8.24-.567 11.34 1.34.368.227.488.708.26 1.075zm.106-2.835C14.592 8.7 9.102 8.52 5.923 9.485c-.482.146-.988-.128-1.134-.61-.147-.483.128-.988.61-1.134 3.655-1.11 9.7-.9 13.52 1.37.435.258.578.816.32 1.25-.258.435-.815.577-1.25.32z"/>
                </svg>
                <span>
                  {activeTab === 'music' ? 'Seguir en Spotify Artist' : 'Seguir Podcast en Spotify'}
                </span>
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-[650px] ease" />
              </a>
            </div>

          </div>

          {/* COLUMN 2: Audio Cassette Tape Deck (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* Audio Cassette Tape Deck casing */}
            <div 
              className="p-6 rounded-3xl bg-white/[0.015] border backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-700 flex flex-col justify-between h-[516px]"
              style={{
                borderColor: `${activeColor}22`,
                boxShadow: `0 20px 45px -15px ${activeColor}15`,
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.012) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.012) 1px, transparent 1px)
                `,
                backgroundSize: '36px 36px',
                backgroundPosition: 'center'
              }}
            >
              {/* 4 Corner Screws */}
              <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-neutral-600 to-neutral-800 border border-white/10" />
              <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-neutral-600 to-neutral-800 border border-white/10" />
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-neutral-600 to-neutral-800 border border-white/10" />
              <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-neutral-600 to-neutral-800 border border-white/10" />

              {/* Title / Header */}
              <div className="flex justify-between items-center select-none relative z-10 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isTapePlaying ? 'animate-ping' : ''}`} style={{ backgroundColor: activeColor }} />
                  <h4 className="font-display font-black text-xs tracking-wider uppercase text-white/80">
                    📟 CASSETTE DECK
                  </h4>
                </div>
                <span className="font-mono text-[7px] text-white/30 tracking-widest uppercase">
                  {isTapePlaying ? 'STATUS: PLAYING' : 'STATUS: PAUSED'}
                </span>
              </div>

              {/* CASSETTE REALISTIC CHASSIS */}
              <div className="relative z-10 w-full aspect-[1.58/1] bg-gradient-to-b from-[#16161a] to-[#0a0a0c] border-[5px] border-[#222227] rounded-2xl p-3.5 shadow-[0_20px_45px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden relative">
                
                {/* 4 Corner metallic screws with slot line */}
                <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-neutral-600 to-neutral-800 border border-white/10 flex items-center justify-center shadow-inner">
                  <div className="w-1.5 h-0.5 bg-neutral-950 rotate-45" />
                </div>
                <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-neutral-600 to-neutral-800 border border-white/10 flex items-center justify-center shadow-inner">
                  <div className="w-1.5 h-0.5 bg-neutral-950 -rotate-12" />
                </div>
                <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-neutral-600 to-neutral-800 border border-white/10 flex items-center justify-center shadow-inner">
                  <div className="w-1.5 h-0.5 bg-neutral-950 rotate-[70deg]" />
                </div>
                <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-neutral-600 to-neutral-800 border border-white/10 flex items-center justify-center shadow-inner">
                  <div className="w-1.5 h-0.5 bg-neutral-950 rotate-[120deg]" />
                </div>

                {/* Upper Compact Label Sticker with horizontal stripes */}
                <div 
                  className="w-[92%] h-[40%] bg-[#dedde2] rounded-lg p-3 flex flex-col justify-between border-t-[6px] shadow-md relative overflow-hidden mx-auto z-10"
                  style={{ borderColor: activeColor }}
                >
                  {/* Colorful Retro Stripes */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-green-500 opacity-80" />
                  
                  {/* Sticker lines for notes */}
                  <div className="absolute inset-x-2 top-8 bottom-2 border-b border-black/[0.04] pointer-events-none" />

                  {/* Centered Large Bold Song Title */}
                  <div className="flex flex-col items-center justify-center text-center w-full h-full relative z-10 py-1">
                    <span className="text-[5.5px] font-mono text-neutral-500 uppercase tracking-widest font-black leading-none">NINJA CASSETTE</span>
                    <span className="text-[11px] md:text-[12.5px] font-display font-black uppercase tracking-wide leading-snug text-neutral-900 border-b border-dashed border-neutral-400/40 pb-1 mt-1.5 w-full whitespace-normal text-center select-all" style={{ color: '#111116' }}>
                      {activeTab === 'music' ? 'NINJA HOUSE - BANDA SONORA VOL.1' : 'NARRANDO CÓMICS - SHOW OFICIAL'}
                    </span>
                    <span className="text-[6.5px] font-mono font-bold text-neutral-600 mt-1 uppercase tracking-wider">
                      {activeTab === 'music' ? 'Artist: Ninja House // Side A' : 'Spotify Official Podcast Show'}
                    </span>
                  </div>
                  
                  <span className="absolute top-2.5 right-3 text-[7.5px] font-mono font-black text-neutral-700 border border-neutral-400 px-1 rounded leading-none select-none">A</span>
                </div>

                {/* Middle transparent window screen */}
                <div className="w-[68%] h-[24%] bg-black/90 rounded-xl border border-white/5 mx-auto relative flex items-center justify-between px-6 overflow-hidden shadow-[inset_0_3px_8px_rgba(0,0,0,0.95)] z-10">
                  
                  {/* Spooled brown magnetic tape behind reels */}
                  <div className="absolute inset-y-1 left-3 bg-[#4b3327] rounded-full transition-all duration-500 shadow-md" style={{ width: '38%', height: '88%', alignSelf: 'center' }} />
                  <div className="absolute inset-y-1 right-3 bg-[#4b3327] rounded-full transition-all duration-500 shadow-md" style={{ width: '34%', height: '88%', alignSelf: 'center' }} />

                  {/* LEFT REEL HUB */}
                  <div className="w-7 h-7 relative flex items-center justify-center z-10">
                    <div 
                      className="w-full h-full text-neutral-400 transition-transform duration-75"
                      style={{ transform: `rotate(${tapeRotation}deg)` }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                        <circle cx="50" cy="50" r="42" fill="#15151a" stroke="#444" strokeWidth="4" />
                        <path d="M 50,5 L 50,95 M 5,50 L 95,50 M 18.3,18.3 L 81.7,81.7 M 18.3,81.7 L 81.7,18.3" stroke="#888" strokeWidth="12" />
                        <circle cx="50" cy="50" r="24" fill="#000" />
                        <circle cx="50" cy="50" r="10" fill="#15151a" />
                      </svg>
                    </div>
                  </div>

                  {/* Tape meter marks in center of window */}
                  <div className="absolute inset-x-0 bottom-0.5 flex justify-center gap-2 text-[4.5px] text-white/20 font-mono tracking-tighter select-none">
                    <span>0</span><span>..</span><span>50</span><span>..</span><span>100</span>
                  </div>

                  {/* RIGHT REEL HUB */}
                  <div className="w-7 h-7 relative flex items-center justify-center z-10">
                    <div 
                      className="w-full h-full text-neutral-400 transition-transform duration-75"
                      style={{ transform: `rotate(${tapeRotation}deg)` }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                        <circle cx="50" cy="50" r="42" fill="#15151a" stroke="#444" strokeWidth="4" />
                        <path d="M 50,5 L 50,95 M 5,50 L 95,50 M 18.3,18.3 L 81.7,81.7 M 18.3,81.7 L 81.7,18.3" stroke="#888" strokeWidth="12" />
                        <circle cx="50" cy="50" r="24" fill="#000" />
                        <circle cx="50" cy="50" r="10" fill="#15151a" />
                      </svg>
                    </div>
                  </div>

                </div>

                {/* Bottom tape Trapezoid guide */}
                <div className="w-[74%] h-[16%] bg-[#121215] rounded-t-xl mx-auto border-t border-[#26262b] relative flex items-center justify-between px-10 pt-1 select-none z-10">
                  <div className="w-3 h-3 rounded-full bg-black border border-neutral-800 shadow-inner flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  </div>
                  <div className="w-6 h-2 bg-[#09090b] rounded-sm border border-neutral-850" />
                  <div className="w-3 h-3 rounded-full bg-black border border-neutral-800 shadow-inner flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  </div>
                </div>

              </div>

              {/* MECHANICAL VU METERS DISPLAY */}
              <div className="mt-4 bg-black/45 rounded-2xl border border-white/[0.05] p-3 flex flex-col gap-2 shadow-inner select-none relative">
                <span className="text-[6px] font-mono text-white/30 uppercase tracking-widest text-center">LEVEL TELEMETRY (VU)</span>
                
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* LEFT VU METER */}
                  <div 
                    className="border border-neutral-850 rounded-xl p-2 relative overflow-hidden h-20 flex flex-col justify-end items-center transition-all duration-500 shadow-md"
                    style={{
                      backgroundColor: isTapePlaying ? '#161512' : '#0c0c0d',
                      boxShadow: isTapePlaying ? `inset 0 0 12px ${activeColor}20` : 'none'
                    }}
                  >
                    
                    {/* Vintage Meter Face (Backlight warm yellow glow) */}
                    <div 
                      className="absolute inset-0 transition-all duration-700 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at bottom, ${activeColor}aa 0%, #1a1505 100%)`,
                        opacity: isTapePlaying ? 0.35 : 0.05
                      }}
                    />

                    {/* Meter Scale Arc */}
                    <svg viewBox="0 0 100 50" className="absolute left-1/2 -translate-x-1/2 top-1.5 h-12 w-[85%] z-10 pointer-events-none">
                      {/* Scale background arc */}
                      <path d="M 18,31 A 35,35 0 0,1 82,31" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                      {/* Safe Zone (Green) */}
                      <path d="M 18,31 A 35,35 0 0,1 59.1,11.2" fill="none" stroke="#67B946" strokeWidth="2.5" strokeOpacity="0.75" />
                      {/* Over Zone (Red) */}
                      <path d="M 59.1,11.2 A 35,35 0 0,1 82,31" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeOpacity="0.85" />
                      
                      {/* Tick Marks */}
                      <path d="M 18,31 L 15.3,32.3 M 32.5,21.3 L 30.5,19.3 M 59.1,11.2 L 60.1,7.3 M 72.5,18.2 L 75.1,15.1 M 82,31 L 84.7,32.3" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

                      {/* Text values */}
                      <text x="10" y="37" fill="rgba(255,255,255,0.25)" fontSize="4.5" fontFamily="monospace">-20</text>
                      <text x="23" y="18" fill="rgba(255,255,255,0.25)" fontSize="4.5" fontFamily="monospace">-10</text>
                      <text x="56" y="6" fill="rgba(255,255,255,0.35)" fontSize="5" fontFamily="monospace" fontWeight="bold">0</text>
                      <text x="76" y="14" fill="#dc2626" fontSize="4.5" fontFamily="monospace" opacity="0.75">+3</text>
                      <text x="85" y="37" fill="#dc2626" fontSize="4.5" fontFamily="monospace" opacity="0.75">+5</text>

                      {/* Needle coordinates calculations inside SVG */}
                      <line x1="50" y1="45" x2={needleX_L} y2={needleY_L} stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" style={{ transition: 'all 0.08s ease-out' }} />
                      
                      {/* Center pivot point cap inside SVG */}
                      <circle cx="50" cy="45" r="7.5" fill="#111" stroke="#444" strokeWidth="1" />
                      <circle cx="50" cy="45" r="2.5" fill="#000" />
                    </svg>

                    <span className="text-[6px] font-mono text-white/50 z-20 mt-1 uppercase tracking-widest">CH_L</span>
                  </div>

                  {/* RIGHT VU METER */}
                  <div 
                    className="border border-neutral-850 rounded-xl p-2 relative overflow-hidden h-20 flex flex-col justify-end items-center transition-all duration-500 shadow-md"
                    style={{
                      backgroundColor: isTapePlaying ? '#161512' : '#0c0c0d',
                      boxShadow: isTapePlaying ? `inset 0 0 12px ${activeColor}20` : 'none'
                    }}
                  >
                    
                    {/* Vintage Meter Face (Backlight warm yellow glow) */}
                    <div 
                      className="absolute inset-0 transition-all duration-700 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at bottom, ${activeColor}aa 0%, #1a1505 100%)`,
                        opacity: isTapePlaying ? 0.35 : 0.05
                      }}
                    />

                    {/* Meter Scale Arc */}
                    <svg viewBox="0 0 100 50" className="absolute left-1/2 -translate-x-1/2 top-1.5 h-12 w-[85%] z-10 pointer-events-none">
                      {/* Scale background arc */}
                      <path d="M 18,31 A 35,35 0 0,1 82,31" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                      {/* Safe Zone (Green) */}
                      <path d="M 18,31 A 35,35 0 0,1 59.1,11.2" fill="none" stroke="#67B946" strokeWidth="2.5" strokeOpacity="0.75" />
                      {/* Over Zone (Red) */}
                      <path d="M 59.1,11.2 A 35,35 0 0,1 82,31" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeOpacity="0.85" />
                      
                      {/* Tick Marks */}
                      <path d="M 18,31 L 15.3,32.3 M 32.5,21.3 L 30.5,19.3 M 59.1,11.2 L 60.1,7.3 M 72.5,18.2 L 75.1,15.1 M 82,31 L 84.7,32.3" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

                      {/* Text values */}
                      <text x="10" y="37" fill="rgba(255,255,255,0.25)" fontSize="4.5" fontFamily="monospace">-20</text>
                      <text x="23" y="18" fill="rgba(255,255,255,0.25)" fontSize="4.5" fontFamily="monospace">-10</text>
                      <text x="56" y="6" fill="rgba(255,255,255,0.35)" fontSize="5" fontFamily="monospace" fontWeight="bold">0</text>
                      <text x="76" y="14" fill="#dc2626" fontSize="4.5" fontFamily="monospace" opacity="0.75">+3</text>
                      <text x="85" y="37" fill="#dc2626" fontSize="4.5" fontFamily="monospace" opacity="0.75">+5</text>

                      {/* Needle coordinates calculations inside SVG */}
                      <line x1="50" y1="45" x2={needleX_R} y2={needleY_R} stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" style={{ transition: 'all 0.08s ease-out' }} />
                      
                      {/* Center pivot point cap inside SVG */}
                      <circle cx="50" cy="45" r="7.5" fill="#111" stroke="#444" strokeWidth="1" />
                      <circle cx="50" cy="45" r="2.5" fill="#000" />
                    </svg>

                    <span className="text-[6px] font-mono text-white/50 z-20 mt-1 uppercase tracking-widest">CH_R</span>
                  </div>

                </div>

              </div>

              {/* MECHANICAL BUTTONS DECK CONTROLS */}
              <div className="mt-4 flex gap-2 justify-center">
                
                <button 
                  onClick={() => setIsTapePlaying(false)}
                  className={`flex-1 py-2 px-1 text-[8px] font-display font-black tracking-widest rounded-lg border border-white/5 uppercase select-none transition-all duration-350 cursor-pointer text-center ${
                    !isTapePlaying
                      ? 'bg-red-600/10 border-red-500/50 text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                      : 'bg-white/[0.02] border-white/5 text-white/45 hover:text-white hover:border-white/10'
                  }`}
                >
                  ⏹ STOP
                </button>

                <button 
                  onClick={() => setIsTapePlaying(true)}
                  className={`flex-1 py-2 px-1 text-[8px] font-display font-black tracking-widest rounded-lg border border-white/5 uppercase select-none transition-all duration-350 cursor-pointer text-center ${
                    isTapePlaying
                      ? 'bg-green-600/10 border-green-500/50 text-green-500 shadow-[0_0_8px_rgba(34,197,94,0.25)]'
                      : 'bg-white/[0.02] border-white/5 text-white/45 hover:text-white hover:border-white/10'
                  }`}
                >
                  ▶ PLAY
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}
