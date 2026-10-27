import { motion, useMotionTemplate, backOut, circOut, easeIn, easeInOut, easeOut } from 'framer-motion'
import { Scene, useTl, useTimeFn } from './timeline'
import { RevealText, RevealWords, Counter, ParticleField, Shuriken, Backdrop } from './primitives'
import { programsData, type Program } from '../data/programs'
import { metricsData, globalMetrics } from '../data/metrics'

/* ═══════════════════════════ TIMING (segundos) ═══════════════════════════ */

export const DURATION = 30
export const FPS = 30

const T = {
  intro: [0, 4.3],
  about: [4.0, 9.2],
  wipe: [8.7, 9.7],
  progTitle: [9.0, 10.7],
  programsStart: 10.4,
  slide: 1.75,
  metrics: [20.75, 26.2],
  outro: [26.0, DURATION],
} as const

const LOGO = '/assets/LOGO_NINJA_HOUSE.png'

const HERO_BY_PROGRAM: Record<string, string> = {
  'animes-y-ramen': '/assets/heros/ramen.webp',
  overhead: '/assets/heros/overhead.webp',
  frikisdem: '/assets/heros/frikis.webp',
  'maldito-plastico': '/assets/heros/plastico.webp',
  'cine-infarto': '/assets/heros/infarto.webp',
  'plan-oscuro': '/assets/heros/plano.webp',
}

/** Todas las imágenes que deben estar decodificadas antes de reproducir/renderizar. */
export const PRELOAD_IMAGES = [LOGO, ...Object.values(HERO_BY_PROGRAM)]

/* ═══════════════════════════ 1. INTRO ═══════════════════════════ */

function Slash({ start, top, rotate, color }: { start: number; top: string; rotate: number; color: string }) {
  const scaleX = useTl([start, start + 0.4], [0, 1], easeOut)
  const opacity = useTl([start + 0.35, start + 0.8], [1, 0])
  return (
    <motion.div
      className="absolute left-[-10%] w-[120%] h-[6px]"
      style={{ top, rotate, scaleX, opacity, originX: 0, background: `linear-gradient(90deg, transparent, ${color}, #fff, ${color}, transparent)`, boxShadow: `0 0 30px ${color}` }}
    />
  )
}

function TagPill({ label, start }: { label: string; start: number }) {
  const opacity = useTl([start, start + 0.3], [0, 1])
  const y = useTl([start, start + 0.4], [24, 0], backOut)
  return (
    <motion.span style={{ opacity, y }} className="px-6 py-2.5 rounded-full border border-white/10 bg-white/[0.04] text-white/75 font-display font-bold text-[22px] tracking-wider backdrop-blur-md">
      {label}
    </motion.span>
  )
}

