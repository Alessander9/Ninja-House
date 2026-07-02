import { useState } from 'react'

export function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    reason: 'Auspicio',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulate submission
    setSubmitted(true)
    
    // Create mailto link as fallback
    const subject = encodeURIComponent(`Ninja House Contacto - ${form.reason} de ${form.name}`)
    const body = encodeURIComponent(
      `Nombre: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Empresa/Marca: ${form.company}\n` +
      `Motivo: ${form.reason}\n\n` +
      `Mensaje:\n${form.message}`
    )
    
    // Open email client after 1.5s simulation
    setTimeout(() => {
      window.location.href = `mailto:Contacto@ninjahouseshow.com?subject=${subject}&body=${body}`
      setSubmitted(false)
      setForm({ name: '', email: '', company: '', reason: 'Auspicio', message: '' })
    }, 1200)
  }

  return (
    <section id="contact-section" className="py-24 px-4 bg-ninja-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
      <div 
        className="absolute bottom-0 right-0 w-[500px] h-[300px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(103,185,70,0.06) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      />
      <div 
        className="absolute top-0 left-0 w-[400px] h-[400px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(184,40,40,0.06) 0%, transparent 70%)',
          filter: 'blur(90px)'
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-ninja-green/10 border border-ninja-green/30 rounded-full text-ninja-green font-display font-bold text-xs tracking-widest mb-4">
            ✉️ CONTACTO DEL DOJO
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2">
            Entra en{' '}
            <span className="text-ninja-green" style={{ textShadow: '0 0 30px rgba(103,185,70,0.4)' }}>
              Contacto
            </span>
          </h2>
          <p className="text-white/40 mt-3 font-body max-w-xl mx-auto text-sm md:text-base">
            ¿Quieres ser auspiciador, colaborar o ser parte de un show? Envíanos un mensaje y te responderemos de inmediato.
          </p>
        </div>

        {/* Contact Form Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar contact info */}
          <div className="md:col-span-1 flex flex-col gap-6 text-center md:text-left">
            <div className="p-6 rounded-2xl bg-ninja-card border border-white/5 flex flex-col gap-4 items-center md:items-start">
              <span className="text-2xl text-ninja-green">📧</span>
              <div>
                <h4 className="font-display font-black text-sm text-white uppercase tracking-wider">Email Oficial</h4>
                <a href="mailto:Contacto@ninjahouseshow.com" className="text-ninja-green hover:underline text-sm font-body break-all">
                  Contacto@ninjahouseshow.com
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-ninja-card border border-white/5 flex flex-col gap-4 items-center md:items-start">
              <span className="text-2xl text-ninja-green">📍</span>
              <div>
                <h4 className="font-display font-black text-sm text-white uppercase tracking-wider">Ubicación</h4>
                <p className="text-white/50 text-sm font-body">
                  Lima, Perú — Dojo de Transmisión.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-ninja-card border border-white/5 flex flex-col gap-4 items-center md:items-start">
              <span className="text-2xl text-ninja-green">🕒</span>
              <div>
                <h4 className="font-display font-black text-sm text-white uppercase tracking-wider">Transmisiones</h4>
                <p className="text-white/50 text-sm font-body">
                  Lunes a Viernes y Domingos 9:00 PM - 11:00 PM.
                </p>
              </div>
            </div>
          </div>

          {/* Form component */}
          <div className="md:col-span-2">
            <form 
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl bg-ninja-card border border-white/5 flex flex-col gap-5 text-left relative overflow-hidden"
            >
              {/* Halftone circular highlight inside form */}
              <div className="absolute inset-0 halftone-bg opacity-5 pointer-events-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="form-name" className="text-xs font-display font-bold text-white/60">Nombre completo</label>
                  <input 
                    id="form-name"
                    type="text" 
                    required
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-body text-sm focus:outline-none focus:border-ninja-green transition-all"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="form-email" className="text-xs font-display font-bold text-white/60">Correo electrónico</label>
                  <input 
                    id="form-email"
                    type="email" 
                    required
                    placeholder="correo@ejemplo.com"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-body text-sm focus:outline-none focus:border-ninja-green transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="form-company" className="text-xs font-display font-bold text-white/60">Empresa / Marca</label>
                  <input 
                    id="form-company"
                    type="text" 
                    placeholder="Nombre de tu marca"
                    value={form.company}
                    onChange={(e) => setForm({...form, company: e.target.value})}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-body text-sm focus:outline-none focus:border-ninja-green transition-all"
                  />
                </div>

                {/* Reason */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="form-reason" className="text-xs font-display font-bold text-white/60">Motivo del contacto</label>
                  <select 
                    id="form-reason"
                    value={form.reason}
                    onChange={(e) => setForm({...form, reason: e.target.value})}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-body text-sm focus:outline-none focus:border-ninja-green transition-all"
                  >
                    <option className="bg-ninja-card text-white" value="Auspicio">Auspiciar / Sponsor</option>
                    <option className="bg-ninja-card text-white" value="Inversión">Inversión Comercial</option>
                    <option className="bg-ninja-card text-white" value="Colaboración">Colaboración de Contenido</option>
                    <option className="bg-ninja-card text-white" value="Prensa">Prensa / Medios</option>
                    <option className="bg-ninja-card text-white" value="Invitado">Participar como Invitado</option>
                    <option className="bg-ninja-card text-white" value="Otro">Otro Asunto</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="form-message" className="text-xs font-display font-bold text-white/60">Mensaje</label>
                <textarea 
                  id="form-message"
                  required
                  rows={4}
                  placeholder="Escribe tu consulta detallada aquí..."
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-body text-sm focus:outline-none focus:border-ninja-green transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <button 
                type="submit"
                disabled={submitted}
                className="w-full py-4 bg-ninja-green text-ninja-black font-display font-black text-sm rounded-xl hover:bg-ninja-green/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-ninja-green/10"
              >
                {submitted ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-ninja-black border-t-transparent animate-spin" />
                    <span>Redireccionando a tu correo...</span>
                  </>
                ) : (
                  <>
                    <span>✉️ Enviar Mensaje</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  )
}
