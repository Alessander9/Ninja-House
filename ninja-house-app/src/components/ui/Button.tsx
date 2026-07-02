import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'yellow'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  onClick?: () => void
  href?: string
  className?: string
  disabled?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-ninja-green text-ninja-black font-bold border-2 border-ninja-green hover:bg-transparent hover:text-ninja-green',
  secondary:
    'bg-transparent text-ninja-purple font-bold border-2 border-ninja-purple hover:bg-ninja-purple hover:text-white',
  ghost:
    'bg-transparent text-white font-semibold border-2 border-white/20 hover:border-ninja-green hover:text-ninja-green',
  yellow:
    'bg-ninja-yellow text-ninja-black font-bold border-2 border-ninja-yellow hover:bg-transparent hover:text-ninja-yellow',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className = '',
  disabled = false,
}: ButtonProps) {
  const baseClass = `inline-flex items-center justify-center gap-2 font-display transition-all duration-300 cursor-pointer select-none relative overflow-hidden ${variants[variant]} ${sizes[size]} ${className}`

  const motionProps = {
    whileHover: { scale: 1.04, y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
  }

  if (href) {
    return (
      <motion.a href={href} target="_blank" rel="noopener noreferrer" className={baseClass} {...motionProps}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button onClick={onClick} className={baseClass} disabled={disabled} {...motionProps}>
      {children}
    </motion.button>
  )
}