function IntroScene() {
  const exitScale = useTl([3.6, 4.3], [1, 1.3], easeIn)
  const exitOpacity = useTl([3.85, 4.3], [1, 0])
  const exitBlur = useTl([3.7, 4.3], [0, 14])
  const exitFilter = useMotionTemplate`blur(${exitBlur}px)`

  const logoScale = useTl([0.5, 1.45], [2.2, 1], circOut)
  const logoBlur = useTl([0.5, 1.2], [30, 0])
  const logoOpacity = useTl([0.5, 0.85], [0, 1])
  const logoY = useTimeFn((t) => Math.sin(t * 1.8) * 6)
  const logoRotate = useTl([0.5, 1.45], [-8, 0], circOut)
  const logoFilter = useMotionTemplate`blur(${logoBlur}px) drop-shadow(0 0 50px rgba(183,31,29,0.6))`

  const flash = useTl([0.55, 0.65, 1.1], [0, 0.45, 0])
  const ringScale = useTl([0.6, 1.6], [0.2, 2.4], easeOut)
  const ringOpacity = useTl([0.6, 1.6], [0.8, 0])

  const badgeOpacity = useTl([1.5, 1.9], [0, 1])
  const badgeY = useTl([1.5, 1.9], [-20, 0], easeOut)
  const nerdScale = useTl([2.15, 2.65], [0.4, 1], backOut)
  const nerdOpacity = useTl([2.15, 2.4], [0, 1])
  const dotOpacity = useTimeFn((t) => 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 7)))

  return (
    <Scene start={T.intro[0]} end={T.intro[1]}>
      <Backdrop />
      <ParticleField count={46} />

      <motion.div className="absolute inset-0 flex flex-col items-center justify-center" style={{ scale: exitScale, opacity: exitOpacity, filter: exitFilter }}>
        {/* Shurikens decorativos */}
        <Shuriken size={150} speed={120} className="absolute left-[120px] top-[110px] opacity-60" />
        <Shuriken size={90} speed={-160} color="#C75A58" className="absolute right-[170px] top-[180px] opacity-50" />
        <Shuriken size={120} speed={140} color="#AA0B0A" className="absolute right-[260px] bottom-[120px] opacity-50" />
        <Shuriken size={70} speed={-200} className="absolute left-[300px] bottom-[170px] opacity-40" />

        {/* Onda expansiva */}
        <motion.div className="absolute w-[700px] h-[700px] rounded-full border-[3px] border-red-500" style={{ scale: ringScale, opacity: ringOpacity, boxShadow: '0 0 80px rgba(189,33,31,0.7), inset 0 0 80px rgba(189,33,31,0.5)' }} />

        {/* Badge */}
        <motion.div style={{ opacity: badgeOpacity, y: badgeY }} className="flex items-center gap-4 mb-2 z-10">
          <span className="inline-flex items-center gap-3 px-6 py-2 bg-red-600/15 border border-red-600/40 rounded-full text-red-400 font-display font-bold text-[22px] tracking-[0.25em]">
            <motion.span className="w-3 h-3 rounded-full bg-red-500" style={{ opacity: dotOpacity }} />
            CANAL OFICIAL
          </span>
          <span className="px-5 py-2 bg-white/[0.05] border border-white/10 rounded-full text-white/70 font-display font-bold text-[20px] tracking-widest">🔴 LUN A SÁB · 9PM</span>
        </motion.div>

        {/* Logo */}
        <motion.img
          src={LOGO}
          alt="Ninja House"
          className="w-[1050px] -my-14 z-10"
          style={{ scale: logoScale, opacity: logoOpacity, y: logoY, rotate: logoRotate, filter: logoFilter }}
        />

        {/* Headline */}
        <h1 className="font-display font-black text-[78px] leading-none text-white tracking-tight z-10 flex items-baseline gap-5">
          <RevealWords text="La única" start={1.95} />
          <motion.span
            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300"
            style={{ scale: nerdScale, opacity: nerdOpacity, filter: 'drop-shadow(0 0 30px rgba(239,68,68,0.6))' }}
          >
            NERDwork
          </motion.span>
          <RevealWords text="de YouTube" start={2.35} />
        </h1>

        <div className="flex gap-4 mt-10 z-10">
          {['🎮 Gaming', '🍜 Anime', '🍿 Cultura Pop', '📦 Coleccionismo', '🔮 Misterio'].map((t, i) => (
            <TagPill key={t} label={t} start={2.75 + i * 0.09} />
          ))}
        </div>
      </motion.div>

      {/* Cortes de katana */}
      <Slash start={0.05} top="38%" rotate={-14} color="#BD211F" />
      <Slash start={0.22} top="62%" rotate={-14} color="#C75A58" />
      <motion.div className="absolute inset-0 bg-white" style={{ opacity: flash }} />
    </Scene>
  )
}

/* ═══════════════════════════ 2. ¿QUÉ ES NINJA HOUSE? ═══════════════════════════ */

