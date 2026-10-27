import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function TermsConditionsPage() {
  useEffect(() => {
    document.title = 'Términos y Condiciones | Ninja House'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-ninja-black text-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div 
        className="absolute top-0 right-1/4 w-[700px] h-[400px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(184,40,40,0.08) 0%, transparent 70%)',
          filter: 'blur(120px)'
        }}
      />
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-ninja-red hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-ninja-red/10 border border-ninja-red/20"
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
          <span className="text-xs font-display font-bold text-ninja-red tracking-widest uppercase">
            📜 Reglas de Convivencia & Marco Legal
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white mt-3">
            Términos y <span className="text-ninja-red">Condiciones</span>
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
              <span className="w-2 h-2 rounded-full bg-ninja-red" />
              1. Aceptación de los Términos
            </h2>
            <p>
              El acceso, navegación y uso del portal web de <strong className="text-white">Ninja House</strong> y de sus canales de difusión multimedia asociados implica la aceptación plena e incondicional de los presentes Términos y Condiciones por parte del usuario. Si no estás de acuerdo con alguna de las cláusulas aquí estipuladas, deberás abstenerte de hacer uso de este sitio web.
            </p>
          </section>

          {/* Section 2 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-ninja-card border border-white/5 space-y-3">
            <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-ninja-red" />
              2. Propiedad Intelectual y Marcas
            </h2>
            <p>
              Todos los elementos que componen el ecosistema visual de Ninja House —incluyendo, entre otros: logotipos oficiales, isotipos, audios, intros, gráficos, diseño web, código fuente, nombres de los programas (<em className="text-white">Animes y Ramen</em>, <em className="text-white">Over Head</em>, <em className="text-white">Frikis de M</em>, <em className="text-white">Maldito Plástico</em>, <em className="text-white">Cine Infarto</em> y <em className="text-white">El Plano Oscuro</em>)— son propiedad exclusiva de Ninja House o cuentan con las respectivas licencias de uso autorizadas.
            </p>
            <p>
              Queda estrictamente prohibida la reproducción, duplicación, distribución, venta o explotación con fines lucrativos de cualquier contenido audiovisual o gráfico sin el consentimiento previo y por escrito de la dirección de Ninja House.
            </p>
          </section>

          {/* Section 3 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-ninja-card border border-white/5 space-y-3">
            <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-ninja-red" />
              3. Reglas de Conducta de la Comunidad Ninja
            </h2>
            <p>
              Ninja House fomenta un espacio abierto de debate, humor y pasión por la cultura geek, cine, gaming y coleccionismo. Sin embargo, no se tolerará en nuestros formularios, foros o chats en vivo:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-white/60">
              <li>Conductas de odio, discriminación por origen, raza, género, religión u orientación sexual.</li>
              <li>Acoso, amenazas o difusión no autorizada de información privada de otros miembros de la comunidad o presentadores del staff.</li>
              <li>Spam publicitario, enlaces a malware o intentos de vulnerar la seguridad informática del sitio.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-ninja-card border border-white/5 space-y-3">
            <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-ninja-red" />
              4. Transmisiones en Vivo y Canales Externos
            </h2>
            <p>
              Nuestras transmisiones en directo se emiten primariamente a través de plataformas de terceros como YouTube y Spotify. Ninja House no se responsabiliza por interrupciones de señal, fallos técnicos ajenos a nuestra infraestructura o suspensiones temporales imputables a los servidores de dichos proveedores.
            </p>
          </section>

          {/* Section 5 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-ninja-card border border-white/5 space-y-3">
            <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-ninja-red" />
              5. Auspicios, Alianzas y Publicidad
            </h2>
            <p>
              Las marcas auspiciadoras que aparecen en el sitio web y en los programas en vivo son seleccionadas bajo criterios de afinidad con la cultura y los valores de nuestra audiencia. Ninja House no garantiza ni asume responsabilidad directa por los productos o servicios ofrecidos por anunciantes externos fuera de los acuerdos contractuales explícitos.
            </p>
          </section>

          {/* Section 6 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-ninja-card border border-white/5 space-y-3">
            <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-ninja-red" />
              6. Ley Aplicable y Jurisdicción
            </h2>
            <p>
              Los presentes términos se regirán e interpretarán de acuerdo con las leyes vigentes de la República del Perú. Para la resolución de cualquier litigio o controversia que pudiera suscitarse, las partes se someten a la competencia territorial de los Juzgados y Tribunales de la ciudad de Lima, Perú.
            </p>
          </section>

        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link 
            to="/privacidad" 
            className="text-xs font-display font-bold uppercase tracking-wider text-white/60 hover:text-ninja-red transition-colors"
          >
            ← Ver Política de Privacidad
          </Link>
          <Link 
            to="/contacto" 
            className="px-6 py-3 rounded-xl bg-ninja-red text-white font-display font-black text-xs uppercase tracking-wider hover:bg-ninja-red/90 transition-all shadow-lg shadow-ninja-red/20"
          >
            Contactar al Dojo Oficial
          </Link>
        </div>

      </div>
    </div>
  )
}
