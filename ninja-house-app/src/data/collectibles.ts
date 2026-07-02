export interface CollectibleItem {
  id: string
  title: string
  description: string
  price: string
  status: 'available' | 'upcoming' | 'sold-out'
  statusDisplay: string
  image: string
  color: string
  category: string
}

export const collectiblesData: CollectibleItem[] = [
  {
    id: 'cyberpunk-ninja-toy',
    title: 'Figura Cyberpunk Ninja Art Toy',
    description: 'Figura de colección de vinil de 18cm. Edición numerada limitada con acabados mate y visor brillante con luces reactivas.',
    price: '$79.99',
    status: 'upcoming',
    statusDisplay: 'PRÓXIMO DROP — JULIO 2026',
    image: '/assets/cyberpunk_ninja_toy.png',
    color: '#67B946', // Verde ninja
    category: 'Coleccionables'
  },
  {
    id: 'dojo-streetwear-hoodie',
    title: 'Hoddie Dojo Oficial 2026',
    description: 'Algodón pesado cepillado premium con el emblema ninja bordado en hilo neón de alta densidad. Corte oversize streetwear.',
    price: '$55.00',
    status: 'available',
    statusDisplay: 'DISPONIBLE AHORA',
    image: '/assets/dojo_streetwear_hoodie.png',
    color: '#5A287A', // Morado profundo
    category: 'Ropa'
  },
  {
    id: 'ninja-mechanical-keyboard',
    title: 'Teclado Mecánico Custom Dojo-65',
    description: 'Teclado 65% hot-swappable con switches lineares custom pre-lubricados. Keycaps exclusivas con tipografía ninja y luces RGB neón.',
    price: '$129.00',
    status: 'upcoming',
    statusDisplay: 'PRÓXIMO DROP — AGOSTO 2026',
    image: '/assets/ninja_mechanical_keyboard.png',
    color: '#F6D853', // Amarillo acento
    category: 'Hardware'
  }
]
