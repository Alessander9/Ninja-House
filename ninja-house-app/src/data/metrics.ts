// Archivo generado automáticamente por scripts/sync-social-metrics.mjs
// Última sincronización: 2026-10-06T12:18:00.710Z

export interface Metric {
  id: string
  platform: string
  handle: string
  label: string
  value: number
  suffix: string
  color: string
  description: string
  reach?: number
  interaction?: number
  url: string
}

export const metricsData: Metric[] = [
  {
    "id": "yt-subs",
    "platform": "YouTube",
    "handle": "@NinjaHouseShow",
    "label": "Suscriptores",
    "value": 61900,
    "suffix": "",
    "color": "#FF0000",
    "description": "Comunidad activa en videos largos, Shorts y directos. +12.4M visualizaciones totales.",
    "url": "https://youtube.com/@NinjaHouseShow"
  },
  {
    "id": "ig-followers",
    "platform": "Instagram",
    "handle": "@ninjahouseshow",
    "label": "Seguidores",
    "value": 25500,
    "suffix": "",
    "color": "#E1306C",
    "description": "Comunidad activa y fiel con alto engagement diario en Reels, Stories y dinámicas en vivo.",
    "url": "https://www.instagram.com/ninjahouseshow/?hl=es#"
  },
  {
    "id": "tiktok-followers",
    "platform": "TikTok",
    "handle": "@ninjahouseshow",
    "label": "Seguidores",
    "value": 42500,
    "suffix": "",
    "color": "#00F2FE",
    "description": "Crecimiento viral continuo con millones de visualizaciones en clips y mejores momentos.",
    "url": "https://tiktok.com/@ninjahouseshow"
  },
  {
    "id": "fb-followers",
    "platform": "Facebook",
    "handle": "NinjaHouseshow",
    "label": "Seguidores",
    "value": 44000,
    "suffix": "",
    "color": "#1877F2",
    "description": "Comunidad interactiva con constante interacción en publicaciones, debates y transmisiones.",
    "url": "https://www.facebook.com/NinjaHouseshow/followers/"
  }
]

export const globalMetrics = [
  {
    "label": "Seguidores en redes",
    "value": 173900,
    "prefix": "+",
    "suffix": ""
  },
  {
    "label": "Alcance mensual",
    "value": 1026480,
    "prefix": "+",
    "suffix": ""
  },
  {
    "label": "Programas semanales",
    "value": 6,
    "prefix": "",
    "suffix": ""
  }
]
