# 🥷 Contexto del Proyecto: Ninja House

Este documento resume el estado real del proyecto **Ninja House** a partir del código que existe hoy en `ninja-house-app/`.

## 1. Identidad del Proyecto
**Ninja House** es una plataforma web para una comunidad geek, gaming y de entretenimiento. La identidad visual combina una base oscura con acentos neón.

**Tokens de marca principales:**
- Verde ninja: `#67B946`
- Amarillo acento: `#F6D853`
- Morado profundo: `#5A287A`
- Negro base: `#151515`

En la implementación actual también aparecen acentos en rojo, naranja y azul para diferenciar programas, estados y secciones.

## 2. Stack Tecnológico Actual
El proyecto está montado en `ninja-house-app` con este stack:
- **Base:** React 19 + TypeScript + Vite
- **Estilos:** Tailwind CSS v3
- **Router:** React Router DOM v7
- **Animación:** GSAP + `@gsap/react`
- **Microinteracciones:** Framer Motion
- **Scroll suave:** Lenis
- **Contadores / métricas:** animaciones propias con `requestAnimationFrame`
- **Otros paquetes instalados:** `@tsparticles/react`, `@tsparticles/slim`, `react-countup`
- **Integraciones Especiales:**
  - Desmontaje condicional del iframe de Spotify para pausado inmediato analógico por políticas de seguridad (CORS).
  - Cálculo trigonométrico en línea dentro de SVG para el barrido concéntrico preciso de las agujas de los medidores VU.

## 3. Estructura Real del Proyecto
El árbol de `src/` actual incluye:

- **`components/about/`**: sección `AboutSection`
- **`components/collectibles/`**: sección `CollectiblesSection`
- **`components/contact/`**: sección `ContactSection`
- **`components/hero/`**: `HeroSection`, `HeroCarousel` y `ParticlesBackground`
- **`components/invest/`**: `InvestSection`
- **`components/layout/`**: `Navbar`, `Footer`, `SectionWrapper`, `SocialSidebar`
- **`components/live/`**: `LiveNowSection`
- **`components/metrics/`**: `MetricsSection`
- **`components/programs/`**: `ProgramsSection`, `ProgramDetailPage` y `ProgramLoadingScreen`
- **`components/schedule/`**: `ScheduleSection`
- **`components/spotify/`**: `SpotifySection` (Consola oficial de audio y cassette)
- **`components/social/`**: `SocialSection`
- **`components/talents/`**: `TalentsSection`
- **`components/ui/`**: `Button`, `Badge`, `Card`, `LoadingScreen`, `ScrollStack`
- **`data/`**: `schedule.ts`, `programs.ts`, `programThemes.ts`, `metrics.ts`, `investment.ts`, `collectibles.ts`
- **`hooks/`**: `useLenis.ts`, `useReducedMotion.ts`
- **`lib/`**: lógica de agenda en `schedule.ts`
- **`pages/`**: `ProgramsPage.tsx`, `InvestPage.tsx`, `ContactPage.tsx`, `MediaKitPage.tsx`
- **`styles/`**: `globals.css`

## 4. Rutas y Flujo de la App
`src/App.tsx` hoy:
- inicializa `useLenis()`
- muestra `LoadingScreen` durante `2.8s` (versión minimalista refinada con anillos concéntricos)
- monta `Navbar`, `Footer` y el router principal

Rutas activas:
- `/` -> landing principal
- `/programa/:id` -> detalle de programa
- `/programas` -> página de programas con `ScrollStack`
- `/invierte` -> página de inversión
- `/contacto` -> página de contacto
- `/media-kit` -> página de media kit

### Landing actual
La landing no solo contiene hero y programa principal. El orden actual es:
1. `HeroSection` (con línea divisoria superior atenuada `border-white/[0.03]` para los marcadores)
2. `AboutSection`
3. `ProgramsSection`
4. `LiveNowSection`
5. `InvestSection`
6. `SpotifySection` (Nueva consola retro analógica integrada)
7. `MetricsSection` (Tarjeta de Facebook con icono SVG y animación azul activa)
8. `SocialSection`
9. `ContactSection`

Las secciones están separadas con líneas de gradiente rojas tenues.

## 5. Estado de Implementación Relevante

