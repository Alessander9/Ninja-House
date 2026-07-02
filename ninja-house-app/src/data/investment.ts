export interface InvestmentBenefit {
  id: string
  title: string
  description: string
  icon: string
}

export interface SponsorFormat {
  id: string
  title: string
  description: string
  badge: string
}

export const investmentBenefits: InvestmentBenefit[] = [
  {
    id: 'geek-influence',
    title: 'Plataforma de influencia geek',
    description: 'Producimos y amplificamos contenido sobre anime, coleccionables, lucha libre, cine, rol y cultura pop con credibilidad real.',
    icon: '🎯',
  },
  {
    id: 'active-community',
    title: 'Comunidad activa y comprometida',
    description: 'Conectamos marcas con fans y coleccionistas que generan conversación real, comparten, debaten y participan cada semana.',
    icon: '🔥',
  },
  {
    id: 'live-formats',
    title: 'Formatos virales y experiencias en vivo',
    description: 'Creamos contenido dinámico en directo que impulsa visibilidad, engagement y recordación de marca sin interrupciones frías.',
    icon: '📺',
  },
  {
    id: 'targeted-audience',
    title: 'Audiencia que consume cultura geek',
    description: 'Una comunidad juvenil y adulta (18 a 55 años) que invierte activamente en su hobby, merchandising y productos recomendados.',
    icon: '💳',
  },
  {
    id: 'multiplatform-presence',
    title: 'Presencia multiplataforma',
    description: 'YouTube, Instagram, Facebook y TikTok trabajando de forma integrada como un ecosistema de alto alcance (+1M mensual).',
    icon: '🌐',
  },
  {
    id: 'niche-segmentation',
    title: 'Segmentación por programa',
    description: 'Cada programa permite conectar con audiencias específicas según la temática, edad e intereses particulares de los fans.',
    icon: '📊',
  },
]

export const sponsorFormats: SponsorFormat[] = [
  {
    id: 'official-sponsor',
    title: 'Auspicio de programa',
    description: 'Tu marca se convierte en el sponsor oficial de un programa específico, con banners permanentes y presencia visual destacada.',
    badge: 'Presencia Estructural',
  },
  {
    id: 'live-mentions',
    title: 'Menciones en vivo',
    description: 'Integración natural y dinámica de tu marca por parte de los talentos durante la transmisión del programa en tiempo real.',
    badge: 'Interactividad Directa',
  },
  {
    id: 'product-placement',
    title: 'Product placement',
    description: 'Presentación física o digital de tus productos dentro del set de grabación, visibles durante todo el show.',
    badge: 'Visibilidad Orgánica',
  },
  {
    id: 'seasonal-campaigns',
    title: 'Campañas por temporada',
    description: 'Activaciones especiales durante lanzamientos de películas, estrenos de anime, eventos importantes o campañas comerciales.',
    badge: 'Alto Impacto',
  },
  {
    id: 'branded-content',
    title: 'Branded content',
    description: 'Creación de segmentos o contenidos especiales estructurados conjuntamente con tu marca y con un enfoque geek atractivo.',
    badge: 'Contenido Co-creado',
  },
  {
    id: 'giveaways-dynamics',
    title: 'Sorteos y dinámicas',
    description: 'Activaciones interactivas con el chat en vivo y redes sociales para premiar a la comunidad y generar leads de valor.',
    badge: 'Engagement Extremo',
  },
  {
    id: 'social-presence',
    title: 'Presencia en redes',
    description: 'Amplificación a través de reels, tiktoks, shorts y posts colaborativos en las redes sociales de Ninja House Show.',
    badge: 'Viralidad Cruzada',
  },
  {
    id: 'strategic-alliances',
    title: 'Alianzas estratégicas',
    description: 'Colaboraciones comerciales de largo plazo con presencia sostenida en todo el ecosistema de contenidos digitales de la marca.',
    badge: 'Partnership de Marca',
  },
]
