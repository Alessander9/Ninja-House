import { type ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  id?: string
  className?: string
  diagonal?: 'top' | 'bottom' | 'both' | 'none'
  bg?: string
}

export function SectionWrapper({
  children,
  id,
  className = '',
  diagonal = 'none',
  bg = 'bg-ninja-black',
}: SectionWrapperProps) {
  const diagClass = {
    top: 'diagonal-top',
    bottom: 'diagonal-bottom',
    both: 'diagonal-both',
    none: '',
  }[diagonal]

  return (
    <section
      id={id}
      className={`relative ${bg} ${diagClass} ${className}`}
    >
      {children}
    </section>
  )
}