const ABOUT_CARDS = [
  { title: 'Contenido Geek', desc: 'Anime, manga, wrestling, cine, series y cultura pop en un solo lugar.', icon: '🎮', color: '#B01A19' },
  { title: 'Comunidad Activa', desc: 'Una audiencia que comenta, debate, comparte y participa en vivo.', icon: '🔥', color: '#BD211F' },
  { title: 'Programas en Vivo', desc: 'Seis espacios semanales en prime time con talentos y debate real.', icon: '🎙️', color: '#C75A58' },
  { title: 'Conexión con Marcas', desc: 'Campañas, patrocinios, unboxings y experiencias comerciales.', icon: '📈', color: '#AA0B0A' },
]

function AboutCard({ card, start }: { card: (typeof ABOUT_CARDS)[number]; start: number }) {
  const y = useTl([start, start + 0.7], [160, 0], backOut)
  const rotateX = useTl([start, start + 0.7], [55, 0], easeOut)
  const opacity = useTl([start, start + 0.35], [0, 1])
  const bar = useTl([start + 0.3, start + 0.8], [0, 1], easeOut)
  const iconScale = useTl([start + 0.35, start + 0.8], [0, 1], backOut)
  const float = useTimeFn((t) => Math.sin(t * 1.4 + start * 3) * 6)
  return (
    <motion.div style={{ y, rotateX, opacity, transformPerspective: 1200 }} className="w-[380px]">
      <motion.div style={{ y: float }} className="relative h-[330px] p-9 rounded-[28px] bg-[#1b1b1b]/90 border border-white/[0.07] flex flex-col gap-5 overflow-hidden backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <motion.div className="absolute top-0 left-0 right-0 h-[6px]" style={{ backgroundColor: card.color, scaleX: bar, originX: 0, boxShadow: `0 0 24px ${card.color}` }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 80% 0%, ${card.color}22 0%, transparent 60%)` }} />
        <motion.span style={{ scale: iconScale }} className="text-[46px] w-[84px] h-[84px] rounded-2xl bg-white/[0.06] flex items-center justify-center">{card.icon}</motion.span>
        <h3 className="font-display font-black text-[34px] text-white leading-tight">{card.title}</h3>
        <p className="font-body text-[21px] leading-relaxed text-white/55">{card.desc}</p>
      </motion.div>
    </motion.div>
  )
}

function AboutScene() {
  const chipOpacity = useTl([4.2, 4.5], [0, 1])
  const chipScale = useTl([4.2, 4.6], [0.6, 1], backOut)
  const exitY = useTl([8.4, 9.1], [0, -120], easeIn)
  const exitOpacity = useTl([8.5, 9.1], [1, 0])
  const enterScale = useTl([4.0, 4.8], [1.12, 1], easeOut)
  const enterOpacity = useTl([4.0, 4.4], [0, 1])

  return (
    <Scene start={T.about[0]} end={T.about[1]}>
      <motion.div className="absolute inset-0" style={{ opacity: enterOpacity, scale: enterScale }}>
        <Backdrop glowColor="rgba(176,26,25,0.2)" />
        <ParticleField count={30} />
      </motion.div>

      <motion.div className="absolute inset-0 flex flex-col items-center pt-[120px]" style={{ y: exitY, opacity: exitOpacity }}>
        <motion.span style={{ opacity: chipOpacity, scale: chipScale }} className="px-7 py-2.5 bg-red-600/15 border border-red-600/40 rounded-full text-red-400 font-display font-bold text-[22px] tracking-[0.25em]">
          🥷 EL TEMPLO GEEK
        </motion.span>

        <h2 className="font-display font-black text-[104px] leading-none text-white mt-8 tracking-tight" style={{ filter: 'drop-shadow(0 0 40px rgba(176,26,25,0.45))' }}>
          <RevealText text="¿Qué es " start={4.35} stagger={0.03} />
          <RevealText text="Ninja House" start={4.6} stagger={0.035} className="text-red-500" />
          <RevealText text="?" start={5.0} />
        </h2>

        <p className="font-body text-[27px] text-white/60 text-center max-w-[1250px] leading-relaxed mt-8">
          <RevealWords text="La plataforma de influencia geek que conecta marcas con una comunidad apasionada de fans y coleccionistas." start={5.05} stagger={0.035} dur={0.45} />
        </p>

        <div className="flex gap-8 mt-14">
          {ABOUT_CARDS.map((c, i) => <AboutCard key={c.title} card={c} start={5.6 + i * 0.16} />)}
        </div>
      </motion.div>
    </Scene>
  )
}

