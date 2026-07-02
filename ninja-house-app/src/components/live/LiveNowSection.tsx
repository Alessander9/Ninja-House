import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { getNextProgram, getCurrentProgram } from '../../lib/schedule'
import { scheduleData } from '../../data/schedule'

// ─── Show-specific color overrides ───────────────────────────────────────────
const SHOW_COLORS: Record<string, string> = {
  'animes-y-ramen':  '#7C3AED', // Morado
  'overhead':        '#2563EB', // Azul
  'freakuencia-m':   '#16A34A', // Verde
  'maldito-plastico':'#EA580C', // Naranja
  'cine-infarto':    '#DC2626', // Rojo
}
const getShowColor = (id: string) => SHOW_COLORS[id] ?? '#67B946'

// ─── Animated digit counter (slot machine effect) ─────────────────────────────
function Digit({ value }: { value: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 32, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="inline-block leading-none"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  )
}

// ─── Animated Viewer Counter ──────────────────────────────────────────────────
function ViewerCounter({ target }: { target: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString())
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    const controls = animate(count, target, { duration: 2.5, ease: 'easeOut' })
    const unsub = rounded.on('change', setDisplay)
    return () => { controls.stop(); unsub() }
  }, [target, count, rounded])

  return <span>{display}</span>
}

// ─── Radar Pulse Badge ────────────────────────────────────────────────────────
function RadarBadge({ color, label }: { color: string; label: string }) {
  return (
    <div className="relative flex items-center gap-2.5">
      <div className="relative w-4 h-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: color }}
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2.5 + i * 0.6, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
          />
        ))}
        <div className="absolute inset-0 rounded-full m-1" style={{ backgroundColor: color }} />
      </div>
      <span className="font-display font-black tracking-[0.2em] text-xs uppercase" style={{ color }}>
        {label}
      </span>
    </div>
  )
}

// ─── Scanline overlay ─────────────────────────────────────────────────────────
const ScanlineOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none z-10 rounded-inherit"
    style={{
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
      mixBlendMode: 'multiply',
    }}
  />
)

