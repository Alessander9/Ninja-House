
export type ProgramStatus = 'live' | 'today' | 'next-live' | 'upcoming' | 'finished'

export interface ScheduleProgram {
  id: string
  day: string
  shortDay: string
  dayIndex: number // 0=Sun, 1=Mon...6=Sat
  time: string     // "21:00" 24h for comparison
  timeDisplay: string
  endTime: string
  title: string
  description: string
  category: string
  image: string
  color: string
  emoji: string
  host?: string
}

export const scheduleData: ScheduleProgram[] = [
  {
    id: 'animes-y-ramen',
    day: 'Lunes',
    shortDay: 'LUN',
    dayIndex: 1,
    time: '21:00',
    timeDisplay: '9:00 PM',
    endTime: '11:00 PM',
    title: 'Animes y Ramen',
    description: 'Programa dedicado al anime, manga y cultura japonesa con reviews, debates y noticias.',
    category: 'Anime, manga y cultura japonesa',
    image: '/assets/animesYramen1.png',
    color: '#7C3AED',
    emoji: '🍜',
    host: 'Charrita Peruana & Ale Romero',
  },
  {
    id: 'overhead',
    day: 'Martes',
    shortDay: 'MAR',
    dayIndex: 2,
    time: '21:00',
    timeDisplay: '9:00 PM',
    endTime: '11:00 PM',
    title: 'Overhead',
    description: 'Programa dedicado a la lucha libre profesional con análisis, debates y cobertura de WWE, AEW y wrestling mundial.',
    category: 'Lucha libre profesional',
    image: '/assets/overHead1.png',
    color: '#2563EB',
    emoji: '🌐',
    host: 'Umano Mc, Luis Ríos & El tío Hitman',
  },
  {
    id: 'freakuencia-m',
    day: 'Miércoles',
    shortDay: 'MIÉ',
    dayIndex: 3,
    time: '21:00',
    timeDisplay: '9:00 PM',
    endTime: '11:00 PM',
    title: 'Freakuencia M',
    description: 'Programa enfocado en cultura pop y actualidad geek con análisis de tendencias y noticias virales.',
    category: 'Cultura pop y actualidad geek',
    image: '/assets/freakuencia1.png',
    color: '#16A34A',
    emoji: '⚡',
    host: 'Darranque, Luis Ríos, Umano & Rafomagia',
  },
  {
    id: 'maldito-plastico',
    day: 'Jueves',
    shortDay: 'JUE',
    dayIndex: 4,
    time: '21:00',
    timeDisplay: '9:00 PM',
    endTime: '11:00 PM',
    title: 'Maldito Plástico',
    description: 'Programa dedicado al coleccionismo y figuras de acción con unboxings y análisis.',
    category: 'Coleccionismo y figuras de acción',
    image: '/assets/malditoPlastico1.png',
    color: '#EA580C',
    emoji: '🧸',
    host: 'Markollectibles, Gianco C & Rafomagia',
  },
  {
    id: 'cine-infarto',
    day: 'Viernes',
    shortDay: 'VIE',
    dayIndex: 5,
    time: '21:00',
    timeDisplay: '9:00 PM',
    endTime: '11:00 PM',
    title: 'Cine Infarto',
    description: 'Programa centrado en cine, series y misterio con temáticas de terror y suspenso.',
    category: 'Cine, series, misterio, terror y suspenso',
    image: '/assets/CineInfarto1.png',
    color: '#DC2626',
    emoji: '🎬',
    host: 'Carmen Bathory & José Manco',
  },
  /*,
  {
    id: 'lanzalo',
    day: 'Domingo',
    shortDay: 'DOM',
    dayIndex: 0,
    time: '21:00',
    timeDisplay: '9:00 PM',
    endTime: '11:00 PM',
    title: 'Lanzalo',
    description: 'Programa de Calabozos y Dragones en vivo con rol, improvisación e interacción activa.',
    category: 'Calabozos y Dragones en vivo',
    image: '/assets/CineInfarto1.png',
    color: '#4E3FA8',
    emoji: '🎲',
    host: 'Goncho Iglesias, Luciana Roy, JeanPhil, Jose Klauer & Gonzalo Heredia',
  },
  */
]

/**
 * Smart status resolver:
 * - If today is Saturday (6), all are upcoming/finished
 * - If today is a show day:
 *   - Before 9PM → that day = 'next-live', earlier days = 'finished'
 *   - 9PM-11PM → that day = 'live'
 *   - After 11PM → that day = 'finished'
 */
export function getSmartStatus(program: ScheduleProgram): ProgramStatus {
  const now = new Date()
  const todayIndex = now.getDay()   // 0=Sun, 1=Mon ... 6=Sat
  const currentHour = now.getHours()
  const currentMin = now.getMinutes()
  const currentMinutes = currentHour * 60 + currentMin
  const showStartMinutes = 21 * 60  // 9PM = 21:00
  const showEndMinutes = 23 * 60    // 11PM = 23:00

  const p = program.dayIndex

  // Saturday (6) is a day with no programs. Next program is Lanzalo (0 - Sunday)
  if (todayIndex === 6) {
    return p === 0 ? 'next-live' : 'upcoming'
  }

  // If the program day index is before today's day index, it is finished for the week.
  // Note: Sunday (0) is the start of the week in JavaScript, but in our schedule, Lanzalo is Sunday.
  // Let's make sure it handles logical weekly cycle.
  // Let's mapping: Mon(1), Tue(2), Wed(3), Thu(4), Fri(5), Sat(6), Sun(0)
  // Let's calculate distance from today:
  const getDistance = (day: number, today: number) => {
    // Distance from today to day
    // e.g. today is Sunday(0), Mon(1) is 1 day away, Tue(2) is 2 days away.
    // Sunday(0) to Sunday(0) is 0 days away.
    // Saturday(6) to Sunday(0) is 1 day away.
    const diff = (day - today + 7) % 7
    return diff
  }

  const distance = getDistance(p, todayIndex)

  if (distance === 0) {
    if (currentMinutes < showStartMinutes) {
      return 'next-live'
    } else if (currentMinutes < showEndMinutes) {
      return 'live'
    } else {
      return 'finished'
    }
  }

  // If it's in the past (e.g. today is Wednesday, and program is Monday or Tuesday)
  // How to know if it's past? If getDistance(today, p) > getDistance(p, today)
  // Better: Mon is 1, Tue is 2, Wed is 3, Thu is 4, Fri is 5, Sun is 0.
  // If we treat Sunday as 7 for simple order: Mon(1), Tue(2), Wed(3), Thu(4), Fri(5), Sat(6), Sun(7)
  const getOrder = (day: number) => (day === 0 ? 7 : day)
  const todayOrder = getOrder(todayIndex)
  const programOrder = getOrder(p)

  if (programOrder < todayOrder) {
    return 'finished'
  }

  // If it's the next day of a finished show or if today's show is finished
  if (programOrder === todayOrder + 1 || (todayIndex === 5 && p === 0)) {
    const todayShowDone = todayOrder === 6 || currentMinutes >= showEndMinutes
    if (todayShowDone) {
      return 'next-live'
    }
  }

  return 'upcoming'
}