/* ═══════════════════════════ Transición: barrido diagonal ═══════════════════════════ */

function WipeTransition() {
  const x1 = useTl([8.7, 9.6], ['-130%', '130%'], easeInOut)
  const x2 = useTl([8.78, 9.7], ['-130%', '130%'], easeInOut)
  return (
    <Scene start={T.wipe[0]} end={T.wipe[1]} className="z-[60] pointer-events-none">
      <motion.div className="absolute -inset-y-[20%] w-[120%] bg-[#B01A19]" style={{ x: x1, skewX: -18, boxShadow: '0 0 120px rgba(176,26,25,0.8)' }} />
      <motion.div className="absolute -inset-y-[20%] w-[110%] bg-[#0c0c0c] flex items-center justify-center" style={{ x: x2, skewX: -18 }}>
        <img src={LOGO} alt="" className="w-[520px] opacity-90" style={{ transform: 'skewX(18deg)' }} />
      </motion.div>
    </Scene>
  )
}

/* ═══════════════════════════ 3. PROGRAMACIÓN ═══════════════════════════ */

function DayDot({ p, start }: { p: Program; start: number }) {
  const scale = useTl([start, start + 0.4], [0, 1], backOut)
  return (
    <motion.div style={{ scale }} className="flex flex-col items-center gap-3">
      <div className="w-[110px] h-[110px] rounded-[26px] flex items-center justify-center text-[50px]" style={{ background: `${p.color}26`, border: `2px solid ${p.color}`, boxShadow: `0 0 40px ${p.color}55` }}>
        {p.emoji}
      </div>
      <span className="font-display font-black text-[22px] tracking-widest" style={{ color: p.color }}>{p.day.slice(0, 3).toUpperCase()}</span>
    </motion.div>
  )
}

function ProgramsTitleScene() {
  const exitScale = useTl([10.15, 10.7], [1, 1.35], easeIn)
  const exitOpacity = useTl([10.25, 10.7], [1, 0])
  const subOpacity = useTl([9.55, 9.9], [0, 1])
  return (
    <Scene start={T.progTitle[0]} end={T.progTitle[1]}>
      <Backdrop />
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center" style={{ scale: exitScale, opacity: exitOpacity }}>
        <span className="font-display font-bold text-[26px] text-red-400 tracking-[0.5em] mb-4">
          <RevealText text="PRIME TIME · 9PM" start={9.15} stagger={0.025} />
        </span>
        <h2 className="font-display font-black text-[150px] leading-none text-white tracking-tight" style={{ filter: 'drop-shadow(0 0 45px rgba(176,26,25,0.5))' }}>
          <RevealText text="PROGRAMACIÓN" start={9.2} stagger={0.03} dur={0.5} />
        </h2>
        <motion.p style={{ opacity: subOpacity }} className="font-body text-[30px] text-white/60 mt-6">
          6 shows en vivo · Lunes a Sábado · desde el dojo ninja
        </motion.p>
        <div className="flex gap-8 mt-14">
          {programsData.map((p, i) => <DayDot key={p.id} p={p} start={9.65 + i * 0.07} />)}
        </div>
      </motion.div>
    </Scene>
  )
}

