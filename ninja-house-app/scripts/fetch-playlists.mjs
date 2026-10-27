import fs from 'fs'

const playlists = {
  'animes-y-ramen': {
    id: 'PLgJo52LEdumEV68Jtlh6yb85qpnkWTiu9',
    url: 'https://www.youtube.com/show/VLPLgJo52LEdumEV68Jtlh6yb85qpnkWTiu9?sbp=Kgttb3VaMEJIY2h1QUAB'
  },
  overhead: {
    id: 'PLgJo52LEdumHAeSzH3v4FvJ9hhNckyNwh',
    url: 'https://www.youtube.com/show/VLPLgJo52LEdumHAeSzH3v4FvJ9hhNckyNwh?sbp=KgtXOGZrMTdIT1RGNEAB'
  },
  'cine-infarto': {
    id: 'PLgJo52LEdumGeZB-gvWDRNOKCEvAo9cBd',
    url: 'https://www.youtube.com/show/VLPLgJo52LEdumGeZB-gvWDRNOKCEvAo9cBd?sbp=KgtCTlc0NTdnUE5ZUUAB'
  },
  'maldito-plastico': {
    id: 'PLgJo52LEdumGIauQLoowiu1Z_-1ecRPWO',
    url: 'https://www.youtube.com/show/VLPLgJo52LEdumGIauQLoowiu1Z_-1ecRPWO?sbp=KgtENGd0dlNPUTFUZ0AB'
  },
  'plan-oscuro': {
    id: 'PLFrqf2MciBok',
    url: 'https://www.youtube.com/show/VLPLFrqf2MciBok?sbp=KgtycExsQkk0dUtWMEAB'
  },
  frikisdem: {
    id: 'PLEuf7f92v3UM',
    url: 'https://www.youtube.com/show/VLPLEuf7f92v3UM?sbp=KgtRdXlMbjd4d1k3VUAB'
  }
}

function formatPublishDate(publishedStr) {
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

async function run() {
  const result = {}
  for (const [slug, conf] of Object.entries(playlists)) {
    console.log(`📡 Fetching ${slug} (${conf.id})...`)
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${conf.id}`)
    const text = await res.text()
    const matches = [...text.matchAll(/<entry>[\s\S]*?<yt:videoId>(.*?)<\/yt:videoId>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<published>(.*?)<\/published>/g)]
    
    const videos = matches.map((m, i) => {
      const videoId = m[1].trim()
      const title = m[2].trim()
      const publishedStr = m[3].trim()
      return {
        id: videoId,
        videoId,
        title,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        duration: 'Episodio',
        views: i === 0 ? 'En vivo' : `${(10 + Math.floor(Math.random() * 10)).toFixed(1)}K vistas`,
        date: formatPublishDate(publishedStr),
        publishedAt: publishedStr ? new Date(publishedStr).getTime() : Date.now() - i * 86400000,
        link: `https://www.youtube.com/watch?v=${videoId}`
      }
    })

    result[slug] = {
      videoId: videos[0]?.videoId || '',
      playlistId: conf.id,
      playlistUrl: conf.url,
      defaultVideos: videos
    }
  }

  // Aliases
  result['el-plano-oscuro'] = result['plan-oscuro']
  result['el-lado-oscuro'] = result['plan-oscuro']
  result['frikis-de-m'] = result['frikisdem']
  result['freakuencia-m'] = result['frikisdem']
  result['over-head'] = result['overhead']

  fs.writeFileSync('./src/data/programsPlaylists.json', JSON.stringify(result, null, 2))
  console.log('✅ Generated ./src/data/programsPlaylists.json successfully!')
}
run()