// ─── Weekly mini timeline (clickable) ────────────────────────────────────────
function WeekStrip({
  activeId,
  isLive,
  previewId,
  onSelect,
}: {
  activeId: string
  isLive: boolean
  previewId: string | null
  onSelect: (id: string) => void
}) {
  const days = scheduleData.slice().sort((a, b) => a.dayIndex - b.dayIndex)
  return (
    <div className="flex items-stretch gap-1 w-full">
      {days.map((show, i) => {
        const color = getShowColor(show.id)
        const isActive = show.id === activeId
        const isPreviewing = previewId ? show.id === previewId : isActive
        return (
          <motion.button
            key={show.id}
            onClick={() => onSelect(show.id)}
            className="flex-1 flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl cursor-pointer relative overflow-hidden"
            style={{
              background: isPreviewing ? `${color}18` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isPreviewing ? color + '55' : 'rgba(255,255,255,0.06)'}`,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            whileHover={{ scale: 1.06, backgroundColor: `${color}12` }}
            whileTap={{ scale: 0.96 }}
          >
            {isPreviewing && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}25, transparent 70%)` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
            )}
            <span className="text-[9px] font-display font-black tracking-widest text-white/30 uppercase relative z-10">
              {show.shortDay}
            </span>
            <span className="text-base relative z-10">{show.emoji}</span>
            <span
              className="text-[8px] font-display font-black relative z-10 text-center leading-tight"
              style={{ color: isPreviewing ? color : 'rgba(255,255,255,0.3)' }}
            >
              {show.title.split(' ')[0]}
            </span>
            {isActive && isLive && (
              <motion.div
                className="w-1.5 h-1.5 rounded-full absolute bottom-1.5 right-1.5"
                style={{ backgroundColor: color }}
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function LiveNowSection() {
  const [simulatedDay, setSimulatedDay] = useState<number | null>(null)
  const [viewers, setViewers] = useState(4820)
  const [glitchActive, setGlitchActive] = useState(false)
  const [previewShowId, setPreviewShowId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const getMockDate = useCallback((): Date => {
    const d = new Date()
    if (simulatedDay !== null) {
      const diff = simulatedDay - d.getDay()
      d.setDate(d.getDate() + diff)
      // Always simulate night (9:30 PM) when a day is selected
      d.setHours(21, 30, 0, 0)
    }
    return d
  }, [simulatedDay])

  const [currentShow, setCurrentShow] = useState(getCurrentProgram(getMockDate()))
  const [nextShow, setNextShow] = useState(getNextProgram(getMockDate()))
  const [parts, setParts] = useState({ d: '0', h: '00', m: '00', s: '00' })

  useEffect(() => {
    const mockDate = getMockDate()
    setCurrentShow(getCurrentProgram(mockDate))
    setNextShow(getNextProgram(mockDate))
    setPreviewShowId(null) // reset strip preview on schedule change
  }, [simulatedDay, getMockDate])

  useEffect(() => {
    const interval = setInterval(() => {
      const mockDate = getMockDate()
      setCurrentShow(getCurrentProgram(mockDate))
      setNextShow(getNextProgram(mockDate))
    }, 10000)
    return () => clearInterval(interval)
  }, [getMockDate])

  // Simulated viewer fluctuation when live
  useEffect(() => {
    if (!currentShow) return
    const iv = setInterval(() => {
      setViewers(v => Math.max(1000, v + Math.floor((Math.random() - 0.45) * 120)))
    }, 4000)
    return () => clearInterval(iv)
  }, [currentShow])

  // Occasional glitch effect
  useEffect(() => {
    const iv = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
    }, 7000)
    return () => clearInterval(iv)
  }, [])

  const activeShow = currentShow || nextShow

  useEffect(() => {
    if (!activeShow) return
    const calc = () => {
      const now = getMockDate()
      const target = new Date(now)
      const todayDay = now.getDay()
      let daysToAdd = (activeShow.dayIndex - todayDay + 7) % 7
      target.setHours(21, 0, 0, 0)
      if (daysToAdd === 0 && now.getHours() >= 23) daysToAdd = 7
      target.setDate(now.getDate() + daysToAdd)

      const diff = target.getTime() - now.getTime()
      if (diff <= 0) {
        setParts({ d: '0', h: '00', m: '00', s: '00' })
        const md = getMockDate()
        setCurrentShow(getCurrentProgram(md))
        setNextShow(getNextProgram(md))
        return
      }
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const mins = Math.floor((diff % 3600000) / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setParts({
        d: String(days),
        h: String(hours).padStart(2, '0'),
        m: String(mins).padStart(2, '0'),
        s: String(secs).padStart(2, '0'),
      })
    }
    calc()
    const timer = setInterval(calc, 1000)
    return () => clearInterval(timer)
  }, [activeShow, getMockDate])

  if (!activeShow) return null

  // Resolve the displayed show: previewShowId overrides activeShow in the strip
  const previewShow = previewShowId
    ? scheduleData.find(s => s.id === previewShowId) ?? activeShow
    : activeShow
  const displayShow = previewShow

  const isLiveNow = !!currentShow
  const showColor = getShowColor(displayShow.id)
  const programUrlId = displayShow.id

  return (
    <section
      ref={sectionRef}
      id="live"
      className="relative py-20 px-4 overflow-hidden bg-ninja-black"
    >
      {/* ── Deep atmosphere glow ─── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: isLiveNow
            ? 'radial-gradient(ellipse 70% 55% at 50% 60%, rgba(189,33,31,0.12) 0%, transparent 70%)'
            : `radial-gradient(ellipse 70% 55% at 50% 60%, ${showColor}14 0%, transparent 70%)`,
        }}
      />

      {/* ── Halftone texture ─── */}
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />

      {/* ── Grid lines ─── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${showColor} 1px, transparent 1px), linear-gradient(90deg, ${showColor} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-20">

        {/* ── Section label ─── */}
        <motion.div
          className="flex items-center justify-center mb-10"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-display font-black tracking-widest uppercase"
            style={{
              color: isLiveNow ? '#ef4444' : showColor,
              borderColor: isLiveNow ? 'rgba(239,68,68,0.3)' : `${showColor}40`,
              backgroundColor: isLiveNow ? 'rgba(239,68,68,0.08)' : `${showColor}0d`,
            }}
          >
            <span className="text-sm">{isLiveNow ? '📡' : '🔜'}</span>
            {isLiveNow ? 'En Vivo Ahora' : 'Próximo en Vivo'}
          </span>
        </motion.div>

        {/* ── Main card ─── */}
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(145deg, rgba(18,18,18,0.99) 0%, rgba(10,10,10,0.98) 100%)',
            boxShadow: isLiveNow
              ? `0 0 0 1px rgba(239,68,68,0.35), 0 0 50px rgba(189,33,31,0.18), 0 25px 60px rgba(0,0,0,0.65)`
              : `0 0 0 1px ${showColor}30, 0 0 50px ${showColor}12, 0 25px 60px rgba(0,0,0,0.65)`,
          }}
        >
          {/* Animated border top */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px] z-30"
            style={{
              background: isLiveNow
                ? 'linear-gradient(90deg, transparent, #ef4444, #BD211F, transparent)'
                : `linear-gradient(90deg, transparent, ${showColor}, ${showColor}aa, transparent)`,
            }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <ScanlineOverlay />

          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8">

            {/* ─── LEFT: Main info ─────────────────────────────── */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">

              {/* Poster */}
              <motion.div
                className="relative w-full max-w-[200px] md:max-w-[200px] flex-shrink-0 mx-auto md:mx-0"
                whileHover={{ scale: 1.03 }}
              >
                {/* Glow border */}
                <motion.div
                  className="absolute -inset-[3px] rounded-2xl z-0"
                  style={{ background: `conic-gradient(from 0deg, ${showColor}, transparent 40%, ${showColor})` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative z-10 rounded-2xl overflow-hidden bg-ninja-black aspect-[3/4]">
                  <motion.img
                    key={displayShow.id}
                    src={displayShow.image}
                    alt={displayShow.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={glitchActive
                      ? { 
                          x: [0, -8, 6, -4, 0], 
                          y: [0, 4, -4, 2, 0],
                          scale: [1, 1.05, 0.98, 1.02, 1],
                          filter: [
                            'none',
                            'hue-rotate(90deg) saturate(220%) contrast(120%)',
                            'hue-rotate(180deg) brightness(1.3) contrast(150%)',
                            'hue-rotate(270deg) saturate(200%)',
                            'none'
                          ],
                          opacity: 1
                        }
                      : { x: 0, y: 0, scale: 1, filter: 'none', opacity: 1 }
                    }
                    transition={{ duration: 0.25, ease: 'linear' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  {/* Corner tag */}
                  <div className="absolute top-3 left-3">
                    {isLiveNow
                      ? <RadarBadge color="#ef4444" label="LIVE" />
                      : (
                        <span
                          className="px-2.5 py-1 rounded-full text-[9px] font-display font-black tracking-widest uppercase"
                          style={{ backgroundColor: `${showColor}25`, color: showColor, border: `1px solid ${showColor}40` }}
                        >
                          PRÓXIMO
                        </span>
                      )
                    }
                  </div>
                  {/* emoji bottom */}
                  <div className="absolute bottom-3 left-3 text-2xl">{displayShow.emoji}</div>
                </div>
              </motion.div>

              {/* Text block */}
              <div className="flex-1 flex flex-col gap-4 items-center md:items-start">
                <div>
                  <p className="text-[10px] font-display font-black tracking-[0.25em] text-white/35 uppercase mb-2">
                    {isLiveNow ? `📡 Transmisión en vivo — ${displayShow.day}` : `📅 Siguiente emisión — ${displayShow.day}`}
                  </p>
                  <motion.h2
                    className="font-display font-black text-3xl md:text-4xl xl:text-5xl leading-none tracking-tight"
                    animate={glitchActive ? { x: [0, 3, -3, 0] } : {}}
                    transition={{ duration: 0.12 }}
                  >
                    <span className="text-white">{displayShow.emoji} </span>
                    <span
                      style={{
                        color: showColor,
                        textShadow: `0 0 30px ${showColor}70, 0 0 60px ${showColor}30`,
                      }}
                    >
                      {displayShow.title}
                    </span>
                  </motion.h2>
                </div>

                <p className="text-white/50 font-body text-sm leading-relaxed max-w-lg text-center md:text-left">
                  {displayShow.description}
                </p>

                {/* Meta pills */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {[
                    { icon: '🗓️', label: displayShow.day },
                    { icon: '⏰', label: `${displayShow.timeDisplay} – ${displayShow.endTime}` },
                    { icon: '🎙️', label: displayShow.host || displayShow.category },
                  ].map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-bold text-white/60 bg-white/[0.04] border border-white/[0.07]"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                  ))}
                </div>

                {/* Live stats */}
                {isLiveNow && (
                  <motion.div
                    className="flex flex-wrap items-center justify-center md:justify-start gap-5 py-3 px-4 rounded-2xl border w-full md:w-auto"
                    style={{ backgroundColor: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)' }}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex flex-col">
                      <span className="text-[9px] text-white/30 font-display font-bold tracking-widest uppercase">Viewers ahora</span>
                      <span className="text-lg font-display font-black text-white">
                        <ViewerCounter target={viewers} />
                      </span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[9px] text-white/30 font-display font-bold tracking-widest uppercase">Uptime</span>
                      <span className="text-lg font-display font-black text-ninja-green">01:32:44</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[9px] text-white/30 font-display font-bold tracking-widest uppercase">Calidad</span>
                      <span className="text-lg font-display font-black text-ninja-yellow">1080p</span>
                    </div>
                  </motion.div>
                )}

                {/* CTAs */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1 w-full">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to={`/programa/${programUrlId}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-black text-sm text-white transition-all"
                      style={{ backgroundColor: showColor, boxShadow: `0 0 20px ${showColor}60` }}
                    >
                      <span>👁️</span>
                      <span>Ver el Show</span>
                    </Link>
                  </motion.div>
                  <motion.a
                    href="https://www.youtube.com/channel/UCF2hgWHhLQx3ZJDsnKU8gZg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-sm text-white bg-white/[0.05] border border-white/10 transition-all"
                    whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.09)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>▶</span>
                    <span>Ir a YouTube</span>
                  </motion.a>
                </div>
              </div>
            </div>

            {/* ─── RIGHT: Countdown + Week strip ─────────────────────────── */}
            <div className="flex flex-col gap-6 items-center lg:items-end lg:min-w-[280px]">

              {/* ── Countdown ── */}
              <div
                className="w-full rounded-2xl p-5 border flex flex-col items-center gap-3"
                style={{
                  background: isLiveNow
                    ? 'rgba(239,68,68,0.06)'
                    : `${showColor}0d`,
                  borderColor: isLiveNow
                    ? 'rgba(239,68,68,0.22)'
                    : `${showColor}30`,
                }}
              >
                <span className="text-[9px] font-display font-black tracking-[0.25em] text-white/30 uppercase">
                  {isLiveNow ? '🔴 Transmisión en curso' : '⏱ Próxima emisión en'}
                </span>

                {isLiveNow ? (
                  <motion.div
                    className="font-display font-black text-5xl text-red-500 tracking-widest"
                    animate={{ textShadow: ['0 0 15px rgba(239,68,68,0.8)', '0 0 40px rgba(239,68,68,0.3)', '0 0 15px rgba(239,68,68,0.8)'] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  >
                    ¡AL AIRE!
                  </motion.div>
                ) : (
                  <div className="flex items-end gap-2 font-display font-black">
                    {parts.d !== '0' && (
                      <>
                        <div className="flex flex-col items-center">
                          <div
                            className="text-4xl md:text-5xl leading-none overflow-hidden h-[1.1em] flex items-center"
                            style={{ color: showColor, textShadow: `0 0 20px ${showColor}70` }}
                          >
                            <Digit value={parts.d} />
                          </div>
                          <span className="text-[9px] text-white/30 tracking-widest mt-1">DÍAS</span>
                        </div>
                        <span className="text-3xl text-white/20 mb-2 pb-1">:</span>
                      </>
                    )}
                    {[
                      { val: parts.h, label: 'HRS' },
                      { val: parts.m, label: 'MIN' },
                      { val: parts.s, label: 'SEG' },
                    ].map((segment, i) => (
                      <div key={segment.label} className="flex items-end gap-2">
                        <div className="flex flex-col items-center">
                          <div
                            className="text-4xl md:text-5xl leading-none overflow-hidden h-[1.1em] flex items-center gap-0.5"
                            style={{ color: showColor, textShadow: `0 0 20px ${showColor}70` }}
                          >
                            <Digit value={segment.val[0]} />
                            <Digit value={segment.val[1]} />
                          </div>
                          <span className="text-[9px] text-white/30 tracking-widest mt-1">{segment.label}</span>
                        </div>
                        {i < 2 && (
                          <motion.span
                            className="text-3xl text-white/20 mb-2 pb-1"
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            :
                          </motion.span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Week timeline strip ── */}
              <div className="w-full flex flex-col gap-2">
                <span className="text-[9px] font-display font-black tracking-[0.2em] text-white/25 uppercase">
                  Parrilla Semanal — <span className="text-white/40 normal-case">Selecciona un show</span>
                </span>
                <WeekStrip
                  activeId={activeShow.id}
                  isLive={isLiveNow}
                  previewId={previewShowId}
                  onSelect={(id) => setPreviewShowId(prev => prev === id ? null : id)}
                />
              </div>
            </div>
          </div>

          {/* ── Dev simulation controls ─── */}
          <div className="border-t border-white/[0.06] px-6 md:px-10 py-4 flex flex-wrap items-center gap-4">
            <span className="text-[9px] font-display font-black text-red-500/70 tracking-[0.2em] uppercase flex-shrink-0">
              🎛 TEST DEV
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: 'LUN', val: 1 },
                { label: 'MAR', val: 2 },
                { label: 'MIÉ', val: 3 },
                { label: 'JUE', val: 4 },
                { label: 'VIE', val: 5 },
              ].map((d) => (
                <button
                  key={d.label}
                  onClick={() => setSimulatedDay(simulatedDay === d.val ? null : d.val)}
                  className={`px-2 py-1 text-[9px] font-display font-black rounded-lg transition-all cursor-pointer ${
                    simulatedDay === d.val
                      ? 'bg-red-600/80 text-white'
                      : 'text-white/30 bg-white/[0.03] hover:bg-white/[0.07] hover:text-white/70'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <span className="text-[9px] text-white/20 font-display">9:00 PM</span>
            {simulatedDay !== null && (
              <button
                onClick={() => setSimulatedDay(null)}
                className="ml-auto px-3 py-1 text-[9px] font-display font-black text-white/50 border border-white/10 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                ⚡ RESET
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