function ProgramSlide({ p, index, start }: { p: Program; index: number; start: number }) {
  const end = start + T.slide + 0.45
  const D = T.slide

  const reveal = useTl([start, start + 0.55], ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'], circOut)
  const edgeX = useTl([start, start + 0.55], ['1920px', '0px'], circOut)
  const edgeOpacity = useTl([start + 0.45, start + 0.6], [1, 0])

  const cardX = useTl([start + 0.1, start + 0.75], [220, 0], circOut)
  const cardRotY = useTl([start + 0.1, start + 0.9], [-18, -6], easeOut)
  const imgScale = useTl([start, end], [1.22, 1.04])
  const imgX = useTl([start, end], [-30, 30])
  const watermarkX = useTl([start, end], [80, -120])

  const badgeOpacity = useTl([start + 0.3, start + 0.55], [0, 1])
  const badgeX = useTl([start + 0.3, start + 0.6], [-40, 0], easeOut)
  const lineScale = useTl([start + 0.55, start + 0.95], [0, 1], easeOut)
  const infoOpacity = useTl([start + 0.65, start + 0.95], [0, 1])
  const infoY = useTl([start + 0.65, start + 0.95], [20, 0], easeOut)
  const glowPulse = useTimeFn((t) => 0.55 + 0.25 * Math.sin(t * 4))
  const shadow = `0 40px 120px rgba(0,0,0,0.6), 0 0 90px ${p.color}66`

  return (
    <Scene start={start} end={end} className="" >
      <motion.div className="absolute inset-0" style={{ clipPath: reveal, zIndex: index + 1 }}>
        <div className="absolute inset-0 bg-[#0d0d0d]" />
        <motion.div className="absolute inset-0" style={{ opacity: glowPulse, background: `radial-gradient(ellipse at 72% 50%, ${p.color}55 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, ${p.color}22 0%, transparent 50%)` }} />
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `radial-gradient(circle, ${p.color}44 1.5px, transparent 1.5px)`, backgroundSize: '26px 26px' }} />

        {/* Marca de agua con el día */}
        <motion.div
          className="absolute bottom-[-70px] left-0 font-display font-black text-[330px] leading-none whitespace-nowrap select-none"
          style={{ x: watermarkX, color: 'transparent', WebkitTextStroke: `2px ${p.color}`, opacity: 0.16 }}
        >
          {p.day.toUpperCase()}
        </motion.div>

        {/* Columna de info */}
        <div className="absolute left-[110px] top-[230px] w-[640px] flex flex-col gap-7">
          <motion.div style={{ opacity: badgeOpacity, x: badgeX }} className="flex items-center gap-4">
            <span className="font-display font-black text-[22px] text-white/40 tracking-widest">{String(index + 1).padStart(2, '0')} / 06</span>
            <span className="px-5 py-2 rounded-full font-display font-black text-[22px] tracking-widest text-white" style={{ background: p.color, boxShadow: `0 0 30px ${p.color}88` }}>
              {p.emoji} {p.day.toUpperCase()} · 9PM
            </span>
          </motion.div>

          <h3 className="font-display font-black text-[100px] leading-[0.95] text-white tracking-tight" style={{ filter: `drop-shadow(0 0 40px ${p.color}66)` }}>
            <RevealText text={p.title} start={start + 0.35} stagger={0.03} dur={0.5} />
          </h3>

          <motion.div className="h-[5px] w-[220px] rounded-full" style={{ background: p.color, scaleX: lineScale, originX: 0, boxShadow: `0 0 20px ${p.color}` }} />

          <motion.div style={{ opacity: infoOpacity, y: infoY }} className="flex flex-col gap-4">
            <p className="font-display font-bold text-[32px] text-white/85 leading-snug">{p.category}</p>
            <p className="font-body text-[22px] text-white/50 leading-relaxed">
              <span className="text-white/35 uppercase tracking-widest text-[18px] font-bold mr-2">Con</span>
              {p.talents.join(' · ')}
            </p>
          </motion.div>
        </div>

        {/* Tarjeta de imagen */}
        <motion.div
          className="absolute left-[800px] top-[215px] w-[1020px] h-[574px] rounded-[30px] overflow-hidden"
          style={{ x: cardX, rotateY: cardRotY, transformPerspective: 1800, border: `2px solid ${p.color}99`, boxShadow: shadow }}
        >
          <motion.img src={HERO_BY_PROGRAM[p.id]} alt={p.title} className="w-full h-full object-cover" style={{ scale: imgScale, x: imgX }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.12) 0%, transparent 35%)' }} />
        </motion.div>

        {/* Barra de progreso de shows */}
        <div className="absolute left-[110px] right-[100px] bottom-[70px] flex gap-3">
          {programsData.map((q, j) => (
            <ProgressSeg key={q.id} color={q.color} state={j < index ? 'done' : j === index ? 'active' : 'todo'} start={start} dur={D} />
          ))}
        </div>
      </motion.div>

      {/* Borde de luz del barrido */}
      <motion.div className="absolute top-0 bottom-0 w-[10px]" style={{ x: edgeX, opacity: edgeOpacity, zIndex: index + 2, background: '#fff', boxShadow: `0 0 50px 18px ${p.color}` }} />
    </Scene>
  )
}

