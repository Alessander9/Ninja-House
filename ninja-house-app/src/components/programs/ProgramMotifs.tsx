import { motion, useReducedMotion } from 'framer-motion'
import type { ProgramTheme } from '../../data/programThemes'

type MotifItem = {
  icon: string
  top: string
  left: string
  size: number
  delay: number
  duration: number
  rotate: number
  opacity: number
}

const MOTIFS: Record<string, MotifItem[]> = {
  'animes-y-ramen': [
    { icon: '🍜', top: '12%', left: '8%', size: 34, delay: 0, duration: 7.2, rotate: -10, opacity: 0.26 },
    { icon: '🥢', top: '22%', left: '76%', size: 24, delay: 0.6, duration: 8.4, rotate: 16, opacity: 0.20 },
    { icon: '🏮', top: '64%', left: '12%', size: 28, delay: 0.2, duration: 9, rotate: -6, opacity: 0.18 },
    { icon: '🌸', top: '68%', left: '79%', size: 22, delay: 0.8, duration: 7.8, rotate: 10, opacity: 0.18 },
    { icon: '🍥', top: '38%', left: '50%', size: 20, delay: 0.4, duration: 8.8, rotate: 8, opacity: 0.18 },
    { icon: '✨', top: '16%', left: '50%', size: 18, delay: 0.9, duration: 6.8, rotate: 0, opacity: 0.18 },
  ],
  overhead: [
    { icon: '🥊', top: '14%', left: '10%', size: 30, delay: 0, duration: 7.6, rotate: -12, opacity: 0.22 },
    { icon: '🎙️', top: '24%', left: '82%', size: 24, delay: 0.5, duration: 8.6, rotate: 12, opacity: 0.18 },
    { icon: '🏟️', top: '66%', left: '14%', size: 26, delay: 0.2, duration: 8.2, rotate: 8, opacity: 0.16 },
    { icon: '⚡', top: '70%', left: '76%', size: 22, delay: 0.7, duration: 7.4, rotate: -8, opacity: 0.20 },
    { icon: '🪢', top: '40%', left: '50%', size: 20, delay: 0.4, duration: 9, rotate: 4, opacity: 0.15 },
    { icon: '💥', top: '16%', left: '50%', size: 18, delay: 1, duration: 6.8, rotate: 0, opacity: 0.18 },
  ],
  'freakuencia-m': [
    { icon: '📡', top: '12%', left: '10%', size: 30, delay: 0, duration: 7.1, rotate: -8, opacity: 0.24 },
    { icon: '💬', top: '22%', left: '78%', size: 24, delay: 0.4, duration: 8.8, rotate: 10, opacity: 0.18 },
    { icon: '⚡', top: '66%', left: '12%', size: 24, delay: 0.2, duration: 7.8, rotate: -4, opacity: 0.22 },
    { icon: '🔔', top: '70%', left: '80%', size: 22, delay: 0.7, duration: 8.4, rotate: 8, opacity: 0.18 },
    { icon: '🎛️', top: '40%', left: '48%', size: 20, delay: 0.5, duration: 9.2, rotate: 6, opacity: 0.16 },
    { icon: '✳️', top: '16%', left: '50%', size: 18, delay: 0.9, duration: 6.9, rotate: 0, opacity: 0.16 },
  ],
  'maldito-plastico': [
    { icon: '🧸', top: '12%', left: '10%', size: 32, delay: 0, duration: 7.8, rotate: -8, opacity: 0.24 },
    { icon: '📦', top: '22%', left: '78%', size: 24, delay: 0.4, duration: 8.6, rotate: 10, opacity: 0.20 },
    { icon: '⭐', top: '66%', left: '13%', size: 24, delay: 0.2, duration: 7.6, rotate: -4, opacity: 0.20 },
    { icon: '🏷️', top: '70%', left: '79%', size: 22, delay: 0.7, duration: 8.8, rotate: 8, opacity: 0.18 },
    { icon: '🧩', top: '40%', left: '50%', size: 20, delay: 0.5, duration: 9, rotate: 4, opacity: 0.16 },
    { icon: '🎁', top: '16%', left: '50%', size: 18, delay: 0.9, duration: 6.8, rotate: 0, opacity: 0.16 },
  ],
  'cine-infarto': [
    { icon: '🎬', top: '12%', left: '10%', size: 30, delay: 0, duration: 7.6, rotate: -8, opacity: 0.24 },
    { icon: '🍿', top: '22%', left: '79%', size: 24, delay: 0.4, duration: 8.4, rotate: 10, opacity: 0.20 },
    { icon: '🎞️', top: '66%', left: '12%', size: 24, delay: 0.2, duration: 7.8, rotate: -4, opacity: 0.18 },
    { icon: '🔦', top: '70%', left: '78%', size: 22, delay: 0.7, duration: 8.8, rotate: 8, opacity: 0.18 },
    { icon: '⭐', top: '40%', left: '50%', size: 20, delay: 0.5, duration: 9.1, rotate: 4, opacity: 0.16 },
    { icon: '📽️', top: '16%', left: '50%', size: 18, delay: 0.9, duration: 6.9, rotate: 0, opacity: 0.16 },
  ],
}

export function ProgramMotifs({
  programId,
  theme,
  variant = 'panel',
}: {
  programId: string
  theme: ProgramTheme
  variant?: 'panel' | 'compact'
}) {
  const reducedMotion = useReducedMotion()
  const motifs = MOTIFS[programId] ?? []

  if (variant === 'compact') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.primary}08, transparent 60%, ${theme.accent}08)` }} />
        {motifs.map((motif) => (
          <motion.div
            key={`${programId}-${motif.icon}-${motif.top}-${motif.left}`}
            className="absolute flex items-center justify-center select-none"
            style={{
              top: motif.top,
              left: motif.left,
              width: motif.size * 0.8,
              height: motif.size * 0.8,
              fontSize: motif.size * 0.8,
              opacity: motif.opacity * 0.7,
              color: theme.accent,
            }}
            animate={
              reducedMotion
                ? { opacity: motif.opacity * 0.7 }
                : { y: [0, -8, 0], rotate: [motif.rotate, motif.rotate + 3, motif.rotate] }
            }
            transition={{ duration: motif.duration, repeat: Infinity, ease: 'easeInOut', delay: motif.delay }}
          >
            <span>{motif.icon}</span>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl border"
      style={{
        background: variant === 'panel' ? theme.softGradient : 'transparent',
        borderColor: `${theme.primary}22`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(135deg, ${theme.primary}10, transparent 55%, ${theme.accent}08)` }} />
      <div className="absolute inset-0 pointer-events-none">
        {motifs.map((motif) => (
          <motion.div
            key={`${programId}-${motif.icon}-${motif.top}-${motif.left}`}
            className="absolute flex items-center justify-center select-none"
            style={{
              top: motif.top,
              left: motif.left,
              width: motif.size,
              height: motif.size,
              fontSize: motif.size,
              opacity: motif.opacity,
              color: theme.accent,
              textShadow: `0 0 18px ${theme.primary}66`,
            }}
            animate={
              reducedMotion
                ? { opacity: motif.opacity }
                : {
                    y: [0, -10, 0],
                    x: [0, 3, 0],
                    rotate: [motif.rotate, motif.rotate + 4, motif.rotate],
                  }
            }
            transition={{
              duration: motif.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: motif.delay,
            }}
          >
            <span>{motif.icon}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
