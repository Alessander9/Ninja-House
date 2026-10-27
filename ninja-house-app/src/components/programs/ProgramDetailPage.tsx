import { useParams, useNavigate, Link } from 'react-router-dom'
import { programsData } from '../../data/programs'
import { scheduleData, getSmartStatus } from '../../data/schedule'
import { fallbackProgramTheme, programThemes } from '../../data/programThemes'
import { ProgramLoadingScreen } from './ProgramLoadingScreen'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from 'gsap'
import { fetchLiveEpisodes, type YouTubeEpisode, youtubePlaylistMap } from '../../services/youtubePlaylistService'
import { useSEO } from '../../hooks/useSEO'

const statusConfig = {
  live: { label: '🔴 EN VIVO AHORA', bg: 'bg-red-600', pulse: true },
  'next-live': { label: '🔜 PRÓXIMO EN VIVO', bg: 'bg-ninja-purple', pulse: true },
  today: { label: '⚡ HOY EN VIVO', bg: 'bg-ninja-green', pulse: false },
  upcoming: { label: '🕐 PRÓXIMAMENTE', bg: 'bg-ninja-yellow text-ninja-black', pulse: false },
  finished: { label: '✓ FINALIZADO ESTA SEMANA', bg: 'bg-white/20 text-white/60', pulse: false },
}

interface ShowExtraData {
  hosts: { name: string; role: string; avatar: string }[]
  faqs: { q: string; a: string }[]
  episodes: { id: string; title: string; duration: string; views: string; date: string }[]
  chatMessages: string[]
}

const PLAYLIST_CACHE_PREFIX = 'ninja-house:playlist-cache:v6:'
const PLAYLIST_CACHE_TTL = 1000 * 60 * 15
const inactiveProgramIds = new Set(['lanzalo'])

const extraShowsData: Record<string, ShowExtraData> = {
  'animes-y-ramen': {
    hosts: [
      { name: 'Charrita', role: 'Comentarista y analista de cultura otaku', avatar: '🌸' },
      { name: 'Ale Romero', role: 'Analista de anime y cultura pop', avatar: '🍜' }
    ],
    faqs: [
      { q: '¿De qué trata Animes y Ramen?', a: 'Programa dedicado al anime, manga y cultura japonesa, con reviews, debates y noticias para una comunidad otaku que vive el anime más allá de la pantalla.' },
      { q: '¿Cómo puedo recomendar un anime para el show?', a: 'Puedes proponer tus animes favoritos en el chat en vivo los lunes o taggearnos en Instagram con el hashtag #AnimesYRamen.' },
      { q: '¿Qué tipo de ramen preparan en el show?', a: 'Desde Shoyu y Tonkotsu tradicional hasta variaciones picantes extremas preparadas en vivo por nuestros hosts.' }
    ],
    episodes: [
      { id: 'ar-1', title: 'Episodio 48: Shonen moderno vs clásicos de oro del anime', duration: '1h 35m', views: '14.2K views', date: 'Hace 3 días' },
      { id: 'ar-2', title: 'Episodio 47: Estrenos de temporada y novedades del manga', duration: '2h 05m', views: '18.1K views', date: 'Hace 1 semana' },
      { id: 'ar-3', title: 'Episodio 46: Cultura japonesa, ramen y recomendaciones otaku', duration: '1h 50m', views: '22.5K views', date: 'Hace 2 semanas' }
    ],
    chatMessages: [
      '¡Solo Leveling y Jujutsu Kaisen los mejores!',
      'Charrita y Ale tienen la mejor vibra otaku 🌸',
      '¡Saludos desde todo el Perú para Animes y Ramen!',
      'Ese ramen se ve delicioso 🍜',
      '¿Harán review de la nueva película de Kimetsu?',
      '¡Gran inicio de semana en el dojo!'
    ]
  },
  'overhead': {
    hosts: [
      { name: 'Umano', role: 'Conductor y Fanático del Wrestling', avatar: '🎙️' },
      { name: 'Gianco', role: 'Analista Técnico de WWE y Rivales', avatar: '🤼' },
      { name: 'Luchito', role: 'Comentarista y Especialista del Ring', avatar: '💪' }
    ],
    faqs: [
      { q: '¿De qué trata Over Head?', a: 'Programa dedicado a la lucha libre, conducido por Umano, Gianco y Luchito. Noticias, análisis, rankings y debates sobre WWE y el universo del wrestling, con humor y pasión por el ring.' },
      { q: '¿De qué empresas de wrestling hablan?', a: 'Analizamos WWE, AEW, NJPW y las principales ligas independientes de todo el mundo.' },
      { q: '¿Hacen transmisiones de los Pay-Per-View?', a: 'Sí, hacemos sintonías y reacciones en vivo de los eventos más importantes del año.' }
    ],
    episodes: [
      { id: 'oh-1', title: 'Episodio 92: Análisis estelar de WWE y combates históricos', duration: '1h 45m', views: '10.5K views', date: 'Hace 4 días' },
      { id: 'oh-2', title: 'Episodio 91: Rivalidades legendarias del wrestling mundial', duration: '1h 58m', views: '12.8K views', date: 'Hace 1 semana' },
      { id: 'oh-3', title: 'Episodio 90: Rankings y debates sobre el campeonato mundial', duration: '2h 15m', views: '19.4K views', date: 'Hace 2 semanas' }
    ],
    chatMessages: [
      '¡Qué gran debate sobre WWE!',
      'Umano, Gianco y Luchito la rompen en el ring 🏟️',
      'Revivan ese combate histórico del 2001',
      'Over Head es pura pasión por la lucha libre',
      '¿Quién ganará el próximo Royal Rumble?',
      '¡Saludos muchachos, gran programa!'
    ]
  },
  'frikisdem': {
    hosts: [
      { name: 'Camu', role: 'Cultura Pop, Tendencias y Cine', avatar: '🍿' },
      { name: 'Umano', role: 'Humor, Mirada Friki y Series', avatar: '🎙️' },
      { name: 'D’arranque', role: 'Debate en Vivo y Anécdotas', avatar: '⚡' },
      { name: 'Rafomagia', role: 'Ilusionismo, Memes y Viralidad', avatar: '🎩' },
      { name: 'Luchito', role: 'En los Controles & Master Switcher', avatar: '🎛️' }
    ],
    faqs: [
      { q: '¿De qué trata Frikis de M?', a: 'Cultura pop, actualidad y anécdotas con humor y mirada friki. Camu, Umano, D’arranque y Rafomagia, con Luchito en los controles, convierten series, películas, tendencias y situaciones cotidianas en debates y conversaciones en vivo. Un espacio para compartir opiniones, reírse y sentirse entre amigos.' },
      { q: '¿Cuándo se transmite en vivo?', a: 'Todos los miércoles a las 9:00 PM por YouTube y canales oficiales de Ninja House.' },
      { q: '¿Cómo puedo enviar sugerencias o memes?', a: 'Puedes enviarlos en el chat en vivo o etiquetarnos en redes sociales oficiales.' }
    ],
    episodes: [
      { id: 'fdm-1', title: 'Episodio 105: Tendencias absurdas de internet, películas y anécdotas en vivo', duration: '1h 40m', views: '15.6K views', date: 'Hace 2 días' },
      { id: 'fdm-2', title: 'Episodio 104: Series del momento y debates frikis sin filtro', duration: '1h 52m', views: '17.9K views', date: 'Hace 9 días' },
      { id: 'fdm-3', title: 'Episodio 103: Especial: Situaciones cotidianas y memes virales', duration: '2h 08m', views: '25.1K views', date: 'Hace 2 semanas' }
    ],
    chatMessages: [
      '¡Buenas vibras al dojo!',
      'Camu siempre con los mejores datos de cine 🎬',
      'Rafomagia haz un truco en vivo!',
      'Luchito pon los efectos de sonido jajaja',
      'D’arranque y Umano la dupla del humor',
      'Frikis de M es mi programa favorito de la semana'
    ]
  },
  'maldito-plastico': {
    hosts: [
      { name: 'Markollectibles', role: 'Cazador de Figuras y Lanzamientos', avatar: '🛒' },
      { name: 'Gianco Condemarín', role: 'Experto en Licencias, Precios y Escala 1/6', avatar: '📦' },
      { name: 'Rafomagia', role: 'Nostalgia, Coleccionismo y Cultura Pop', avatar: '🤖' }
    ],
    faqs: [
      { q: '¿De qué trata Maldito Plástico?', a: 'Coleccionismo, nostalgia y cultura pop sin filtros. Markollectibles, Gianco Condemarín y Rafomagia analizan figuras, lanzamientos, precios, licencias y esas obsesiones que solo otro coleccionista comprende. Debates, noticias y experiencias para una comunidad que sabe que cada pieza guarda una historia.' },
      { q: '¿Cómo sé si una figura es original?', a: 'Damos tips semanales de pintura, articulaciones, logos y cajas licenciadas para no caer en copias falsas.' },
      { q: '¿Hacen sorteos de figuras para suscriptores?', a: '¡Sí! Al final de cada mes hacemos dinámicas en directo para regalar piezas coleccionables a la comunidad.' }
    ],
    episodes: [
      { id: 'mp-1', title: 'Episodio 58: Unboxing y review de figuras exclusivas y lanzamientos', duration: '2h 10m', views: '11.2K views', date: 'Hace 3 días' },
      { id: 'mp-2', title: 'Episodio 57: Guía de precios, licencias y cacería de grails', duration: '1h 48m', views: '13.5K views', date: 'Hace 1 semana' },
      { id: 'mp-3', title: 'Episodio 56: La nostalgia de los 80s y 90s en el coleccionismo actual', duration: '1h 55m', views: '16.8K views', date: 'Hace 2 semanas' }
    ],
    chatMessages: [
      '¡Qué joya de figura!',
      'Markollectibles siempre encuentra las piezas más raras',
      'Gianco, muestra la vitrina completa',
      'Maldito plástico es mi adicción semanal',
      '¿Qué opinan de las nuevas figuras articuladas?',
      '¿Dónde consiguieron ese estante de acrílico?'
    ]
  },
  'cine-infarto': {
    hosts: [
      { name: 'Carmen Bathory', role: 'Especialista en Cine de Terror, Suspenso y Culto', avatar: '👻' },
      { name: 'Andrés Manco', role: 'Analista de Películas, Estrenos y Directores', avatar: '🎥' }
    ],
    faqs: [
      { q: '¿De qué trata Cine Infarto?', a: 'Cine de terror, suspenso y culto visto por quienes aman el género. Carmen Bathory y Andrés Manco analizan películas, estrenos, clásicos, directores y esas historias capaces de inquietarnos mucho después de los créditos. Opiniones, noticias y debates para una comunidad que disfruta el miedo dentro y fuera del cine.' },
      { q: '¿Hacen spoilers en las reseñas?', a: 'Siempre avisamos con anticipación antes de entrar en zona de spoilers para que disfrutes del análisis sin arruinar la película.' },
      { q: '¿Qué géneros cubren en el programa?', a: 'Terror psicológico, slasher, suspenso, thrillers, gore, horror cósmico y clásicos de culto.' }
    ],
    episodes: [
      { id: 'ci-1', title: 'Episodio 75: Terror psicológico contemporáneo vs clásicos del slasher', duration: '1h 55m', views: '16.9K views', date: 'Hace 1 día' },
      { id: 'ci-2', title: 'Episodio 74: Directores de culto y las películas más perturbadoras', duration: '2h 12m', views: '18.4K views', date: 'Hace 1 semana' },
      { id: 'ci-3', title: 'Episodio 73: TOP Películas de suspenso que desafían tus nervios', duration: '1h 42m', views: '28.9K views', date: 'Hace 2 semanas' }
    ],
    chatMessages: [
      'Carmen y Andrés tienen los mejores análisis de cine 🍿',
      '¡Esa película de terror me quitó el sueño!',
      '¿Qué opinan del cine de suspenso independiente?',
      'Cine Infarto es una cita obligada los viernes',
      '¡Grandes recomendaciones de clásicos!',
      'Midsommar y Hereditary son obras maestras'
    ]
  },
  'plan-oscuro': {
    hosts: [
      { name: 'Adriana Larrea (Mar de Luna)', role: 'Médium & Conexión Espiritual', avatar: '🌙' },
      { name: 'Sandra (La Suma Sacerdotisa)', role: 'Bruja Blanca & Tarotista', avatar: '🔮' }
    ],
    faqs: [
      { q: '¿De qué trata El Plano Oscuro?', a: 'Fenómenos paranormales, terror y misterio explorados desde lo espiritual y lo inexplicable. Adriana Larrea, médium conocida como Mar de Luna, y Sandra, bruja blanca y tarotista conocida como La Suma Sacerdotisa, analizan casos, relatos, leyendas, señales y experiencias que desafían la lógica. Un espacio para debatir, escuchar testimonios y conectar en vivo con una comunidad que se atreve a mirar más allá de lo visible.' },
      { q: '¿Puedo enviar testimonios o evidencias paranormales?', a: 'Sí, recibimos audios, fotos, videos y relatos de la comunidad para analizarlos y debatirlos en vivo.' },
      { q: '¿Hacen lecturas en directo durante la transmisión?', a: 'Sí, realizamos dinámicas con la comunidad, lecturas de tarot y análisis de señales espirituales.' }
    ],
    episodes: [
      { id: 'po-1', title: 'Episodio 1: Señales del Más Allá, Casas Embrujadas y Relatos Reales', duration: '1h 50m', views: '18.4K views', date: 'Reciente' },
      { id: 'po-2', title: 'Episodio 2: Leyendas Urbanas y Casos que Desafían la Lógica', duration: '2h 05m', views: '21.8K views', date: 'En vivo' },
      { id: 'po-3', title: 'Episodio 3: Conexión Espiritual, Terror y Lectura de Tarot', duration: '1h 45m', views: '24.2K views', date: 'Estreno' }
    ],
    chatMessages: [
      '¡Se me puso la piel de gallina con este relato!',
      'Mar de Luna y La Suma Sacerdotisa tienen una energía muy poderosa 🌙🔮',
      'Apaguen las luces para escuchar el programa...',
      '¿Vieron esa sombra detrás en el segundo 45?',
      'El Plano Oscuro era lo que le faltaba a Ninja House 🕯️',
      '¡Qué misterio tan fascinante!'
    ]
  }
}

