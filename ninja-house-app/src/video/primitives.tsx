import type { CSSProperties } from 'react'
import { motion, useMotionTemplate, backOut, easeOut, type EasingFunction as Easing } from 'framer-motion'
import { useTl, useTimeFn } from './timeline'

/* ───────────────────────── Texto con reveal por caracter ───────────────────────── */

function Char({ ch, start, dur, ease }: { ch: string; start: number; dur: number; ease: Easing }) {
  const y = useTl([start, start + dur], ['110%', '0%'], ease)
  const rotate = useTl([start, start + dur], [12, 0], ease)
  const opacity = useTl([start, start + dur * 0.6], [0, 1])
  return (
    <span className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
      <motion.span className="inline-block" style={{ y, rotate, opacity, transformOrigin: '0% 100%' }}>
        {ch === ' ' ? '\u00A0' : ch}
      </motion.span>
    </span>
  )
}

export function RevealText({
  text, start, stagger = 0.035, dur = 0.55, className = '', style, ease = backOut,
}: { text: string; start: number; stagger?: number; dur?: number; className?: string; style?: CSSProperties; ease?: Easing }) {
  let idx = 0
  const words = text.split(' ')
  return (
    <span className={className} style={style} aria-label={text}>
      {words.map((word, w) => {
        const chars = Array.from(word).map((ch) => {
          const i = idx++
          return <Char key={i} ch={ch} start={start + i * stagger} dur={dur} ease={ease} />
        })
        idx++ // el espacio también cuenta en el stagger
        return (
          <span key={w}>
            <span className="inline-block whitespace-nowrap">{chars}</span>
            {w < words.length - 1 ? ' ' : null}
          </span>
        )
      })}
    </span>
  )
}

/** Palabras que suben desde una máscara. */
function Word({ word, start, dur }: { word: string; start: number; dur: number }) {
  const y = useTl([start, start + dur], ['105%', '0%'], easeOut)
  return (
    <span className="inline-block overflow-hidden align-bottom mr-[0.25em]" style={{ paddingBottom: '0.1em', marginBottom: '-0.1em' }}>
      <motion.span className="inline-block" style={{ y }}>{word}</motion.span>
    </span>
  )
}

export function RevealWords({ text, start, stagger = 0.08, dur = 0.5, className = '' }: { text: string; start: number; stagger?: number; dur?: number; className?: string }) {
  return (
    <span className={className}>
      {text.split(' ').map((w, i) => <Word key={i} word={w} start={start + i * stagger} dur={dur} />)}
    </span>
  )
}

/* ───────────────────────── Contador animado ───────────────────────── */

export function Counter({
  value, start, dur = 1.6, prefix = '', suffix = '', className = '', style,
}: { value: number; start: number; dur?: number; prefix?: string; suffix?: string; className?: string; style?: CSSProperties }) {
  const text = useTimeFn((t) => {
    const p = Math.min(Math.max((t - start) / dur, 0), 1)
    return `${prefix}${Math.round(easeOut(p) * value).toLocaleString('en-US')}${suffix}`
  })
  return <motion.span className={`tabular-nums ${className}`} style={style}>{text}</motion.span>
}

/* ───────────────────────── Fondo con partículas flotantes ───────────────────────── */

function Particle({ i }: { i: number }) {
  const colors = ['#B01A19', '#BD211F', '#C75A58', '#ffffff']
  const size = (i % 3) + 2
  const y = useTimeFn((t) => Math.sin(t * (0.6 + (i % 5) * 0.15) + i) * 26 - t * (6 + (i % 4) * 3))
  const x = useTimeFn((t) => Math.cos(t * 0.4 + i * 1.7) * 14)
  const opacity = useTimeFn((t) => 0.15 + 0.25 * (0.5 + 0.5 * Math.sin(t * 1.3 + i)))
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size, height: size,
        left: `${(i * 37 + 5) % 98}%`, top: `${(i * 53 + 10) % 95}%`,
        backgroundColor: colors[i % colors.length],
        boxShadow: `0 0 ${size * 4}px ${colors[i % colors.length]}`,
        x, y, opacity,
      }}
    />
  )
}

export function ParticleField({ count = 40 }: { count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => <Particle key={i} i={i} />)}
    </div>
  )
}

/* ───────────────────────── Shuriken SVG ───────────────────────── */

export function Shuriken({ size = 120, color = '#B01A19', speed = 90, className = '', style }: { size?: number; color?: string; speed?: number; className?: string; style?: CSSProperties }) {
  const rotate = useTimeFn((t) => t * speed)
  return (
    <motion.svg viewBox="0 0 100 100" width={size} height={size} className={className} style={{ rotate, ...style }}>
      <path
        d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z"
        fill={color}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
      />
      <circle cx="50" cy="50" r="7" fill="#0b0b0b" />
    </motion.svg>
  )
}

/* ───────────────────────── Capas globales de acabado ───────────────────────── */

export function Backdrop({ glowColor = 'rgba(183,31,29,0.28)' }: { glowColor?: string }) {
  const gx = useTimeFn((t) => 60 + Math.sin(t * 0.35) * 15)
  const gy = useTimeFn((t) => 35 + Math.cos(t * 0.3) * 12)
  const background = useMotionTemplate`radial-gradient(ellipse at ${gx}% ${gy}%, ${glowColor} 0%, transparent 55%), radial-gradient(ellipse at 15% 80%, rgba(176,26,25,0.12) 0%, transparent 50%), #101010`
  return (
    <>
      <motion.div className="absolute inset-0" style={{ background }} />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(170,11,10,0.22) 1.5px, transparent 1.5px)', backgroundSize: '26px 26px' }} />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #B01A19 0, #B01A19 1px, transparent 0, transparent 50%)', backgroundSize: '18px 18px' }} />
    </>
  )
}

export function FinishLayers() {
  const grainX = useTimeFn((t) => `${(Math.floor(t * 24) * 37) % 100}%`)
  const grainY = useTimeFn((t) => `${(Math.floor(t * 24) * 53) % 100}%`)
  return (
    <div className="absolute inset-0 pointer-events-none z-[90]">
      {/* Viñeta */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.65) 100%)' }} />
      {/* Grano de película */}
      <motion.div
        className="absolute -inset-[50%] opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundPositionX: grainX, backgroundPositionY: grainY,
        }}
      />
      {/* Scanlines sutiles */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #000 0, #000 1px, transparent 1px, transparent 3px)' }} />
    </div>
  )
}
