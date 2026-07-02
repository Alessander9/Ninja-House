import { motion } from 'framer-motion'

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
)

const TwitchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.806-6.806v-14.149h-21.851zm19.164 13.612l-4.119 4.119h-5.731l-3.045 3.045v-3.045h-4.836v-15.045h17.731v10.926zm-2.866-6.448v5.373h-2.149v-5.373h2.149zm-5.731 0v5.373h-2.149v-5.373h2.149z"/>
  </svg>
)

const socials = [
  { name: 'Instagram', icon: <InstagramIcon />, url: 'https://instagram.com', color: '#E1306C' },
  { name: 'Facebook', icon: <FacebookIcon />, url: 'https://facebook.com', color: '#1877F2' },
  { name: 'TikTok', icon: <TikTokIcon />, url: 'https://tiktok.com', color: '#69C9D0' },
  { name: 'Twitch', icon: <TwitchIcon />, url: 'https://twitch.tv', color: '#9146FF' },
]

export function SocialSidebar() {
  return (
    <motion.div 
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 pl-4 hidden md:flex"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3.5, duration: 0.8, ease: 'easeOut' }} // Shows after loader
    >
      {socials.map((social, idx) => (
        <motion.a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group w-11 h-11 flex items-center justify-center rounded-xl bg-ninja-black border border-white/10 text-white/50 hover:text-white"
          whileHover={{ scale: 1.15, x: 5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.5 + idx * 0.1 }}
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
        >
          {/* Hover glow */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ 
              background: `radial-gradient(circle at 50% 50%, ${social.color}40 0%, transparent 70%)`,
              boxShadow: `inset 0 0 0 1px ${social.color}50, 0 0 20px ${social.color}40`
            }}
          />
          <div className="relative z-10 transition-colors duration-300 group-hover:!text-white" style={{
            // When hovered, we can tint the icon, or let the text-white take over.
            // Using a hack to apply the exact color to SVG when hovered
          }}>
            {social.icon}
          </div>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-2 py-1 bg-ninja-black border border-white/10 rounded-md text-xs font-display font-bold opacity-0 -translate-x-2 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" style={{ color: social.color }}>
            {social.name}
          </div>
        </motion.a>
      ))}
    </motion.div>
  )
}
