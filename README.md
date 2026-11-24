# Ninja House Web Platform

> Plataforma web interactiva e inmersiva de streaming, entretenimiento geek, gaming y cultura pop, diseñada para la comunidad digital hispanohablante y marcas patrocinadoras de contenido en vivo.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-F6D853?style=for-the-badge)](LICENSE)
[![Production](https://img.shields.io/badge/Production-Live-67B946?style=for-the-badge&logo=apache&logoColor=white)](https://ninjahouseshow.com)

**🌐 Producción Oficial:** [https://ninjahouseshow.com](https://ninjahouseshow.com)  
**⚡ Mirror de Desarrollo:** [https://ninjahouse-app.vercel.app](https://ninjahouse-app.vercel.app)

---

## Qué hace

Ninja House centraliza el ecosistema digital de un canal de streaming y creación de contenido temático con identidad cyberpunk y retro-analógica. Sus funcionalidades principales comprenden:

1. **Hub de Programación Semanal en Vivo**:
   - Cartelera interactiva de emisiones periódicas con sincronización horaria y estados en vivo (*Animes y Ramen*, *Overhead*, *Freakuencia M*, *Maldito Plástico*, *Cine Infarto* y el archivo de *Lánzalo*).
   - Páginas de detalle por programa con paletas cromáticas contextuales dinámicas y perfiles de conductores.
2. **Consola de Audio Retro (Spotify Cassette Deck)**:
   - Reproductor interactivo de audio con chasis de cassette transparente SVG hiperrealista y bobinas magnéticas animadas.
   - Telemetría de medidores **VU-Meter** analógicos duales calculados trigonométricamente sobre el arco de rotación mediante `requestAnimationFrame`.
   - Control de aislamiento de Iframe inteligente para pausa instantánea sin bloqueos de políticas CORS de terceros.
3. **Radar de Inversión Cyberpunk & Simulador de Pauta**:
   - Simulador presupuestario para anunciantes que calcula el alcance estimado en millones de impresiones y engagement proyectado.
   - Radar animado de barrido visual en CSS para presentación de métricas a inversores.
4. **Media Kit Híbrido (Web e Imprimible)**:
   - Panel de datos corporativos y demografía de audiencia.
   - Optimización automática con reglas `@media print` que transforma la página en un dossier corporativo limpio para descarga directa a PDF.
5. **Directorio y Social Sync de Talentos**:
   - Fichas biográficas de los hosts y acceso directo a sus canales de YouTube, TikTok, Instagram y Spotify.
6. **Experiencia de Navegación Inercial**:
   - Scroll ultra-suave impulsado por Lenis, microinteracciones con Framer Motion y secuencias de entrada orquestadas con GSAP.

---

## Arquitectura

La solución se estructura como una **Single Page Application (SPA)** desacoplada bajo el modelo de **4+1 Vistas de Arquitectura RUP (Rational Unified Process)**:

```mermaid
flowchart TD
    subgraph Cliente["Navegador Web (Desktop / Mobile)"]
        UI["Capa de Presentación React 19 + Tailwind"]
        Hooks["Hooks Inerciales (useLenis, useReducedMotion)"]
        State["Estado Reactivo Local & Router v7"]
    end

    subgraph Hosting_Produccion["Servidor de Producción (Ferozo / DonWeb)"]
        Apache["Servidor Apache 2.4 (IP: 200.58.104.120)"]
        SSL["Certificado TLS 1.3 Let's Encrypt"]
        Rewrite["mod_rewrite (.htaccess SPA routing)"]
        Files["Archivos Estáticos (/public_html/assets)"]
    end

    subgraph Servicios_Externos["Integraciones Cloud"]
        Cloudinary["Cloudinary CDN (Video Promo / Banners)"]
        Spotify["Spotify Embed / Web Player"]
        YouTube["YouTube Live & Playlists Data"]
    end

    UI --> Hooks
    Hooks --> State
    Cliente -->|HTTPS / 443| SSL
    SSL --> Apache
    Apache --> Rewrite
    Rewrite --> Files
    UI -.->|Streaming Audio| Spotify
    UI -.->|Media Assets| Cloudinary
    UI -.->|Transmisión en Vivo| YouTube
```

📖 **Documentación arquitectónica completa y especificación técnica detallada en:**  
👉 **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**

---

### Diagramas RUP UML

#### 1. RUP Vista de Casos de Uso (Use Case View)

```mermaid
flowchart LR
    Fan((Espectador Geek))
    Sponsor((Marca / Inversionista))
    Admin((Administrador))

    subgraph Ninja_House_System["Sistema Web Ninja House"]
        UC1(["Consultar Parrilla y Horarios"])
        UC2(["Ver Detalle de Programa y Talentos"])
        UC3(["Operar Cassette Deck Analógico"])
        UC4(["Sintonizar Live Stream"])
        UC5(["Simular Presupuesto Publicitario"])
        UC6(["Exportar Media Kit a PDF"])
        UC7(["Enviar Propuesta por Formulario"])
        UC8(["Ejecutar Sync de Métricas Sociales"])
        UC9(["Desplegar Build a Producción"])
    end

    Fan --> UC1
    Fan --> UC2
    Fan --> UC3
    Fan --> UC4
    Fan --> UC7

    Sponsor --> UC5
    Sponsor --> UC6
    Sponsor --> UC7

    Admin --> UC8
    Admin --> UC9
```

#### 2. RUP Vista Lógica (Logical View / Diagrama de Clases UML)

```mermaid
classDiagram
    class Program {
        +string id
        +string title
        +string slug
        +string scheduleDay
        +string scheduleTime
        +string primaryColor
        +string secondaryColor
        +string description
        +string[] tags
        +string[] hosts
        +string bannerUrl
    }

    class Talent {
        +string id
        +string name
        +string role
        +string programId
        +string avatarUrl
        +SocialLinks socials
    }

    class SocialLinks {
        +string instagram
        +string tiktok
        +string youtube
        +string spotify
    }

    class MetricStat {
        +string platform
        +number followers
        +string engagementRate
        +string icon
    }

    class InvestmentTier {
        +string name
        +number minBudget
        +number estimatedImpressions
        +string[] deliverables
    }

    Program "1" *-- "1..*" Talent : presenta
    Talent "1" *-- "1" SocialLinks : dispone
    InvestmentTier ..> MetricStat : correlaciona impacto
```

#### 3. RUP Vista de Despliegue Físico (Deployment View)

```mermaid
deploymentView
flowchart LR
    nodeClient["Dispositivo Usuario<br/>(Navegador Chrome / Safari / Firefox)"]
    
    subgraph DonWeb_Infra["Nodo Servidor Ferozo (DonWeb)"]
        nodeApache["Servidor Web Apache 2.4<br/>Puerto 443 / SSL"]
        nodeStorage["Sistema de Archivos Linux<br/>/public_html"]
    end

    subgraph CDNs["Redes CDN & APIs Externas"]
        nodeCloudinary["Cloudinary Media Server"]
        nodeSpotify["Spotify Audio CDN"]
    end

    nodeClient -->|HTTPS / TLS 1.3| nodeApache
    nodeApache --> nodeStorage
    nodeClient -.->|Iframe Audio| nodeSpotify
    nodeClient -.->|Optimized Images| nodeCloudinary
```

---

## Inicio rápido

### Prerrequisitos
* **Node.js**: v18.0.0 o superior (recomendado v20+ / v24 LTS).
* **Gestor de paquetes**: `npm` (incluido en Node) o `pnpm`.

### Instalación y Ejecución

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Alessander9/Ninja-House.git
   cd Ninja-House/ninja-house-app
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en modo de desarrollo local**:
   ```bash
   npm run dev
   ```
   La consola indicará el puerto local activo (por defecto `http://localhost:5173`).

4. **Compilar para producción**:
   ```bash
   npm run build
   ```
   Genera el bundle compilado y minificado en la carpeta `dist/`.

5. **Previsualizar la compilación de producción**:
   ```bash
   npm run preview
   ```

---

## Configuración (.env.example)

Crea un archivo `.env` en la raíz de `ninja-house-app/` tomando como referencia [.env.example](ninja-house-app/.env.example):

```env
# Configuración del CDN de Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=akbhdsaa
CLOUDINARY_API_KEY=128275187432123
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name

# Licencia UI (React Bits Pro / Componentes especializados)
REACTBITS_LICENSE_KEY=your_reactbits_license_key_here
```

### Tabla de Variables de Entorno

| Variable | Requerida | Propósito | Entorno |
|---|---|---|---|
| `VITE_CLOUDINARY_CLOUD_NAME` | Sí | Nombre del bucket/cloud en Cloudinary para optimización de imágenes en el cliente Vite. | Cliente / Frontend |
| `CLOUDINARY_API_KEY` | Opcional | Clave pública para scripts CLI de subida de assets multimedia. | Node CLI / Scripts |
| `CLOUDINARY_API_SECRET` | Opcional | Clave secreta para autenticación en la API de Cloudinary. | Node CLI / Scripts |
| `CLOUDINARY_URL` | Opcional | Cadena de conexión unificada para scripts de automatización. | Node CLI / Scripts |
| `REACTBITS_LICENSE_KEY` | Opcional | Licencia para efectos y micro-componentes UI animados. | Build Time |

---

## Modelos y datos usados

El sistema adopta una arquitectura basada en **fuentes de datos inmutables y tipadas** ubicadas en `src/data/`:

* **`programs.ts` & `programThemes.ts`**: Contiene la definición canónica de cada show, sus tokens de color primario/secundario, horarios de transmisión, tags de temática y badges.
* **`schedule.ts`**: Modela la grilla semanal de emisión (Lunes a Viernes a las 9:00 PM y Viernes 5:00 PM para Cine Infarto).
* **`talents.ts` & `talent_links.json`**: Datos de los conductores, perfiles sociales y enlaces oficiales directos.
* **`metrics.ts`**: Métricas de comunidad (alcance global, visualizaciones mensuales, engagement rate y seguidores por plataforma).
* **`investment.ts`**: Estructura de paquetes para auspiciadores (Sponsor Principal, Segmento Exclusivo, Integración de Marca) y fórmulas de proyección de impacto publicitario.
* **`collectibles.ts`**: Definición de tarjetas de colección y memorabilia digital de la marca.

---

## Evaluación y resultados

La plataforma fue evaluada mediante auditorías de rendimiento, accesibilidad y pruebas de estrés visual:

* **Compilación ultra-rápida**: Bundle generado en **1.83 segundos** gracias a la optimización de Vite y Rolldown.
* **Code Splitting & Chunks**:
  - `dist/assets/index-CCyA0FqC.css`: 112.27 kB (17.67 kB gzipped).
  - `dist/assets/vendor-react-*.js`: 223.13 kB (71.40 kB gzipped).
  - `dist/assets/vendor-animation-*.js`: 248.72 kB (88.61 kB gzipped).
* **Consumo de Memoria**: Control de animaciones GSAP y `requestAnimationFrame` que se suspenden automáticamente cuando los componentes salen del viewport del usuario.
* **Respuesta del Servidor Ferozo/Apache**: TTFB < 90ms bajo conexión segura TLS 1.3 con compresión gzip nativa.

---

## Seguridad y limitaciones conocidas

### Medidas de Seguridad Implementadas
1. **Reglas de Seguridad HTTP en `.htaccess`**:
   - `X-Content-Type-Options: nosniff` (previene ataques de tipo MIME).
   - `X-Frame-Options: SAMEORIGIN` (mitigación de Clickjacking).
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (fuerza navegación HTTPS estricta).
   - `Referrer-Policy: strict-origin-when-cross-origin`.
2. **Mitigación CORS en el Iframe de Spotify**:
   - Aislamiento en sandbox sin intentar acceder a APIs internas del iframe ajeno al origen.
3. **Certificación TLS 1.3**:
   - Certificado oficial de **Let's Encrypt** con renovación de 90 días y soporte SNI dual (`ninjahouseshow.com` y `www.ninjahouseshow.com`).

### Limitaciones Conocidas
* **Sin Base de Datos Relacional Centralizada**: Los datos de programación y talentos se compilan estáticamente en el frontend; las actualizaciones editoriales requieren un nuevo despliegue o la ejecución de los scripts de sincronización (`npm run sync:metrics`).
* **Dependencia de Redes de Terceros**: Las transmisiones en vivo y el catálogo musical dependen de la disponibilidad operativa de YouTube y Spotify.

---

## Costos y rendimiento

* **Costo Operativo de Infraestructura**: **$0 adicionales** sobre el plan de Web Hosting compartido contratado (Apache en DonWeb Ferozo) y capa gratuita (Hobby) de Vercel.
* **Certificado SSL**: **$0** (generación y renovación automatizada con Let's Encrypt).
* **Media Storage**: **$0** (aprovechamiento de la capa gratuita de Cloudinary y compresión estática local).
* **Presupuesto de Rendimiento**: Carga inicial completa del DOM en < 1.2s en redes 4G estándar.

---

## Estructura del proyecto

```text
Ninja House/
├── docs/                                  # Documentación técnica profunda
│   └── ARCHITECTURE.md                    # Arquitectura RUP, vistas 4+1 y ADRs
├── IMG/                                   # Assets visuales brutos de marca y logos
├── NH - REBRAND/                          # Manuales de marca y archivos de diseño
├── ninja-house-app/                       # Aplicación React 19 + TypeScript
│   ├── public/                            # Archivos públicos directos
│   │   ├── .htaccess                      # Configuración Apache para React Router
│   │   ├── _redirects                     # Redirecciones para Netlify/Cloudflare
│   │   ├── favicon.svg                    # Isotipo de pestaña
│   │   ├── robots.txt                     # Directivas para rastreadores de búsqueda
│   │   └── sitemap.xml                    # Mapa de URLs del sitio
│   ├── scripts/                           # Scripts de automatización y CLI
│   │   ├── fetch-playlists.mjs            # Extracción de listas de reproducción
│   │   ├── render-promo.mjs               # Renderizado automatizado de video promo
│   │   ├── sync-social-metrics.mjs        # Sincronización de métricas multired
│   │   └── upload-to-cloudinary.mjs       # Subida de assets al CDN
│   ├── src/
│   │   ├── components/                    # Componentes modulares
│   │   │   ├── about/                     # Sección institucional
│   │   │   ├── collectibles/              # Coleccionables digitales
│   │   │   ├── contact/                   # Formulario y canales de contacto
│   │   │   ├── hero/                      # Hero section, carrusel y partículas
│   │   │   ├── invest/                    # Radar y simulador de auspiciadores
│   │   │   ├── layout/                    # Navbar, Footer y barras laterales
│   │   │   ├── live/                      # Indicador de estado y stream incrustado
│   │   │   ├── metrics/                   # Módulos de estadísticas de audiencia
│   │   │   ├── programs/                  # Grilla, cards y detalle de programas
│   │   │   ├── schedule/                  # Parrilla horaria semanal interactiva
│   │   │   ├── social/                    # Feed de publicaciones sociales
│   │   │   ├── spotify/                   # Cassette Deck y consola analógica
│   │   │   ├── talents/                   # Perfiles de creadores de contenido
│   │   │   └── ui/                        # Componentes atómicos (Button, Card, Badge)
│   │   ├── data/                          # Fuentes de datos inmutables (.ts)
│   │   ├── hooks/                         # Hooks de ciclo de vida (useLenis, etc.)
│   │   ├── lib/                           # Utilidades de fecha y formateo
│   │   ├── pages/                         # Vistas de ruta principales
│   │   └── styles/                        # Tailwind CSS y directivas globales
│   ├── .env.example                       # Plantilla de variables de entorno
│   ├── package.json                       # Dependencias y scripts NPM
│   ├── tailwind.config.js                 # Tokens de diseño y colores neón
│   └── vite.config.ts                     # Configuración del bundler Vite
├── contexto.md                            # Resumen de contexto del proyecto
├── DESIGN_SYSTEM.md                       # Especificación del sistema de diseño
└── README.md                              # Documentación principal del repositorio
```

---

## Tests

El proyecto implementa una suite de verificación multifase:

### 1. Validación de Tipos Estáticos
```bash
npm --prefix ninja-house-app run build
# Ejecuta: tsc -b && vite build
```
Asegura consistencia de interfaces TypeScript en el 100% de los componentes.

### 2. Análisis Estático de Código (Linter)
```bash
npm --prefix ninja-house-app run lint
# Ejecuta oxlint: linter de alta velocidad en Rust
```

### 3. Pruebas de Regresión Visual Responsiva (Playwright)
En el directorio `ninja-house-app/scratch/` se encuentran scripts automatizados con Playwright para validar la fidelidad visual:
* `test_responsive.cjs`: Comprueba la grilla y el orden de elementos en viewports móvil (390px), tablet (768px) y escritorio (1360px).
* `test_aspect.cjs`: Valida que los iframes de video y el reproductor de cassette conserven su relación de aspecto analógica.

---

## Documentación adicional

Para profundizar en áreas específicas del proyecto, consulta los documentos de soporte:

* 🏛️ **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**: Arquitectura detallada con RUP 4+1 vistas, diagramas UML y decisiones técnicas (ADRs).
* 🎨 **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)**: Guía de estilos, tokens hexadecimales, tipografías y paletas cromáticas por programa.
* 👥 **[TALENT_SOCIALS.md](TALENT_SOCIALS.md)**: Directorio completo de creadores, redes verificadas y fichas técnicas.
* 📋 **[RESUMEN_EJECUTIVO.md](RESUMEN_EJECUTIVO.md)**: Resumen ejecutivo del negocio y parrilla programática.
* 🗺️ **[MAPA_VISUAL.md](MAPA_VISUAL.md)**: Diagrama de navegación y estructura de pantallas.

---

## Contribuir · Licencia · Contacto

### Cómo Contribuir
1. Realiza un Fork del repositorio.
2. Crea una rama para tu feature o bugfix:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus commits siguiendo la convención de [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(spotify): optimizar renderizado de agujas VU"
   ```
4. Envía tu Pull Request a la rama `main`.

### Licencia
Distribuido bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para mayores detalles.

### Contacto Oficial
* **Sitio Web**: [https://ninjahouseshow.com](https://ninjahouseshow.com)
* **Correo Corporativo**: [contacto@ninjahouseshow.com](mailto:contacto@ninjahouseshow.com)
* **YouTube**: [@NinjaHousepe](https://www.youtube.com/@NinjaHousepe)
* **Instagram**: [@ninjahousepe](https://www.instagram.com/ninjahousepe)
* **TikTok**: [@ninjahousepe](https://www.tiktok.com/@ninjahousepe)
* **Spotify**: [Ninja House Show](https://open.spotify.com/show/7s0mFGBj7n5eG4cQc3yW4J)