// Aliases for seamless subpage URL routing
extraShowsData['el-plano-oscuro'] = extraShowsData['plan-oscuro']
extraShowsData['el-lado-oscuro'] = extraShowsData['plan-oscuro']
extraShowsData['frikis-de-m'] = extraShowsData['frikisdem']
extraShowsData['freakuencia-m'] = extraShowsData['frikisdem']
extraShowsData['over-head'] = extraShowsData['overhead']

const programHeroMediaMap: Record<string, { type: 'video' | 'image'; src: string; poster?: string }> = {
  'animes-y-ramen': {
    type: 'image',
    src: '/assets/heros/hero-subpaginas/hero-animesRamen.webp',
  },
  overhead: {
    type: 'image',
    src: '/assets/heros/hero-subpaginas/hero-overhead.webp',
  },
  'over-head': {
    type: 'image',
    src: '/assets/heros/hero-subpaginas/hero-overhead.webp',
  },
  frikisdem: {
    type: 'image',
    src: '/assets/heros/hero-subpaginas/hero-frikisM.webp',
  },
  'frikis-de-m': {
    type: 'image',
    src: '/assets/heros/hero-subpaginas/hero-frikisM.webp',
  },
  'freakuencia-m': {
    type: 'image',
    src: '/assets/heros/hero-subpaginas/hero-frikisM.webp',
  },
  'cine-infarto': {
    type: 'image',
    src: '/assets/heros/hero-subpaginas/hero-cine-infarto.webp',
  },
  'maldito-plastico': {
    type: 'image',
    src: '/assets/heros/hero-subpaginas/hero-malditoPlastico_opt.webp',
  },
  'plan-oscuro': {
    type: 'image',
    src: '/assets/heros/hero-subpaginas/Retrato de brujas en tonos dorados_opt.webp',
  },
  'el-plano-oscuro': {
    type: 'image',
    src: '/assets/heros/hero-subpaginas/Retrato de brujas en tonos dorados_opt.webp',
  },
  'el-lado-oscuro': {
    type: 'image',
    src: '/assets/heros/hero-subpaginas/Retrato de brujas en tonos dorados_opt.webp',
  },
}

const programSectionBannerMap: Record<string, string> = {
  'animes-y-ramen': '/assets/seccionANIMESRAMEN.webp',
  overhead: '/assets/heros/sectionoverhead.webp',
  'over-head': '/assets/heros/sectionoverhead.webp',
  frikisdem: '/assets/frikisection.webp',
  'frikis-de-m': '/assets/frikisection.webp',
  'freakuencia-m': '/assets/frikisection.webp',
  'maldito-plastico': '/assets/plasticosection.webp',
  'malditoplastico': '/assets/plasticosection.webp',
  'cine-infarto': '/assets/infartoSection_opt.webp',
  cineinfarto: '/assets/infartoSection_opt.webp',
  'plan-oscuro': '/assets/oscurosection.webp',
  'el-plano-oscuro': '/assets/oscurosection.webp',
  'el-lado-oscuro': '/assets/oscurosection.webp',
}

const relatedProgramImageMap: Record<string, string> = {
  'animes-y-ramen': '/assets/heros/img-programas/animes-y-ramen.png',
  'animesyramen': '/assets/heros/img-programas/animes-y-ramen.png',
  'overhead': '/assets/heros/img-programas/overhead.png',
  'over-head': '/assets/heros/img-programas/overhead.png',
  'frikisdem': '/assets/heros/img-programas/frikis-de-m.png',
  'frikis-de-m': '/assets/heros/img-programas/frikis-de-m.png',
  'freakuencia-m': '/assets/heros/img-programas/frikis-de-m.png',
  'maldito-plastico': '/assets/heros/img-programas/maldito-plastico.png',
  'malditoplastico': '/assets/heros/img-programas/maldito-plastico.png',
  'cine-infarto': '/assets/heros/img-programas/cine-infarto.png',
  'cineinfarto': '/assets/heros/img-programas/cine-infarto.png',
  'plan-oscuro': '/assets/heros/img-programas/el-plano-oscuro.png',
  'el-plano-oscuro': '/assets/heros/img-programas/el-plano-oscuro.png',
  'el-lado-oscuro': '/assets/heros/img-programas/el-plano-oscuro.png',
}

function useCountdown(dayIndex: number) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date()
      const currentDay = now.getDay()
      const targetTime = new Date()
      targetTime.setHours(21, 0, 0, 0) // 9:00 PM

      let daysToAdd = (dayIndex - currentDay + 7) % 7
      
      if (daysToAdd === 0 && now.getHours() >= 21) {
        daysToAdd = 7
      }

      targetTime.setDate(now.getDate() + daysToAdd)
      
      const diff = targetTime.getTime() - now.getTime()
      if (diff <= 0) {
        setTimeLeft('¡AL AIRE AHORA!')
        return
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / 1000 / 60) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      let text = ''
      if (days > 0) text += `${days}d `
      text += `${hours}h ${minutes}m ${seconds}s`
      setTimeLeft(text)
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [dayIndex])

  return timeLeft
}

function readCachedPlaylist(programSlug: string, fallbackVideoId: string): YouTubeEpisode[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(`${PLAYLIST_CACHE_PREFIX}${programSlug}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { ts: number; videos: YouTubeEpisode[] }
    if (!parsed?.ts || !Array.isArray(parsed.videos) || parsed.videos.length === 0) return null
    if (Date.now() - parsed.ts > PLAYLIST_CACHE_TTL) return null
    return parsed.videos.map((video) => ({
      ...video,
      videoId: video.videoId || fallbackVideoId,
      thumbnail: video.thumbnail || `https://i.ytimg.com/vi/${video.videoId || fallbackVideoId}/hqdefault.jpg`,
      link: video.link || `https://www.youtube.com/watch?v=${video.videoId || fallbackVideoId}`
    }))
  } catch {
    return null
  }
}

function writeCachedPlaylist(programSlug: string, videos: YouTubeEpisode[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      `${PLAYLIST_CACHE_PREFIX}${programSlug}`,
      JSON.stringify({ ts: Date.now(), videos })
    )
  } catch {
    // Ignore storage failures
  }
}

