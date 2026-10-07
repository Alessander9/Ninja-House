/**
 * socialMetricsService.ts
 * Servicio cliente para mantener las métricas de redes sociales siempre actualizadas
 * en tiempo real desde el navegador.
 */

import { metricsData, globalMetrics, type Metric } from '../data/metrics'

const METRICS_CACHE_KEY = 'ninja_social_metrics_cache_v1'
const CACHE_TTL = 1000 * 60 * 30 // 30 minutos

export interface SocialMetricsPayload {
  metrics: Metric[]
  globalMetrics: typeof globalMetrics
  lastUpdated: string
}

/**
 * Lee las métricas cacheadas en localStorage
 */
export function getCachedSocialMetrics(): SocialMetricsPayload | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(METRICS_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { ts: number; data: SocialMetricsPayload }
    if (!parsed || !parsed.ts || !parsed.data) return null
    // Si la caché aún es fresca (menor a 30m)
    if (Date.now() - parsed.ts < CACHE_TTL) {
      return parsed.data
    }
    return parsed.data // Retornar para render inmediato aunque luego se refresque
  } catch {
    return null
  }
}

/**
 * Guarda las métricas en caché local
 */
export function setCachedSocialMetrics(data: SocialMetricsPayload): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      METRICS_CACHE_KEY,
      JSON.stringify({ ts: Date.now(), data })
    )
  } catch {
    // Ignorar errores de quota de localStorage
  }
}

/**
 * Realiza una consulta asíncrona a proxies públicos para obtener datos frescos de YouTube
 */
export async function fetchLiveSocialMetrics(): Promise<SocialMetricsPayload> {
  const currentMetrics = [...metricsData]
  let hasUpdates = false

  try {
    // Consultar suscriptores de YouTube a través de proxy ligero
    const targetUrl = encodeURIComponent('https://www.youtube.com/@NinjaHouseShow')
    const proxyUrl = `https://api.allorigins.win/raw?url=${targetUrl}`
    
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) })
    if (res.ok) {
      const html = await res.text()
      const subMatch = html.match(/"text":\{"content":"([\d.,\s\u00a0\u202f]+(?:k|m|mil|millones)?\s*(?:suscriptores|subscribers))"\}/i) ||
                       html.match(/"content":"([\d.,\s\u00a0\u202f]+(?:k|m|mil|millones)?\s*(?:suscriptores|subscribers))"/i) ||
                       html.match(/([\d.,\s\u00a0\u202f]+(?:k|m|mil)?\s*suscriptores)/i)
      
      if (subMatch && subMatch[1]) {
        const raw = subMatch[1].replace(/[\u00a0\u202f]/g, ' ').toLowerCase()
        let count = 0
        if (raw.includes('k') || raw.includes('mil')) {
          const num = parseFloat(raw.replace(/[^\d.,]/g, '').replace(',', '.'))
          count = Math.round(num * 1000)
        } else if (raw.includes('m') || raw.includes('millón') || raw.includes('millones')) {
          const num = parseFloat(raw.replace(/[^\d.,]/g, '').replace(',', '.'))
          count = Math.round(num * 1000000)
        } else {
          const num = parseInt(raw.replace(/[^\d]/g, ''), 10)
          if (!isNaN(num) && num > 0) count = num
        }

        if (count > 0) {
          const ytIdx = currentMetrics.findIndex(m => m.id === 'yt-subs')
          if (ytIdx !== -1 && currentMetrics[ytIdx].value !== count) {
            currentMetrics[ytIdx] = {
              ...currentMetrics[ytIdx],
              value: count
            }
            hasUpdates = true
          }
        }
      }
    }
  } catch {
    // Fallback silencioso a la base de datos estática
  }

  const totalFollowers = currentMetrics.reduce((acc, m) => acc + m.value, 0)
  const updatedGlobalMetrics = [
    {
      label: 'Seguidores en redes',
      value: totalFollowers,
      prefix: '+',
      suffix: '',
    },
    {
      label: 'Alcance mensual',
      value: globalMetrics[1]?.value || 1200000,
      prefix: '+',
      suffix: '',
    },
    {
      label: 'Programas semanales',
      value: 6,
      prefix: '',
      suffix: '',
    },
  ]

  const payload: SocialMetricsPayload = {
    metrics: currentMetrics,
    globalMetrics: updatedGlobalMetrics,
    lastUpdated: new Date().toISOString()
  }

  if (hasUpdates) {
    setCachedSocialMetrics(payload)
  }

  return payload
}
