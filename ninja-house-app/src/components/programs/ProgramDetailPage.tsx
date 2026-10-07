import { useParams, useNavigate, Link } from 'react-router-dom'
import { programsData } from '../../data/programs'
import { scheduleData, getSmartStatus } from '../../data/schedule'
import { fallbackProgramTheme, programThemes } from '../../data/programThemes'
import { ProgramMotifs } from './ProgramMotifs'
import { ProgramLoadingScreen } from './ProgramLoadingScreen'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from 'gsap'
import { fetchLiveEpisodes, type YouTubeEpisode, youtubePlaylistMap } from '../../services/youtubePlaylistService'

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

const PLAYLIST_CACHE_PREFIX = 'ninja-house:playlist-cache:'
const PLAYLIST_CACHE_TTL = 1000 * 60 * 15
const inactiveProgramIds = new Set(['lanzalo'])

const extraShowsData: Record<string, ShowExtraData> = {
  'animes-y-ramen': {
    hosts: [
      { name: 'Charrita Peruana', role: 'Especialista en Manga y Cultura Cosplay', avatar: '🌸' },
      { name: 'Ale Romero', role: 'Crítico de Anime & Sommelier de Ramen', avatar: '🍜' }
    ],
    faqs: [
      { q: '¿Cómo puedo recomendar un anime para el show?', a: 'Puedes proponer tus animes favoritos en el chat en vivo los lunes o taggearnos en Instagram con el hashtag #AnimesYRamen.' },
      { q: '¿Qué tipo de ramen preparan en el show?', a: 'Desde Shoyu y Tonkotsu tradicional hasta variaciones picantes extremas preparadas en vivo por nuestros hosts.' }
    ],
    episodes: [
      { id: 'ar-1', title: 'Episodio 48: ¿Por qué Chainsaw Man redefinió el Shonen moderno?', duration: '1h 35m', views: '14.2K views', date: 'Hace 3 días' },
      { id: 'ar-2', title: 'Episodio 47: Estrenos Crunchyroll Temporada de Invierno', duration: '2h 05m', views: '18.1K views', date: 'Hace 1 semana' },
      { id: 'ar-3', title: 'Episodio 46: Probando el ramen más picante de la ciudad en vivo', duration: '1h 50m', views: '22.5K views', date: 'Hace 2 semanas' }
    ],
    chatMessages: [
      '¡Solo Leveling es lo mejor de este año!',
      '¿Ya vieron el nuevo trailer de Jujutsu Kaisen?',
      'Ese ramen se ve deliciosoooo',
      '¡Saludooos desde Lima! Grande Charrita',
      'Ramen de cerdo supremacy 🍜',
      'Ale, ¿harás review de la película de Kimetsu?',
      '¿Qué opinan de la nueva temporada de Demon Slayer?'
    ]
  },
  'overhead': {
    hosts: [
      { name: 'Umano Mc', role: 'Narrador Experto y Fan de Lucha Libre', avatar: '🎙️' },
      { name: 'Luis Ríos', role: 'Analista Técnico de Wrestling', avatar: '🌐' },
      { name: 'El tío Hitman', role: 'Historiador de WWE y Lucha Libre Retro', avatar: '🥋' }
    ],
    faqs: [
      { q: '¿De qué empresas de wrestling hablan?', a: 'Analizamos WWE, AEW, NJPW y las principales ligas independientes de todo el mundo.' },
      { q: '¿Hacen transmisiones de los Pay-Per-View?', a: 'Sí, hacemos sintonías y reacciones en vivo de los eventos más importantes del año.' }
    ],
    episodes: [
      { id: 'oh-1', title: 'Episodio 92: Wrestlemania Resumen Completo y Sorpresas', duration: '1h 45m', views: '10.5K views', date: 'Hace 4 días' },
      { id: 'oh-2', title: 'Episodio 91: El regreso de las leyendas a la lona', duration: '1h 58m', views: '12.8K views', date: 'Hace 1 semana' },
      { id: 'oh-3', title: 'Episodio 90: ¿Por qué el campeonato mundial necesita un cambio?', duration: '2h 15m', views: '19.4K views', date: 'Hace 2 semanas' }
    ],
    chatMessages: [
      '¡Umano, qué opinas del combate estelar de anoche?',
      'AEW se lució con el último show',
      'El tío Hitman tiene la razón en todo',
      '¡Gran debate muchachos!',
      '¿Cuándo traen invitados nacionales?',
      'WWE está en su mejor momento en años',
      '¿El reinado de Cody acabará pronto?'
    ]
  },
  'freakuencia-m': {
    hosts: [
      { name: 'Darranque', role: 'Conductor de Tendencias y Memeología', avatar: '⚡' },
      { name: 'Luis Ríos', role: 'Crítico de Cultura Pop', avatar: '🌐' },
      { name: 'Umano', role: 'Analista de Actualidad Geek', avatar: '🎙️' },
      { name: 'Rafomagia', role: 'Especialista en Ilusionismo y Viralidades', avatar: '🎩' }
    ],
    faqs: [
      { q: '¿Cómo eligen los temas semanales?', a: 'Monitoreamos las tendencias virales, memes y noticias geek más comentadas de las últimas 24 horas.' },
      { q: '¿Puedo enviar memes o videos para que los reaccionen?', a: '¡Claro! Taggeanos en TikTok e Instagram para sumarlo a la parrilla.' }
    ],
    episodes: [
      { id: 'fq-1', title: 'Episodio 105: Tendencias absurdas de internet y memes virales', duration: '1h 40m', views: '15.6K views', date: 'Hace 2 días' },
      { id: 'fq-2', title: 'Episodio 104: El auge de la cultura pop y la nostalgia retro', duration: '1h 52m', views: '17.9K views', date: 'Hace 9 días' },
      { id: 'fq-3', title: 'Episodio 103: Especial: Lo que no te contaron de los virales de la semana', duration: '2h 08m', views: '25.1K views', date: 'Hace 2 semanas' }
    ],
    chatMessages: [
      'Jajaja ese meme de Darranque estuvo genial',
      'Rafomagia haz un truco en vivo!',
      '¿Qué opinan de las tendencias de IA en Twitter?',
      '¡Buenas vibras al dojo!',
      'Luis siempre dando el toque de cordura',
      'El programa más divertido de la semana',
      '¡Grande Umano!'
    ]
  },
  'frikisdem': {
    hosts: [
      { name: 'Darranque', role: 'Conductor de Tendencias y Memeología', avatar: '⚡' },
      { name: 'Luis Ríos', role: 'Crítico de Cultura Pop', avatar: '🌐' },
      { name: 'Umano', role: 'Analista de Actualidad Geek', avatar: '🎙️' },
      { name: 'Rafomagia', role: 'Especialista en Ilusionismo y Viralidades', avatar: '🎩' }
    ],
    faqs: [
      { q: '¿Cómo eligen los temas semanales?', a: 'Monitoreamos las tendencias virales, memes y noticias geek más comentadas de las últimas 24 horas.' },
      { q: '¿Puedo enviar memes o videos para que los reaccionen?', a: '¡Claro! Taggeanos en TikTok e Instagram para sumarlo a la parrilla.' }
    ],
    episodes: [
      { id: 'fdm-1', title: 'Episodio 105: Tendencias absurdas de internet y memes virales', duration: '1h 40m', views: '15.6K views', date: 'Hace 2 días' },
      { id: 'fdm-2', title: 'Episodio 104: El auge de la cultura pop y la nostalgia retro', duration: '1h 52m', views: '17.9K views', date: 'Hace 9 días' },
      { id: 'fdm-3', title: 'Episodio 103: Especial: Lo que no te contaron de los virales de la semana', duration: '2h 08m', views: '25.1K views', date: 'Hace 2 semanas' }
    ],
    chatMessages: [
      'Jajaja ese momento estuvo genial',
      'Rafomagia haz un truco en vivo!',
      '¿Qué opinan de las tendencias de IA en Twitter?',
      '¡Buenas vibras al dojo!',
      'Luis siempre dando el toque de cordura',
      'FrikisDeM es mi programa favorito',
      '¡Grande Umano!'
    ]
  },
  'maldito-plastico': {
    hosts: [
      { name: 'Markollectibles', role: 'Cazador de Figuras Vintage & Grail Hunt', avatar: '🧸' },
      { name: 'Gianco C', role: 'Coleccionista de Escala 1/6 y Estatuas', avatar: '📦' },
      { name: 'Rafomagia', role: 'Aficionado al Merchandising Exclusivo', avatar: '🎩' }
    ],
    faqs: [
      { q: '¿Cómo sé si una figura de acción es original?', a: 'Damos tips semanales de pintura, articulaciones, logos y cajas licenciadas para no caer en copias falsas.' },
      { q: '¿Hacen sorteos de figuras para suscriptores?', a: '¡Sí! Al final de cada mes hacemos dinámicas en directo para regalar piezas coleccionables.' }
    ],
    episodes: [
      { id: 'mp-1', title: 'Episodio 58: Unboxing y review de la colosal estatua de Seiya de $600', duration: '2h 10m', views: '11.2K views', date: 'Hace 3 días' },
      { id: 'mp-2', title: 'Episodio 57: Guía definitiva para coleccionar figuras de Saint Seiya', duration: '1h 48m', views: '13.5K views', date: 'Hace 1 semana' },
      { id: 'mp-3', title: 'Episodio 56: La fiebre de las figuras retro de los años 80 y 90', duration: '1h 55m', views: '16.8K views', date: 'Hace 2 semanas' }
    ],
    chatMessages: [
      '¡Qué locura de estatua por dios!',
      'Tengo 50 funkos y ya no tengo espacio en mi cuarto help',
      '¿Vale la pena comprar figuras usadas en Japón?',
      'Maldito plástico es mi adicción semanal jajaja',
      '¿Van a hacer un especial de figuras de Dragon Ball?',
      '¿Dónde consiguieron ese estante acrílico?',
      '¡Gianco, muestra tu colección de figuras de terror!'
    ]
  },
  'cine-infarto': {
    hosts: [
      { name: 'Carmen Bathory', role: 'Especialista en Cine de Terror y Slasher', avatar: '🎬' },
      { name: 'José Manco', role: 'Analista de Guion y Estrenos Comerciales', avatar: '🍿' }
    ],
    faqs: [
      { q: '¿Qué géneros de películas analizan en Cine Infarto?', a: 'Nos especializamos en terror, suspenso, thriller psicológico, cine de culto y estrenos de cartelera.' },
      { q: '¿Hacen spoilers en las reseñas?', a: 'Siempre avisamos antes de entrar a la sección con spoilers para que disfrutes del análisis sin arruinar la película.' }
    ],
    episodes: [
      { id: 'ci-1', title: 'Episodio 75: A24 vs Blumhouse: Dos caras del terror contemporáneo', duration: '1h 55m', views: '16.9K views', date: 'Hace 1 día' },
      { id: 'ci-2', title: 'Episodio 74: ¿Por qué el cine de superhéroes está en crisis de guion?', duration: '2h 12m', views: '18.4K views', date: 'Hace 1 semana' },
      { id: 'ci-3', title: 'Episodio 73: TOP 10 Películas más perturbadoras que no querrás volver a ver', duration: '1h 42m', views: '28.9K views', date: 'Hace 2 semanas' }
    ],
    chatMessages: [
      'Midsommar es una obra maestra del terror psicológico',
      '¿Qué opinan de la nueva de Alien?',
      'Carmen, ¿cuál es tu película slasher favorita?',
      '¡Esa lista del TOP 10 me dio pesadillas anoche!',
      '¿Van a hablar de directores como Stanley Kubrick?',
      'El cine independiente está salvando la industria',
      '¡Apoyo total al cine de terror nacional!'
    ]
  },
  'plan-oscuro': {
    hosts: [
      { name: 'Investigador Oculto', role: 'Crónicas Paranormales y Misterios', avatar: '🕯️' },
      { name: 'Narrador de Sombras', role: 'Criptozoología y Fenómenos Inexplicables', avatar: '👁️' }
    ],
    faqs: [
      { q: '¿De qué trata Plan Oscuro?', a: 'Es nuestro programa dedicado al misterio, fenómenos paranormales, conspiraciones, leyendas urbanas e investigaciones en la oscuridad.' },
      { q: '¿Puedo enviar testimonios o evidencias paranormales?', a: 'Sí, recibimos audios, fotos y videos de la comunidad para analizarlos en vivo.' }
    ],
    episodes: [
      { id: 'po-1', title: 'Episodio 1: Archivos Clasificados y Misterios no Resueltos', duration: '1h 50m', views: '12.4K views', date: 'Estreno' },
      { id: 'po-2', title: 'Episodio 2: Relatos de Ultratumba y Casas Embrujadas', duration: '2h 05m', views: '15.8K views', date: 'Próximamente' }
    ],
    chatMessages: [
      '¡Se me puso la piel de gallina con este relato!',
      '¿Vieron esa sombra detrás en el segundo 45?',
      'Plan Oscuro era lo que le faltaba a Ninja House 🕯️',
      'Apaguen las luces para ver el programa...',
      'Ese archivo desclasificado es perturbador',
      '¡Excelente producción y ambientación!'
    ]
  }
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
  const program = programsData.find((p) => p.slug === id)
  const scheduleInfo = scheduleData.find((s) => s.id === id)
  const extra = extraShowsData[id || '']
  const countdown = useCountdown(program?.dayIndex ?? 1)
  const isRetiredProgram = !!program && inactiveProgramIds.has(program.id)

  useEffect(() => {
    if (!program || reducedMotion) return

    const ctx = gsap.context(() => {
      const shell = heroShellRef.current
      const poster = heroPosterRef.current
      const copyChildren = heroCopyRef.current?.children ?? []

      const introMap = {
        'animes-y-ramen': {
          shellFrom: { opacity: 0, y: 22 },
          posterFrom: { x: -52, y: 28, rotation: -7, scale: 0.84 },
          posterEase: 'expo.out',
          copyFrom: { x: 28, y: 18, opacity: 0 },
          copyEase: 'power3.out',
          copyStagger: 0.065,
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
          shellFrom: { opacity: 0, y: 28 },
          posterFrom: { y: 68, rotation: 6, scale: 0.9 },
          posterEase: 'back.out(1.7)',
          copyFrom: { y: 28, opacity: 0 },
          copyEase: 'power3.out',
          copyStagger: 0.05,
          after: (tl: gsap.core.Timeline) => {
            tl.to(poster, { y: -4, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.92)
          },
        },
        'freakuencia-m': {
          shellFrom: { opacity: 0, y: 18, x: 14 },
          posterFrom: { x: 58, y: 18, rotation: 2, scale: 0.88 },
          posterEase: 'power4.out',
          copyFrom: { x: -24, y: 18, opacity: 0 },
          copyEase: 'power3.out',
          copyStagger: 0.045,
          after: (tl: gsap.core.Timeline) => {
            tl.to(shell, { x: 2, duration: 0.05, repeat: 3, yoyo: true, ease: 'none' }, 0.45)
          },
        },
        'maldito-plastico': {
          shellFrom: { opacity: 0, y: 30 },
          posterFrom: { y: 46, scale: 0.76, rotation: -4 },
          posterEase: 'back.out(1.9)',
          copyFrom: { y: 22, opacity: 0 },
          copyEase: 'power2.out',
          copyStagger: 0.06,
          after: (tl: gsap.core.Timeline) => {
            tl.fromTo(
              poster,
              { boxShadow: '0 0 0 rgba(0,0,0,0)' },
              { boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 42px ${(programThemes[program.id] ?? fallbackProgramTheme).primary}26`, duration: 0.7 },
              0.2
            )
          },
        },
        'cine-infarto': {
          shellFrom: { opacity: 0, y: 24 },
          posterFrom: { y: 36, scale: 1.06, rotation: -1, filter: 'brightness(0.9)' },
          posterEase: 'power2.out',
          copyFrom: { y: 20, opacity: 0 },
          copyEase: 'power3.out',
          copyStagger: 0.055,
          after: (tl: gsap.core.Timeline) => {
            tl.fromTo(
              shell,
              { filter: 'saturate(0.88) contrast(1.04)' },
              { filter: 'saturate(1) contrast(1)', duration: 0.9 },
              0.16
            )
          },
        },
      } as const

      const intro = introMap[program.id as keyof typeof introMap] ?? {
        shellFrom: { opacity: 0, y: 20 },
        posterFrom: { y: 28, opacity: 0, scale: 0.95 },
        posterEase: 'power3.out',
        copyFrom: { y: 18, opacity: 0 },
        copyEase: 'power3.out',
        copyStagger: 0.06,
      }

      gsap.set(poster, { transformOrigin: '50% 50%' })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(shell, intro.shellFrom, { opacity: 1, y: 0, duration: 0.45 })
        .fromTo(
          poster,
          intro.posterFrom,
          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, filter: 'none', duration: 0.85, ease: intro.posterEase },
          0.06
        )
        .fromTo(
          copyChildren,
          intro.copyFrom,
          { x: 0, y: 0, opacity: 1, duration: 0.5, stagger: intro.copyStagger, ease: intro.copyEase },
          0.12
        )

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
        setActiveVideoId((prev) => prev || liveEpisodes[0]?.videoId || fallbackVideoId)
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

  // Filter other shows for the related list
  const relatedPrograms = programsData.filter((p) => p.slug !== id && !inactiveProgramIds.has(p.id)).slice(0, 3)
  const activePlaylistVideo = playlistVideos.find((video) => video.videoId === activeVideoId)
  const currentVideoId = activePlaylistVideo?.videoId ?? playlistVideos[0]?.videoId ?? youtubePlaylistMap[program.slug]?.videoId
  const currentPoster = activePlaylistVideo?.thumbnail ?? playlistVideos[0]?.thumbnail ?? program.image

  const isAnimeRamen = program.id === 'animes-y-ramen'
  const [activeKawaiiReaction, setActiveKawaiiReaction] = useState<string | null>(null)
  const [kawaiiReactionMessage, setKawaiiReactionMessage] = useState<string | null>(null)

  const triggerKawaiiReaction = (name: string, emoji: string, message: string) => {
    setActiveKawaiiReaction(name)
    setKawaiiReactionMessage(`${emoji} ${message}`)
    setTimeout(() => {
      setActiveKawaiiReaction(null)
      setKawaiiReactionMessage(null)
    }, 2800)
  }

  if (showIntro) {
    return <ProgramLoadingScreen isVisible={true} program={program} theme={theme} />
  }

  return (
    <div
      className={`program-theme-shell ${theme.textureClass} min-h-screen bg-ninja-black text-white pt-28 pb-20 relative overflow-hidden`}
      style={{
        '--program-primary': theme.primary,
        '--program-secondary': theme.secondary,
        '--program-accent': theme.accent,
        background: isAnimeRamen
          ? `linear-gradient(180deg, #100b18 0%, rgba(198,162,230,0.18) 35%, rgba(242,173,209,0.12) 68%, #0a0710 100%)`
          : `linear-gradient(180deg, #151515 0%, ${theme.secondary}22 48%, #0b0b0b 100%)`,
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
      <div
        className="program-ambient-line absolute left-0 top-36 h-px w-full pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}88, transparent)` }}
      />

      {/* Floating Kawaii Reaction Toast Banner */}
      <AnimatePresence>
        {kawaiiReactionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#C6A2E6] text-[#050505] font-display font-black text-sm border-2 border-[#050505] shadow-[4px_4px_0px_#050505] flex items-center gap-2"
          >
            <span>{kawaiiReactionMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Back navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate('/programas')}
            className="flex items-center gap-2 text-white/50 hover:text-white font-display text-sm font-bold group cursor-pointer"
          >
            <span className="group-hover:text-white transition-colors" style={{ color: theme.primary }}>←</span>
            <span>Ver todos los programas</span>
          </button>

          {/* Special Kawaii Mini-Sticker Bar for Animes y Ramen */}
          {isAnimeRamen && (
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="px-3 py-1 rounded-full text-[11px] font-display font-black bg-[#C6A2E6]/20 text-[#C6A2E6] border border-[#C6A2E6]/40 shadow-sm flex items-center gap-1.5">
                🌸 アニメ & ラーメン
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-display font-black bg-[#F2ADD1]/20 text-[#F2ADD1] border border-[#F2ADD1]/40 shadow-sm flex items-center gap-1.5">
                🍜 SOMMELIER DE RAMEN
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-display font-black bg-[#F1D090]/20 text-[#F1D090] border border-[#F1D090]/40 shadow-sm flex items-center gap-1.5">
                🎧 VIBES OTAKU
              </span>
            </div>
          )}
        </div>

        {/* Hero showcase */}
        <motion.div
          ref={heroShellRef}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className={`rounded-3xl p-8 lg:p-12 mb-10 overflow-hidden relative border flex flex-col lg:flex-row gap-8 items-center ${
            isAnimeRamen ? 'border-2 border-[#050505] shadow-[8px_8px_0px_#050505]' : ''
          }`}
          style={{
            background: isAnimeRamen
              ? 'linear-gradient(135deg, rgba(198,162,230,0.30) 0%, rgba(242,173,209,0.22) 50%, rgba(20,14,28,0.95) 100%)'
              : program.heroVideo ? '#0e0e0e' : theme.gradient,
            borderColor: isAnimeRamen ? '#C6A2E6' : `${theme.primary}44`,
            boxShadow: isAnimeRamen
              ? `0 24px 60px rgba(0,0,0,0.6), 0 0 50px rgba(198,162,230,0.2), inset 0 2px 0 rgba(255,255,255,0.15)`
              : `0 24px 55px rgba(0,0,0,0.64), inset 0 1px 0 rgba(255,255,255,0.06)`
          }}
        >
          {/* Full-bleed video background if available */}
          {program.heroVideo && (
            <>
              <video
                src={program.heroVideo}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-30 scale-105"
              />
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  background: isAnimeRamen
                    ? 'linear-gradient(135deg, rgba(16,11,24,0.96) 0%, rgba(16,11,24,0.85) 50%, rgba(16,11,24,0.60) 100%)'
                    : 'linear-gradient(135deg, rgba(14,14,14,0.96) 0%, rgba(14,14,14,0.84) 50%, rgba(14,14,14,0.55) 100%)'
                }}
              />
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 75% 30%, ${theme.primary}30 0%, transparent 65%)`
                }}
              />
            </>
          )}

          <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: `linear-gradient(0deg, ${theme.primary}16, transparent)` }}
          />
          <ProgramMotifs programId={program.id} theme={theme} variant="compact" />

          {/* Show Image / Video Poster */}
          <motion.div
            ref={heroPosterRef}
            className={`program-hero-poster relative w-full max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl bg-black ${
              isAnimeRamen ? 'border-2 border-[#050505] shadow-[6px_6px_0px_#050505]' : 'border border-white/15'
            }`}
            whileHover={{ y: -6, rotate: -0.8 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            style={{ boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 42px ${theme.primary}26` }}
          >
            {program.heroVideo ? (
              <video
                src={program.heroVideo}
                poster={program.image}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={program.image} 
                alt={program.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between">
              <span
                className="inline-flex rounded-full px-3 py-1 text-[10px] font-display font-black uppercase tracking-widest"
                style={{ backgroundColor: `${theme.primary}30`, color: theme.ink, border: `1px solid ${theme.primary}75` }}
              >
                {theme.visualTags[0]}
              </span>
              {program.heroVideo && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-display font-black text-white border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  PREVIEW
                </span>
              )}
            </div>
          </motion.div>

          {/* Info Details */}
          <div ref={heroCopyRef} className="program-hero-copy flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 w-full">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <motion.span 
                className={`px-3.5 py-1.5 rounded-full text-xs font-display font-black tracking-wider shadow-lg ${
                  isAnimeRamen ? 'bg-[#C6A2E6] text-[#050505] border border-[#050505]' : statusCfg.bg
                }`}
                animate={statusCfg.pulse ? { scale: [1, 1.04, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {statusCfg.label}
              </motion.span>

              {currentStatus !== 'live' && (
                <span className={`px-3 py-1 rounded-full text-xs font-display font-semibold tracking-wide ${
                  isAnimeRamen ? 'bg-white/10 border border-[#F2ADD1]/30 text-white' : 'bg-white/5 border border-white/10 text-white'
                }`}>
                  ⏰ Emisión: <span style={{ color: theme.primary }} className="font-bold">{countdown}</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {theme.visualTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-[10px] font-display font-black uppercase tracking-widest"
                  style={{
                    backgroundColor: isAnimeRamen ? '#F2ADD125' : `${theme.primary}14`,
                    color: isAnimeRamen ? '#FFFFFF' : theme.ink,
                    border: isAnimeRamen ? '1px solid #F2ADD155' : `1px solid ${theme.primary}28`
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 
              className="font-display font-black text-4xl lg:text-5xl tracking-tight leading-tight"
              style={{ textShadow: `0 0 35px ${theme.primary}50` }}
            >
              <span className="text-white">{program.emoji} </span>
              <span style={{ color: theme.primary }}>{program.title}</span>
            </h1>

            <p className="text-white/90 text-lg font-display font-bold leading-snug max-w-2xl text-center lg:text-left">
              {theme.headline}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 font-display font-bold text-sm">
              <span className={`px-3 py-1 rounded-lg border ${
                isAnimeRamen ? 'bg-[#F1D090]/15 border-[#F1D090]/35 text-[#F1D090]' : 'bg-white/5 border-white/10 text-white'
              }`}>
                📅 EMISIÓN: {program.badge}
              </span>
              <span className="text-white/40">a las</span>
              <span
                className="px-3 py-1 rounded-lg"
                style={{ backgroundColor: `${theme.primary}22`, border: `1px solid ${theme.primary}45`, color: theme.ink }}
              >
                ⏰ {program.time}
              </span>
            </div>

            <p className="text-white/70 text-base font-body leading-relaxed max-w-2xl text-center lg:text-left">
              {theme.identity}
            </p>

            <p className="text-white/45 text-sm font-body leading-relaxed max-w-2xl text-center lg:text-left">
              {theme.atmosphere}
            </p>

            {/* Showcase hosts */}
            <div className="flex flex-col gap-2 mt-2 w-full">
              <span className="text-[10px] text-white/35 tracking-[0.2em] font-display font-bold uppercase block text-center lg:text-left">
                {isAnimeRamen ? '🌸 HOSTS DEL DOJO OTAKU' : 'HOSTS DEL SHOW'}
              </span>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {extra.hosts.map((host) => (
                  <div
                    key={host.name}
                    className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left ${
                      isAnimeRamen
                        ? 'bg-[#C6A2E6]/10 border border-[#C6A2E6]/30 shadow-sm'
                        : 'bg-white/5 border border-white/5'
                    }`}
                  >
                    <span className="text-xl bg-white/10 w-9 h-9 rounded-lg flex items-center justify-center">{host.avatar}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-display font-black text-white/95">{host.name}</span>
                      <span className="text-[9.5px] font-body text-white/50">{host.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-white/15 my-2" />

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 w-full">
              <a
                href="https://www.youtube.com/channel/UCF2hgWHhLQx3ZJDsnKU8gZg"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 rounded-xl font-display font-black text-sm transition-all ${
                  isAnimeRamen
                    ? 'bg-[#C6A2E6] text-[#050505] border-2 border-[#050505] shadow-[4px_4px_0px_#050505] hover:bg-[#F2ADD1]'
                    : ''
                }`}
                style={!isAnimeRamen ? { backgroundColor: theme.primary, color: '#070707', boxShadow: `0 0 28px ${theme.primary}30` } : {}}
              >
                {theme.ctaLabel}
              </a>
              <Link
                to="/contacto"
                className={`px-6 py-3 rounded-xl font-display font-bold text-sm transition-all ${
                  isAnimeRamen
                    ? 'bg-[#F2ADD1]/15 hover:bg-[#F2ADD1]/25 border border-[#F2ADD1]/40 text-white'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                }`}
              >
                {theme.sponsorLabel}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════
            DOJO KAWAII & RAMEN BAR (Exclusivo Animes y Ramen)
            ══════════════════════════════════════════════════ */}
        {isAnimeRamen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-14 rounded-3xl p-6 lg:p-8 border-2 border-[#050505] shadow-[6px_6px_0px_#050505]"
            style={{
              background: 'linear-gradient(135deg, rgba(198,162,230,0.18) 0%, rgba(242,173,209,0.14) 50%, rgba(241,208,144,0.10) 100%)',
              borderColor: '#C6A2E6',
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3 text-center md:text-left">
                <span className="text-3xl">🍜</span>
                <div>
                  <h3 className="font-display font-black text-xl text-white flex items-center gap-2 justify-center md:justify-start">
                    <span>Dojo Kawaii & Ramen Bar</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#F2ADD1] text-[#050505] font-black">
                      8-BIT VIBES
                    </span>
                  </h3>
                  <p className="text-white/60 font-body text-xs">
                    Interacciones y menú oficial de la comunidad otaku de Animes y Ramen.
                  </p>
                </div>
              </div>

              {/* 8-bit Soundboard / Kawaii reactions */}
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { name: 'sakura', icon: '🌸', label: 'Sakura', msg: '¡Lluvia de pétalos de sakura!' },
                  { name: 'ramen', icon: '🍜', label: 'Ramen', msg: '¡Ordenando tazón de ramen extra!' },
                  { name: 'lofi', icon: '🎧', label: 'Lo-Fi', msg: '¡Modo Lo-Fi Anime activado!' },
                  { name: 'nya', icon: '🐱', label: 'Nya~', msg: '¡Nya kawaii desu ne!' },
                  { name: 'onigiri', icon: '🍙', label: 'Onigiri', msg: '¡Poder Otaku al 100%!' },
                ].map((btn) => (
                  <button
                    key={btn.name}
                    onClick={() => triggerKawaiiReaction(btn.name, btn.icon, btn.msg)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-display font-black text-xs transition-all cursor-pointer ${
                      activeKawaiiReaction === btn.name
                        ? 'bg-[#F2ADD1] text-[#050505] scale-105 border-2 border-[#050505]'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                    }`}
                  >
                    <span>{btn.icon}</span>
                    <span>{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Menú Otaku Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  emoji: '🍜',
                  title: 'Tonkotsu Ramen Chashu',
                  desc: 'Caldo de cerdo cocido 18h, fideos firmes, ajitsuke tamago y narutomaki.',
                  badge: 'PLATO ESTRELLA',
                  color: '#C6A2E6',
                },
                {
                  emoji: '🧋',
                  title: 'Boba Tea Taro Kawaii',
                  desc: 'Té de taro cremoso con perlas de tapioca negra y leche condensada.',
                  badge: '100% DULCE',
                  color: '#F2ADD1',
                },
                {
                  emoji: '🍡',
                  title: 'Dango Tricolor Kioto',
                  desc: 'Mochi artesanal de arroz al vapor con flor de sakura, vainilla y matcha.',
                  badge: 'TRADICIONAL',
                  color: '#F1D090',
                },
                {
                  emoji: '🐟',
                  title: 'Taiyaki de Chocolate',
                  desc: 'Waffle japonés crujiente en forma de pez relleno de chocolate caliente.',
                  badge: 'SNACK CRUJIENTE',
                  color: '#C6A2E6',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between gap-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.emoji}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-display font-black tracking-widest uppercase"
                      style={{ backgroundColor: `${item.color}25`, color: item.color, border: `1px solid ${item.color}45` }}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-black text-sm text-white">{item.title}</h4>
                    <p className="text-white/50 text-[11px] font-body mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

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
                      href={`https://www.youtube.com/playlist?list=${youtubePlaylistMap[program.slug]?.playlistId}`}
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
        <div className="border-t border-white/10 pt-12 text-left">
          <h3 className="font-display font-black text-xl text-white mb-8 uppercase tracking-widest">
            Otros Programas Relacionados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPrograms.map((related) => {
              const programUrlId = related.title.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
              return (
                <Link 
                  key={related.id} 
                  to={`/programa/${programUrlId}`}
                  className="ninja-card p-5 border border-white/5 hover:border-white/15 transition-all group flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center">
                    <span style={{ color: related.color }} className="text-[10px] font-display font-black tracking-wider uppercase">
                      {related.day}
                    </span>
                    <span className="text-xl">{related.emoji}</span>
                  </div>
                  <h4 className="font-display font-black text-base text-white group-hover:text-ninja-green transition-colors">
                    {related.title}
                  </h4>
                  <p className="text-white/40 text-xs font-body leading-relaxed line-clamp-2">
                    {related.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

