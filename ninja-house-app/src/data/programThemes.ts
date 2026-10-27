export interface ProgramTheme {
  id: string
  primary: string
  secondary: string
  accent: string
  ink: string
  logoPath: string
  gradient: string
  softGradient: string
  textureClass: string
  motif: string
  eyebrow: string
  headline: string
  identity: string
  atmosphere: string
  ctaLabel: string
  sponsorLabel: string
  visualTags: string[]
}

export const programThemes: Record<string, ProgramTheme> = {
  'animes-y-ramen': {
    id: 'animes-y-ramen',
    primary: '#C6A2E6', // Lavanda pastel
    secondary: '#F2ADD1', // Rosa pastel
    accent: '#F1D090', // Crema
    ink: '#FFFFFF', // Blanco
    logoPath: '/assets/animesRamen_logo.webp',
    gradient: 'linear-gradient(135deg, rgba(198,162,230,0.38) 0%, rgba(242,173,209,0.28) 45%, rgba(15,10,22,0.98) 100%)',
    softGradient: 'linear-gradient(135deg, rgba(198,162,230,0.22), rgba(242,173,209,0.18), rgba(241,208,144,0.14), rgba(15,10,22,0.96))',
    textureClass: 'theme-texture-manga',
    motif: 'Kawaii 8px pixel stickers / ramen steam / pastel anime / sakura petals',
    eyebrow: '🌸 Anime, Kawaii & Cultura Japonesa',
    headline: 'Otaku, ramen y cultura japonesa sin ponerse serio.',
    identity: 'Anime moderno, kawaii, comida japonesa, ramen caliente, audífonos y debates divertidos con la mejor vibra de la comunidad otaku.',
    atmosphere: 'Estética pastel lavanda y rosa con acentos crema, stickers kawaii, estética Y2K anime y espíritu de merienda japonesa.',
    ctaLabel: '🌸 Entrar al Dojo Kawaii',
    sponsorLabel: '✨ Auspiciar Animes y Ramen',
    visualTags: ['Kawaii', 'Anime', 'Ramen', 'Otaku', 'Japón', 'Cosplay', '8-Bit'],
  },
  overhead: {
    id: 'overhead',
    primary: '#2563EB',
    secondary: '#1E3A8A',
    accent: '#38BDF8',
    ink: '#EFF6FF',
    logoPath: '/assets/OVERHEAD_LOGO.png',
    gradient: 'linear-gradient(135deg, rgba(37,99,235,0.34) 0%, rgba(30,58,138,0.24) 48%, rgba(8,12,22,0.98) 100%)',
    softGradient: 'linear-gradient(135deg, rgba(37,99,235,0.16), rgba(56,189,248,0.08), rgba(8,12,22,0.96))',
    textureClass: 'theme-texture-ring',
    motif: 'Ring lights / ropes / fight night',
    eyebrow: 'Lucha libre profesional & gaming',
    headline: 'La mesa de análisis para vivir cada rivalidad como evento central.',
    identity: 'Cobertura, debate e intensidad para fans de wrestling y gaming que siguen historias, técnica y espectáculo semana a semana.',
    atmosphere: 'Luces de arena, líneas de ring y energía de entrada antes de la pelea estelar.',
    ctaLabel: 'Subir al ring',
    sponsorLabel: 'Auspiciar Overhead',
    visualTags: ['WWE', 'AEW', 'Gaming', 'Debate'],
  },
  frikisdem: {
    id: 'frikisdem',
    primary: '#16A34A',
    secondary: '#14532D',
    accent: '#A3E635',
    ink: '#F0FDF4',
    logoPath: '/assets/FrikisDeM_Logo.png',
    gradient: 'linear-gradient(135deg, rgba(22,163,74,0.32) 0%, rgba(20,83,45,0.24) 44%, rgba(6,18,12,0.98) 100%)',
    softGradient: 'linear-gradient(135deg, rgba(22,163,74,0.16), rgba(163,230,53,0.08), rgba(6,18,12,0.96))',
    textureClass: 'theme-texture-signal',
    motif: 'Signal grid / digital feed / pop glitch',
    eyebrow: 'Cultura pop, memes y actualidad geek',
    headline: 'El espacio donde tendencias, memes y cultura pop chocan en vivo.',
    identity: 'Un radar de actualidad geek: noticias virales, conversación digital, memes, cultura pop y humor sin filtro.',
    atmosphere: 'Señal digital, scanlines discretas y pulsos verdes como una transmisión en movimiento.',
    ctaLabel: 'Sintonizar FrikisDeM',
    sponsorLabel: 'Auspiciar FrikisDeM',
    visualTags: ['FrikisDeM', 'Memes', 'Pop', 'Viral'],
  },
  'freakuencia-m': {
    id: 'freakuencia-m',
    primary: '#16A34A',
    secondary: '#14532D',
    accent: '#A3E635',
    ink: '#F0FDF4',
    logoPath: '/assets/FrikisDeM_Logo.png',
    gradient: 'linear-gradient(135deg, rgba(22,163,74,0.32) 0%, rgba(20,83,45,0.24) 44%, rgba(6,18,12,0.98) 100%)',
    softGradient: 'linear-gradient(135deg, rgba(22,163,74,0.16), rgba(163,230,53,0.08), rgba(6,18,12,0.96))',
    textureClass: 'theme-texture-signal',
    motif: 'Signal grid / digital feed / pop glitch',
    eyebrow: 'Cultura pop, memes y actualidad geek',
    headline: 'El espacio donde tendencias, memes y cultura pop chocan en vivo.',
    identity: 'Un radar de actualidad geek: noticias virales, conversación digital, memes, cultura pop y humor sin filtro.',
    atmosphere: 'Señal digital, scanlines discretas y pulsos verdes como una transmisión en movimiento.',
    ctaLabel: 'Sintonizar FrikisDeM',
    sponsorLabel: 'Auspiciar FrikisDeM',
    visualTags: ['FrikisDeM', 'Memes', 'Pop', 'Viral'],
  },
  'maldito-plastico': {
    id: 'maldito-plastico',
    primary: '#EA580C',
    secondary: '#9A3412',
    accent: '#FDBA74',
    ink: '#FFF7ED',
    logoPath: '/assets/MALDITOPLASTICO_LOGO.png',
    gradient: 'linear-gradient(135deg, rgba(234,88,12,0.34) 0%, rgba(154,52,18,0.22) 46%, rgba(20,11,7,0.98) 100%)',
    softGradient: 'linear-gradient(135deg, rgba(234,88,12,0.16), rgba(253,186,116,0.08), rgba(20,11,7,0.96))',
    textureClass: 'theme-texture-packaging',
    motif: 'Collector shelf / packaging / retro stickers',
    eyebrow: 'Coleccionismo y figuras de acción',
    headline: 'La vitrina semanal para coleccionistas que aman el plástico con historia.',
    identity: 'Un show para hablar de figuras, rarezas, unboxings, nostalgia y valor de colección con mirada de fan experto.',
    atmosphere: 'Texturas de empaque, vitrinas iluminadas y detalles naranjas como stickers de edición limitada.',
    ctaLabel: 'Abrir la vitrina',
    sponsorLabel: 'Auspiciar Maldito Plástico',
    visualTags: ['Figuras', 'Unboxing', 'Retro', 'Grails'],
  },
  'cine-infarto': {
    id: 'cine-infarto',
    primary: '#DC2626',
    secondary: '#7F1D1D',
    accent: '#FCA5A5',
    ink: '#FEF2F2',
    logoPath: '/assets/CINEINFARTO_LOGO.png',
    gradient: 'linear-gradient(135deg, rgba(220,38,38,0.34) 0%, rgba(127,29,29,0.24) 42%, rgba(12,5,5,0.98) 100%)',
    softGradient: 'linear-gradient(135deg, rgba(220,38,38,0.16), rgba(252,165,165,0.07), rgba(12,5,5,0.96))',
    textureClass: 'theme-texture-cinema',
    motif: 'Film grain / projector flicker / horror poster',
    eyebrow: 'Cine, series, misterio y suspenso',
    headline: 'Una sala oscura para teorías, terror y análisis que deja marca.',
    identity: 'Cine, series y misterio con mirada crítica: estrenos, clásicos, suspenso, terror y conversación cargada de teorías.',
    atmosphere: 'Grano de película, viñeta roja y parpadeo de proyector sin sobrecargar la lectura.',
    ctaLabel: 'Entrar a la sala',
    sponsorLabel: 'Auspiciar Cine Infarto',
    visualTags: ['Terror', 'Suspenso', 'Cine', 'Teorías'],
  },
  'plan-oscuro': {
    id: 'plan-oscuro',
    primary: '#9333EA',
    secondary: '#581C87',
    accent: '#C084FC',
    ink: '#FAF5FF',
    logoPath: '/assets/PLAN_OSCURO_LOGO.webp',
    gradient: 'linear-gradient(135deg, rgba(147,51,234,0.36) 0%, rgba(88,28,135,0.26) 45%, rgba(10,5,16,0.98) 100%)',
    softGradient: 'linear-gradient(135deg, rgba(147,51,234,0.18), rgba(192,132,252,0.08), rgba(10,5,16,0.96))',
    textureClass: 'theme-texture-shadow',
    motif: 'Shadow mist / candle light / dark mystery files',
    eyebrow: 'Paranormal, misterio y espiritualidad',
    headline: 'Fenómenos paranormales, terror y misterio desde lo espiritual e inexplicable.',
    identity: 'Adriana Larrea (Mar de Luna) y Sandra (La Suma Sacerdotisa) analizan casos, leyendas, señales y experiencias que desafían la lógica.',
    atmosphere: 'Sombras profundas, velas tenues, acentos violetas y conexión mística con lo desconocido.',
    ctaLabel: 'Explorar El Plano Oscuro',
    sponsorLabel: 'Auspiciar El Plano Oscuro',
    visualTags: ['Paranormal', 'Misterio', 'Tarot', 'Espiritualidad', 'Leyendas'],
  },
}

// Slugs aliases mapping to the same theme
programThemes['el-plano-oscuro'] = programThemes['plan-oscuro']
programThemes['el-lado-oscuro'] = programThemes['plan-oscuro']
programThemes['frikis-de-m'] = programThemes['frikisdem']

export const fallbackProgramTheme = programThemes['cine-infarto']

export const programLogoMap: Record<string, string> = {
  'animes-y-ramen': '/assets/ANIMESRAMEN9PM.webp',
  overhead: '/assets/OVERHEAD9PM.webp',
  'over-head': '/assets/OVERHEAD9PM.webp',
  frikisdem: '/assets/FRIKIS9PM.webp',
  'frikis-de-m': '/assets/FRIKIS9PM.webp',
  'freakuencia-m': '/assets/FRIKIS9PM.webp',
  'maldito-plastico': '/assets/malditoPlastico.webp',
  'cine-infarto': '/assets/CINEINFARTO9PM.webp',
  'plan-oscuro': '/assets/ELPLANO9PM.webp',
  'el-plano-oscuro': '/assets/ELPLANO9PM.webp',
  'el-lado-oscuro': '/assets/ELPLANO9PM.webp',
}
