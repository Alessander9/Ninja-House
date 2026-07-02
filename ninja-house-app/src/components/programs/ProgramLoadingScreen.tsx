import { AnimatePresence, motion } from 'framer-motion'
import type { Program } from '../../data/programs'
import type { ProgramTheme } from '../../data/programThemes'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { ProgramMotifs } from './ProgramMotifs'

interface ProgramLoadingScreenProps {
  isVisible: boolean
  program: Program
  theme: ProgramTheme
}

export function ProgramLoadingScreen({ isVisible, program, theme }: ProgramLoadingScreenProps) {
  const reducedMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={`${program.id}-loading`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.45, ease: 'easeOut' }}
          className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden"
          style={{
            background: theme.gradient,
          }}
        >
          <ProgramMotifs programId={program.id} theme={theme} variant="compact" />

          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(120deg, transparent 0%, ${theme.primary}10 45%, transparent 70%)`,
            }}
          />
          <div className={`absolute inset-0 pointer-events-none ${theme.textureClass}`} />

          <motion.div
            className="relative z-10 w-full max-w-2xl px-6 text-center"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <motion.div
              className="flex justify-center"
              animate={
                reducedMotion
                  ? undefined
                  : {
                      y: [0, -5, 0],
                      scale: [1, 1.04, 1],
                    }
              }
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="relative w-28 h-28 rounded-2xl overflow-hidden border"
                style={{
                  borderColor: `${theme.primary}40`,
                  boxShadow: `0 0 0 1px ${theme.primary}22, 0 18px 48px rgba(0,0,0,0.45)`,
                  background: 'rgba(10,10,10,0.65)',
                }}
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        rotate: [0, -2, 2, 0],
                        boxShadow: [
                          `0 0 0 1px ${theme.primary}22, 0 18px 48px rgba(0,0,0,0.45)`,
                          `0 0 0 1px ${theme.primary}44, 0 18px 60px rgba(0,0,0,0.5)`,
                          `0 0 0 1px ${theme.primary}22, 0 18px 48px rgba(0,0,0,0.45)`,
                        ],
                      }
                }
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src={theme.logoPath}
                  alt={`${program.title} logo`}
                  className="w-full h-full object-contain p-3"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
