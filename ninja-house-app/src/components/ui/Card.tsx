import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glowColor?: 'green' | 'purple' | 'yellow' | 'none'
  onClick?: () => void
}

const glowMap = {
  green:  '0 0 0 1px #67B946, 0 8px 32px rgba(103,185,70,0.35)',
  purple: '0 0 0 1px #5A287A, 0 8px 32px rgba(90,40,122,0.45)',
  yellow: '0 0 0 1px #F6D853, 0 8px 32px rgba(246,216,83,0.35)',
  none:   '0 4px 20px rgba(0,0,0,0.4)',
}

const borderMap = {
  green:  '1px solid #67B946',
  purple: '1px solid #5A287A',
  yellow: '1px solid #F6D853',
  none:   '1px solid rgba(255,255,255,0.06)',
}

export function Card({ children, className = '', glowColor = 'green', onClick }: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`bg-ninja-card rounded-xl overflow-hidden relative ${className}`}
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, y: 30 }}
      whileHover={{
        y: -6,
        scale: 1.025,
        boxShadow: glowMap[glowColor],
        border: borderMap[glowColor],
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
