import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

const DEFAULT_TITLE = 'Ninja House — Contenido Geek Sin Filtros'
const DEFAULT_DESC = 'Ninja House: el canal de gaming, anime, cultura pop y entretenimiento geek. Programación semanal en vivo, reviews y mucho más. ¡Únete a la comunidad ninja!'
const SITE_URL = 'https://ninja-house-app.vercel.app'
const DEFAULT_IMAGE = `${SITE_URL}/assets/banner.png`

export function useSEO({ title, description, image, url }: SEOProps = {}) {
  const location = useLocation()

  useEffect(() => {
    // 1. Title
    const finalTitle = title ? `${title} | Ninja House` : DEFAULT_TITLE
    document.title = finalTitle

    // 2. Meta description
    const finalDesc = description || DEFAULT_DESC
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', finalDesc)

    // 3. Open Graph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', finalTitle)

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', finalDesc)

    const finalImage = image || DEFAULT_IMAGE
    const ogImg = document.querySelector('meta[property="og:image"]')
    if (ogImg) ogImg.setAttribute('content', finalImage)

    // 4. Canonical URL
    const canonicalUrl = url || `${SITE_URL}${location.pathname}`
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonicalTag) {
      canonicalTag = document.createElement('link')
      canonicalTag.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalTag)
    }
    canonicalTag.setAttribute('href', canonicalUrl)

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl)
  }, [title, description, image, url, location.pathname])
}
