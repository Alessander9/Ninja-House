import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { TimelineProvider } from './timeline'
import { FinishLayers } from './primitives'
import { PromoComposition, DURATION, FPS, PRELOAD_IMAGES } from './scenes'

declare global {
  interface Window {
    __videoReady?: boolean
    __videoMeta?: { duration: number; fps: number; width: number; height: number }
    __seek?: (t: number) => Promise<void>
  }
}

const W = 1920
const H = 1080

const CHAPTERS = [
  { label: 'Intro', t: 0 },
  { label: 'Qué es', t: 4.2 },
  { label: 'Programas', t: 9.1 },
  { label: 'Métricas', t: 20.8 },
  { label: 'CTA', t: 26 },
]

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()))

async function preloadAssets() {
  await Promise.all(
    PRELOAD_IMAGES.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.src = src
          img.decode().then(() => resolve(), () => resolve())
        }),
    ),
  )
  await Promise.all([
    document.fonts.load('900 100px Outfit'),
    document.fonts.load('700 40px Outfit'),
    document.fonts.load('400 24px Inter'),
  ]).catch(() => undefined)
  await document.fonts.ready
}

function fmt(t: number) {
  const s = Math.floor(t)
  const f = Math.floor((t - s) * FPS)
  return `00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`
}

function Controls({ time, playing, setPlaying }: { time: MotionValue<number>; playing: boolean; setPlaying: (v: boolean) => void }) {
  const [cur, setCur] = useState(0)
  useMotionValueEvent(time, 'change', (v) => setCur(v))

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-3 px-6">
      <div className="relative h-2 rounded-full bg-white/10 group cursor-pointer">
        <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-600 to-rose-400" style={{ width: `${(cur / DURATION) * 100}%` }} />
        {CHAPTERS.map((c) => (
          <span key={c.label} className="absolute top-1/2 -translate-y-1/2 w-1 h-3 rounded bg-white/40" style={{ left: `${(c.t / DURATION) * 100}%` }} />
        ))}
        <input
          id="video-scrubber"
          aria-label="Línea de tiempo"
          type="range"
          min={0}
          max={DURATION}
          step={1 / FPS}
          value={cur}
          onChange={(e) => { setPlaying(false); time.set(Number(e.target.value)) }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          id="video-play-toggle"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            if (!playing && time.get() >= DURATION - 0.05) time.set(0)
            setPlaying(!playing)
          }}
          className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.5)]"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5 ml-0.5" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
          )}
        </motion.button>

        <span className="font-mono text-sm text-white/60 tabular-nums">{fmt(cur)} / {fmt(DURATION)}</span>

        <div className="flex gap-2 ml-auto">
          {CHAPTERS.map((c) => (
            <button
              key={c.label}
              id={`video-chapter-${c.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => { time.set(c.t); setPlaying(true) }}
              className="px-3 py-1.5 rounded-full text-xs font-display font-bold tracking-wider border border-white/10 bg-white/[0.04] text-white/70 hover:text-white hover:border-red-500/50 transition-colors"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-white/30 text-xs font-body">
        Espacio: play/pausa · ←/→: ±1 frame · Exportar MP4: <code className="text-red-400">npm run render:video</code>
      </p>
    </div>
  )
}

export function PromoVideo() {
  const renderMode = useMemo(() => new URLSearchParams(window.location.search).has('render'), [])
  const time = useMotionValue(0)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(!renderMode)
  const [scale, setScale] = useState(1)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Ninja House — Video Promo'
    let cancelled = false
    preloadAssets().then(() => {
      if (cancelled) return
      setReady(true)
      window.__videoMeta = { duration: DURATION, fps: FPS, width: W, height: H }
      window.__seek = async (t: number) => {
        time.set(t)
        await nextFrame()
        await nextFrame()
      }
      window.__videoReady = true
    })
    return () => { cancelled = true }
  }, [time])

  // Escalado del lienzo 1920x1080 al viewport
  useEffect(() => {
    if (renderMode) return
    const fit = () => {
      const el = wrapRef.current
      if (!el) return
      setScale(Math.min(el.clientWidth / W, el.clientHeight / H))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [renderMode])

  // Atajos de teclado
  useEffect(() => {
    if (renderMode) return
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); setPlaying((p) => !p) }
      if (e.code === 'ArrowRight') { setPlaying(false); time.set(Math.min(DURATION, time.get() + 1 / FPS)) }
      if (e.code === 'ArrowLeft') { setPlaying(false); time.set(Math.max(0, time.get() - 1 / FPS)) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [renderMode, time])

  useAnimationFrame((_, delta) => {
    if (renderMode || !ready || !playing) return
    const next = time.get() + Math.min(delta, 100) / 1000
    if (next >= DURATION) { time.set(DURATION - 0.0001); setPlaying(false) } else time.set(next)
  })

  const stage = (
    <div className="relative overflow-hidden bg-[#0b0b0b] text-white" style={{ width: W, height: H }}>
      <TimelineProvider time={time}>
        {ready && <PromoComposition />}
        <FinishLayers />
      </TimelineProvider>
    </div>
  )

  if (renderMode) return <div className="fixed inset-0 bg-black">{stage}</div>

  return (
    <main className="fixed inset-0 bg-[#070707] flex flex-col gap-5 py-6">
      <header className="flex items-center gap-3 px-8">
        <img src="/assets/NinjaLOGO.png" alt="Ninja House" className="h-9" />
        <h1 className="font-display font-black text-white text-lg tracking-wide">Video Promo <span className="text-red-500">· Framer Motion</span></h1>
        <span className="ml-auto text-white/40 text-xs font-display tracking-widest">1920×1080 · {FPS}FPS · {DURATION}s</span>
      </header>

      <div ref={wrapRef} className="flex-1 min-h-0 flex items-center justify-center px-8">
        <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-[0_30px_120px_rgba(176,26,25,0.25)]" style={{ width: W * scale, height: H * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>{stage}</div>
        </div>
      </div>

      {!ready && <p className="text-center text-white/40 text-sm">Cargando assets…</p>}
      <Controls time={time} playing={playing} setPlaying={setPlaying} />
    </main>
  )
}