function ProgressSeg({ color, state, start, dur }: { color: string; state: 'done' | 'active' | 'todo'; start: number; dur: number }) {
  const fill = useTl([start + 0.2, start + dur + 0.2], [0, 1])
  return (
    <div className="flex-1 h-[6px] rounded-full bg-white/10 overflow-hidden">
      {state !== 'todo' && (
        <motion.div className="h-full rounded-full" style={{ background: color, scaleX: state === 'done' ? 1 : fill, originX: 0 }} />
      )}
    </div>
  )
}

/* ═══════════════════════════ 4. MÉTRICAS ═══════════════════════════ */

const PLATFORM_ORDER = ['yt-subs', 'tiktok-followers', 'fb-followers', 'ig-followers']

function PlatformCard({ id, start }: { id: string; start: number }) {
  const m = metricsData.find((x) => x.id === id)!
  const y = useTl([start, start + 0.6], [140, 0], backOut)
  const opacity = useTl([start, start + 0.3], [0, 1])
  const float = useTimeFn((t) => Math.sin(t * 1.5 + start * 4) * 5)
  return (
    <motion.div style={{ y, opacity }}>
      <motion.div style={{ y: float }} className="relative w-[360px] p-8 rounded-[26px] bg-[#1a1a1a]/90 border border-white/[0.07] overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 15% 0%, ${m.color}33 0%, transparent 65%)` }} />
        <div className="relative flex items-center gap-4">
          <span className="w-[58px] h-[58px] rounded-2xl flex items-center justify-center font-display font-black text-[28px] text-white" style={{ background: m.color, boxShadow: `0 0 26px ${m.color}88` }}>
            {m.platform[0]}
          </span>
          <div className="flex flex-col">
            <span className="font-display font-black text-[26px] text-white leading-tight">{m.platform}</span>
            <span className="font-body text-[18px] text-white/40">{m.handle}</span>
          </div>
        </div>
        <div className="relative mt-6 font-display font-black text-[64px] leading-none text-white">
          <Counter value={m.value} start={start + 0.15} dur={1.5} />
        </div>
        <span className="relative font-body text-[19px] text-white/45">{m.label}</span>
      </motion.div>
    </motion.div>
  )
}