### Hero
- `HeroSection.tsx` usa GSAP para la secuencia de entrada.
- El contador del hero está implementado con un componente React local llamado `HeroCounter`.
- La línea superior que separa los marcadores del carrusel se atenuó de `border-white/8` a `border-white/[0.03]` para un look premium.

### Consola de Spotify y Cassette Deck Analógico
- `SpotifySection.tsx` presenta un mueble de control analógico de dos columnas:
  - **Izquierda (Spotify Embed):** Iframe oficial que se desmonta físicamente al presionar `STOP` para silenciar la señal de audio y simular parada física. En estado apagado, muestra un monitor CRT retro: *"⚠️ TAPE STANDBY / SIGNAL DISCONNECTED"*. Al dar `PLAY`, se vuelve a montar el reproductor instantáneamente.
  - **Derecha (Cassette Deck SVG):** Un cassette hiperrealista con chasis oscuro translúcido, tornillos 3D plateados en las esquinas, rodillos guía y bobinas magnéticas giratorias. La etiqueta superior incluye franjas de colores retro y muestra el título completo en 2 líneas centradas y en negrita sin cortes.
  - **Telemetría VU:** Dos medidores con retroiluminación ámbar reactiva (brilla en `PLAY` y se apaga en `STOP`) y agujas rojas que oscilan integradas directamente en el SVG mediante cálculo de coordenadas trigonométricas, garantizando un centrado perfecto sobre el arco.

### Página Invierte (Rediseño Absoluto)
- `InvestPage.tsx` abandonó el tema oscuro simple por una estética corporativa Ninja Green premium:
  - Radar de inversión digital que pulsa en verde.
  - Selectores cyberpunk personalizados y un simulador de presupuesto interactivo que calcula el alcance estimado según la inversión.
  - Mini-reproductor flotante móvil que se activa al hacer scroll.

### Media Kit Imprimible Híbrido
- `MediaKitPage.tsx` muestra estadísticas interactivas en pantalla y, al presionar "Imprimir / PDF", utiliza media queries `@media print` para ocultar la barra de navegación, botones flotantes y degradados de color, reestructurando toda la data comercial en una tabla clásica de alto contraste blanco y negro idónea para reuniones ejecutivas.

### Iconos de Redes Sociales
- `MetricsSection.tsx` cuenta con soporte y renderizado de logos vectoriales para YouTube, Instagram, TikTok y Facebook (`FacebookIcon`), solucionando el vacío que tenía la tarjeta de Facebook anteriormente.

## 6. Datos y Assets

### Datos estáticos
Los datos principales viven en:
- `src/data/programs.ts`
- `src/data/schedule.ts`
- `src/data/metrics.ts`
- `src/data/investment.ts`
- `src/data/collectibles.ts`

### Assets en `IMG/`
Los assets de marca existen en `IMG/` como fuente original y en `ninja-house-app/public/assets/` como los archivos consumidos por la app. Entre los de mayor uso:
- `logo.png`
- `Logo2.png`
- `NinjaLOGO.png`
- `ninjaHouseLogo.png`
- `animesYramenLogo.png`
- `overheadLogo.png`
- `FreakuenciaLogo.png`
- `malditoPlasticoLogo.png`
- `cineinfartoLogo.png`

## 7. Programación Actual
La programación visible hoy está concentrada de lunes a viernes, con emisiones a las 9:00 PM:
- Lunes: `Animes y Ramen`
- Martes: `Overhead`
- Miércoles: `Freakuencia M`
- Jueves: `Maldito Plástico`
- Viernes: `Cine Infarto`

`Lanzalo` quedó retirado del flujo activo y no se muestra como programa vigente en la navegación principal.

## 8. Navegación Y Secciones
- `Drops` fue desactivado en la navegación principal.
- `TalentsSection` y `CollectiblesSection` quedaron comentadas en el `LandingPage`.

## 9. Observaciones
- La experiencia de cada sección utiliza técnicas de hardware realístico (tornillos en esquinas de gabinetes, reflejos CRT de vidrio, perillas rotatorias de ganancia y ecualización BASS/TREBLE).
- Toda la aplicación se valida a nivel de compilación mediante `npm run build` sin errores de tipado de TypeScript ni importaciones rotas.

*Última actualización: Junio 2026*