export function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const heroShellRef = useRef<HTMLDivElement>(null)
  const heroPosterRef = useRef<HTMLDivElement>(null)
  const heroCopyRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<'episodes' | 'faq'>('episodes')
  const [playlistVideos, setPlaylistVideos] = useState<YouTubeEpisode[]>([])
  const [isLoadingFeed, setIsLoadingFeed] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])
  useEffect(() => {
    setShowIntro(true)
    const timer = window.setTimeout(() => setShowIntro(false), reducedMotion ? 120 : 950)
    return () => window.clearTimeout(timer)
  }, [id, reducedMotion])
  const normalizedId = (id === 'el-plano-oscuro' || id === 'el-lado-oscuro')
    ? 'plan-oscuro'
    : (id === 'frikis-de-m' ? 'frikisdem' : (id === 'over-head' ? 'overhead' : id || ''))

  const program = programsData.find((p) => 
    p.slug === id || p.id === id || p.id === normalizedId || p.slug === normalizedId
  )
  const scheduleInfo = scheduleData.find((s) => 
    s.id === id || s.id === normalizedId || s.id === program?.id
  )
  const extra = extraShowsData[id || ''] || extraShowsData[normalizedId] || (program ? extraShowsData[program.id] : undefined) || (program ? extraShowsData[program.slug] : undefined)
  const countdown = useCountdown(program?.dayIndex ?? 1)
  const isRetiredProgram = !!program && inactiveProgramIds.has(program.id)

  useSEO({
    title: program ? `${program.title} — Transmisiones y Episodios` : 'Programa',
    description: program ? `${program.description}. Transmisiones oficiales en vivo por Ninja House.` : undefined
  })

  useEffect(() => {
    if (!program || reducedMotion) return

    const ctx = gsap.context(() => {
      const shell = heroShellRef.current
      const poster = heroPosterRef.current
      const copyChildren = heroCopyRef.current?.children ?? []

      const introMap = {
        'animes-y-ramen': {
          shellFrom: { opacity: 0, y: 15 },
          posterFrom: { opacity: 0, scale: 0.98 },
          posterEase: 'expo.out',
          copyFrom: { y: 18, opacity: 0 },
          copyEase: 'power3.out',
          copyStagger: 0.05,
          after: (tl: gsap.core.Timeline) => {
            tl.fromTo(
              shell,
              { filter: 'saturate(0.92) brightness(0.95)' },
              { filter: 'saturate(1) brightness(1)', duration: 0.8 },
              0.18
            )
          },
        },
        overhead: {
          shellFrom: { opacity: 0, y: 15 },
          posterFrom: { opacity: 0, scale: 0.98 },
          posterEase: 'power3.out',
          copyFrom: { y: 18, opacity: 0 },
          copyEase: 'power3.out',
          copyStagger: 0.05,
          after: () => {},
        },
        'freakuencia-m': {
          shellFrom: { opacity: 0, y: 15 },
          posterFrom: { opacity: 0, scale: 0.98 },
          posterEase: 'power4.out',
          copyFrom: { y: 18, opacity: 0 },
          copyEase: 'power3.out',
          copyStagger: 0.045,
          after: () => {},
        },
        frikisdem: {
          shellFrom: { opacity: 0, y: 15 },
          posterFrom: { opacity: 0, scale: 0.98 },
          posterEase: 'power4.out',
          copyFrom: { y: 18, opacity: 0 },
          copyEase: 'power3.out',
          copyStagger: 0.045,
          after: () => {},
        },
        'maldito-plastico': {
          shellFrom: { opacity: 0, y: 15 },
          posterFrom: { opacity: 0, scale: 0.98 },
          posterEase: 'power3.out',
          copyFrom: { y: 18, opacity: 0 },
          copyEase: 'power2.out',
          copyStagger: 0.05,
          after: () => {},
        },
        'cine-infarto': {
          shellFrom: { opacity: 0, y: 15 },
          posterFrom: { opacity: 0, scale: 0.98 },
          posterEase: 'power2.out',
          copyFrom: { y: 18, opacity: 0 },
          copyEase: 'power3.out',
          copyStagger: 0.05,
          after: () => {},
        },
        'plan-oscuro': {
          shellFrom: { opacity: 0, y: 15 },
          posterFrom: { opacity: 0, scale: 0.98 },
          posterEase: 'power2.out',
          copyFrom: { y: 18, opacity: 0 },
          copyEase: 'power3.out',
          copyStagger: 0.05,
          after: () => {},
        },
      } as const

      const intro = introMap[program.id as keyof typeof introMap] ?? {
        shellFrom: { opacity: 0, y: 15 },
        posterFrom: { opacity: 0, scale: 0.98 },
        posterEase: 'power3.out',
        copyFrom: { y: 18, opacity: 0 },
        copyEase: 'power3.out',
        copyStagger: 0.05,
      }

      if (poster) {
        gsap.set(poster, { transformOrigin: '50% 50%' })
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      if (shell) {
        tl.fromTo(shell, intro.shellFrom, { opacity: 1, y: 0, duration: 0.45 })
      }
      if (poster) {
        tl.fromTo(
          poster,
          intro.posterFrom,
          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, filter: 'none', duration: 0.85, ease: intro.posterEase },
          0.06
        )
      }
      if (copyChildren.length > 0) {
        tl.fromTo(
          copyChildren,
          intro.copyFrom,
          { x: 0, y: 0, opacity: 1, duration: 0.5, stagger: intro.copyStagger, ease: intro.copyEase },
          0.12
        )
      }

      intro.after?.(tl)
    }, heroShellRef)

    return () => ctx.revert()
  }, [program, reducedMotion, id])

  if (program && isRetiredProgram) {
    return (
      <div className="min-h-screen bg-ninja-black text-white pt-28 pb-20 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <button
            onClick={() => navigate('/programas')}
            className="flex items-center gap-2 text-white/50 hover:text-white font-display text-sm font-bold mb-8 group cursor-pointer"
          >
            <span className="group-hover:text-white transition-colors" style={{ color: fallbackProgramTheme.primary }}>←</span>
            <span>Ver todos los programas</span>
          </button>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
            <span className="inline-flex mb-4 px-3 py-1 rounded-full text-[10px] font-display font-black tracking-[0.25em] uppercase" style={{ backgroundColor: `${fallbackProgramTheme.primary}18`, color: fallbackProgramTheme.primary }}>
              Programa retirado
            </span>
            <h1 className="font-display font-black text-4xl md:text-5xl leading-tight">
              {program.title} ya no está disponible
            </h1>
            <p className="mt-4 text-white/60 text-base leading-relaxed">
              Este programa fue retirado de la programación activa. Si necesitas conservar referencias históricas o assets, podemos mostrarlos en un archivo aparte, pero no como parte de la experiencia vigente.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const loadEpisodes = useCallback(async (force = false) => {
    if (!program) return
    setIsLoadingFeed(true)
    if (force) setIsRefreshing(true)

    const fallbackVideoId = youtubePlaylistMap[program.slug]?.videoId ?? ''

    // 1. Initial immediate paint from localStorage or curated defaults
    if (!force) {
      const cached = readCachedPlaylist(program.slug, fallbackVideoId)
      if (cached && cached.length > 0) {
        setPlaylistVideos(cached)
        setActiveVideoId((prev) => prev || cached[0]?.videoId || fallbackVideoId)
        setIsLoadingFeed(false)
      } else {
        const defaults = youtubePlaylistMap[program.slug]?.defaultVideos ?? []
        if (defaults.length > 0) {
          setPlaylistVideos(defaults)
          setActiveVideoId((prev) => prev || defaults[0]?.videoId || fallbackVideoId)
        }
      }
    }

    // 2. Fetch live YouTube playlist episodes asynchronously in background
    try {
      const liveEpisodes = await fetchLiveEpisodes(program.slug)
      if (liveEpisodes && liveEpisodes.length > 0) {
        setPlaylistVideos(liveEpisodes)
        setActiveVideoId((prev) => (!prev || prev === fallbackVideoId || !liveEpisodes.some(v => v.videoId === prev)) ? liveEpisodes[0]?.videoId : prev)
        writeCachedPlaylist(program.slug, liveEpisodes)
      }
    } catch (err) {
      console.warn('Could not fetch live YouTube episodes:', err)
    } finally {
      setIsLoadingFeed(false)
      setIsRefreshing(false)
    }
  }, [program])

  useEffect(() => {
    loadEpisodes(false)
  }, [loadEpisodes, id])

  if (!program || !extra) {
    return (
      <div className="min-h-screen bg-ninja-black flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-display font-black text-white mb-4">Show No Encontrado</h1>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-ninja-green text-ninja-black font-display font-bold rounded-xl"
        >
          Volver al Dojo
        </button>
      </div>
    )
  }

  const currentStatus = scheduleInfo ? getSmartStatus(scheduleInfo) : 'upcoming'
  const statusCfg = statusConfig[currentStatus]
  const theme = programThemes[program.id] ?? fallbackProgramTheme

  // Filter other shows for the related list (ordered by day of week)
  const relatedPrograms = programsData
    .filter((p) => p.id !== program.id && p.slug !== program.slug && p.id !== id && p.slug !== id && !inactiveProgramIds.has(p.id))
    .sort((a, b) => a.dayIndex - b.dayIndex)
  const activePlaylistVideo = playlistVideos.find((video) => video.videoId === activeVideoId)
  const currentVideoId = activePlaylistVideo?.videoId ?? playlistVideos[0]?.videoId ?? youtubePlaylistMap[program.slug]?.videoId
  const currentPoster = activePlaylistVideo?.thumbnail ?? playlistVideos[0]?.thumbnail ?? program.image

  const heroConfig = programHeroMediaMap[program.id] ?? programHeroMediaMap[program.slug] ?? { type: 'image' as const, src: program.image }
  const sectionBanner = programSectionBannerMap[program.id] ?? programSectionBannerMap[program.slug] ?? program.image
  const isOverhead = program.id === 'overhead' || program.slug === 'overhead'
  const isAnimeRamen = program.id === 'animes-y-ramen' || program.slug === 'animes-y-ramen' || program.id === 'animesyramen' || program.slug === 'animesyramen'
  const isFrikis = program.id === 'frikisdem' || program.slug === 'frikis-de-m' || program.slug === 'frikisdem' || program.id === 'frikis-de-m' || program.id === 'freakuencia-m' || program.slug === 'freakuencia-m'
  const isPlastico = program.id === 'maldito-plastico' || program.slug === 'maldito-plastico' || program.id === 'malditoplastico' || program.slug === 'malditoplastico'
  const isCineInfarto = program.id === 'cine-infarto' || program.slug === 'cine-infarto' || program.id === 'cineinfarto' || program.slug === 'cineinfarto'
  const isPlanoOscuro = program.id === 'plan-oscuro' || program.slug === 'el-plano-oscuro' || program.id === 'el-plano-oscuro' || program.slug === 'plan-oscuro' || program.id === 'el-lado-oscuro' || program.slug === 'el-lado-oscuro'

  if (showIntro) {
    return <ProgramLoadingScreen isVisible={true} program={program} theme={theme} />
  }

  return (
    <div
      className={`program-theme-shell ${theme.textureClass} min-h-screen bg-ninja-black text-white pt-0 pb-20 relative overflow-hidden`}
      style={{
        '--program-primary': theme.primary,
        '--program-secondary': theme.secondary,
        '--program-accent': theme.accent,
        background: `linear-gradient(180deg, #0d0a14 0%, ${theme.primary}18 35%, ${theme.secondary}12 68%, #08060c 100%)`,
      } as CSSProperties}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.primary}24 0%, transparent 68%)`,
          filter: 'blur(72px)',
        }}
      />

      {/* ── FULL WIDTH HERO (100% DE ANCHO Y LARGO — TODO EL ESPACIO EDGE-TO-EDGE) ── */}
      {/* pt-[57px] = altura del navbar fijo (h-14) + su borde inferior: el hero empieza debajo del navbar */}
      <div data-hero="true" className="w-full relative mb-8 overflow-hidden pt-[57px]">
        <motion.div
          ref={heroShellRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full relative"
        >
          <div ref={heroPosterRef} className="w-full aspect-[1672/941] relative bg-[#0a0710] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            {heroConfig.type === 'video' ? (
              <video
                src={heroConfig.src}
                poster={heroConfig.poster}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover block select-none"
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            ) : (
              <img
                src={heroConfig.src}
                alt={program.title}
                className="w-full h-full object-cover object-top block select-none"
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            )}

            {/* Gradient suave de integración inferior con la página */}
            <div className="absolute inset-x-0 bottom-0 h-32 sm:h-48 bg-gradient-to-t from-ninja-black via-ninja-black/60 to-transparent pointer-events-none" />

            {/* Overlay gráfico oficial para Animes y Ramen (comentado porque está encima del hero) */}
            {/* {isAnimeRamen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                className="absolute bottom-[3%] sm:bottom-[4%] right-[2%] sm:right-[3%] w-[42%] sm:w-[38%] md:w-[34%] max-w-[480px] z-10 pointer-events-none select-none"
              >
                <img
                  src="/assets/heros/hero-subpaginas/sinfondoheroanimes.webp"
                  alt="Animes y Ramen — Logo oficial y horarios"
                  className="w-full h-auto object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] drop-shadow-[0_0_35px_rgba(198,162,230,0.45)]"
                />
              </motion.div>
            )} */}
          </div>
        </motion.div>
      </div>

      {/* ── CONTENIDO PRINCIPAL (max-w-6xl centrado) ── */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Navegación para volver a programas */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate('/programas')}
            className="flex items-center gap-2 text-white/50 hover:text-white font-display text-sm font-bold group cursor-pointer transition-colors"
          >
            <span className="group-hover:text-white transition-colors" style={{ color: theme.primary }}>←</span>
            <span>Ver todos los programas</span>
          </button>
        </div>

        {/* Sección Banner Gráfico con Arte Oficial y Hosts — Para Overhead con su arte oficial y descripción temática */}
        {isOverhead ? (
          <div
            ref={heroCopyRef}
            className="rounded-3xl mb-12 overflow-hidden border-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-[#050308] relative group"
            style={{
              borderColor: `${theme.primary}50`,
              boxShadow: `0 20px 50px rgba(0,0,0,0.85), 0 0 35px ${theme.primary}25`
            }}
          >
            {/* Versión Desktop / Tablet (md y superior): Arte panorámico con contenido integrado en la zona izquierda */}
            <div className="hidden md:block relative w-full aspect-[2075/758]">
              <img
                src="/assets/heros/sectionoverhead.webp"
                alt="Over Head — Ninja House"
                className="w-full h-full object-cover block select-none pointer-events-none"
              />

              {/* Degradado sutil para legibilidad impecable sobre la zona inferior izquierda del arte */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(5,3,8,0.92) 0%, rgba(5,3,8,0.75) 42%, transparent 70%)'
                }}
              />

              {/* Contenido en la zona izquierda debajo del logo de Overhead — Más grande y con mejor distribución */}
              <div className="absolute bottom-[5%] md:bottom-[5.5%] lg:bottom-[6%] left-[4%] lg:left-[4.5%] w-[53%] lg:w-[51%] xl:w-[49%] z-10 text-left flex flex-col gap-2.5 lg:gap-3">
                {/* Header / Pill Badge */}
                <div className="flex flex-wrap items-center gap-2 lg:gap-2.5">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#078BFF]/25 border border-[#078BFF]/60 text-[#FFD000] font-display font-black text-xs lg:text-[12.5px] tracking-wider uppercase shadow-[0_0_16px_rgba(7,139,255,0.3)]">
                    <span className="w-2 h-2 rounded-full bg-[#FFD000] animate-pulse shadow-[0_0_10px_#FFD000]" />
                    🤼 DOJO WRESTLING
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 font-display font-bold text-xs lg:text-[12px] shadow-sm">
                    ⏰ MARTES 9:00 PM
                  </span>
                </div>

                {/* Texto descriptivo */}
                <p className="font-sans text-[12.5px] md:text-[13px] lg:text-[14px] xl:text-[14.5px] text-white/95 font-normal leading-[1.6] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                  Programa dedicado a la lucha libre, conducido por{' '}
                  <strong className="text-[#FFD000] font-black drop-shadow-[0_0_10px_rgba(255,208,0,0.5)]">
                    Umano, Gianco y Luchito
                  </strong>
                  . Noticias, análisis, rankings y debates sobre WWE y el universo del wrestling, con humor y pasión por el ring. Un espacio para revivir combates históricos, discutir rivalidades y compartir en vivo con la comunidad.
                </p>

                {/* Separador deportivo más visible y con glow */}
                <div className="h-[2px] w-full my-0.5 bg-gradient-to-r from-[#078BFF] via-[#FFD000]/70 to-transparent shadow-[0_0_10px_rgba(7,139,255,0.4)]" />

                {/* Fila de iconos temáticos — Con grid equilibrado, tarjetas más amplias y tipografía destacada */}
                <div className="grid grid-cols-4 gap-2 sm:gap-2.5 lg:gap-3 w-full max-w-[540px] pt-0.5">
                  {[
                    { name: 'Fuerza & Pasión', src: '/assets/icons/overhead/brazo-fuerza.svg', desc: 'Fuerza' },
                    { name: 'El Cuadrilátero', src: '/assets/icons/overhead/ring-lucha.svg', desc: 'Ring' },
                    { name: 'Intensidad & Rivalidad', src: '/assets/icons/overhead/llama-intensidad.svg', desc: 'Rivalidad' },
                    { name: 'Transmisiones & Episodios', src: '/assets/icons/overhead/tv-transmisiones.svg', desc: 'En Vivo' },
                  ].map((icon) => (
                    <div
                      key={icon.name}
                      className="flex flex-col items-center justify-center p-2 sm:p-2.5 lg:p-3 rounded-2xl bg-[#05070d]/80 border border-[#078BFF]/40 hover:border-[#FFD000]/90 hover:bg-[#078BFF]/20 transition-all duration-200 group/icon cursor-pointer shadow-[0_6px_18px_rgba(0,0,0,0.7)] backdrop-blur-md hover:scale-[1.04]"
                      title={icon.name}
                    >
                      <img
                        src={icon.src}
                        alt={icon.name}
                        className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 object-contain group-hover/icon:scale-110 transition-transform drop-shadow-[0_2px_10px_rgba(255,208,0,0.4)]"
                      />
                      <span className="text-[9.5px] sm:text-[10px] lg:text-[11.5px] font-display font-black text-white/80 group-hover/icon:text-[#FFD000] mt-1.5 tracking-wider uppercase text-center leading-none">
                        {icon.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Versión Mobile (< md): Arte arriba y tarjeta temática debajo */}
            <div className="block md:hidden">
              <div className="relative w-full aspect-[2075/758]">
                <img
                  src="/assets/heros/sectionoverhead.webp"
                  alt="Over Head — Ninja House"
                  className="w-full h-full object-cover block select-none pointer-events-none"
                />
              </div>
              <div
                className="p-5 flex flex-col gap-3.5 text-left border-t"
                style={{
                  background: 'linear-gradient(180deg, #050308 0%, rgba(37,99,235,0.18) 100%)',
                  borderColor: 'rgba(37,99,235,0.35)'
                }}
              >
                {/* Header / Pill Badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#078BFF]/25 border border-[#078BFF]/60 text-[#FFD000] font-display font-black text-[11px] tracking-wider uppercase">
                    <span className="w-2 h-2 rounded-full bg-[#FFD000] animate-pulse shadow-[0_0_8px_#FFD000]" />
                    🤼 DOJO WRESTLING
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white/90 font-display font-bold text-[11px]">
                    ⏰ MARTES 9:00 PM
                  </span>
                </div>

                <p className="font-sans text-[13px] text-white/95 font-normal leading-relaxed">
                  Programa dedicado a la lucha libre, conducido por{' '}
                  <strong className="text-[#FFD000] font-black">Umano, Gianco y Luchito</strong>.
                  Noticias, análisis, rankings y debates sobre WWE y el universo del wrestling, con humor y pasión por el ring. Un espacio para revivir combates históricos, discutir rivalidades y compartir en vivo con la comunidad.
                </p>

                <div className="h-[2px] w-full my-1 bg-gradient-to-r from-[#078BFF]/80 via-[#FFD000]/60 to-transparent" />

                <div className="grid grid-cols-4 gap-2 pt-0.5">
                  {[
                    { name: 'Fuerza & Pasión', src: '/assets/icons/overhead/brazo-fuerza.svg', desc: 'Fuerza' },
                    { name: 'El Cuadrilátero', src: '/assets/icons/overhead/ring-lucha.svg', desc: 'Ring' },
                    { name: 'Intensidad & Rivalidad', src: '/assets/icons/overhead/llama-intensidad.svg', desc: 'Rivalidad' },
                    { name: 'Transmisiones & Episodios', src: '/assets/icons/overhead/tv-transmisiones.svg', desc: 'En Vivo' },
                  ].map((icon) => (
                    <div
                      key={icon.name}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.05] border border-[#078BFF]/35 hover:border-[#FFD000]/80 hover:bg-[#078BFF]/15 transition-all duration-200 shadow-sm"
                    >
                      <img
                        src={icon.src}
                        alt={icon.name}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-[9px] font-display font-bold text-white/80 mt-1 tracking-tight text-center leading-none">
                        {icon.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isFrikis ? (
          <div
            className="rounded-3xl mb-12 overflow-hidden border-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-[#120822] relative group"
            style={{
              borderColor: 'rgba(34,197,94,0.45)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 35px rgba(34,197,94,0.25)'
            }}
          >
            {/* Desktop / Tablet: frikisection.webp como FONDO COMPLETO con altura reducida y panorámica */}
            <div className="hidden md:block relative w-full aspect-[21/9] lg:aspect-[2.35/1] xl:aspect-[2.45/1] max-h-[475px]">
              <img
                src="/assets/frikisection.webp"
                alt="Frikis de M — Ninja House"
                className="w-full h-full object-cover object-center block select-none pointer-events-none"
              />

              {/* Degradado para garantizar legibilidad impecable sobre la zona izquierda sin tocar el logo */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(14,6,27,0.96) 0%, rgba(14,6,27,0.88) 42%, rgba(14,6,27,0.35) 58%, transparent 74%)'
                }}
              />

              {/* Contenido en la zona izquierda */}
              <div
                ref={heroCopyRef}
                className="absolute inset-y-0 left-[3.5%] lg:left-[4%] w-[54%] lg:w-[52%] xl:w-[50%] max-w-[560px] z-10 flex flex-col justify-center text-left py-4 gap-2 lg:gap-2.5"
              >
                {/* Badges de categoría, horario y cuenta regresiva */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-500/60 text-[#4ade80] font-display font-black text-[11px] tracking-wider uppercase shadow-[0_0_12px_rgba(74,222,128,0.25)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
                    🎮 MIÉRCOLES
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/95 font-display font-bold text-[11px] shadow-sm">
                    ⏰ {program.time}
                  </span>
                  {currentStatus === 'live' ? (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-display font-black text-white ${statusCfg.bg} shadow-md`}>
                      {statusCfg.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/35 text-purple-200 font-display font-semibold text-[11px]">
                      ⏳ En {countdown}
                    </span>
                  )}
                </div>

                {/* Párrafo descriptivo del programa */}
                <p className="font-sans text-[12.5px] lg:text-[13.5px] text-white/95 leading-[1.5] font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {extra.faqs?.[0]?.a || program.description}
                </p>

                {/* Separador deportivo / ninja */}
                <div className="flex items-center gap-3 my-0.5">
                  <div className="h-[2px] w-24 rounded-full bg-gradient-to-r from-emerald-400 via-purple-400 to-transparent shadow-[0_0_10px_#4ade80]" />
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                </div>

                {/* Sección de Conductores & Equipo */}
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <span className="text-[10px] font-display font-black tracking-widest uppercase text-emerald-400/90 flex items-center gap-1.5">
                    🎙️ CONDUCTORES & EQUIPO DEL DOJO
                  </span>

                  <div className="grid grid-cols-2 gap-1.5 lg:gap-2">
                    {extra.hosts.slice(0, 4).map((host) => (
                      <div
                        key={host.name}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#0f071f]/85 border border-purple-500/30 hover:border-emerald-500/60 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md group/h hover:scale-[1.02]"
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-emerald-500/20 border border-emerald-500/40 flex-shrink-0 group-hover/h:scale-110 transition-transform">
                          {host.avatar}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-display font-black text-[11px] lg:text-xs text-white leading-tight">
                            {host.name}
                          </span>
                          <span className="text-[9.5px] lg:text-[10px] text-white/70 leading-snug line-clamp-1">
                            {host.role}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Luchito (5to integrante) a 2 columnas */}
                    {extra.hosts[4] && (
                      <div className="col-span-2 flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-950/70 via-[#0f071f]/85 to-transparent border border-emerald-500/35 hover:border-emerald-400/60 transition-all shadow-sm">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-emerald-500/20 border border-emerald-500/40 flex-shrink-0">
                          {extra.hosts[4].avatar}
                        </div>
                        <div className="flex items-center justify-between flex-1 flex-wrap gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-[11px] lg:text-xs text-white">
                              {extra.hosts[4].name}
                            </span>
                            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Switcher
                            </span>
                          </div>
                          <span className="text-[10px] text-white/80 font-medium">
                            {extra.hosts[4].role}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Versión Mobile: Frikis de M */}
            <div className="block md:hidden">
              <div className="relative w-full aspect-[1672/941]">
                <img
                  src="/assets/frikisection.webp"
                  alt="Frikis de M — Ninja House"
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <div
                className="p-5 flex flex-col gap-4 text-left border-t"
                style={{
                  background: 'linear-gradient(180deg, #120822 0%, rgba(22,163,74,0.15) 100%)',
                  borderColor: 'rgba(34,197,94,0.3)'
                }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-display font-black text-[10px] tracking-wider uppercase bg-emerald-500/25 border border-emerald-500/50 text-[#4ade80]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    🎮 MIÉRCOLES
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-display font-bold text-[10px]">
                    ⏰ {program.time}
                  </span>
                  {currentStatus === 'live' ? (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-display font-black text-white ${statusCfg.bg}`}>
                      {statusCfg.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-200 font-display font-medium text-[9px]">
                      ⏳ En {countdown}
                    </span>
                  )}
                </div>

                <p className="font-body text-xs text-white/90 leading-relaxed">
                  {extra.faqs?.[0]?.a || program.description}
                </p>

                <div className="h-px w-full my-1 bg-gradient-to-r from-emerald-500/60 via-purple-500/40 to-transparent" />

                <div className="flex flex-col gap-2.5">
                  <span className="font-display font-black text-xs tracking-widest uppercase text-emerald-400">
                    CONDUCTORES & EQUIPO DEL DOJO:
                  </span>

                  {extra.hosts.map((host) => (
                    <div
                      key={host.name}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-purple-500/30"
                    >
                      <span className="text-xl flex-shrink-0">{host.avatar}</span>
                      <div className="flex flex-col">
                        <span className="font-display font-black text-sm text-white leading-tight">
                          {host.name}
                        </span>
                        <span className="font-body text-xs text-white/60 mt-0.5">
                          {host.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isPlastico ? (
          <div
            className="rounded-3xl mb-12 overflow-hidden border-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-[#0d0705] relative group"
            style={{
              borderColor: 'rgba(234,88,12,0.5)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 35px rgba(234,88,12,0.25)'
            }}
          >
            {/* Desktop / Tablet: plasticosection.webp con su relación de aspecto exacta (2103/748) para que no se corte el logo */}
            <div className="hidden md:block relative w-full aspect-[2103/748]">
              <img
                src="/assets/plasticosection.webp"
                alt="Maldito Plástico — Ninja House"
                className="w-full h-full object-cover object-right block select-none pointer-events-none"
              />

              {/* Degradado para garantizar legibilidad impecable sobre la zona izquierda sin tocar el logo */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(13,7,5,0.96) 0%, rgba(13,7,5,0.85) 40%, rgba(13,7,5,0.25) 55%, transparent 70%)'
                }}
              />

              {/* Contenido en la zona izquierda */}
              <div
                ref={heroCopyRef}
                className="absolute inset-y-0 left-[3.5%] lg:left-[4%] w-[52%] lg:w-[49%] max-w-[540px] z-10 flex flex-col justify-center text-left py-3 gap-1.5 lg:gap-2"
              >
                {/* Badges de categoría, horario y cuenta regresiva */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/25 border border-orange-500/60 text-[#fb923c] font-display font-black text-[11px] tracking-wider uppercase shadow-[0_0_12px_rgba(251,146,60,0.25)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shadow-[0_0_8px_#fb923c]" />
                    🛒 JUEVES
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/95 font-display font-bold text-[11px] shadow-sm">
                    ⏰ {program.time}
                  </span>
                  {currentStatus === 'live' ? (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-display font-black text-white ${statusCfg.bg} shadow-md`}>
                      {statusCfg.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-950/70 border border-orange-500/35 text-orange-200 font-display font-semibold text-[11px]">
                      ⏳ En {countdown}
                    </span>
                  )}
                </div>

                {/* Párrafo descriptivo del programa */}
                <p className="font-sans text-[12px] lg:text-[13px] text-white/95 leading-[1.5] font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {extra.faqs?.[0]?.a || program.description}
                </p>

                {/* Separador deportivo / comic */}
                <div className="flex items-center gap-3 my-0.5">
                  <div className="h-[2px] w-24 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-transparent shadow-[0_0_10px_#f97316]" />
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                </div>

                {/* Sección de Conductores & Equipo */}
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <span className="text-[10px] font-display font-black tracking-widest uppercase text-amber-400/95 flex items-center gap-1.5">
                    🛒 CAZADORES & EQUIPO DEL SHOW
                  </span>

                  <div className="grid grid-cols-2 gap-1.5 lg:gap-2">
                    {extra.hosts.slice(0, 2).map((host) => (
                      <div
                        key={host.name}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#180d08]/85 border border-orange-500/30 hover:border-amber-400/60 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md group/h hover:scale-[1.02]"
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-orange-500/20 border border-orange-500/40 flex-shrink-0 group-hover/h:scale-110 transition-transform">
                          {host.avatar}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-display font-black text-[11px] lg:text-xs text-white leading-tight">
                            {host.name}
                          </span>
                          <span className="text-[9.5px] lg:text-[10px] text-white/70 leading-snug line-clamp-1">
                            {host.role}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* 3er integrante (Rafomagia) a 2 columnas */}
                    {extra.hosts[2] && (
                      <div className="col-span-2 flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-950/70 via-[#180d08]/85 to-transparent border border-orange-500/35 hover:border-amber-400/60 transition-all shadow-sm">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-orange-500/20 border border-orange-500/40 flex-shrink-0">
                          {extra.hosts[2].avatar}
                        </div>
                        <div className="flex items-center justify-between flex-1 flex-wrap gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-[11px] lg:text-xs text-white">
                              {extra.hosts[2].name}
                            </span>
                            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-amber-300 border border-orange-500/40">
                              Nostalgia & Toys
                            </span>
                          </div>
                          <span className="text-[10px] text-white/80 font-medium">
                            {extra.hosts[2].role}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Versión Mobile: Maldito Plástico */}
            <div className="block md:hidden">
              <div className="relative w-full aspect-[2103/748]">
                <img
                  src="/assets/plasticosection.webp"
                  alt="Maldito Plástico — Ninja House"
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <div
                className="p-5 flex flex-col gap-4 text-left border-t"
                style={{
                  background: 'linear-gradient(180deg, #130a06 0%, rgba(234,88,12,0.15) 100%)',
                  borderColor: 'rgba(234,88,12,0.3)'
                }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-display font-black text-[10px] tracking-wider uppercase bg-orange-500/25 border border-orange-500/50 text-[#fb923c]">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                    🛒 JUEVES
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-display font-bold text-[10px]">
                    ⏰ {program.time}
                  </span>
                  {currentStatus === 'live' ? (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-display font-black text-white ${statusCfg.bg}`}>
                      {statusCfg.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-950/70 border border-orange-500/30 text-orange-200 font-display font-medium text-[9px]">
                      ⏳ En {countdown}
                    </span>
                  )}
                </div>

                <p className="font-body text-xs text-white/90 leading-relaxed">
                  {extra.faqs?.[0]?.a || program.description}
                </p>

                <div className="h-px w-full my-1 bg-gradient-to-r from-amber-500/60 via-orange-500/40 to-transparent" />

                <div className="flex flex-col gap-2.5">
                  <span className="font-display font-black text-xs tracking-widest uppercase text-amber-400">
                    CAZADORES & EQUIPO DEL SHOW:
                  </span>

                  {extra.hosts.map((host) => (
                    <div
                      key={host.name}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-orange-500/30"
                    >
                      <span className="text-xl flex-shrink-0">{host.avatar}</span>
                      <div className="flex flex-col">
                        <span className="font-display font-black text-sm text-white leading-tight">
                          {host.name}
                        </span>
                        <span className="font-body text-xs text-white/60 mt-0.5">
                          {host.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isCineInfarto ? (
          <div
            className="rounded-3xl mb-12 overflow-hidden border-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-[#0a0507] relative group"
            style={{
              borderColor: 'rgba(220,38,38,0.5)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 35px rgba(220,38,38,0.25)'
            }}
          >
            {/* Desktop / Tablet: infartoSection_opt.webp con su relación de aspecto exacta (2103/748) para que no se corte el logo */}
            <div className="hidden md:block relative w-full aspect-[2103/748]">
              <img
                src="/assets/infartoSection_opt.webp"
                alt="Cine Infarto — Ninja House"
                className="w-full h-full object-cover object-right block select-none pointer-events-none"
              />

              {/* Degradado para garantizar legibilidad impecable sobre la zona izquierda sin tocar el logo */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(10,5,7,0.96) 0%, rgba(10,5,7,0.85) 40%, rgba(10,5,7,0.25) 55%, transparent 70%)'
                }}
              />

              {/* Contenido en la zona izquierda */}
              <div
                ref={heroCopyRef}
                className="absolute inset-y-0 left-[3.5%] lg:left-[4%] w-[52%] lg:w-[49%] max-w-[540px] z-10 flex flex-col justify-center text-left py-3 gap-1.5 lg:gap-2"
              >
                {/* Badges de categoría, horario y cuenta regresiva */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/25 border border-red-500/60 text-[#f87171] font-display font-black text-[11px] tracking-wider uppercase shadow-[0_0_12px_rgba(248,113,113,0.25)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#f87171]" />
                    🎬 VIERNES
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/95 font-display font-bold text-[11px] shadow-sm">
                    ⏰ {program.time}
                  </span>
                  {currentStatus === 'live' ? (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-display font-black text-white ${statusCfg.bg} shadow-md`}>
                      {statusCfg.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/70 border border-red-500/35 text-red-200 font-display font-semibold text-[11px]">
                      ⏳ En {countdown}
                    </span>
                  )}
                </div>

                {/* Párrafo descriptivo del programa */}
                <p className="font-sans text-[12px] lg:text-[13px] text-white/95 leading-[1.5] font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {extra.faqs?.[0]?.a || program.description}
                </p>

                {/* Separador temático terror / cine */}
                <div className="flex items-center gap-3 my-0.5">
                  <div className="h-[2px] w-24 rounded-full bg-gradient-to-r from-red-500 via-rose-600 to-transparent shadow-[0_0_10px_#dc2626]" />
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                </div>

                {/* Sección de Conductores & Equipo */}
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <span className="text-[10px] font-display font-black tracking-widest uppercase text-red-400/95 flex items-center gap-1.5">
                    🎬 CRÍTICOS & EQUIPO DEL INFARTO
                  </span>

                  <div className="grid grid-cols-2 gap-1.5 lg:gap-2">
                    {extra.hosts.map((host) => (
                      <div
                        key={host.name}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#1a0a0d]/85 border border-red-500/30 hover:border-red-400/60 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md group/h hover:scale-[1.02]"
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-red-500/20 border border-red-500/40 flex-shrink-0 group-hover/h:scale-110 transition-transform">
                          {host.avatar}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-display font-black text-[11px] lg:text-xs text-white leading-tight">
                            {host.name}
                          </span>
                          <span className="text-[9.5px] lg:text-[10px] text-white/70 leading-snug line-clamp-1">
                            {host.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Versión Mobile: Cine Infarto */}
            <div className="block md:hidden">
              <div className="relative w-full aspect-[2103/748]">
                <img
                  src="/assets/infartoSection_opt.webp"
                  alt="Cine Infarto — Ninja House"
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <div
                className="p-5 flex flex-col gap-4 text-left border-t"
                style={{
                  background: 'linear-gradient(180deg, #14080a 0%, rgba(220,38,38,0.15) 100%)',
                  borderColor: 'rgba(220,38,38,0.3)'
                }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-display font-black text-[10px] tracking-wider uppercase bg-red-500/25 border border-red-500/50 text-[#f87171]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    🎬 VIERNES
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-display font-bold text-[10px]">
                    ⏰ {program.time}
                  </span>
                  {currentStatus === 'live' ? (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-display font-black text-white ${statusCfg.bg}`}>
                      {statusCfg.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/70 border border-red-500/30 text-red-200 font-display font-medium text-[9px]">
                      ⏳ En {countdown}
                    </span>
                  )}
                </div>

                <p className="font-body text-xs text-white/90 leading-relaxed">
                  {extra.faqs?.[0]?.a || program.description}
                </p>

                <div className="h-px w-full my-1 bg-gradient-to-r from-red-500/60 via-rose-600/40 to-transparent" />

                <div className="flex flex-col gap-2.5">
                  <span className="font-display font-black text-xs tracking-widest uppercase text-red-400">
                    CRÍTICOS & EQUIPO DEL INFARTO:
                  </span>

                  {extra.hosts.map((host) => (
                    <div
                      key={host.name}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-red-500/30"
                    >
                      <span className="text-xl flex-shrink-0">{host.avatar}</span>
                      <div className="flex flex-col">
                        <span className="font-display font-black text-sm text-white leading-tight">
                          {host.name}
                        </span>
                        <span className="font-body text-xs text-white/60 mt-0.5">
                          {host.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isPlanoOscuro ? (
          <div
            className="rounded-3xl mb-12 overflow-hidden border-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-[#080503] relative group"
            style={{
              borderColor: 'rgba(234,179,8,0.45)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 35px rgba(234,179,8,0.22)'
            }}
          >
            {/* Desktop / Tablet: oscurosection.webp con su relación de aspecto exacta (2103/748) para que no se corte el logo */}
            <div className="hidden md:block relative w-full aspect-[2103/748]">
              <img
                src="/assets/oscurosection.webp"
                alt="El Plano Oscuro — Ninja House"
                className="w-full h-full object-cover object-right block select-none pointer-events-none"
              />

              {/* Degradado para garantizar legibilidad impecable sobre la zona izquierda sin tocar el logo */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(8,5,3,0.96) 0%, rgba(8,5,3,0.85) 40%, rgba(8,5,3,0.25) 55%, transparent 70%)'
                }}
              />

              {/* Contenido en la zona izquierda */}
              <div
                ref={heroCopyRef}
                className="absolute inset-y-0 left-[3.5%] lg:left-[4%] w-[52%] lg:w-[49%] max-w-[540px] z-10 flex flex-col justify-center text-left py-3 gap-1.5 lg:gap-2"
              >
                {/* Badges de categoría, horario y cuenta regresiva */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-500/60 text-[#fbbf24] font-display font-black text-[11px] tracking-wider uppercase shadow-[0_0_12px_rgba(251,191,36,0.25)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
                    🔮 DOMINGO
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/95 font-display font-bold text-[11px] shadow-sm">
                    ⏰ {program.time}
                  </span>
                  {currentStatus === 'live' ? (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-display font-black text-white ${statusCfg.bg} shadow-md`}>
                      {statusCfg.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/35 text-amber-200 font-display font-semibold text-[11px]">
                      ⏳ En {countdown}
                    </span>
                  )}
                </div>

                {/* Párrafo descriptivo del programa */}
                <p className="font-sans text-[12px] lg:text-[13px] text-white/95 leading-[1.5] font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {extra.faqs?.[0]?.a || program.description}
                </p>

                {/* Separador temático paranormal / misterio */}
                <div className="flex items-center gap-3 my-0.5">
                  <div className="h-[2px] w-24 rounded-full bg-gradient-to-r from-amber-400 via-yellow-600 to-transparent shadow-[0_0_10px_#eab308]" />
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                </div>

                {/* Sección de Conductores & Equipo */}
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <span className="text-[10px] font-display font-black tracking-widest uppercase text-amber-400/95 flex items-center gap-1.5">
                    🔮 ESPÍRITUS & EQUIPO DEL MISTERIO
                  </span>

                  <div className="grid grid-cols-2 gap-1.5 lg:gap-2">
                    {extra.hosts.map((host) => (
                      <div
                        key={host.name}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#140b05]/85 border border-amber-500/30 hover:border-amber-400/60 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md group/h hover:scale-[1.02]"
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-amber-500/20 border border-amber-500/40 flex-shrink-0 group-hover/h:scale-110 transition-transform">
                          {host.avatar}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-display font-black text-[11px] lg:text-xs text-white leading-tight">
                            {host.name}
                          </span>
                          <span className="text-[9.5px] lg:text-[10px] text-white/70 leading-snug line-clamp-1">
                            {host.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Versión Mobile: El Plano Oscuro */}
            <div className="block md:hidden">
              <div className="relative w-full aspect-[2103/748]">
                <img
                  src="/assets/oscurosection.webp"
                  alt="El Plano Oscuro — Ninja House"
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <div
                className="p-5 flex flex-col gap-4 text-left border-t"
                style={{
                  background: 'linear-gradient(180deg, #100804 0%, rgba(234,179,8,0.15) 100%)',
                  borderColor: 'rgba(234,179,8,0.3)'
                }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-display font-black text-[10px] tracking-wider uppercase bg-amber-500/25 border border-amber-500/50 text-[#fbbf24]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    🔮 DOMINGO
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-display font-bold text-[10px]">
                    ⏰ {program.time}
                  </span>
                  {currentStatus === 'live' ? (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-display font-black text-white ${statusCfg.bg}`}>
                      {statusCfg.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-200 font-display font-medium text-[9px]">
                      ⏳ En {countdown}
                    </span>
                  )}
                </div>

                <p className="font-body text-xs text-white/90 leading-relaxed">
                  {extra.faqs?.[0]?.a || program.description}
                </p>

                <div className="h-px w-full my-1 bg-gradient-to-r from-amber-500/60 via-yellow-600/40 to-transparent" />

                <div className="flex flex-col gap-2.5">
                  <span className="font-display font-black text-xs tracking-widest uppercase text-amber-400">
                    ESPÍRITUS & EQUIPO DEL MISTERIO:
                  </span>

                  {extra.hosts.map((host) => (
                    <div
                      key={host.name}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-amber-500/30"
                    >
                      <span className="text-xl flex-shrink-0">{host.avatar}</span>
                      <div className="flex flex-col">
                        <span className="font-display font-black text-sm text-white leading-tight">
                          {host.name}
                        </span>
                        <span className="font-body text-xs text-white/60 mt-0.5">
                          {host.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isAnimeRamen ? (
          <div
            className="rounded-3xl mb-12 overflow-hidden border-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-[#050308] relative group"
            style={{
              borderColor: `${theme.primary}45`,
              boxShadow: `0 20px 50px rgba(0,0,0,0.85), 0 0 30px ${theme.primary}20`
            }}
          >
            {/* Versión Desktop / Tablet (md y superior): Imagen panorámica completa con el texto ubicado en la zona oscura izquierda */}
            <div className="hidden md:block relative w-full aspect-[2075/758]">
              <img
                src={sectionBanner}
                alt={`${program.title} — Ninja House`}
                className="w-full h-full object-cover object-right block select-none pointer-events-none"
              />

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(5,3,8,0.96) 0%, rgba(5,3,8,0.88) 36%, rgba(5,3,8,0.3) 54%, transparent 72%)'
                }}
              />

              <div
                ref={heroCopyRef}
                className="absolute top-[48%] -translate-y-1/2 left-[4.5%] lg:left-[5%] w-[45%] lg:w-[44%] xl:w-[42%] max-w-[500px] flex flex-col justify-center text-left z-10 gap-2.5 lg:gap-3"
              >
                <div className="flex flex-wrap items-center gap-2 lg:gap-2.5">
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-display font-black text-xs lg:text-[12px] tracking-wider uppercase border shadow-sm"
                    style={{
                      backgroundColor: `${theme.primary}25`,
                      borderColor: `${theme.primary}50`,
                      color: theme.ink
                    }}
                  >
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
                    {program.emoji} {program.badge}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 font-display font-bold text-xs lg:text-[11.5px] shadow-sm">
                    ⏰ {program.time}
                  </span>
                  {currentStatus === 'live' ? (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs lg:text-[11px] font-display font-black text-white ${statusCfg.bg} shadow-md`}>
                      {statusCfg.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 font-display font-semibold text-xs lg:text-[11px]">
                      ⏳ En {countdown}
                    </span>
                  )}
                </div>

                <p className="font-body text-[13.5px] sm:text-[14px] lg:text-[14.5px] xl:text-[15px] text-white/95 leading-[1.65] font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                  {extra.faqs?.[0]?.a || program.description}
                </p>

                <div className="w-full my-0.5 flex items-center gap-3">
                  <div
                    className="h-[2px] w-20 rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
                      boxShadow: `0 0 10px ${theme.primary}`
                    }}
                  />
                  <div className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
                </div>

                <div className="w-full pt-0.5">
                  <div className={`grid ${extra.hosts.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 lg:gap-2.5`}>
                    {extra.hosts.map((host) => (
                      <div
                        key={host.name}
                        className="flex items-center gap-2.5 p-2 sm:px-3 sm:py-2 rounded-2xl bg-[#0e0717]/90 border shadow-[0_4px_16px_rgba(0,0,0,0.65)] backdrop-blur-md transition-all group/host hover:border-opacity-80 hover:scale-[1.02] min-h-[58px]"
                        style={{ borderColor: `${theme.primary}35` }}
                      >
                        <div
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-sm sm:text-base flex-shrink-0 group-hover/host:scale-110 transition-transform shadow-inner"
                          style={{
                            backgroundColor: `${theme.primary}25`,
                            border: `1px solid ${theme.primary}45`
                          }}
                        >
                          {host.avatar}
                        </div>
                        <div className="flex flex-col min-w-0 justify-center">
                          <span className="font-display font-black text-xs sm:text-[12.5px] lg:text-[13px] text-white leading-tight">
                            {host.name}
                          </span>
                          <span className="font-body text-[10px] sm:text-[10.5px] lg:text-[11px] text-white/75 leading-snug line-clamp-2 mt-0.5">
                            {host.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Versión Mobile Anime & Ramen */}
            <div className="block md:hidden">
              <div className="relative w-full aspect-[2075/758]">
                <img
                  src={sectionBanner}
                  alt={`${program.title} — Ninja House`}
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <div
                className="p-5 flex flex-col gap-4 text-left border-t"
                style={{
                  background: `linear-gradient(180deg, #050308 0%, ${theme.primary}15 100%)`,
                  borderColor: `${theme.primary}30`
                }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-display font-black text-[10px] tracking-wider uppercase border"
                    style={{
                      backgroundColor: `${theme.primary}20`,
                      borderColor: `${theme.primary}40`,
                      color: theme.ink
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
                    {program.emoji} {program.badge}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-display font-bold text-[10px]">
                    ⏰ {program.time}
                  </span>
                  {currentStatus === 'live' ? (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-display font-black text-white ${statusCfg.bg}`}>
                      {statusCfg.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70 font-display font-medium text-[9px]">
                      ⏳ En {countdown}
                    </span>
                  )}
                </div>

                <p className="font-body text-xs text-white/90 leading-relaxed">
                  {extra.faqs?.[0]?.a || program.description}
                </p>

                <div
                  className="h-px w-full my-1"
                  style={{
                    background: `linear-gradient(to right, ${theme.primary}60, ${theme.secondary}40, transparent)`
                  }}
                />

                <div className="flex flex-col gap-2.5">
                  <span
                    className="font-display font-black text-xs tracking-widest uppercase flex items-center gap-1.5"
                    style={{ color: theme.primary }}
                  >
                    HOSTS DEL SHOW:
                  </span>

                  {extra.hosts.map((host) => (
                    <div
                      key={host.name}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] border"
                      style={{ borderColor: `${theme.primary}30` }}
                    >
                      <span className="text-xl flex-shrink-0">{host.avatar}</span>
                      <div className="flex flex-col">
                        <span className="font-display font-black text-sm text-white leading-tight">
                          {host.name}
                        </span>
                        <span className="font-body text-xs text-white/60 mt-0.5">
                          {host.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Nueva Distribución Balanceada y Premium para Frikis de M, Maldito Plástico, Cine Infarto y El Plano Oscuro */
          <div
            className="rounded-3xl mb-12 overflow-hidden border-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-[#07050d] relative group"
            style={{
              borderColor: `${theme.primary}45`,
              boxShadow: `0 20px 50px rgba(0,0,0,0.85), 0 0 35px ${theme.primary}20`
            }}
          >
            {/* Ambient glows de iluminación temática */}
            <div
              className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
              style={{ backgroundColor: theme.primary }}
            />
            <div
              className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
              style={{ backgroundColor: theme.secondary || theme.primary }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10 relative z-10">
              
              {/* Columna Izquierda: Badges, Descripción y Hosts en estructura limpia y espaciosa */}
              <div ref={heroCopyRef} className="lg:col-span-7 flex flex-col gap-4 text-left">
                
                {/* Badges de categoría, horario y cuenta regresiva con espacio propio */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-display font-black text-xs sm:text-[12.5px] tracking-wider uppercase border shadow-sm"
                    style={{
                      backgroundColor: `${theme.primary}22`,
                      borderColor: `${theme.primary}60`,
                      color: theme.ink
                    }}
                  >
                    <span className="w-2 h-2 rounded-full animate-pulse shadow-sm" style={{ backgroundColor: theme.primary }} />
                    {program.emoji} {program.badge}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/95 font-display font-bold text-xs sm:text-[12px] shadow-sm">
                    ⏰ {program.time}
                  </span>
                  {currentStatus === 'live' ? (
                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-display font-black text-white ${statusCfg.bg} shadow-md`}>
                      {statusCfg.label}
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-display font-semibold"
                      style={{
                        backgroundColor: `${theme.primary}12`,
                        borderColor: `${theme.primary}30`,
                        color: theme.ink
                      }}
                    >
                      ⏳ En {countdown}
                    </span>
                  )}
                </div>

                {/* Párrafo descriptivo del programa con máxima legibilidad */}
                <p className="text-[14px] sm:text-[14.5px] lg:text-[15px] text-white/90 leading-relaxed font-normal">
                  {extra.faqs?.[0]?.a || program.description}
                </p>

                {/* Separador deportivo / ninja */}
                <div className="flex items-center gap-3 my-0.5">
                  <div
                    className="h-[2px] w-24 rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary || theme.primary})`,
                      boxShadow: `0 0 12px ${theme.primary}60`
                    }}
                  />
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                </div>

                {/* Sección de Conductores & Equipo */}
                <div className="flex flex-col gap-2.5 pt-1">
                  <div
                    className="text-[11px] font-display font-black tracking-widest uppercase flex items-center gap-2"
                    style={{ color: `${theme.primary}ee` }}
                  >
                    <span>🎙️ CONDUCTORES & EQUIPO DEL DOJO</span>
                  </div>

                  {/* Grid de Hosts balanceado: 2 columnas con soporte destacado para integrante impar (Switcher/Controles) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {extra.hosts.map((host, idx) => {
                      const isLastSolo = extra.hosts.length % 2 !== 0 && idx === extra.hosts.length - 1
                      return (
                        <div
                          key={host.name}
                          className={`flex items-center gap-2.5 p-2.5 sm:px-3 sm:py-2.5 rounded-2xl bg-[#0c0a14]/90 border shadow-sm backdrop-blur-md transition-all group/host hover:scale-[1.02] ${
                            isLastSolo ? 'sm:col-span-2 bg-gradient-to-r from-white/[0.04] to-transparent' : ''
                          }`}
                          style={{ borderColor: `${theme.primary}35` }}
                        >
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 group-hover/host:scale-110 transition-transform shadow-inner"
                            style={{
                              backgroundColor: `${theme.primary}25`,
                              border: `1px solid ${theme.primary}45`
                            }}
                          >
                            {host.avatar}
                          </div>
                          <div className={`flex ${isLastSolo ? 'flex-1 items-center justify-between flex-wrap gap-2' : 'flex-col min-w-0'}`}>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-black text-[13px] sm:text-[13.5px] text-white leading-tight">
                                {host.name}
                              </span>
                              {isLastSolo && host.role.toLowerCase().includes('switcher') && (
                                <span
                                  className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border"
                                  style={{
                                    backgroundColor: `${theme.primary}20`,
                                    borderColor: `${theme.primary}40`,
                                    color: theme.ink
                                  }}
                                >
                                  Switcher
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] sm:text-[11.5px] text-white/75 leading-snug line-clamp-2">
                              {host.role}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>

              {/* Columna Derecha: Ilustración Oficial completa, nítida y sin recortes */}
              <div className="lg:col-span-5 flex items-center justify-center relative p-2 sm:p-4">
                <div className="relative w-full max-w-[480px] aspect-[1402/1122] flex items-center justify-center">
                  {/* Halo de luz temática detrás de la ilustración */}
                  <div
                    className="absolute inset-0 rounded-full blur-3xl transform scale-90 pointer-events-none opacity-25"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <img
                    src={sectionBanner}
                    alt={`${program.title} — Ninja House`}
                    className="w-full h-full object-contain relative z-10 select-none pointer-events-none transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{
                      filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.9)) drop-shadow(0 0 35px ${theme.primary}40)`
                    }}
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            DOJO KAWAII & RAMEN BAR (Arte Ilustrado Oficial) - COMENTADO
            ══════════════════════════════════════════════════ */}
        {/*
        {isAnimeRamen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-14 rounded-3xl overflow-hidden border-2 border-[#C6A2E6]/35 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(198,162,230,0.18)] bg-[#050308] relative group"
          >
            <div className="relative w-full aspect-[2075/758]">
              <img
                src="/assets/ramenseccion.webp"
                alt="Dojo Kawaii & Ramen Bar — Ninja House"
                className="w-full h-full object-cover block select-none pointer-events-none"
              />

              <div 
                className="absolute top-[23%] left-[51%] flex items-center justify-between gap-1 z-10"
                style={{ width: '41%', height: '8.5%' }}
              >
                {[
                  { name: 'sakura', icon: '🌸', msg: '¡Lluvia de pétalos de sakura!' },
                  { name: 'ramen', icon: '🍜', msg: '¡Ordenando tazón de ramen extra!' },
                  { name: 'lofi', icon: '🎧', msg: '¡Modo Lo-Fi Anime activado!' },
                  { name: 'nya', icon: '🐱', msg: '¡Nya kawaii desu ne!' },
                  { name: 'onigiri', icon: '🍙', msg: '¡Poder Otaku al 100%!' },
                ].map((btn) => (
                  <button
                    key={btn.name}
                    onClick={() => triggerKawaiiReaction(btn.name, btn.icon, btn.msg)}
                    className="flex-1 h-full rounded-full cursor-pointer hover:bg-white/15 active:scale-95 transition-all focus:outline-none"
                    title={`Reaccionar con ${btn.name}`}
                    aria-label={btn.name}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        */}

        {/* ══════════════════════════════════════════════════
            REPRODUCTOR DE EPISODIOS — PREMIUM LIVE FEED
            ══════════════════════════════════════════════════ */}
        <div className="mb-16">

          {/* Section header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-1 h-6 rounded-full"
                style={{ background: `linear-gradient(to bottom, ${theme.primary}, ${theme.primary}60)` }}
              />
              <h3 className="font-display font-black text-lg text-white tracking-widest uppercase">
                Reproductor de Episodios
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-display font-bold tracking-wider bg-white/5 border border-white/10 text-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {playlistVideos.length} {playlistVideos.length === 1 ? 'episodio' : 'episodios'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Force Refresh / Sync Feed button */}
              <button
                onClick={() => loadEpisodes(true)}
                disabled={isRefreshing || isLoadingFeed}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-display font-bold text-[11px] tracking-wide transition-all cursor-pointer disabled:opacity-50"
                title="Actualizar últimos videos desde YouTube"
              >
                <motion.svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                  transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                </motion.svg>
                <span>{isRefreshing ? 'Actualizando...' : 'Sincronizar Feed'}</span>
              </button>

              {isPlaying && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 bg-red-600/15 border border-red-500/40 px-3 py-1 rounded-full text-[10px] font-display font-black text-red-400"
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  EN REPRODUCCIÓN
                </motion.span>
              )}
            </div>
          </div>

          {/* Main player + sidebar grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">

            {/* ── Left: Video Player ── */}
            <div className="flex flex-col gap-0">
              
              {/* Player container */}
              <div
                className="relative w-full aspect-video rounded-t-2xl overflow-hidden group shadow-2xl bg-black"
                style={{
                  boxShadow: `0 0 0 1px ${theme.primary}20, 0 25px 50px rgba(0,0,0,0.7), 0 0 80px ${theme.primary}10`
                }}
              >
                {isPlaying && currentVideoId ? (
                  <div className="relative w-full h-full bg-black">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1`}
                      title={activePlaylistVideo?.title || program.title}
                      className="relative z-10 w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    {/* Floating stop button */}
                    <motion.button
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setIsPlaying(false)}
                      className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-black/70 hover:bg-red-700/90 backdrop-blur-sm text-white font-display font-black text-[10px] rounded-lg transition-all border border-white/10 hover:border-red-500 cursor-pointer shadow-lg"
                    >
                      <span className="text-red-400">■</span> DETENER
                    </motion.button>
                  </div>
                ) : (
                  <>
                    {/* Thumbnail background */}
                    <img
                      src={currentPoster}
                      alt={activePlaylistVideo?.title || program.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (currentVideoId && !target.src.includes('hqdefault')) {
                          target.src = `https://i.ytimg.com/vi/${currentVideoId}/hqdefault.jpg`
                        } else {
                          target.src = program.image
                        }
                      }}
                    />

                    {/* Dark overlay layers */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Corner brand accent */}
                    <div
                      className="absolute top-0 left-0 w-20 h-20 opacity-60"
                      style={{
                        background: `radial-gradient(circle at top left, ${theme.primary}60, transparent 70%)`
                      }}
                    />

                    {/* Center play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Outer pulse ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: `${theme.primary}30` }}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        <motion.button
                          onClick={() => setIsPlaying(true)}
                          className="relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer z-10 shadow-2xl"
                          style={{
                            backgroundColor: theme.primary,
                            color: '#0a0a0a',
                            boxShadow: `0 0 40px ${theme.primary}80, 0 0 80px ${theme.primary}30`
                          }}
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.93 }}
                        >
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5.14v14l11-7-11-7z"/>
                          </svg>
                        </motion.button>
                      </div>
                    </div>

                    {/* Bottom info bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                      <div className="flex flex-col gap-1 max-w-[75%]">
                        <span
                          className="text-[9px] font-display font-black tracking-[0.2em] uppercase flex items-center gap-1.5"
                          style={{ color: theme.primary }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                          {isLoadingFeed ? 'Actualizando episodio...' : (activePlaylistVideo === playlistVideos[0] ? 'Último Episodio' : 'Episodio Seleccionado')}
                        </span>
                        <p className="text-white font-display font-bold text-sm leading-snug line-clamp-2">
                          {activePlaylistVideo?.title || playlistVideos[0]?.title || program.title}
                        </p>
                      </div>
                      <motion.button
                        onClick={() => setIsPlaying(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-black text-[10px] tracking-wider cursor-pointer"
                        style={{ backgroundColor: theme.primary, color: '#0a0a0a' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5.14v14l11-7-11-7z"/>
                        </svg>
                        REPRODUCIR
                      </motion.button>
                    </div>
                  </>
                )}
              </div>

              {/* Video meta bar below player */}
              <div
                className="rounded-b-2xl px-5 py-3.5 flex items-center justify-between"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}12, rgba(20,20,20,0.95))`,
                  border: `1px solid ${theme.primary}20`,
                  borderTop: 'none'
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: `${theme.primary}20`, border: `1px solid ${theme.primary}40` }}
                  >
                    {program.emoji}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-display font-black text-white/40 tracking-widest uppercase truncate">
                      {activePlaylistVideo?.title ? program.title : 'Ninja House TV'}
                    </span>
                    <span className="text-[10px] font-display font-semibold text-white/70 truncate">
                      {activePlaylistVideo?.date || playlistVideos[0]?.date || 'YouTube Feed'}
                      {(activePlaylistVideo?.views || playlistVideos[0]?.views) && ` · ${activePlaylistVideo?.views || playlistVideos[0]?.views}`}
                    </span>
                  </div>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${currentVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-display font-bold text-white/50 hover:text-white transition-colors flex items-center gap-1.5 flex-shrink-0 ml-3 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10"
                >
                  <span>Abrir en YouTube</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15,3 21,3 21,9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* ── Right: Episode Sidebar ── */}
            <div
              className="flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #111111 0%, #0d0d0d 100%)',
                border: `1px solid ${theme.primary}18`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.5)`
              }}
            >
              {/* Sidebar header with tabs */}
              <div className="flex border-b border-white/5">
                <button
                  onClick={() => setActiveTab('episodes')}
                  className={`flex-1 py-3.5 text-[10px] font-display font-black tracking-widest uppercase transition-all cursor-pointer relative ${
                    activeTab === 'episodes' ? 'text-white' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {activeTab === 'episodes' && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: theme.primary }}
                    />
                  )}
                  Episodios ({playlistVideos.length})
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`flex-1 py-3.5 text-[10px] font-display font-black tracking-widest uppercase transition-all cursor-pointer relative ${
                    activeTab === 'faq' ? 'text-white' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {activeTab === 'faq' && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: theme.primary }}
                    />
                  )}
                  Sobre el Show
                </button>
              </div>

              {/* Episodes tab */}
              {activeTab === 'episodes' && (
                <div className="flex flex-col overflow-y-auto custom-scrollbar" style={{ maxHeight: '460px' }}>
                  
                  {/* Loading skeleton */}
                  {isLoadingFeed && playlistVideos.length === 0 && (
                    <div className="flex flex-col gap-0">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-3 p-3 border-b border-white/5 animate-pulse">
                          <div className="w-24 h-[54px] rounded-lg bg-white/5 flex-shrink-0" />
                          <div className="flex flex-col gap-2 flex-1 justify-center">
                            <div className="h-2.5 bg-white/5 rounded w-full" />
                            <div className="h-2.5 bg-white/5 rounded w-2/3" />
                            <div className="h-2 bg-white/5 rounded w-1/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Episodes List (All live & cached items) */}
                  {playlistVideos.map((ep, idx) => {
                    const isSelected = activeVideoId === ep.videoId || (!activeVideoId && idx === 0)
                    return (
                      <motion.button
                        key={ep.videoId || ep.id || idx}
                        onClick={() => {
                          setActiveVideoId(ep.videoId)
                          setIsPlaying(true)
                        }}
                        className={`flex gap-3 p-3 text-left w-full transition-all border-b border-white/5 cursor-pointer group relative ${
                          isSelected
                            ? 'bg-white/[0.07]'
                            : 'hover:bg-white/[0.03]'
                        }`}
                        whileHover={{ x: 2 }}
                      >
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0 w-24 h-[54px] rounded-lg overflow-hidden bg-black/50">
                          <img
                            src={ep.thumbnail}
                            alt={ep.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              if (!target.src.includes('hqdefault')) {
                                target.src = `https://i.ytimg.com/vi/${ep.videoId}/hqdefault.jpg`
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20" />
                          
                          {isSelected && isPlaying ? (
                            <div
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ backgroundColor: `${theme.primary}85` }}
                            >
                              <div className="flex gap-0.5 items-end h-4">
                                {[1, 2, 3].map(b => (
                                  <motion.div
                                    key={b}
                                    className="w-1 rounded-full bg-black"
                                    animate={{ height: ['25%', '100%', '25%'] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: b * 0.15 }}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                              <svg className="opacity-0 group-hover:opacity-100 transition-opacity" width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5.14v14l11-7-11-7z"/>
                              </svg>
                            </div>
                          )}

                          {/* Index / New badge */}
                          {idx === 0 ? (
                            <div
                              className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[7px] font-display font-black tracking-wider"
                              style={{ backgroundColor: theme.primary, color: '#0a0a0a' }}
                            >
                              NUEVO
                            </div>
                          ) : (
                            <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded text-[8px] font-display font-semibold bg-black/80 text-white/70">
                              #{playlistVideos.length - idx}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col gap-1 justify-center flex-1 min-w-0">
                          <p className={`font-display font-bold text-[11px] leading-snug line-clamp-2 transition-colors ${
                            isSelected ? 'text-white font-extrabold' : 'text-white/80 group-hover:text-white'
                          }`}>
                            {ep.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-display text-white/40">{ep.date}</span>
                            {ep.views && (
                              <>
                                <span className="text-white/20">·</span>
                                <span className="text-[9px] font-display text-white/40">{ep.views}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Active indicator bar */}
                        {isSelected && (
                          <div
                            className="w-1 self-stretch rounded-full flex-shrink-0"
                            style={{ backgroundColor: theme.primary }}
                          />
                        )}
                      </motion.button>
                    )
                  })}

                  {/* Footer link to full playlist on YouTube */}
                  {youtubePlaylistMap[program.slug]?.playlistId && (
                    <a
                      href={youtubePlaylistMap[program.slug]?.playlistUrl || `https://www.youtube.com/playlist?list=${youtubePlaylistMap[program.slug]?.playlistId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3 text-[10px] font-display font-bold text-white/30 hover:text-white/80 transition-colors border-t border-white/5 cursor-pointer bg-white/[0.01] hover:bg-white/[0.04]"
                    >
                      <span>Ver playlist completa en YouTube</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15,3 21,3 21,9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}

              {/* FAQ tab */}
              {activeTab === 'faq' && (
                <div className="flex flex-col gap-0 overflow-y-auto" style={{ maxHeight: '440px' }}>
                  {extra.faqs.map((faq, i) => (
                    <div key={i} className="p-4 border-b border-white/5 last:border-b-0 flex flex-col gap-2">
                      <h4
                        className="font-display font-black text-[11px] uppercase tracking-wider leading-snug"
                        style={{ color: theme.primary }}
                      >
                        {faq.q}
                      </h4>
                      <p className="text-white/45 text-[11px] font-body leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sponsor CTA Block */}
        <div
          className="p-8 rounded-3xl border mb-16 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}16, rgba(255,255,255,0.035))`,
            borderColor: `${theme.primary}26`,
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)` }}
          />
          <div className="text-left">
            <h3 className="font-display font-black text-xl text-white">¿Te interesa pautar en {program.title}?</h3>
            <p className="text-white/40 text-sm font-body mt-2 leading-relaxed max-w-xl">
              {program.sponsorText}
            </p>
          </div>
          <Link
            to="/contacto"
            className="px-6 py-3.5 font-display font-black text-sm rounded-xl transition-all shadow-lg text-center"
            style={{ backgroundColor: theme.primary, color: '#070707', boxShadow: `0 0 24px ${theme.primary}30` }}
          >
            {theme.sponsorLabel}
          </Link>
        </div>

        {/* Related Programs List */}
        <div className="border-t border-white/10 pt-16 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-display font-black tracking-widest uppercase mb-2 border border-white/15 bg-white/5 text-white/70">
                EXPLORA EL DOJO
              </span>
              <h3 className="font-display font-black text-2xl lg:text-3xl text-white uppercase tracking-wider">
                Otros Programas Relacionados
              </h3>
            </div>
            <Link
              to="/programas"
              className="text-xs font-display font-bold text-white/50 hover:text-white transition-colors flex items-center gap-1.5 group"
            >
              <span>Ver cartelera completa</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {relatedPrograms.map((related) => {
              const cardImage = relatedProgramImageMap[related.slug] ?? relatedProgramImageMap[related.id] ?? related.image
              const targetUrl = `/programa/${related.slug || related.id}`

              return (
                <Link 
                  key={related.id} 
                  to={targetUrl}
                  className="group relative rounded-3xl overflow-hidden border border-white/10 bg-[#0d0d12]/90 hover:border-white/30 transition-all duration-300 flex flex-col hover:-translate-y-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.6)]"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 20px 45px rgba(0,0,0,0.8), 0 0 35px ${related.color}35`
                    e.currentTarget.style.borderColor = `${related.color}70`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.6)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  }}
                >
                  {/* Top accent line with show color */}
                  <div
                    className="h-1 w-full"
                    style={{ background: `linear-gradient(90deg, ${related.color}, ${related.color}60, transparent)` }}
                  />

                  {/* 16:9 Video / Graphic Container */}
                  <div className="relative w-full aspect-video overflow-hidden bg-black/60 flex items-center justify-center">
                    {related.heroVideo ? (
                      <video
                        src={related.heroVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={cardImage}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none"
                      />
                    ) : (
                      <img
                        src={cardImage}
                        alt={`${related.title} — Ninja House`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent opacity-80 pointer-events-none" />
                    
                    {/* Day / Time pill badge on top left */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-display font-black tracking-wider uppercase backdrop-blur-md border border-white/15 bg-black/65 text-white shadow-lg pointer-events-none">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: related.color }} />
                      <span>{related.day} • {related.time?.split(' - ')[0] || '9:00 PM'}</span>
                    </div>

                    {/* Emoji badge top right */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/65 backdrop-blur-md border border-white/15 flex items-center justify-center text-sm shadow-lg pointer-events-none">
                      {related.emoji}
                    </div>
                  </div>

                  {/* Body info */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-display font-bold uppercase tracking-wider text-white/40 mb-1">
                        {related.category}
                      </div>
                      <h4 className="font-display font-black text-lg text-white group-hover:text-ninja-green transition-colors leading-tight">
                        {related.title}
                      </h4>
                      <p className="text-white/60 text-xs font-body leading-relaxed line-clamp-2 mt-2">
                        {related.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-display font-bold">
                      <span className="text-white/40 group-hover:text-white/80 transition-colors">
                        Explorar show
                      </span>
                      <span
                        className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-1"
                        style={{ color: related.color }}
                      >
                        <span>Ver más</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

