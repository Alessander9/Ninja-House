import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Política de Privacidad | Ninja House'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-ninja-black text-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(103,185,70,0.08) 0%, transparent 70%)',
          filter: 'blur(120px)'
        }}
      />
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-ninja-green hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-ninja-green/10 border border-ninja-green/20"
          >
            ← Volver al Dojo Principal
          </Link>
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 border-b border-white/10 pb-8"
        >
          <span className="text-xs font-display font-bold text-ninja-green tracking-widest uppercase">
            ⚖️ Marco Legal & Transparencia
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white mt-3">
            Política de <span className="text-ninja-green">Privacidad</span>
          </h1>
          <p className="text-white/40 text-sm mt-3 font-body">
            Última actualización: 27 de Octubre de 2026 · Ninja House Media Group (Lima, Perú)
          </p>
        </motion.div>

        {/* Content Body */}
        <div className="space-y-10 font-body text-sm sm:text-base text-white/70 leading-relaxed">
          
          {/* Section 1 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-ninja-card border border-white/5 space-y-3">
            <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-ninja-green" />
              1. Identidad del Responsable
            </h2>
            <p>
              El sitio web <strong className="text-white">Ninja House</strong> (accesible a través de su dominio oficial y redes asociadas) es una plataforma digital de entretenimiento, streaming y cultura geek producida en Lima, Perú.
            </p>
            <p>
              Para cualquier consulta o solicitud respecto al tratamiento de tus datos personales, puedes contactarnos directamente al correo oficial: <a href="mailto:Contacto@ninjahouseshow.com" className="text-ninja-green hover:underline">Contacto@ninjahouseshow.com</a>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-ninja-card border border-white/5 space-y-3">
            <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-ninja-green" />
              2. Datos Personales que Recopilamos
            </h2>
            <p>
              En Ninja House respetamos tu privacidad y nos regimos por el principio de minimización de datos. Únicamente recopilamos información personal cuando nos la proporcionas de forma voluntaria a través de:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-white/60">
              <li><strong className="text-white">Formularios de Contacto y Alianzas:</strong> Nombre completo, correo electrónico corporativo o personal, nombre de la marca o empresa, y el mensaje o propuesta que desees enviarnos.</li>
              <li><strong className="text-white">Datos de Navegación Técnica:</strong> Dirección IP anonimizada, tipo de navegador, sistema operativo y páginas visitadas para garantizar la seguridad de la infraestructura y optimizar el rendimiento técnico.</li>
              <li><strong className="text-white">Comunidad y Redes Sociales:</strong> Las interacciones que realices en nuestras transmisiones en vivo (YouTube Chat, Spotify, Discord, Instagram o TikTok) están sujetas a las políticas de privacidad de cada plataforma respectiva.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-ninja-card border border-white/5 space-y-3">
            <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-ninja-green" />
              3. Finalidad del Tratamiento de Datos
            </h2>
            <p>
              Los datos facilitados son utilizados exclusivamente con los siguientes propósitos legítimos:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-white/60">
              <li>Responder a solicitudes comerciales, propuestas de auspicio publicitario, convenios de contenido y postulaciones.</li>
              <li>Garantizar la seguridad y protección de la plataforma web frente a ataques automatizados, SPAM o actividades maliciosas.</li>
              <li>Monitorear métricas globales y anónimas de audiencia para mejorar la experiencia de usuario y la estabilidad técnica del sitio.</li>
            </ul>
            <p className="text-xs text-white/50 italic">
              * Ninja House jamás comercializa, vende, alquila ni cede tus datos de contacto personales a terceros bajo ninguna circunstancia.
            </p>
          </section>

          {/* Section 4 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-ninja-card border border-white/5 space-y-3">
            <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-ninja-green" />
              4. Uso de Cookies y Tecnologías Similares
            </h2>
            <p>
              Nuestro sitio utiliza cookies esenciales y almacenamiento local del navegador (<code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs">localStorage</code>) para:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-white/60">
              <li>Recordar tu consentimiento y preferencias sobre el banner de cookies.</li>
              <li>Permitir la reproducción fluida de contenido multimedia integrado (reproductores de YouTube y Spotify).</li>
              <li>Optimizar la carga de recursos gráficos mediante almacenamiento en caché del navegador.</li>
            </ul>
            <p>
              Puedes rechazar o borrar las cookies en cualquier momento ajustando la configuración de privacidad de tu navegador web.
            </p>
          </section>

          {/* Section 5 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-ninja-card border border-white/5 space-y-3">
            <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-ninja-green" />
              5. Servicios de Terceros
            </h2>
            <p>
              El sitio web integra enlaces e incrustaciones de servicios reconocidos internacionalmente:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-white/60">
              <li><strong className="text-white">YouTube (Google LLC):</strong> Para la visualización de programas en diferido y directos oficiales.</li>
              <li><strong className="text-white">Spotify AB:</strong> Para la reproducción de podcasts y episodios de audio.</li>
              <li><strong className="text-white">Vercel Inc.:</strong> Proveedor de infraestructura de alojamiento web global y distribución de contenidos (CDN).</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-ninja-card border border-white/5 space-y-3">
            <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-ninja-green" />
              6. Derechos del Usuario (ARCO)
            </h2>
            <p>
              De conformidad con la Ley de Protección de Datos Personales (Ley N° 29733 de la República del Perú) y normativas internacionales afines, tienes derecho en todo momento a acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales.
            </p>
            <p>
              Para ejercer cualquiera de estos derechos, envía un correo a <a href="mailto:Contacto@ninjahouseshow.com" className="text-ninja-green hover:underline">Contacto@ninjahouseshow.com</a> con el asunto "Derechos de Privacidad" indicando tu requerimiento.
            </p>
          </section>

          {/* Section 7 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-ninja-card border border-white/5 space-y-3">
            <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-ninja-green" />
              7. Actualizaciones de esta Política
            </h2>
            <p>
              Ninja House se reserva el derecho de actualizar la presente política periódicamente ante modificaciones regulatorias o la incorporación de nuevas funciones en la plataforma digital. Te recomendamos revisar esta página de manera regular.
            </p>
          </section>

        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link 
            to="/terminos" 
            className="text-xs font-display font-bold uppercase tracking-wider text-white/60 hover:text-ninja-green transition-colors"
          >
            Ver Términos y Condiciones →
          </Link>
          <Link 
            to="/contacto" 
            className="px-6 py-3 rounded-xl bg-ninja-green text-ninja-black font-display font-black text-xs uppercase tracking-wider hover:bg-ninja-green/90 transition-all shadow-lg shadow-ninja-green/10"
          >
            Contactar al Dojo Oficial
          </Link>
        </div>

      </div>
    </div>
  )
}
