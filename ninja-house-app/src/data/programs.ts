export interface Program {
  id: string
  slug: string
  title: string
  description: string
  category: string
  day: string
  dayIndex: number // 0=Sun, 1=Mon...6=Sat
  time: string
  badge?: string
  color: string
  emoji: string
  image: string
  heroVideo?: string
  focus: string
  talents: string[]
  segment: string
  sponsorText: string
}

export const programsData: Program[] = [
  {
    id: 'animes-y-ramen',
    slug: 'animes-y-ramen',
    title: 'Animes y Ramen',
    description: 'Programa dedicado al anime, manga y cultura japonesa, con reviews, debates y noticias para una comunidad otaku que vive el anime más allá de la pantalla. Referentes del mundo geek, generando conversación en vivo y alto engagement.',
    category: 'Anime, manga y cultura japonesa',
    day: 'Lunes',
    dayIndex: 1,
    time: '9:00 PM - 11:00 PM',
    badge: 'LUNES',
    color: '#C6A2E6',
    emoji: '🍜',
    image: '/assets/animesRamen_logo.webp',
    heroVideo: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791287537/1791287482828lhtlquht3_compressed.mp4',
    focus: 'Comunidad otaku activa, participativa y altamente digital.',
    talents: ['Charrita Peruana', 'Ale Romero'],
    segment: 'Hombres y Mujeres de 18 a 45 años',
    sponsorText: 'Auspicia Animes y Ramen y conecta tu marca con una comunidad otaku activa, participativa y altamente digital.'
  },
  {
    id: 'overhead',
    slug: 'overhead',
    title: 'Overhead',
    description: 'Programa de entretenimiento y análisis de lucha libre profesional, videojuegos, películas y cultura gaming con debate en vivo.',
    category: 'Lucha libre profesional & gaming',
    day: 'Martes',
    dayIndex: 2,
    time: '9:00 PM - 11:00 PM',
    badge: 'MARTES',
    color: '#2563EB',
    emoji: '🌐',
    image: '/assets/OVERHEAD_LOGO.png',
    heroVideo: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791285147/OVER_HEAD_logo_neon_background_202608031114.mp4',
    focus: 'Gamers y fans del wrestling, análisis intenso y conversación dinámica en vivo.',
    talents: ['Umano Mc', 'Luis Ríos', 'El tío Hitman'],
    segment: 'Gamers y fans de lucha libre',
    sponsorText: 'Auspicia Overhead y coloca tu marca frente a una comunidad apasionada de gaming y lucha libre.'
  },
  {
    id: 'frikisdem',
    slug: 'frikisdem',
    title: 'FrikisDeM',
    description: 'Programa de entretenimiento con análisis de cultura pop, memes, tendencias y conversación dinámica en vivo sin filtros.',
    category: 'Cultura pop, memes y actualidad geek',
    day: 'Miércoles',
    dayIndex: 3,
    time: '9:00 PM - 11:00 PM',
    badge: 'MIÉRCOLES',
    color: '#16A34A',
    emoji: '🎙️',
    image: '/assets/FrikisDeM_Logo.png',
    heroVideo: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791285670/frikisM.mp4',
    focus: 'Dinámico, colorido, conversación energética, memes y actualidad en vivo.',
    talents: ['Darranque', 'Luis Ríos', 'Umano', 'Rafomagia'],
    segment: 'Hombres y Mujeres de 18 a 45 años',
    sponsorText: 'Auspicia FrikisDeM y conecta tu marca con conversaciones dinámicas, entretenimiento y cultura pop digital.'
  },
  {
    id: 'maldito-plastico',
    slug: 'maldito-plastico',
    title: 'Maldito Plástico',
    description: 'Programa dedicado a coleccionables y cultura geek de juguetes, con análisis, reviews y conversación con la comunidad de coleccionistas.',
    category: 'Coleccionismo y figuras de acción',
    day: 'Jueves',
    dayIndex: 4,
    time: '9:00 PM - 10:00 PM',
    badge: 'JUEVES',
    color: '#EA580C',
    emoji: '🧸',
    image: '/assets/MALDITOPLASTICO_LOGO.png',
    heroVideo: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791285410/FONDO_PANTALLA_TRASERA.webm',
    focus: 'Comunidad de coleccionistas apasionados, nostalgia y valor de colecciones.',
    talents: ['Markollectibles', 'Gianco C', 'Rafomagia'],
    segment: 'Coleccionistas y fans de acción figures',
    sponsorText: 'Auspicia Maldito Plástico y conecta con coleccionistas que compran, recomiendan, comparan y valoran productos de nicho.'
  },
  {
    id: 'cine-infarto',
    slug: 'cine-infarto',
    title: 'Cine Infarto',
    description: 'Programa de cine, thrillers y series con reviews, análisis cinematográfico, misterio y recomendaciones para cinéfilos.',
    category: 'Cine, series, misterio y suspenso',
    day: 'Viernes',
    dayIndex: 5,
    time: '9:00 PM - 11:00 PM',
    badge: '🎬 VIERNES',
    color: '#DC2626',
    emoji: '🎬',
    image: '/assets/CINEINFARTO_LOGO.png',
    heroVideo: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791286679/Palomitas_rojas_en_claqueta_cine_202608031254.mp4',
    focus: 'Análisis crítico y apasionado, generando conversación y teorías cinematográficas.',
    talents: ['Carmen Bathory', 'José Manco'],
    segment: 'Cinéfilos 20-50 años',
    sponsorText: 'Auspicia Cine Infarto y lleva tu marca a una audiencia cinéfila que conversa, teoriza y consume entretenimiento audiovisual.'
  },
  {
    id: 'plan-oscuro',
    slug: 'plan-oscuro',
    title: 'Plan Oscuro',
    description: 'Investigaciones oscuras, crónicas de misterio, fenómenos paranormales y conspiraciones que desafían la realidad.',
    category: 'Misterio, crónicas y casos oscuros',
    day: 'Sábado',
    dayIndex: 6,
    time: '9:00 PM - 11:00 PM',
    badge: '🕯️ SÁBADO',
    color: '#9333EA',
    emoji: '🕯️',
    image: '/assets/PLAN_OSCURO_LOGO.webp',
    heroVideo: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791286705/Animar_logo_en_bucle_202609081015.mp4',
    focus: 'Misterio, crónicas criminales, enigmas y debates oscuros.',
    talents: ['Equipo Plan Oscuro'],
    segment: 'Amantes del misterio y lo paranormal de 18 a 50 años',
    sponsorText: 'Auspicia Plan Oscuro y posiciona tu marca en una audiencia inmersiva y apasionada por los enigmas y el misterio.'
  }
]
