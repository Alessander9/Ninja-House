# 🥷 NINJA HOUSE — PROMPT MAESTRO DEL PROYECTO

> **Stack actual:** React 19 + TypeScript + Vite + Tailwind CSS v3  
> **Router:** React Router DOM v7  
> **Animación:** GSAP + Framer Motion + Lenis  
> **Datos:** Archivos `.ts` estáticos, sin backend

---

## IDENTIDAD DEL PROYECTO

**Ninja House** es una plataforma web para una comunidad geek, gaming y de entretenimiento. La identidad visual es oscura, urbana y neón, con una base de marca fuerte alrededor de un ninja carismático.

**Tokens principales de marca:**

| Token | Uso | Hex |
|---|---|---|
| Verde ninja | Principal | `#67B946` |
| Amarillo acento | Secundario | `#F6D853` |
| Morado profundo | Terciario | `#5A287A` |
| Negro base | Fondo | `#151515` |

La implementación real también usa rojo, naranja y azul como acentos funcionales para programas, estados y llamadas a la acción.

**Assets de marca disponibles en `IMG/`:**
- `logo.png`
- `Logo2.png`
- `NinjaLOGO.png`
- `ninjaHouseLogo.png`
- `banner.png`
- `banner 2.jpg`
- `programacionH.png`
- `programacionH1.png`
- `parrillaNinja.png`
- `parillaVertical.png`
- `horizontalParrilla.png`
- `animesYramenLogo.png`
- `animesYramen1.png`
- `overheadLogo.png`
- `overHead1.png`
- `FreakuenciaLogo.png`
- `freakuencia1.png`
- `malditoPlasticoLogo.png`
- `malditoPlastico1.png`
- `cineinfartoLogo.png`
- `CineInfarto1.png`

---

## STACK TÉCNICO ACTUAL

| Capa | Tecnología | Estado en el proyecto |
|---|---|---|
| Base | React + TypeScript + Vite | Activo |
| Estilos | Tailwind CSS v3 | Activo |
| Routing | React Router DOM v7 | Activo |
| Animación de entrada / scroll | GSAP + `@gsap/react` | Activo en hero y secuencias puntuales |
| Microinteracciones | Framer Motion | Activo en hero, live, cards y badges |
| Scroll suave | Lenis | Activo globalmente |
| Contadores | `requestAnimationFrame` | Activo en hero y métricas |
| Contenido dinámico | `.ts` estáticos | Activo |
| Paquetes instalados adicionales | `@tsparticles/react`, `@tsparticles/slim`, `react-countup` | Instalados, no siempre usados en vistas principales |

Nota: el hero principal usa partículas y texturas CSS propias; `tsParticles` está disponible, pero no es la base visual principal de la vista actual.

---

## ARQUITECTURA REAL DEL CÓDIGO

### `src/components/`
- `about/` -> `AboutSection`
- `collectibles/` -> `CollectiblesSection`
- `contact/` -> `ContactSection`
- `hero/` -> `HeroSection`, `HeroCarousel`, `ParticlesBackground`
- `invest/` -> `InvestSection`
- `layout/` -> `Navbar`, `Footer`, `SectionWrapper`, `SocialSidebar`
- `live/` -> `LiveNowSection`
- `metrics/` -> `MetricsSection`
- `programs/` -> `ProgramsSection`, `ProgramDetailPage`
- `schedule/` -> `ScheduleSection`
- `social/` -> `SocialSection`
- `talents/` -> `TalentsSection`
- `ui/` -> `Button`, `Badge`, `Card`, `LoadingScreen`, `ScrollStack`

### `src/data/`
- `programs.ts`
- `schedule.ts`
- `metrics.ts`
- `investment.ts`
- `collectibles.ts`

### `src/hooks/`
- `useLenis.ts`
- `useReducedMotion.ts`

### `src/lib/`
- `schedule.ts` con lógica de estado y selección de programa actual / siguiente

### `src/pages/`
- `ProgramsPage.tsx`
- `InvestPage.tsx`
- `ContactPage.tsx`
- `MediaKitPage.tsx`

### `src/styles/`
- `globals.css`

---

## RUTAS ACTUALES

`src/App.tsx` monta estas rutas:

- `/` -> landing principal
- `/programa/:id` -> detalle de programa
- `/programas` -> catálogo de programas con `ScrollStack`
- `/invierte` -> página comercial / inversión
- `/contacto` -> página de contacto
- `/media-kit` -> media kit

La app también:
- inicializa `useLenis()`
- muestra `LoadingScreen` durante `2.8s`
- monta `Navbar` y `Footer` globales
- resetea scroll al cambiar de ruta

---

## LANDING ACTUAL

El landing real está compuesto por estas secciones, en este orden:

1. `HeroSection`
2. `AboutSection`
3. `ProgramsSection`
4. `LiveNowSection`
5. `CollectiblesSection`
6. `InvestSection`
7. `MetricsSection`
8. `TalentsSection`
9. `SocialSection`
10. `ContactSection`

Las secciones se separan con líneas de gradiente rojizas tenues.

---

## REGLAS DE DISEÑO Y UX

### Hero
- Debe sentirse vivo, con entrada secuenciada y textura visual.
- El logo entra con GSAP.
- Las estadísticas se animan con un contador React local.
- La experiencia debe respetar `prefers-reduced-motion`.

### Cards y secciones
- Usar hover claros y funcionales.
- Priorizar bordes, glows y cambios de escala sutiles.
- Mantener contraste fuerte sobre fondos oscuros.
- Evitar movimientos excesivos que saturen la vista o dañen mobile.

### Programación
- La programación visible está concentrada de lunes a viernes, a las 9:00 PM.
- Los estados visuales relevantes son `live`, `today`, `next-live`, `upcoming` y `finished`.
- La vista debe dejar claro qué show está al aire, cuál sigue y cuál ya terminó.

### Estética
- Base oscura.
- Acentos neón controlados.
- Texturas tipo halftone / póster urbano.
- Separadores limpios y visualmente intencionales.

---

## IMPLEMENTACIÓN ACTUAL POR ÁREA

### Hero
- `HeroSection.tsx` usa GSAP para la secuencia de entrada.
- `HeroCounter` anima las cifras con `requestAnimationFrame`.
- El fondo usa partículas CSS y gradientes, no depende de una implementación pesada de terceros.

### Programas
- `ProgramsSection` vive en la landing.
- `/programas` usa `ScrollStack` con filtros por categoría.
- La página oculta la barra de scroll con `no-scrollbar` mientras está activa.
- Las cards usan `programs.ts` y color por show.

### En vivo
- `LiveNowSection.tsx` usa Framer Motion para estados, badges, countdown, CRT scanlines y glows.
- La lógica de programación sale de `lib/schedule.ts` y `data/schedule.ts`.
- Existe un modo de simulación por día para depuración visual.

### Métricas
- `MetricsSection.tsx` trabaja con `metrics.ts`.
- Los contadores están animados y orientados a presentar autoridad de marca.

### Comercial
- `InvestPage.tsx` sirve como propuesta comercial / inversión.
- Usa `investment.ts` y `programs.ts` para mostrar beneficios, formatos y oportunidades por show.

### Media kit
- `MediaKitPage.tsx` genera una vista lista para impresión / PDF.
- Resume audiencia, alcance, métricas por plataforma y segmentación por programa.

### Contacto
- `ContactPage.tsx` monta `ContactSection` en una tarjeta contenedora.

---

## DATOS PRINCIPALES

### `programs.ts`
Contiene la ficha de cada programa con:
- `id`
- `slug`
- `title`
- `description`
- `category`
- `day`
- `dayIndex`
- `time`
- `badge`
- `color`
- `emoji`
- `image`
- `focus`
- `talents`
- `segment`
- `sponsorText`

### `schedule.ts`
Contiene la programación semanal con:
- `day`
- `shortDay`
- `dayIndex`
- `time`
- `timeDisplay`
- `endTime`
- `title`
- `description`
- `category`
- `image`
- `color`
- `emoji`
- `host`

Incluye lógica para resolver el estado del programa actual y del próximo.

### `metrics.ts`
Contiene métricas por plataforma y métricas globales de marca.

### `investment.ts`
Contiene beneficios comerciales y formatos de patrocinio.

### `collectibles.ts`
Contiene contenido de coleccionables, drops o piezas relacionadas.

---

## PROGRAMACIÓN VIGENTE

La programación activa hoy es:

- Lunes: `Animes y Ramen`
- Martes: `Overhead`
- Miércoles: `Freakuencia M`
- Jueves: `Maldito Plástico`
- Viernes: `Cine Infarto`

El bloque `Lanzalo` existe como referencia comentada para expansión futura.

---

## NOTAS OPERATIVAS

- Si cambian rutas o secciones, hay que actualizar este documento y `contexto.md` en paralelo.
- Si cambia la programación, editar `src/data/schedule.ts`.
- Si cambian métricas, editar `src/data/metrics.ts`.
- Si cambia el catálogo de programas, editar `src/data/programs.ts`.
- Si cambia la propuesta comercial, editar `src/data/investment.ts`.
- Si cambian los assets de marca, reflejarlo en esta lista.

---

## CRITERIOS DE CALIDAD

- Mantener consistencia visual con la marca Ninja House.
- No introducir librerías nuevas si una solución local ya resuelve el problema.
- Preferir animaciones precisas y ligeras antes que efectos pesados.
- Mantener buen rendimiento móvil.
- Respetar accesibilidad y `prefers-reduced-motion`.
- Evitar desalinear el prompt maestro del código real.

---

*Última actualización: Junio 2026*
