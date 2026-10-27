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
    description: '🍜 ¡Bienvenidos a Animes y Ramen! El podcast donde el anime, la cultura otaku y las opiniones sin filtro se mezclan mejor que los fideos con su caldo. 😂 Junto a Charrita y Ale Romero, exploramos clásicos, tendencias, personajes cuestionables y temas polémicos del mundo otaku. Porque aquí hay espacio para el análisis, las risas y los debates que ni el poder de la amistad puede resolver. ¡Sírvete tu ramen y prepárate para la discusión!',
    category: 'Anime, manga y cultura japonesa',
    day: 'Lunes',
    dayIndex: 1,
    time: '9:00 PM - 11:00 PM',
    badge: '🍜 LUNES',
    color: '#C6A2E6',
    emoji: '🍜',
    image: '/assets/animesRamen_logo.webp',
    heroVideo: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791287537/1791287482828lhtlquht3_compressed.mp4',
    focus: 'Reviews, debates, manga y cultura japonesa en vivo para la comunidad otaku.',
    talents: ['Charrita', 'Ale Romero'],
    segment: 'Comunidad otaku y fans del manga de 18 a 45 años',
    sponsorText: 'Auspicia Animes y Ramen y conecta tu marca con una comunidad otaku activa, participativa y altamente digital.'
  },
  {
    id: 'overhead',
    slug: 'overhead',
    title: 'Over Head',
    description: 'Programa dedicado a la lucha libre, conducido por Umano, Gianco y Luchito. Noticias, análisis, rankings y debates sobre WWE y el universo del wrestling, con humor y pasión por el ring. Un espacio para revivir combates históricos, discutir rivalidades y compartir en vivo con la comunidad. 💪 🏟️ 🔥 📺',
    category: 'Lucha libre, WWE y wrestling',
    day: 'Martes',
    dayIndex: 2,
    time: '9:00 PM - 11:00 PM',
    badge: '🤼 MARTES',
    color: '#2563EB',
    emoji: '🤼',
    image: '/assets/OVERHEAD_LOGO.png',
    heroVideo: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1792118051/LOOP_PANTALLA_DE_ATRAS.webm',
    focus: 'WWE, wrestling, rivalidades históricas y debates en vivo con humor y pasión.',
    talents: ['Umano', 'Gianco', 'Luchito'],
    segment: 'Fans del wrestling, WWE y gaming',
    sponsorText: 'Auspicia Over Head y coloca tu marca frente a una comunidad apasionada de wrestling y entretenimiento.'
  },
  {
    id: 'frikisdem',
    slug: 'frikis-de-m',
    title: 'Frikis de M',
    description: 'Cultura pop, actualidad y anécdotas con humor y mirada friki. Camu, Umano, D’arranque y Rafomagia, con Luchito en los controles, convierten series, películas, tendencias y situaciones cotidianas en debates y conversaciones en vivo. Un espacio para compartir opiniones, reírse y sentirse entre amigos. 🎬 🍿 🎮 ✨',
    category: 'Cultura pop, actualidad y anécdotas',
    day: 'Miércoles',
    dayIndex: 3,
    time: '9:00 PM - 11:00 PM',
    badge: '🎮 MIÉRCOLES',
    color: '#16A34A',
    emoji: '🎮',
    image: '/assets/FrikisDeM_Logo.png',
    heroVideo: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791285670/frikisM.mp4',
    focus: 'Cultura pop, actualidad, tendencias, cine y humor en vivo entre amigos.',
    talents: ['Camu', 'Umano', 'D’arranque', 'Rafomagia', 'Luchito (Controles)'],
    segment: 'Hombres y Mujeres de 18 a 45 años amantes de la cultura pop',
    sponsorText: 'Auspicia Frikis de M y conecta tu marca con conversaciones dinámicas, entretenimiento y cultura pop digital.'
  },
  {
    id: 'maldito-plastico',
    slug: 'maldito-plastico',
    title: 'Maldito Plástico',
    description: 'Coleccionismo, nostalgia y cultura pop sin filtros. Markollectibles, Gianco Condemarín y Rafomagia analizan figuras, lanzamientos, precios, licencias y esas obsesiones que solo otro coleccionista comprende. Debates, noticias y experiencias para una comunidad que sabe que cada pieza guarda una historia. 📦 🤖 ⭐ ❤️',
    category: 'Coleccionismo, nostalgia y cultura pop',
    day: 'Jueves',
    dayIndex: 4,
    time: '9:00 PM - 10:00 PM',
    badge: '🛒 JUEVES',
    color: '#EA580C',
    emoji: '🛒',
    image: '/assets/MALDITOPLASTICO_LOGO.png',
    heroVideo: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791285410/FONDO_PANTALLA_TRASERA.webm',
    focus: 'Coleccionismo, lanzamientos, figuras vintage, licencias y nostalgia.',
    talents: ['Markollectibles', 'Gianco Condemarín', 'Rafomagia'],
    segment: 'Coleccionistas, compradores de figuras y amantes de la nostalgia',
    sponsorText: 'Auspicia Maldito Plástico y conecta con coleccionistas que compran, recomiendan, comparan y valoran productos de nicho.'
  },
  {
    id: 'cine-infarto',
    slug: 'cine-infarto',
    title: 'Cine Infarto',
    description: 'Cine de terror, suspenso y culto visto por quienes aman el género. Carmen Bathory y Andrés Manco analizan películas, estrenos, clásicos, directores y esas historias capaces de inquietarnos mucho después de los créditos. Opiniones, noticias y debates para una comunidad que disfruta el miedo dentro y fuera del cine. 👻 💀 🎥 🍿',
    category: 'Terror, suspenso y cine de culto',
    day: 'Viernes',
    dayIndex: 5,
    time: '9:00 PM - 11:00 PM',
    badge: '🎬 VIERNES',
    color: '#DC2626',
    emoji: '🎬',
    image: '/assets/CINEINFARTO_LOGO.png',
    heroVideo: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1792118147/PANTALLA_TRASERA_02.webm',
    focus: 'Cine de terror, suspenso, estrenos, clásicos y directores de culto.',
    talents: ['Carmen Bathory', 'Andrés Manco'],
    segment: 'Cinéfilos y amantes del terror de 20 a 50 años',
    sponsorText: 'Auspicia Cine Infarto y lleva tu marca a una audiencia cinéfila que conversa, teoriza y consume entretenimiento audiovisual.'
  },
  {
    id: 'plan-oscuro',
    slug: 'el-plano-oscuro',
    title: 'El Plano Oscuro',
    description: 'Fenómenos paranormales, terror y misterio explorados desde lo espiritual y lo inexplicable. Adriana Larrea, médium conocida como Mar de Luna, y Sandra, bruja blanca y tarotista conocida como La Suma Sacerdotisa, analizan casos, relatos, leyendas, señales y experiencias que desafían la lógica. Un espacio para debatir, escuchar testimonios y conectar en vivo con una comunidad que se atreve a mirar más allá de lo visible. 🌙 🕯️ 🔮 ✨',
    category: 'Paranormal, misterio y espiritualidad',
    day: 'Domingo',
    dayIndex: 0,
    time: '9:00 PM - 11:00 PM',
    badge: '🔮 DOMINGO',
    color: '#9333EA',
    emoji: '🔮',
    image: '/assets/PLAN_OSCURO_LOGO.webp',
    heroVideo: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1792120902/PANTALLA_TRASERA.webm',
    focus: 'Fenómenos paranormales, terror y misterio explorados desde lo espiritual y lo inexplicable.',
    talents: ['Adriana Larrea (Mar de Luna)', 'Sandra (La Suma Sacerdotisa)'],
    segment: 'Amantes del misterio, lo paranormal y la espiritualidad de 18 a 50 años',
    sponsorText: 'Auspicia El Plano Oscuro y conecta tu marca con una comunidad inmersiva y apasionada por el misterio y lo inexplicable.'
  }
]
