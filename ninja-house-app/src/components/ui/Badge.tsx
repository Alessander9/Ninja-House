import { motion } from 'framer-motion'
import { type ProgramStatus } from '../../data/schedule'

interface BadgeProps {
  status: ProgramStatus
  className?: string
}

const config: Record<ProgramStatus, { label: string; bgClass: string; textClass: string; animate?: boolean; blink?: boolean }> = {
  live: {
    label: '● EN VIVO',
    bgClass: 'bg-red-600',
    textClass: 'text-white',
    animate: true,
    blink: true,
  },
  today: {
    label: '⚡ HOY',
    bgClass: 'bg-ninja-green',
    textClass: 'text-ninja-black',
    animate: true,
  },
  'next-live': {
    label: '🔜 PRÓXIMO EN VIVO',
    bgClass: 'bg-ninja-purple',
    textClass: 'text-white',
    animate: true,
  },
  upcoming: {
    label: '🕐 PRÓXIMAMENTE',
    bgClass: 'bg-ninja-yellow',
    textClass: 'text-ninja-black',
  },
  finished: {
    label: '✓ FINALIZADO',
    bgClass: 'bg-white/10',
    textClass: 'text-white/50',
  },
}

export function Badge({ status, className = '' }: BadgeProps) {
  const c = config[status]

  return (
    <motion.span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-display tracking-wider ${c.bgClass} ${c.textClass} ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={
        c.animate
          ? {
              scale: [1, 1.05, 1],
              opacity: 1,
            }
          : { scale: 1, opacity: 1 }
      }
      transition={
        c.animate
          ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.3 }
      }
    >
      {c.label}
    </motion.span>
  )
}

// Dot indicator for live status
export function LiveDot() {
  return (
    <motion.span
      className="inline-block w-2 h-2 rounded-full bg-red-500"
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
