import { Link, useNavigate } from 'react-router-dom'
import { CircularGallery, type GalleryItem } from '../components/ui/circular-gallery'
import { useSEO } from '../hooks/useSEO'

const programGalleryItems: GalleryItem[] = [
  {
    common: 'Animes y Ramen',
    binomial: 'Anime, manga y cultura japonesa',
    badge: '🍜 LUNES',
    time: 'Lunes • 9:00 PM - 11:00 PM',
    color: '#C6A2E6',
    link: '/programa/animes-y-ramen',
    video: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791287537/1791287482828lhtlquht3_compressed.mp4',
    photo: {
      url: '/assets/heros/hero-subpaginas/hero-animesRamen.webp',
      text: 'Animes y Ramen — Charrita y Ale Romero',
      pos: 'center top',
      by: 'Hosts: Charrita & Ale Romero',
    },
  },
  {
    common: 'Over Head',
    binomial: 'Lucha libre, WWE y wrestling',
    badge: '🤼 MARTES',
    time: 'Martes • 9:00 PM - 11:00 PM',
    color: '#2563EB',
    link: '/programa/overhead',
    video: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1792118051/LOOP_PANTALLA_DE_ATRAS.webm',
    photo: {
      url: '/assets/heros/hero-subpaginas/hero-overhead.webp',
      text: 'Over Head — Umano, Gianco y Luchito',
      pos: 'center top',
      by: 'Hosts: Umano, Gianco & Luchito',
    },
  },
  {
    common: 'Frikis de M',
    binomial: 'Cultura pop, actualidad y anécdotas',
    badge: '🎮 MIÉRCOLES',
    time: 'Miércoles • 9:00 PM - 11:00 PM',
    color: '#16A34A',
    link: '/programa/frikis-de-m',
    video: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791285670/frikisM.mp4',
    photo: {
      url: '/assets/heros/hero-subpaginas/hero-frikisM.webp',
      text: 'Frikis de M — Camu, Umano, D’arranque, Rafomagia y Luchito',
      pos: 'center top',
      by: 'Hosts: Camu, Umano, D’arranque, Rafomagia & Luchito',
    },
  },
  {
    common: 'Maldito Plástico',
    binomial: 'Coleccionismo, nostalgia y cultura pop',
    badge: '🛒 JUEVES',
    time: 'Jueves • 9:00 PM - 10:00 PM',
    color: '#EA580C',
    link: '/programa/maldito-plastico',
    video: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1791285410/FONDO_PANTALLA_TRASERA.webm',
    photo: {
      url: '/assets/heros/hero-subpaginas/hero-malditoPlastico_opt.webp',
      text: 'Maldito Plástico — Markollectibles, Gianco Condemarín y Rafomagia',
      pos: 'center top',
      by: 'Hosts: Markollectibles, Gianco & Rafomagia',
    },
  },
  {
    common: 'Cine Infarto',
    binomial: 'Terror, suspenso y cine de culto',
    badge: '🎬 VIERNES',
    time: 'Viernes • 9:00 PM - 11:00 PM',
    color: '#DC2626',
    link: '/programa/cine-infarto',
    video: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1792118147/PANTALLA_TRASERA_02.webm',
    photo: {
      url: '/assets/heros/hero-subpaginas/hero-cine-infarto.webp',
      text: 'Cine Infarto — Carmen Bathory y Andrés Manco',
      pos: 'center top',
      by: 'Hosts: Carmen Bathory & Andrés Manco',
    },
  },
  {
    common: 'El Plano Oscuro',
    binomial: 'Paranormal, misterio y espiritualidad',
    badge: '🔮 DOMINGO',
    time: 'Domingo • 9:00 PM - 11:00 PM',
    color: '#9333EA',
    link: '/programa/el-plano-oscuro',
    video: 'https://res.cloudinary.com/akbhdsaa/video/upload/v1792120902/PANTALLA_TRASERA.webm',
    photo: {
      url: '/assets/heros/hero-subpaginas/Retrato de brujas en tonos dorados_opt.webp',
      text: 'El Plano Oscuro — Adriana Larrea y Sandra',
      pos: 'center top',
      by: 'Hosts: Adriana Larrea & Sandra',
    },
  },
]

export function ProgramsPage() {
  const navigate = useNavigate()

  useSEO({
    title: 'Programas y Transmisiones Semanales',
    description: 'Conoce los 6 programas oficiales de Ninja House: Animes y Ramen, Over Head, Frikis de M, Maldito Plástico, Cine Infarto y El Plano Oscuro.'
  })

  return (
    // Outer scrollable container that drives the 3D rotation with scroll + auto-rotation
    <div className="w-full bg-ninja-black text-white relative" style={{ height: '240vh' }}>
      {/* Background ambient lighting */}
      <div 
        className="fixed top-0 right-0 w-[550px] h-[550px] pointer-events-none rounded-full z-0"
        style={{ background: 'radial-gradient(circle, rgba(103,185,70,0.12) 0%, transparent 70%)', filter: 'blur(100px)' }}
      />
      <div 
        className="fixed bottom-0 left-0 w-[500px] h-[500px] pointer-events-none rounded-full z-0"
        style={{ background: 'radial-gradient(circle, rgba(176,26,25,0.08) 0%, transparent 70%)', filter: 'blur(90px)' }}
      />
      <div className="fixed inset-0 halftone-bg opacity-15 pointer-events-none z-0" />

      {/* Sticky viewport container */}
      <div className="w-full h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden z-10">
        
        {/* Header content — Compacto y perfectamente distribuido */}
        <div className="absolute top-20 sm:top-22 z-20 px-4 sm:px-8 w-full max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Botón Home (Casita) */}
          <Link 
            to="/" 
            aria-label="Volver al Inicio"
            title="Volver al Inicio"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] hover:bg-ninja-green/15 border border-white/10 hover:border-ninja-green/50 text-white/70 hover:text-ninja-green flex items-center justify-center transition-all duration-300 shadow-sm group backdrop-blur-sm"
          >
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>

          {/* Título centrado y distribuido armoniosamente */}
          <div className="text-center px-2">
            <h1 className="font-display font-black text-base sm:text-xl md:text-2xl text-white tracking-tight leading-tight">
              Programas <span className="text-ninja-green">Ninja House</span>
            </h1>
            <p className="text-white/50 text-[10px] sm:text-xs font-body mt-0.5 tracking-wide">
              Arrastra o gira • Clic para ingresar
            </p>
          </div>

          {/* Espaciador simétrico invisible para garantizar centrado geométrico absoluto del título */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 pointer-events-none opacity-0" aria-hidden="true" />
        </div>

        {/* 3D Circular Gallery — 100% responsiva (se adapta automáticamente a móvil, tablet y escritorio) */}
        <div className="w-full h-full flex items-center justify-center">
          <CircularGallery
            items={programGalleryItems}
            autoRotateSpeed={0.08}
            onItemClick={(item) => {
              if (item.link) navigate(item.link)
            }}
          />
        </div>

        {/* Scroll / Swipe rotation indicator hint */}
        <div className="absolute bottom-5 sm:bottom-6 z-20 pointer-events-none flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] sm:text-[11px] font-display font-semibold text-white/60 shadow-lg">
          <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-ninja-green animate-ping" />
          <span>Arrastra con el dedo o haz scroll para girar</span>
        </div>
      </div>
    </div>
  )
}

export default ProgramsPage
