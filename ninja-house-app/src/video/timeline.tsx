import { createContext, useContext, type ReactNode } from 'react'
import { motion, useTransform, type MotionValue, type EasingFunction } from 'framer-motion'

/**
 * Motor de timeline determinista.
 * Toda la animación del video se deriva de un único MotionValue `time` (segundos).
 * Así el video se puede reproducir, pausar, hacer scrub y renderizar frame a frame
 * (scripts/render-promo.mjs) con resultados idénticos.
 */
const TimeContext = createContext<MotionValue<number> | null>(null)

export function TimelineProvider({ time, children }: { time: MotionValue<number>; children: ReactNode }) {
  return <TimeContext.Provider value={time}>{children}</TimeContext.Provider>
}

export function useTime(): MotionValue<number> {
  const t = useContext(TimeContext)
  if (!t) throw new Error('useTime debe usarse dentro de <TimelineProvider>')
  return t
}

/** Interpola el tiempo global a un rango de salida (siempre con clamp). */
export function useTl<T extends number | string>(input: number[], output: T[], ease?: EasingFunction | EasingFunction[]): MotionValue<T> {
  const time = useTime()
  return useTransform<number, T>(time, input, output, { clamp: true, ease })
}

/** Transformación libre del tiempo (para loops: pulsos, flotación, rotación). */
export function useTimeFn<T>(fn: (t: number) => T) {
  const time = useTime()
  return useTransform(time, fn)
}

/** Monta/oculta una escena según su ventana de tiempo [start, end). */
export function Scene({ start, end, children, className = '' }: { start: number; end: number; children: ReactNode; className?: string }) {
  const visibility = useTimeFn((t) => (t >= start && t < end ? 'visible' : 'hidden'))
  return (
    <motion.div className={`absolute inset-0 overflow-hidden ${className}`} style={{ visibility }}>
      {children}
    </motion.div>
  )
}