function MetricsScene() {
  const [s] = T.metrics
  const reveal = useTl([s, s + 0.65], ['circle(0% at 50% 50%)', 'circle(80% at 50% 50%)'], circOut)
  const bigScale = useTl([s + 0.75, s + 1.3], [0.5, 1], backOut)
  const bigOpacity = useTl([s + 0.75, s + 1.0], [0, 1])
  const pillsOpacity = useTl([s + 1.4, s + 1.8], [0, 1])
  const pillsY = useTl([s + 1.4, s + 1.8], [20, 0], easeOut)
  const exitOpacity = useTl([25.65, 26.2], [1, 0])
  const exitScale = useTl([25.6, 26.2], [1, 0.92], easeIn)

  return (
    <Scene start={T.metrics[0]} end={T.metrics[1]} className="z-[40]">
      <motion.div className="absolute inset-0" style={{ clipPath: reveal }}>
        <Backdrop glowColor="rgba(183,31,29,0.25)" />
        <ParticleField count={36} />
        <motion.div className="absolute inset-0 flex flex-col items-center pt-[125px]" style={{ opacity: exitOpacity, scale: exitScale }}>
          <span className="px-7 py-2.5 bg-red-600/15 border border-red-600/40 rounded-full text-red-400 font-display font-bold text-[22px] tracking-[0.25em]">
            <RevealText text="📈 COMUNIDAD NINJA" start={s + 0.4} stagger={0.02} />
          </span>
          <h2 className="font-display font-black text-[70px] text-white mt-6 leading-none">
            <RevealText text="Una comunidad que no para de crecer" start={s + 0.5} stagger={0.018} dur={0.45} />
          </h2>

          <motion.div style={{ scale: bigScale, opacity: bigOpacity }} className="mt-8 flex flex-col items-center">
            <span className="font-display font-black text-[190px] leading-none text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300" style={{ filter: 'drop-shadow(0 0 40px rgba(239,68,68,0.5))' }}>
              <Counter value={globalMetrics[0].value} prefix="+" start={s + 0.8} dur={1.9} />
            </span>
            <span className="font-display font-bold text-[30px] text-white/70 tracking-[0.3em] uppercase -mt-2">{globalMetrics[0].label}</span>
          </motion.div>

          <motion.div style={{ opacity: pillsOpacity, y: pillsY }} className="flex gap-5 mt-7">
            <span className="px-6 py-2.5 rounded-full bg-white/[0.05] border border-white/10 font-display font-bold text-[22px] text-white/80">
              🚀 <Counter value={globalMetrics[1].value} prefix="+" start={s + 1.4} dur={1.6} /> alcance mensual
            </span>
            <span className="px-6 py-2.5 rounded-full bg-white/[0.05] border border-white/10 font-display font-bold text-[22px] text-white/80">
              🎙️ {globalMetrics[2].value} programas semanales
            </span>
          </motion.div>

          <div className="flex gap-7 mt-10">
            {PLATFORM_ORDER.map((id, i) => <PlatformCard key={id} id={id} start={s + 1.55 + i * 0.14} />)}
          </div>
        </motion.div>
      </motion.div>
    </Scene>
  )
}

/* ═══════════════════════════ 5. OUTRO / CTA ═══════════════════════════ */

