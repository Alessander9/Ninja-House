
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
  video?: string
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
    description: 'Programa dedicado al anime, manga y cultura japonesa con reviews, debates y noticias en vivo.',
    category: 'Anime, manga y cultura japonesa',
    image: '/assets/animesRamen_logo.webp',
    video: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791287537/1791287482828lhtlquht3_compressed.mp4',
    color: '#C6A2E6',
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
    title: 'Over Head',
    description: 'Programa dedicado a la lucha libre, conducido por Umano, Gianco y Luchito sobre WWE y wrestling.',
    category: 'Lucha libre, WWE y wrestling',
    image: '/assets/OVERHEAD_LOGO.png',
    video: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1792118051/LOOP_PANTALLA_DE_ATRAS.webm',
    color: '#2563EB',
    emoji: '🤼',
    host: 'Umano, Gianco & Luchito',
  },
  {
    id: 'frikisdem',
    day: 'Miércoles',
    shortDay: 'MIÉ',
    dayIndex: 3,
    time: '21:00',
    timeDisplay: '9:00 PM',
    endTime: '11:00 PM',
    title: 'Frikis de M',
    description: 'Cultura pop, actualidad y anécdotas con humor y mirada friki con Camu, Umano, D’arranque, Rafomagia y Luchito.',
    category: 'Cultura pop, actualidad y anécdotas',
    image: '/assets/FrikisDeM_Logo.png',
    video: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791285670/frikisM.mp4',
    color: '#16A34A',
    emoji: '🎮',
    host: 'Camu, Umano, D’arranque, Rafomagia & Luchito',
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
    description: 'Coleccionismo, nostalgia y cultura pop sin filtros con Markollectibles, Gianco Condemarín y Rafomagia.',
    category: 'Coleccionismo, nostalgia y cultura pop',
    image: '/assets/MALDITOPLASTICO_LOGO.png',
    video: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791285410/FONDO_PANTALLA_TRASERA.webm',
    color: '#EA580C',
    emoji: '🛒',
    host: 'Markollectibles, Gianco Condemarín & Rafomagia',
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
    description: 'Cine de terror, suspenso y culto visto por quienes aman el género con Carmen Bathory y Andrés Manco.',
    category: 'Terror, suspenso y cine de culto',
    image: '/assets/CINEINFARTO_LOGO.png',
    video: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1792118147/PANTALLA_TRASERA_02.webm',
    color: '#DC2626',
    emoji: '🎬',
    host: 'Carmen Bathory & Andrés Manco',
  },
  {
    id: 'plan-oscuro',
    day: 'Domingo',
    shortDay: 'DOM',
    dayIndex: 0,
    time: '21:00',
    timeDisplay: '9:00 PM',
    endTime: '11:00 PM',
    title: 'El Plano Oscuro',
    description: 'Fenómenos paranormales, terror y misterio explorados desde lo espiritual y lo inexplicable.',
    category: 'Paranormal, misterio y espiritualidad',
    image: '/assets/PLAN_OSCURO_LOGO.webp',
    video: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1792120902/PANTALLA_TRASERA.webm',
    color: '#9333EA',
    emoji: '🔮',
    host: 'Adriana Larrea (Mar de Luna) & Sandra (La Suma Sacerdotisa)',
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
