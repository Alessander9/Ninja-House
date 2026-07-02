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
    primary: '#7C3AED',
    secondary: '#312E81',
    accent: '#F472B6',
    ink: '#F5F3FF',
    logoPath: '/assets/animesYramenLogo.png',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.32) 0%, rgba(49,46,129,0.24) 42%, rgba(12,10,18,0.98) 100%)',
    softGradient: 'linear-gradient(135deg, rgba(124,58,237,0.16), rgba(244,114,182,0.08), rgba(12,10,18,0.96))',
    textureClass: 'theme-texture-manga',
    motif: 'Manga panels / ramen steam / neon otaku',
    eyebrow: 'Anime, manga y cultura japonesa',
    headline: 'Un dojo otaku con ramen caliente y debate semanal.',
    identity: 'Un espacio para fans que viven el anime como comunidad: reviews, estrenos, manga, cultura japonesa y conversación en vivo.',
    atmosphere: 'Paneles manga, vapor suave y acentos violetas para una sensación nocturna de barrio japonés.',
    ctaLabel: 'Entrar al dojo otaku',
    sponsorLabel: 'Auspiciar Animes y Ramen',
    visualTags: ['Manga', 'Ramen', 'Otaku', 'Japón'],
  },
  overhead: {
    id: 'overhead',
    primary: '#2563EB',
    secondary: '#1E3A8A',
    accent: '#38BDF8',
    ink: '#EFF6FF',
    logoPath: '/assets/overheadLogo.png',
    gradient: 'linear-gradient(135deg, rgba(37,99,235,0.34) 0%, rgba(30,58,138,0.24) 48%, rgba(8,12,22,0.98) 100%)',
    softGradient: 'linear-gradient(135deg, rgba(37,99,235,0.16), rgba(56,189,248,0.08), rgba(8,12,22,0.96))',
    textureClass: 'theme-texture-ring',
    motif: 'Ring lights / ropes / fight night',
    eyebrow: 'Lucha libre profesional',
    headline: 'La mesa de análisis para vivir cada rivalidad como evento central.',
    identity: 'Cobertura, debate e intensidad para fans de wrestling que siguen historias, técnica y espectáculo semana a semana.',
    atmosphere: 'Luces de arena, líneas de ring y energía de entrada antes de la pelea estelar.',
    ctaLabel: 'Subir al ring',
    sponsorLabel: 'Auspiciar Overhead',
    visualTags: ['WWE', 'AEW', 'Ring', 'Debate'],
  },
  'freakuencia-m': {
    id: 'freakuencia-m',
    primary: '#16A34A',
    secondary: '#14532D',
    accent: '#A3E635',
    ink: '#F0FDF4',
    logoPath: '/assets/FreakuenciaLogo.png',
    gradient: 'linear-gradient(135deg, rgba(22,163,74,0.32) 0%, rgba(20,83,45,0.24) 44%, rgba(6,18,12,0.98) 100%)',
    softGradient: 'linear-gradient(135deg, rgba(22,163,74,0.16), rgba(163,230,53,0.08), rgba(6,18,12,0.96))',
    textureClass: 'theme-texture-signal',
    motif: 'Signal grid / digital feed / pop glitch',
    eyebrow: 'Cultura pop y actualidad geek',
    headline: 'La frecuencia donde tendencias, memes y cultura pop chocan en vivo.',
    identity: 'Un radar de actualidad geek: noticias virales, conversación digital, cultura pop y lectura rápida del momento.',
    atmosphere: 'Señal digital, scanlines discretas y pulsos verdes como una transmisión en movimiento.',
    ctaLabel: 'Sintonizar la frecuencia',
    sponsorLabel: 'Auspiciar Freakuencia M',
    visualTags: ['Tendencias', 'Memes', 'Pop', 'Viral'],
  },
  'maldito-plastico': {
    id: 'maldito-plastico',
    primary: '#EA580C',
    secondary: '#9A3412',
    accent: '#FDBA74',
    ink: '#FFF7ED',
    logoPath: '/assets/malditoPlasticoLogo.png',
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
    logoPath: '/assets/cineinfartoLogo.png',
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
}

export const fallbackProgramTheme = programThemes['cine-infarto']

export const programLogoMap: Record<string, string> = {
  'animes-y-ramen': '/assets/animesYramenLogo.png',
  overhead: '/assets/overheadLogo.png',
  'freakuencia-m': '/assets/FreakuenciaLogo.png',
  'maldito-plastico': '/assets/malditoPlasticoLogo.png',
  'cine-infarto': '/assets/cineinfartoLogo.png',
}
