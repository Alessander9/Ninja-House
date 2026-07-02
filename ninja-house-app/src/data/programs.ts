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
    color: '#7C3AED',
    emoji: '🍜',
    image: '/assets/animesYramen1.png',
    focus: 'Comunidad otaku activa, participativa y altamente digital.',
    talents: ['Charrita Peruana', 'Ale Romero'],
    segment: 'Hombres y Mujeres de 18 a 45 años',
    sponsorText: 'Auspicia Animes y Ramen y conecta tu marca con una comunidad otaku activa, participativa y altamente digital.'
  },
  {
    id: 'freakuencia-m',
    slug: 'freakuencia-m',
    title: 'Freakuencia M',
    description: 'Programa de entretenimiento con análisis de cultura pop, tendencias y conversación dinámica en vivo.',
    category: 'Entretenimiento y cultura pop',
    day: 'Miércoles',
    dayIndex: 3,
    time: '9:00 PM - 11:00 PM',
    badge: 'MIÉRCOLES',
    color: '#16A34A',
    emoji: '🎙️',
    image: '/assets/freakuencia1.png',
    focus: 'Dinámico, colorido, conversación energética y actualidad en vivo.',
    talents: ['Host 1', 'Host 2', 'Host 3'],
    segment: 'Hombres y Mujeres de 18 a 45 años',
    sponsorText: 'Auspicia Freakuencia M y conecta tu marca con conversaciones dinámicas, entretenimiento y cultura pop digital.'
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
    image: '/assets/malditoPlastico1.png',
    focus: 'Comunidad de coleccionistas apasionados, nostalgia y valor de colecciones.',
    talents: ['Host 1', 'Host 2', 'Host 3'],
    segment: 'Coleccionistas y fans de acción figures',
    sponsorText: 'Auspicia Maldito Plástico y conecta con coleccionistas que compran, recomiendan, comparan y valoran productos de nicho.'
  },
  {
    id: 'cine-infarto',
    slug: 'cine-infarto',
    title: 'Cine Infarto',
    description: 'Programa de cine y películas con reviews, análisis cinematográfico y recomendaciones para cinéfilos.',
    category: 'Cine y películas',
    day: 'Viernes',
    dayIndex: 5,
    time: '5:00 PM - 7:00 PM',
    badge: '🎬 VIERNES',
    color: '#DC2626',
    emoji: '🎬',
    image: '/assets/CineInfarto1.png',
    focus: 'Análisis crítico y pasionado, generando conversación y teorías cinematográficas.',
    talents: ['Host 1', 'Host 2'],
    segment: 'Cinéfilos 20-50 años',
    sponsorText: 'Auspicia Cine Infarto y lleva tu marca a una audiencia cinéfila que conversa, teoriza y consume entretenimiento audiovisual.'
  },
  {
    id: 'overhead',
    slug: 'overhead',
    title: 'Overhead',
    description: 'Programa de entretenimiento y análisis de videojuegos, películas y cultura gaming con debate en vivo.',
    category: 'Videojuegos y gaming',
    day: 'Martes',
    dayIndex: 2,
    time: '9:00 PM - 11:00 PM',
    badge: 'MARTES',
    color: '#2563EB',
    emoji: '🌐',
    image: '/assets/overHead1.png',
    focus: 'Gamers apasionados, análisis intenso y conversación dinámica en vivo.',
    talents: ['Host 1', 'Host 2', 'Host 3'],
    segment: 'Gamers y fans de entretenimiento',
    sponsorText: 'Auspicia Overhead y coloca tu marca frente a gamers y fans que viven gaming y entretenimiento en comunidad.'
  },
  {
    id: 'lanzalo',
    slug: 'lanzalo',
    title: 'Lanzalo',
    description: 'Programa de Calabozos y Dragones jugado en vivo con participación del público. Combina rol, creatividad y entretenimiento geek, convirtiendo a la audiencia en parte activa de la aventura.',
    category: 'Calabozos y Dragones en vivo',
    day: 'Domingo',
    dayIndex: 0,
    time: '9:00 PM - 11:00 PM',
    badge: 'DOMINGO',
    color: '#E11D48',
    emoji: '🎲',
    image: '/assets/lanzalo1.png',
    focus: 'Rol en vivo, creatividad, participación del público e inmersión épica.',
    talents: ['Goncho Iglesias', 'Luciana Roy', 'JeanPhil', 'Jose Klauer', 'Gonzalo Heredia'],
    segment: 'Hombres y Mujeres de 25 a 50 años',
    sponsorText: 'Auspicia Lanzalo y conecta tu marca con una comunidad creativa, rolera, participativa y altamente inmersiva.'
  }
]