function OutroScene() {
  const [s] = T.outro
  const redFlood = useTl([s, s + 0.5], ['circle(0% at 50% 50%)', 'circle(85% at 50% 50%)'], circOut)
  const darkFlood = useTl([s + 0.3, s + 0.85], ['circle(0% at 50% 50%)', 'circle(85% at 50% 50%)'], circOut)

  const logoScale = useTl([s + 0.6, s + 1.35], [0.3, 1], backOut)
  const logoOpacity = useTl([s + 0.6, s + 0.9], [0, 1])
  const logoY = useTimeFn((t) => Math.sin(t * 1.7) * 8)
  const pillOpacity = useTl([s + 1.3, s + 1.6], [0, 1])
  const pillY = useTl([s + 1.3, s + 1.7], [20, 0], easeOut)
  const ctaScale = useTl([s + 2.0, s + 2.5], [0, 1], backOut)
  const ctaGlow = useTimeFn((t) => `0 0 ${40 + 30 * (0.5 + 0.5 * Math.sin(t * 5))}px rgba(220,38,38,0.75)`)
  const handlesOpacity = useTl([s + 2.4, s + 2.8], [0, 1])
  const dot = useTimeFn((t) => (Math.sin(t * 8) > 0 ? 1 : 0.3))
  const fadeOut = useTl([DURATION - 0.6, DURATION], [0, 1])

  return (
    <Scene start={T.outro[0]} end={T.outro[1]} className="z-[50]">
      <motion.div className="absolute inset-0 bg-[#B01A19]" style={{ clipPath: redFlood }} />
      <motion.div className="absolute inset-0" style={{ clipPath: darkFlood }}>
        <Backdrop glowColor="rgba(183,31,29,0.35)" />
        <ParticleField count={50} />
        <Shuriken size={130} speed={110} className="absolute left-[150px] top-[140px] opacity-50" />
        <Shuriken size={100} speed={-150} color="#C75A58" className="absolute right-[180px] bottom-[160px] opacity-50" />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.img src={LOGO} alt="Ninja House" className="w-[900px] -my-12" style={{ scale: logoScale, opacity: logoOpacity, y: logoY, filter: 'drop-shadow(0 0 60px rgba(183,31,29,0.6))' }} />

          <motion.div style={{ opacity: pillOpacity, y: pillY }} className="flex items-center gap-3 px-7 py-3 rounded-full bg-white/[0.05] border border-white/10">
            <motion.span className="w-3.5 h-3.5 rounded-full bg-red-500" style={{ opacity: dot, boxShadow: '0 0 14px #ef4444' }} />
            <span className="font-display font-black text-[26px] text-white tracking-[0.2em]">EN VIVO · LUN A SÁB · 9:00 PM</span>
          </motion.div>

          <h2 className="font-display font-black text-[64px] text-white mt-8 leading-none">
            <RevealText text="Únete a la comunidad ninja" start={s + 1.55} stagger={0.022} dur={0.45} />
          </h2>

          <motion.div style={{ scale: ctaScale, boxShadow: ctaGlow }} className="mt-10 inline-flex items-center gap-4 px-12 py-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-700 border border-red-400/30">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="font-display font-black text-[38px] text-white">Suscríbete · @NinjaHouseShow</span>
          </motion.div>

          <motion.p style={{ opacity: handlesOpacity }} className="mt-8 font-body text-[24px] text-white/45 tracking-wider">
            Instagram · TikTok · Facebook — @ninjahouseshow
          </motion.p>
        </div>
      </motion.div>
      <motion.div className="absolute inset-0 bg-black z-10" style={{ opacity: fadeOut }} />
    </Scene>
  )
}

/* ═══════════════════════════ HUD persistente ═══════════════════════════ */

function Hud() {
  const opacity = useTl([4.5, 5.0, 25.4, 25.9], [0, 1, 1, 0])
  const dot = useTimeFn((t) => (Math.sin(t * 8) > 0 ? 1 : 0.3))
  return (
    <motion.div className="absolute inset-x-0 top-0 z-[70] flex items-center justify-between px-[60px] pt-[40px] pointer-events-none" style={{ opacity }}>
      <img src={LOGO} alt="" className="h-[70px] drop-shadow-[0_0_20px_rgba(183,31,29,0.5)]" />
      <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
        <motion.span className="w-2.5 h-2.5 rounded-full bg-red-500" style={{ opacity: dot }} />
        <span className="font-display font-bold text-[18px] text-white/80 tracking-[0.25em]">NERDWORK · YOUTUBE</span>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════ COMPOSICIÓN ═══════════════════════════ */

export function PromoComposition() {
  return (
    <>
      <IntroScene />
      <AboutScene />
      <ProgramsTitleScene />
      {programsData.map((p, i) => (
        <ProgramSlide key={p.id} p={p} index={i} start={T.programsStart + i * T.slide} />
      ))}
      <MetricsScene />
      <OutroScene />
      <WipeTransition />
      <Hud />
    </>
  )
}
