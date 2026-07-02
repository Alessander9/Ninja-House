import { useParams, useNavigate, Link } from 'react-router-dom'
import { programsData } from '../../data/programs'
import { scheduleData, getSmartStatus } from '../../data/schedule'
import { fallbackProgramTheme, programThemes } from '../../data/programThemes'
import { ProgramMotifs } from './ProgramMotifs'
import { ProgramLoadingScreen } from './ProgramLoadingScreen'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from 'gsap'

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

type PlaylistVideo = {
  id: string
  videoId: string
  title: string
  thumbnail: string
  duration: string
  views: string
  date: string
  publishedAt?: number
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
  /*,
  'lanzalo': {
    hosts: [
      { name: 'Goncho Iglesias', role: 'Dungeon Master y Narrador de Historias', avatar: '🎲' },
      { name: 'Luciana Roy', role: 'Jugadora - Elfa Exploradora', avatar: '🧝‍♀️' },
      { name: 'JeanPhil', role: 'Jugador - Mago Humano', avatar: '🧙‍♂️' },
      { name: 'Jose Klauer', role: 'Jugador - Enano Bárbaro', avatar: '🏹' },
      { name: 'Gonzalo Heredia', role: 'Jugador - Paladín Humano', avatar: '⚔️' }
    ],
    faqs: [
      { q: '¿Cómo influye el público en la partida de rol?', a: 'El chat puede votar decisiones críticas, decidir el destino de algunas tiradas de dados e interactuar en vivo con los jugadores.' },
      { q: '¿Necesito saber jugar Calabozos y Dragones para ver el show?', a: 'Para nada. Está diseñado para ser entretenido, cómico e inmersivo, ideal para principiantes y veteranos por igual.' }
    ],
    episodes: [
      { id: 'lz-1', title: 'Episodio 12: La caída del templo de fuego y la traición del bardo', duration: '2h 15m', views: '8.4K views', date: 'Hace 3 días' },
      { id: 'lz-2', title: 'Episodio 11: Combate extremo contra la Quimera del pantano', duration: '2h 02m', views: '9.2K views', date: 'Hace 1 semana' },
      { id: 'lz-3', title: 'Episodio 10: Infiltración en la guarida de los goblins nocturnos', duration: '2h 30m', views: '11.5K views', date: 'Hace 2 semanas' }
    ],
    chatMessages: [
      '¡Que tiren dados para iniciativa ya!',
      '¡Luciana salvaste al grupo entero!',
      'Goncho es un Master de Rol increíble, qué voz',
      '¡Ese crítico de 20 en el dado fue espectacular!',
      '¿JeanPhil usará magia de fuego otra vez?',
      'Bárbaro enojado supremacy 🏹',
      '¿Se morirá algún personaje hoy en la transmisión?'
    ]
  }
  */
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

const youtubePlaylistMap: Record<string, { videoId: string; playlistId: string }> = {
  'animes-y-ramen': {
    videoId: 'MfGF4qEWPfo',
    playlistId: 'PLgJo52LEdumEV68Jtlh6yb85qpnkWTiu9'
  },
  'overhead': {
    videoId: 'GE65nGF7nro',
    playlistId: 'PLgJo52LEdumHAeSzH3v4FvJ9hhNckyNwh'
  },
  'freakuencia-m': {
    videoId: '9VoUqGLVP7o',
    playlistId: 'PLgJo52LEdumFciDx_fFD5gBXAgdsgeqsm'
  },
  'maldito-plastico': {
    videoId: '3D0tgWkWElY',
    playlistId: 'PLgJo52LEdumGIauQLoowiu1Z_-1ecRPWO'
  },
  'cine-infarto': {
    videoId: 'zCrhYqLR3lI',
    playlistId: 'PLgJo52LEdumGeZB-gvWDRNOKCEvAo9cBd'
  }
}

function buildLocalPlaylist(programSlug: string, extra: ShowExtraData): PlaylistVideo[] {
  const playlistInfo = youtubePlaylistMap[programSlug]
  if (!playlistInfo) return []

  return extra.episodes.map((ep, idx) => ({
    id: `local-${programSlug}-${idx}`,
    videoId: playlistInfo.videoId,
    title: ep.title,
    thumbnail: `https://i.ytimg.com/vi/${playlistInfo.videoId}/hqdefault.jpg`,
    duration: ep.duration,
    views: ep.views,
    date: ep.date,
    publishedAt: Date.now() - idx * 86400000,
  }))
}

function readCachedPlaylist(programSlug: string, fallbackVideoId: string): PlaylistVideo[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(`${PLAYLIST_CACHE_PREFIX}${programSlug}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { ts: number; videos: PlaylistVideo[] }
    if (!parsed?.ts || !Array.isArray(parsed.videos)) return null
    if (Date.now() - parsed.ts > PLAYLIST_CACHE_TTL) return null
    return parsed.videos.map((video) => ({
      ...video,
      videoId: video.videoId || (video.id.startsWith('static-') || video.id.startsWith('local-') ? fallbackVideoId : video.id),
    }))
  } catch {
    return null
  }
}

function writeCachedPlaylist(programSlug: string, videos: PlaylistVideo[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      `${PLAYLIST_CACHE_PREFIX}${programSlug}`,
      JSON.stringify({ ts: Date.now(), videos })
    )
  } catch {
    // Ignore storage failures and keep rendering the local fallback.
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
  const [playlistVideos, setPlaylistVideos] = useState<PlaylistVideo[]>([])
  const [isLoadingFeed, setIsLoadingFeed] = useState(false)
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

  useEffect(() => {
    if (!program || !extra) return

    const localVideos = buildLocalPlaylist(program.slug, extra)
    const cachedVideos = readCachedPlaylist(program.slug, youtubePlaylistMap[program.slug]?.videoId ?? '')

    setPlaylistVideos(cachedVideos?.length ? cachedVideos : localVideos)
    setActiveVideoId((cachedVideos?.[0] ?? localVideos[0])?.videoId ?? null)
    setIsLoadingFeed(false)
  }, [program, extra])

  // Fetch real-time YouTube playlist episodes via CORS proxy
  useEffect(() => {
    if (!program) return;
    const playlistInfo = youtubePlaylistMap[program.slug];
    if (!playlistInfo) {
      setIsLoadingFeed(false);
      return;
    }

    const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistInfo.playlistId}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
    const controller = new AbortController();
    let cancelled = false;

    fetch(proxyUrl)
      .then(res => {
        if (!res.ok) throw new Error("CORS Proxy error");
        return res.text();
      })
      .then(xmlText => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const entries = xmlDoc.getElementsByTagName("entry");
        
        if (entries.length === 0) throw new Error("No entries found in RSS feed");

        const episodes = Array.from(entries).map((entry) => {
          const videoId = entry.getElementsByTagName("yt:videoId")[0]?.textContent || "";
          const title = entry.getElementsByTagName("title")[0]?.textContent || "";
          const publishedStr = entry.getElementsByTagName("published")[0]?.textContent || "";
          
          const mediaGroup = entry.getElementsByTagName("media:group")[0];
          let thumbnail = "";
          if (mediaGroup) {
            const mediaThumbnail = mediaGroup.getElementsByTagName("media:thumbnail")[0];
            thumbnail = mediaThumbnail?.getAttribute("url") || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
          } else {
            thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
          }
          
          let views = "";
          const mediaStats = entry.getElementsByTagName("media:statistics")[0];
          if (mediaStats) {
            const viewsCount = parseInt(mediaStats.getAttribute("views") || "0", 10);
            views = viewsCount >= 1000 ? `${(viewsCount / 1000).toFixed(1)}K vistas` : `${viewsCount} vistas`;
          } else {
            views = "Vistas en vivo";
          }

          let dateText = "Reciente";
          if (publishedStr) {
            const pubDate = new Date(publishedStr);
            const diffTime = Math.abs(new Date().getTime() - pubDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < 1) {
              dateText = "Hoy";
            } else if (diffDays === 1) {
              dateText = "Ayer";
            } else if (diffDays < 7) {
              dateText = `Hace ${diffDays} días`;
            } else if (diffDays < 30) {
              const weeks = Math.floor(diffDays / 7);
              dateText = weeks === 1 ? "Hace 1 semana" : `Hace ${weeks} semanas`;
            } else {
              const months = Math.floor(diffDays / 30);
              dateText = months === 1 ? "Hace 1 mes" : `Hace ${months} meses`;
            }
          }

          return {
            id: videoId,
            title,
            thumbnail,
            duration: "Episodio",
            views,
            date: dateText,
            publishedAt: publishedStr ? new Date(publishedStr).getTime() : undefined,
          };
        });

        if (cancelled) return
        const normalizedEpisodes = episodes.map((episode) => ({
          ...episode,
          videoId: episode.id,
          publishedAt: episode.publishedAt,
        }))
        normalizedEpisodes.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
        setPlaylistVideos(normalizedEpisodes);
        setActiveVideoId(normalizedEpisodes[0]?.videoId || playlistInfo.videoId);
        writeCachedPlaylist(program.slug, normalizedEpisodes);
        setIsLoadingFeed(false);
      })
      .catch(err => {
        console.warn("Fallback to static episodes:", err);
        if (cancelled) return
        const staticEpisodes = buildLocalPlaylist(program.slug, extra)
        setPlaylistVideos(staticEpisodes)
        setActiveVideoId(staticEpisodes[0]?.videoId || playlistInfo.videoId)
        writeCachedPlaylist(program.slug, staticEpisodes)
        setIsLoadingFeed(false)
      });
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [id, program, extra]);

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
        background: `linear-gradient(180deg, #151515 0%, ${theme.secondary}22 48%, #0b0b0b 100%)`,
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

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate('/programas')}
          className="flex items-center gap-2 text-white/50 hover:text-white font-display text-sm font-bold mb-8 group cursor-pointer"
        >
          <span className="group-hover:text-white transition-colors" style={{ color: theme.primary }}>←</span>
          <span>Ver todos los programas</span>
        </button>

        {/* Hero showcase */}
        <motion.div
          ref={heroShellRef}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="rounded-3xl p-8 lg:p-12 mb-10 overflow-hidden relative border flex flex-col lg:flex-row gap-8 items-center"
          style={{
            background: theme.gradient,
            borderColor: `${theme.primary}44`,
            boxShadow: `0 24px 55px rgba(0,0,0,0.64), inset 0 1px 0 rgba(255,255,255,0.06)`
          }}
          >
          <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: `linear-gradient(0deg, ${theme.primary}16, transparent)` }}
          />
          <ProgramMotifs programId={program.id} theme={theme} variant="compact" />

          {/* Show Image Poster */}
          <motion.div
            ref={heroPosterRef}
            className="program-hero-poster relative w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl"
            whileHover={{ y: -6, rotate: -0.8 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            style={{ boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 42px ${theme.primary}26` }}
          >
            <img 
              src={program.image} 
              alt={program.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <span
                className="inline-flex rounded-full px-3 py-1 text-[10px] font-display font-black uppercase tracking-widest"
                style={{ backgroundColor: `${theme.primary}22`, color: theme.ink, border: `1px solid ${theme.primary}55` }}
              >
                {theme.visualTags[0]}
              </span>
            </div>
          </motion.div>

          {/* Info Details */}
          <div ref={heroCopyRef} className="program-hero-copy flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 w-full">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <motion.span 
                className={`px-3 py-1 rounded-full text-xs font-display font-black tracking-wider shadow-lg ${statusCfg.bg}`}
                animate={statusCfg.pulse ? { scale: [1, 1.04, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {statusCfg.label}
              </motion.span>

              {currentStatus !== 'live' && (
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-display font-semibold tracking-wide">
                  ⏰ Emisión: <span style={{ color: theme.primary }} className="font-bold">{countdown}</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {theme.visualTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-[10px] font-display font-black uppercase tracking-widest"
                  style={{ backgroundColor: `${theme.primary}14`, color: theme.ink, border: `1px solid ${theme.primary}28` }}
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

            <p className="text-white/85 text-lg font-display font-bold leading-snug max-w-2xl text-center lg:text-left">
              {theme.headline}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 font-display font-bold text-sm">
              <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                📅 EMISIÓN: {program.badge}
              </span>
              <span className="text-white/40">a las</span>
              <span
                className="px-3 py-1 rounded-lg"
                style={{ backgroundColor: `${theme.primary}14`, border: `1px solid ${theme.primary}38`, color: theme.ink }}
              >
                ⏰ {program.time}
              </span>
            </div>

            <p className="text-white/60 text-base font-body leading-relaxed max-w-2xl text-center lg:text-left">
              {theme.identity}
            </p>

            <p className="text-white/38 text-sm font-body leading-relaxed max-w-2xl text-center lg:text-left">
              {theme.atmosphere}
            </p>

            {/* Showcase hosts */}
            <div className="flex flex-col gap-2 mt-2 w-full">
              <span className="text-[10px] text-white/30 tracking-[0.2em] font-display font-bold uppercase block text-center lg:text-left">HOSTS DEL SHOW</span>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {extra.hosts.map((host) => (
                  <div key={host.name} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-left">
                    <span className="text-xl bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center">{host.avatar}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-display font-black text-white/90">{host.name}</span>
                      <span className="text-[9px] font-body text-white/40">{host.role}</span>
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
                className="px-6 py-3 rounded-xl font-display font-black text-sm transition-all"
                style={{ backgroundColor: theme.primary, color: '#070707', boxShadow: `0 0 28px ${theme.primary}30` }}
              >
                {theme.ctaLabel}
              </a>
              <Link
                to="/invierte"
                className="px-6 py-3 rounded-xl font-display font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white"
              >
                {theme.sponsorLabel}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════
            REPRODUCTOR DE EPISODIOS — PREMIUM LAYOUT
            ══════════════════════════════════════════════════ */}
        <div className="mb-16">

          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-1 h-6 rounded-full"
                style={{ background: `linear-gradient(to bottom, ${theme.primary}, ${theme.primary}60)` }}
              />
              <h3 className="font-display font-black text-lg text-white tracking-widest uppercase">
                Reproductor de Episodios
              </h3>
            </div>
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

          {/* Main player + sidebar grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

            {/* ── Left: Video Player ── */}
            <div className="flex flex-col gap-0">
              
              {/* Player container */}
              <div
                className="relative w-full aspect-video rounded-t-2xl overflow-hidden group shadow-2xl"
                style={{
                  boxShadow: `0 0 0 1px ${theme.primary}20, 0 25px 50px rgba(0,0,0,0.7), 0 0 80px ${theme.primary}10`
                }}
              >
                {isPlaying && currentVideoId ? (
                  <div className="relative w-full h-full bg-black">
                    <img
                      src={currentPoster}
                      alt={program.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
                    <iframe
                      src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1`}
                      title={program.title}
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
                      alt="Thumbnail"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                      className="absolute top-0 left-0 w-16 h-16 opacity-60"
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
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                      <div className="flex flex-col gap-1 max-w-[70%]">
                        <span
                          className="text-[9px] font-display font-black tracking-[0.2em] uppercase"
                          style={{ color: theme.primary }}
                        >
                          {isLoadingFeed ? 'Cargando...' : 'Episodio más reciente'}
                        </span>
                        <p className="text-white font-display font-bold text-sm leading-snug line-clamp-2">
                          {activePlaylistVideo?.title || playlistVideos[0]?.title || program.title}
                        </p>
                      </div>
                      <motion.div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-black text-[10px] tracking-wider"
                        style={{ backgroundColor: theme.primary, color: '#0a0a0a' }}
                        animate={{ opacity: [1, 0.75, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5.14v14l11-7-11-7z"/>
                        </svg>
                        VER AHORA
                      </motion.div>
                    </div>
                  </>
                )}
              </div>

              {/* Video meta bar below player */}
              {!isPlaying && (
                <div
                  className="rounded-b-2xl px-5 py-3 flex items-center justify-between"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}12, rgba(20,20,20,0.95))`,
                    border: `1px solid ${theme.primary}20`,
                    borderTop: 'none'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                      style={{ backgroundColor: `${theme.primary}20`, border: `1px solid ${theme.primary}40` }}
                    >
                      {program.emoji}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-display font-black text-white/30 tracking-widest uppercase">
                        {program.title}
                      </span>
                      <span className="text-[10px] font-display font-semibold text-white/50">
                        {playlistVideos[0]?.date || 'Cargando...'}
                        {playlistVideos[0]?.views && ` · ${playlistVideos[0].views}`}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideoId || playlistVideos[0]?.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-display font-bold text-white/30 hover:text-white/70 transition-colors flex items-center gap-1"
                  >
                    Ver en YouTube
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15,3 21,3 21,9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>
              )}
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
                  Episodios
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
                <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '440px' }}>
                  
                  {/* Loading skeleton */}
                  {isLoadingFeed && (
                    <div className="flex flex-col gap-0">
                      {[1, 2, 3].map(i => (
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

                  {/* Most recent episode (index 0) — always shown at top */}
                  {!isLoadingFeed && playlistVideos[0] && (
                    <motion.button
                      onClick={() => { setActiveVideoId(playlistVideos[0].videoId); setIsPlaying(true); }}
                      className={`flex gap-3 p-3 text-left w-full transition-all border-b border-white/5 cursor-pointer group ${
                        activeVideoId === playlistVideos[0].videoId
                          ? 'bg-white/5'
                          : 'hover:bg-white/[0.03]'
                      }`}
                      whileHover={{ x: 2 }}
                    >
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0 w-24 h-[54px] rounded-lg overflow-hidden">
                        <img
                          src={playlistVideos[0].thumbnail}
                          alt={playlistVideos[0].title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        {activeVideoId === playlistVideos[0].videoId && isPlaying ? (
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ backgroundColor: `${theme.primary}80` }}
                          >
                            <motion.div className="flex gap-0.5 items-end h-4">
                              {[1,2,3].map(b => (
                                <motion.div
                                  key={b}
                                  className="w-1 rounded-full"
                                  style={{ backgroundColor: '#fff' }}
                                  animate={{ height: ['30%', '100%', '30%'] }}
                                  transition={{ duration: 0.8, repeat: Infinity, delay: b * 0.15 }}
                                />
                              ))}
                            </motion.div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <svg className="opacity-0 group-hover:opacity-100 transition-opacity" width="20" height="20" viewBox="0 0 24 24" fill="white">
                              <path d="M8 5.14v14l11-7-11-7z"/>
                            </svg>
                          </div>
                        )}
                        {/* NEW badge */}
                        <div
                          className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-display font-black"
                          style={{ backgroundColor: theme.primary, color: '#0a0a0a' }}
                        >
                          NUEVO
                        </div>
                      </div>
                      {/* Info */}
                      <div className="flex flex-col gap-1 justify-center flex-1 min-w-0">
                        <p className="text-white/90 font-display font-bold text-[11px] leading-snug line-clamp-2 group-hover:text-white transition-colors">
                          {playlistVideos[0].title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-display text-white/35">{playlistVideos[0].date}</span>
                          {playlistVideos[0].views && (
                            <>
                              <span className="text-white/15">·</span>
                              <span className="text-[9px] font-display text-white/35">{playlistVideos[0].views}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  )}

                  {/* Previous episodes (index 1-3) */}
                  {!isLoadingFeed && playlistVideos.slice(1, 4).map((ep, idx) => (
                    <motion.button
                      key={ep.id}
                      onClick={() => { setActiveVideoId(ep.videoId); setIsPlaying(true); }}
                      className={`flex gap-3 p-3 text-left w-full transition-all cursor-pointer group ${
                        idx < 2 ? 'border-b border-white/5' : ''
                      } ${
                        activeVideoId === ep.videoId
                          ? 'bg-white/5'
                          : 'hover:bg-white/[0.03]'
                      }`}
                      whileHover={{ x: 2 }}
                    >
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0 w-24 h-[54px] rounded-lg overflow-hidden">
                        <img
                          src={ep.thumbnail}
                          alt={ep.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${ep.id}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        {activeVideoId === ep.videoId && isPlaying ? (
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ backgroundColor: `${theme.primary}80` }}
                          >
                            <motion.div className="flex gap-0.5 items-end h-4">
                              {[1,2,3].map(b => (
                                <motion.div
                                  key={b}
                                  className="w-1 rounded-full"
                                  style={{ backgroundColor: '#fff' }}
                                  animate={{ height: ['30%', '100%', '30%'] }}
                                  transition={{ duration: 0.8, repeat: Infinity, delay: b * 0.15 }}
                                />
                              ))}
                            </motion.div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <svg className="opacity-0 group-hover:opacity-100 transition-opacity" width="20" height="20" viewBox="0 0 24 24" fill="white">
                              <path d="M8 5.14v14l11-7-11-7z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex flex-col gap-1 justify-center flex-1 min-w-0">
                        <p className={`font-display font-bold text-[11px] leading-snug line-clamp-2 transition-colors ${
                          activeVideoId === ep.videoId ? 'text-white' : 'text-white/70 group-hover:text-white/90'
                        }`}>
                          {ep.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-display text-white/35">{ep.date}</span>
                          {ep.views && (
                            <>
                              <span className="text-white/15">·</span>
                              <span className="text-[9px] font-display text-white/35">{ep.views}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {/* Active indicator */}
                      {activeVideoId === ep.videoId && (
                        <div
                          className="w-0.5 self-stretch rounded-full flex-shrink-0"
                          style={{ backgroundColor: theme.primary }}
                        />
                      )}
                    </motion.button>
                  ))}

                  {/* Footer link to full playlist */}
                  {!isLoadingFeed && playlistVideos.length > 0 && (
                    <a
                      href={`https://www.youtube.com/playlist?list=${youtubePlaylistMap[program.slug]?.playlistId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3 text-[10px] font-display font-bold text-white/25 hover:text-white/60 transition-colors border-t border-white/5 cursor-pointer"
                    >
                      Ver toda la playlist en YouTube
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
            to="/invierte"
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

