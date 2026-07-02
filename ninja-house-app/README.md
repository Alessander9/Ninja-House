# 🥷 Ninja House

¡Bienvenido al repositorio oficial de **Ninja House**! Esta plataforma es una experiencia web inmersiva diseñada para una comunidad geek, gaming y de entretenimiento digital. La interfaz destaca por una estética oscura premium, acentos neón vibrantes, micro-animaciones fluidas e interacciones retro-analógicas hiperrealistas.

---

## 🚀 Stack Tecnológico

El proyecto está construido sobre un stack moderno y eficiente enfocado en el rendimiento y la calidad visual:

*   **Framework Principal:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/) (para un desarrollo ultra rápido y compilación optimizada).
*   **Estilos:** [Tailwind CSS v3](https://tailwindcss.com/) + PostCSS para una arquitectura de estilos altamente personalizable y responsive.
*   **Enrutador:** [React Router DOM v7](https://reactrouter.com/) (gestión de navegación y carga de páginas).
*   **Animaciones & Secuencias:**
    *   [GSAP (GreenSock Animation Platform)](https://gsap.com/) + `@gsap/react` para animaciones complejas y secuencias cronometradas de entrada.
    *   [Framer Motion](https://www.framer.com/motion/) para microinteracciones fluidas en botones, tarjetas y elementos de interfaz flotantes.
*   **Scroll Suave:** [Lenis Scroll](https://lenis.darkroom.engineering/) para una navegación fluida por toda la landing page.
*   **Efectos Visuales:** `@tsparticles/react` + `@tsparticles/slim` para la renderización de fondos interactivos de partículas.
*   **Métricas y Contadores:** Animaciones personalizadas basadas en `requestAnimationFrame` y `react-countup`.

---

## 🎨 Sistema de Diseño (Design System)

La identidad visual combina la oscuridad cyberpunk con la energía geek utilizando una paleta de colores cuidadosamente curada.

### Colores de Marca (Brand Colors)
*   **Verde Ninja (Principal):** `#67B946`
*   **Amarillo Acento:** `#F6D853`
*   **Morado Profundo:** `#5A287A`
*   **Negro Base (Fondo):** `#151515`

### Colores de Programas Especiales
Cada programa de la parrilla tiene asignada una identidad cromática única:
*   **Animes y Ramen:** Morado (`#7C3AED`) & Rosado Claro (`#E5B8D0`) | Fondo: `#FFF0F6`
*   **Overhead:** Azul (`#2563EB`) & Rojo (`#EF4444`) | Fondo: `#F3F4F6`
*   **Freakuencia M:** Verde (`#16A34A`) & Naranja (`#FB923C`) | Fondo: `#F0FDF4`
*   **Maldito Plástico:** Naranja (`#EA580C`) & Blanco | Fondo: `#FEF3C7`
*   **Cine Infarto:** Rojo (`#DC2626`) & Rosado (`#FEC5D0`) | Fondo: `#FEF2F2`
*   **Lánzalo (Archivo):** Rojo Profundo (`#E11D48`) & Rosado Claro (`#FFB5D0`) | Fondo: `#FEF3F7`

### Tipografía y Espaciados
*   **Familia:** `Inter`, `Helvetica Neue`, sans-serif.
*   **Pesos:** Regular (400) para lectura, Semi-Bold (600) para acentos, Bold (700) para encabezados.
*   **Escala de Tamaños:** H1 (48px), H2 (36px), H3 (28px), H4 (24px), H5 (20px), Body (16px), Small (14px).

---

## 📁 Estructura del Proyecto

El código fuente se organiza bajo el directorio `src/` con un enfoque modular:

```bash
src/
├── components/
│   ├── about/            # Sección de historia y quiénes somos
│   ├── collectibles/     # Componentes de coleccionables digitales
│   ├── contact/          # Formulario y canales de contacto
│   ├── hero/             # Hero, carrusel de programas y fondo de partículas
│   ├── invest/           # Radar e interfaz cyberpunk de inversión
│   ├── layout/           # Navbar, Footer y barras laterales de redes
│   ├── live/             # Indicador en vivo y stream incrustado
│   ├── metrics/          # Tarjetas de estadísticas de redes sociales (FB, YT, IG, TikTok)
│   ├── programs/         # Galería de programas y detalle interactivo
│   ├── schedule/         # Agenda y horarios de transmisión semanal
│   ├── spotify/          # Consola retro de audio y reproductor de cassette
│   ├── social/           # Feed social e integraciones
│   ├── talents/          # Fichas de talentos de la casa
│   └── ui/               # Botones, Badges, Pantallas de carga y ScrollStack
├── data/                 # Archivos de datos estáticos (schedule.ts, programs.ts, etc.)
├── hooks/                # Hooks personalizados (useLenis, useReducedMotion)
├── lib/                  # Utilidades y lógica de agenda
├── pages/                # Páginas principales (Programas, Invierte, Contacto, MediaKit)
└── styles/               # Estilos globales y Tailwind CSS
```

---

## 💎 Integraciones Especiales y Características Premium

### 📼 Consola Retro de Spotify y Cassette Deck Analógico
Ubicada en `src/components/spotify/SpotifySection.tsx`, simula un reproductor físico retro:
*   **Iframe Inteligente:** El iframe oficial de Spotify se desmonta físicamente del DOM al presionar `STOP` para asegurar un silenciado instantáneo sin violar políticas CORS. Cuando está apagado, muestra un monitor CRT retro (*"⚠️ TAPE STANDBY / SIGNAL DISCONNECTED"*). Al presionar `PLAY`, se vuelve a montar.
*   **Cassette SVG Hiperrealista:** Chasis translúcido, tornillos 3D plateados en las esquinas, y bobinas magnéticas animadas que giran al ritmo de la música.
*   **Telemetría VU Meter:** Dos agujas analógicas rojas que oscilan integradas en SVG. La animación calcula de manera concéntrica y trigonométrica la rotación exacta sobre el arco del indicador, sincronizado con un brillo de fondo ámbar activo durante la reproducción.

### 📈 Radar de Inversión Cyberpunk
La sección de inversionistas (`src/pages/InvestPage.tsx`) cuenta con:
*   Un radar digital verde que realiza barridos circulares constantes mediante CSS.
*   Un simulador interactivo de presupuesto que calcula el alcance proyectado de la campaña según el capital ingresado.
*   Mini-reproductor flotante móvil que acompaña al usuario al hacer scroll.

### 📄 Media Kit Híbrido e Imprimible
Diseñado en `src/pages/MediaKitPage.tsx`, permite una doble visualización:
*   **Digital:** Tarjetas de métricas interactivas y degradados modernos para navegación web.
*   **Impreso:** Al presionar "Imprimir", reglas CSS `@media print` ocultan componentes no esenciales (Navbar, Footer, botones flotantes) y reestructuran los datos en tablas limpias de alto contraste para formato físico de negocios.

---

## 🗺️ Rutas y Navegación

El archivo central `src/App.tsx` controla las siguientes rutas:

*   `/` -> Página de inicio (Landing Page unificada con Hero, About, Programs, Live, Invest, Spotify, Metrics, Social, Contact).
*   `/programas` -> Galería interactiva con el componente `ScrollStack`.
*   `/programa/:id` -> Vista detallada de cada programa.
*   `/invierte` -> Panel premium para patrocinadores e inversores.
*   `/contacto` -> Formulario de comunicación.
*   `/media-kit` -> Información corporativa e imprimible.

---

## 📅 Parrilla de Programación Semanal

Las transmisiones principales ocurren a las **9:00 PM** en los siguientes días:

*   **Lunes:** *Animes y Ramen* 🍜 (Anime, manga y cultura japonesa)
*   **Martes:** *Overhead* 🎧 (Música, tendencias y cultura pop)
*   **Miércoles:** *Freakuencia M* 👾 (Gaming, reviews y torneos)
*   **Jueves:** *Maldito Plástico* 🧸 (Coleccionismo de figuras y juguetes retro)
*   **Viernes:** *Cine Infarto* 🍿 (Películas de culto, terror y serie B)

---

## 🛠️ Desarrollo Local

Sigue estos pasos para levantar la aplicación en tu entorno de desarrollo local:

### Prerrequisitos
*   Node.js (versión 18 o superior recomendada)
*   npm o yarn

### Pasos de Instalación
1.  Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/ninja-house.git
    cd ninja-house/ninja-house-app
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Abre en tu navegador la dirección indicada en consola (normalmente `http://localhost:5173`).

### Compilación para Producción
Para compilar la aplicación optimizada para el entorno de producción, ejecuta:
```bash
npm run build
```
Los archivos optimizados se generarán dentro de la carpeta `dist/`.

---

## 🌐 Despliegue en Vercel

El proyecto está configurado para desplegarse de manera ágil y directa a través de la CLI de Vercel.

### Despliegue Manual con la CLI
1.  Instala o ejecuta la CLI de Vercel:
    ```bash
    npx vercel
    ```
2.  Sigue las instrucciones interactivas para vincular el proyecto a tu cuenta.
3.  Para desplegar a producción final, ejecuta:
    ```bash
    npx vercel --prod
    ```

### Configuración del Dominio de Prueba
El entorno de pruebas principal está desplegado en Vercel bajo el nombre de proyecto `ninjahouse-app`, generando la siguiente dirección de prueba accesible:
🔗 **[ninjahouse-app.vercel.app](https://ninjahouse-app.vercel.app)**

---
*Ninja House Web Platform - Creado con 💚 y pasión por el entretenimiento geek.*
