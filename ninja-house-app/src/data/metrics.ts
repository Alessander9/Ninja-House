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
    id: 'yt-subs',
    platform: 'YouTube',
    handle: '@ninjahouseshow',
    label: 'Suscriptores',
    value: 60000,
    suffix: '',
    color: '#FF0000',
    description: 'Comunidad en video, Shorts y directos. 127K+ visualizaciones totales (38K reproducciones, 89K shorts).',
    url: 'https://youtube.com/@ninjahouseshow',
  },
  {
    id: 'ig-followers',
    platform: 'Instagram',
    handle: '@ninjahouseshow',
    label: 'Seguidores',
    value: 23000,
    suffix: '',
    color: '#E1306C',
    description: 'Alcance mensual de 108K+ con 23K+ interacciones activas. Reels, Stories y post del Dojo.',
    url: 'https://instagram.com/ninjahouseshow',
  },
  {
    id: 'tiktok-followers',
    platform: 'TikTok',
    handle: '@ninjahouseshow',
    label: 'Seguidores',
    value: 41000,
    suffix: '',
    color: '#00F2FE', // TikTok cyan glow
    description: 'Nuestra red de mayor crecimiento relativo con +905K visualizaciones y alcance de contenido viral.',
    url: 'https://tiktok.com/@ninjahouseshow',
  },
  {
    id: 'fb-followers',
    platform: 'Facebook',
    handle: 'NinjaHouseshow',
    label: 'Seguidores',
    value: 44000,
    suffix: '',
    color: '#1877F2',
    description: 'Comunidad interactiva con 87K+ de alcance mensual y +168K interacciones en contenidos.',
    url: 'https://facebook.com/NinjaHouseshow',
  },
]

export const globalMetrics = [
  {
    label: 'Seguidores en redes',
    value: 169000,
    prefix: '+',
    suffix: '',
  },
  {
    label: 'Alcance mensual',
    value: 1000000,
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
