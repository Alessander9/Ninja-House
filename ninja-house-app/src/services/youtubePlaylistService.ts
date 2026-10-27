/**
 * youtubePlaylistService.ts
 * Servicio optimizado para obtener automáticamente en tiempo real los episodios y miniaturas
 * de cada programa desde los feeds oficiales de YouTube y playlists de Ninja House.
 */

export interface YouTubeEpisode {
  id: string
  videoId: string
  title: string
  thumbnail: string
  duration: string
  views: string
  date: string
  publishedAt?: number
  link: string
}

export interface YouTubePlaylistConfig {
  videoId: string
  playlistId: string
  playlistUrl?: string
  defaultVideos: YouTubeEpisode[]
}

import programsPlaylistsData from '../data/programsPlaylists.json'

export const youtubePlaylistMap: Record<string, YouTubePlaylistConfig> = {
  ...(programsPlaylistsData as unknown as Record<string, YouTubePlaylistConfig>),
}

// Aliases garantizados para todas las variantes de rutas
youtubePlaylistMap['el-plano-oscuro'] = youtubePlaylistMap['plan-oscuro']
youtubePlaylistMap['el-lado-oscuro'] = youtubePlaylistMap['plan-oscuro']
youtubePlaylistMap['frikis-de-m'] = youtubePlaylistMap['frikisdem']
youtubePlaylistMap['freakuencia-m'] = youtubePlaylistMap['frikisdem']
youtubePlaylistMap['over-head'] = youtubePlaylistMap['overhead']

/**
 * Múltiples proxys CORS para garantizar 100% de disponibilidad al consultar feeds de YouTube
 */
const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
]

function formatPublishDate(publishedStr: string): string {
  if (!publishedStr) return 'Reciente'
  try {
    const pubDate = new Date(publishedStr)
    const diffTime = Math.abs(Date.now() - pubDate.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 1) return 'Hoy'
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return weeks === 1 ? 'Hace 1 semana' : `Hace ${weeks} semanas`
    }
    const months = Math.floor(diffDays / 30)
    return months === 1 ? 'Hace 1 mes' : `Hace ${months} meses`
  } catch {
    return 'Reciente'
  }
}

/**
 * Parsea el XML RSS de YouTube y genera la lista de episodios con miniaturas de alta calidad
 */
function parseYouTubeRss(xmlText: string): YouTubeEpisode[] {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
  const entries = xmlDoc.getElementsByTagName('entry')

  if (!entries || entries.length === 0) return []

  const episodes: YouTubeEpisode[] = []

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const videoId = entry.getElementsByTagName('yt:videoId')[0]?.textContent?.trim() || ''
    if (!videoId) continue

    const title = entry.getElementsByTagName('title')[0]?.textContent?.trim() || 'Episodio Ninja House'
    const publishedStr = entry.getElementsByTagName('published')[0]?.textContent?.trim() || ''
    
    // Thumbnail de alta resolución automática
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

    // Vistas si están disponibles en el feed
    let views = 'En vivo'
    const mediaStats = entry.getElementsByTagName('media:statistics')[0]
    if (mediaStats) {
      const viewsCount = parseInt(mediaStats.getAttribute('views') || '0', 10)
      if (viewsCount > 0) {
        views = viewsCount >= 1000 ? `${(viewsCount / 1000).toFixed(1)}K vistas` : `${viewsCount} vistas`
      }
    }

    episodes.push({
      id: videoId,
      videoId,
      title,
      thumbnail,
      duration: 'Episodio',
      views,
      date: formatPublishDate(publishedStr),
      publishedAt: publishedStr ? new Date(publishedStr).getTime() : Date.now() - i * 86400000,
      link: `https://www.youtube.com/watch?v=${videoId}`
    })
  }

  return episodes.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
}

/**
 * Consulta en tiempo real los episodios de YouTube con cascade fallback resiliente
 */
export async function fetchLiveEpisodes(programSlug: string): Promise<YouTubeEpisode[]> {
  const playlistInfo = youtubePlaylistMap[programSlug]
  if (!playlistInfo) return []

  const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistInfo.playlistId}`

  // 1. Intentar endpoint proxy local primero (Vite dev server o proxy local rápido)
  try {
    const localProxyUrl = `/api/youtube-feed?playlist_id=${playlistInfo.playlistId}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)
    const response = await fetch(localProxyUrl, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (response.ok) {
      const text = await response.text()
      const episodes = parseYouTubeRss(text)
      if (episodes.length > 0) {
        return episodes
      }
    }
  } catch {
    // Si no está disponible el proxy local, continuar con proxys públicos
  }

  // 2. Intentar con la lista de proxys en cascada
  for (const proxyGen of CORS_PROXIES) {
    try {
      const proxyUrl = proxyGen(rssUrl)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(proxyUrl, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (!response.ok) continue

      const text = await response.text()
      const episodes = parseYouTubeRss(text)

      if (episodes.length > 0) {
        return episodes
      }
    } catch {
      // Continuar con el siguiente proxy en caso de fallo
      continue
    }
  }

  // Fallback garantizado: lista de episodios reales pre-sincronizados con miniaturas oficiales de YouTube
  return playlistInfo.defaultVideos
}
