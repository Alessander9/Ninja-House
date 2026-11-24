# 🏛️ Arquitectura del Sistema — Ninja House Web Platform

Este documento detalla la arquitectura de software de la plataforma **Ninja House**, basada en el estándar **RUP (Rational Unified Process)** y el modelo de **4+1 Vistas de Arquitectura de Philippe Kruchten**.

---

## 📑 Tabla de Contenidos
1. [Visión General del Sistema](#1-visión-general-del-sistema)
2. [Vista de Casos de Uso (Use Case View)](#2-vista-de-casos-de-uso-use-case-view)
3. [Vista Lógica (Logical View)](#3-vista-lógica-logical-view)
4. [Vista de Procesos (Process View)](#4-vista-de-procesos-process-view)
5. [Vista de Componentes (Component View / Implementation View)](#5-vista-de-componentes-component-view--implementation-view)
6. [Vista de Despliegue (Deployment View)](#6-vista-de-despliegue-deployment-view)
7. [Decisiones Arquitectónicas Clave (ADRs)](#7-decisiones-arquitectónicas-clave-adrs)

---

## 1. Visión General del Sistema

Ninja House es una Single Page Application (SPA) modular y reactiva orientada a la experiencia de usuario (UX/UI) de alta fidelidad, con estilo cyberpunk/geek neón y elementos retro-analógicos.

```
       +-------------------------------------------------------+
       |                  Cliente / Navegador                  |
       |     React 19 + TypeScript + Vite + Tailwind CSS      |
       +-------------------------------------------------------+
                                   |
         +-------------------------+-------------------------+
         |                                                   |
         v                                                   v
+------------------------+                        +--------------------+
|  Vercel Edge Network   |                        |  Ferozo / Apache   |
| (Mirror de Desarrollo) |                        | (Producción Oficial|
|                        |                        |  ninjahouseshow.com|
+------------------------+                        +--------------------+
         |                                                   |
         +-------------------------+-------------------------+
                                   |
                                   v
             +-------------------------------------------+
             |    Servicios Externos & CDNs              |
             |  - Spotify Embed API                      |
             |  - Cloudinary Media Asset Pipeline        |
             |  - YouTube Data & Embed Streams           |
             |  - Google Fonts CDN                       |
             +-------------------------------------------+
```

---

## 2. Vista de Casos de Uso (Use Case View)

La vista de casos de uso captura las funcionalidades centrales del sistema desde la perspectiva de los diferentes actores:

### Actores
1. **Espectador / Fan Geek**: Explora programación, mira transmisiones en vivo, reproduce música retro y sigue las redes de los talentos.
2. **Patrocinador / Marca Inversionista**: Analiza el impacto de audiencia, simula alcance publicitario por presupuesto y descarga el Media Kit.
3. **Desarrollador / Operador**: Mantiene datos estáticos, ejecuta scripts de sincronización de métricas sociales y despliega a producción.

### Diagrama de Casos de Uso RUP (UML)

```mermaid
flowchart LR
    subgraph Actores
        U((Espectador / Fan))
        I((Inversionista / Marca))
        D((Operador / Dev))
    end

    subgraph Sistema_Ninja_House["Plataforma Ninja House"]
        UC1(["UC-01: Explorar Programación Semanal"])
        UC2(["UC-02: Ver Detalle y Talentos de Programa"])
        UC3(["UC-03: Reproducir Audio en Cassette Deck Retro"])
        UC4(["UC-04: Sintonizar Transmisión en Vivo"])
        UC5(["UC-05: Simular Alcance de Inversión"])
        UC6(["UC-06: Exportar / Imprimir Media Kit"])
        UC7(["UC-07: Enviar Mensaje de Contacto"])
        UC8(["UC-08: Sincronizar Métricas Sociales API"])
        UC9(["UC-09: Desplegar Bundle a Ferozo/Apache"])
    end

    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC4
    U --> UC7

    I --> UC5
    I --> UC6
    I --> UC7

    D --> UC8
    D --> UC9
```

---

## 3. Vista Lógica (Logical View)

Representa la estructura interna del código: clases, componentes, entidades de datos y hooks reactivos.

### Diagrama de Clases y Modelos de Dominio (UML)

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
        +string logoUrl
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

    class MetricCard {
        +string platform
        +number value
        +string label
        +string icon
        +string growthRate
    }

    class InvestmentTier {
        +string id
        +string name
        +number estimatedReach
        +string[] perks
        +number baseBudget
    }

    class CassettePlayerState {
        +boolean isPlaying
        +number currentTrack
        +number vuLeftLevel
        +number vuRightLevel
        +togglePlay()
        +stopPlayback()
    }

    Program "1" o-- "1..*" Talent : reúne
    Talent "1" *-- "1" SocialLinks : posee
    InvestmentTier ..> MetricCard : proyecta alcance sobre
```

### Jerarquía de Capas de la Aplicación

1. **Presentation Layer (Componentes UI y Páginas)**:
   - `src/pages/`: Páginas principales con Code-Splitting vía `React.lazy`.
   - `src/components/`: Componentes organizados por dominio funcional (`hero`, `programs`, `spotify`, `invest`, `metrics`, etc.).
   - `src/components/ui/`: Micro-componentes atómicos de diseño (`Button`, `Card`, `Badge`, `ScrollStack`).
2. **State & Orchestration Layer (Hooks y Contextos)**:
   - `useLenis`: Control de suavizado inercial del scroll de pantalla.
   - `useReducedMotion`: Accesibilidad y desactivación condicional de animaciones GSAP/Framer.
3. **Data / Domain Layer (Entidades Estáticas y Lib)**:
   - `src/data/`: Fuentes únicas de verdad inmutables (`programs.ts`, `schedule.ts`, `metrics.ts`, `investment.ts`).
   - `src/lib/`: Lógica de utilidades (formateadores, cálculo de horarios en vivo).

---

## 4. Vista de Procesos (Process View)

Muestra los flujos dinámicos, secuencias de interacción, concurrencia y gestión de estados asíncronos.

### 4.1 Flujo del Cassette Deck Retro (Gestión de Iframe y CORS)

Para silenciar inmediatamente el audio de Spotify sin incurrir en violaciones de política de mismo origen (CORS), el componente aplica desmontaje condicional en el ciclo de vida del DOM:

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant UI as CassetteDeck (React UI)
    participant VU as VUMeter (Trigonometric SVG)
    participant DOM as Virtual DOM
    participant Spot as Spotify Iframe API

    Usuario->>UI: Clic en botón "PLAY"
    UI->>DOM: Montar <iframe> de Spotify en contenedor
    DOM->>Spot: Carga de stream de audio
    UI->>VU: Iniciar requestAnimationFrame (oscilación de agujas)
    VU-->>Usuario: Feedback visual analógico en tiempo real

    Usuario->>UI: Clic en botón "STOP"
    UI->>VU: Detener requestAnimationFrame y resetear agujas a 0°
    UI->>DOM: Desmontar físicamente <iframe> del DOM
    Note over DOM,Spot: El desmontaje forzado corta el sonido de inmediato
    UI-->>Usuario: Mostrar pantalla CRT en modo STANDBY
```

### 4.2 Flujo de Carga Inicial con Pantalla de Presentación

```mermaid
sequenceDiagram
    autonumber
    actor Visitante
    participant App as App.tsx
    participant Preloader as LoadingScreen.tsx
    participant Lenis as SmoothScroll (Lenis)
    participant Router as React Router DOM v7

    Visitante->>App: Carga inicial de URL /
    App->>Preloader: Renderizar anillos concéntricos SVG (2.8s)
    App->>Lenis: Inicializar listener inercial en window
    Preloader-->>App: Evento onComplete (Fin de animación de apertura)
    App->>Router: Montar rutas y habilitar interacción de usuario
    Router-->>Visitante: Visualización completa de Landing Page
```

---

## 5. Vista de Componentes (Component View / Implementation View)

Organización física del código fuente y dependencias de compilación en paquetes:

```mermaid
graph TD
    subgraph UI_Layer["Capa de Presentación (src/components)"]
        Hero["hero/HeroSection"]
        Programs["programs/ProgramsSection"]
        Spotify["spotify/SpotifySection"]
        Invest["invest/InvestSection"]
        Metrics["metrics/MetricsSection"]
        Schedule["schedule/ScheduleSection"]
        Talents["talents/TalentsSection"]
        Layout["layout/Navbar & Footer"]
    end

    subgraph Pages_Layer["Capa de Páginas (src/pages)"]
        P_Home["Landing (App.tsx)"]
        P_Prog["ProgramsPage"]
        P_ProgDet["ProgramDetailPage"]
        P_Inv["InvestPage"]
        P_Med["MediaKitPage"]
        P_Cont["ContactPage"]
    end

    subgraph Core_Libraries["Bibliotecas del Núcleo"]
        React["React 19 & React Router DOM v7"]
        GSAP["GSAP 3 + @gsap/react"]
        Framer["Framer Motion 12"]
        Tailwind["Tailwind CSS v3"]
        LenisLib["Lenis Smooth Scroll"]
    end

    subgraph Data_Layer["Capa de Datos (src/data)"]
        D_Prog["programs.ts"]
        D_Sched["schedule.ts"]
        D_Metr["metrics.ts"]
        D_Inv["investment.ts"]
    end

    Pages_Layer --> UI_Layer
    UI_Layer --> Data_Layer
    UI_Layer --> Core_Libraries
```

---

## 6. Vista de Despliegue (Deployment View)

Representa la infraestructura física y de red donde se ejecuta la plataforma:

```mermaid
flowchart TB
    subgraph Client_Tier["Nivel Cliente"]
        BrowserMobile["Navegador Móvil (Chrome / Safari / Firefox)"]
        BrowserDesktop["Navegador de Escritorio (Chromium / Firefox / Edge)"]
    end

    subgraph Production_Server["Servidor de Producción Oficial (Ferozo / DonWeb)"]
        DNS_Hostmar["Servidores DNS: ns3.hostmar.com / ns4.hostmar.com"]
        Apache["Servidor Web Apache 2.4 (IP: 200.58.104.120)"]
        ModRewrite["Módulo mod_rewrite (.htaccess para React Router)"]
        SSLCert["Certificado Let's Encrypt (TLS 1.3 / HTTPS)"]
        StaticDir["Directorio public_html/ (Assets, JS, CSS, index.html)"]
    end

    subgraph Development_Mirror["Mirror de Desarrollo / CI"]
        Vercel["Vercel Edge Network (ninjahouse-app.vercel.app)"]
    end

    subgraph External_Cloud["Servicios en la Nube"]
        SpotifyCloud["Spotify CDN & Audio Streamers"]
        Cloudinary["Cloudinary CDN (Imágenes y Video Promocional)"]
        YouTubeCloud["YouTube Live Embeds & Data API"]
    end

    BrowserDesktop -->|HTTPS / Port 443| Apache
    BrowserMobile -->|HTTPS / Port 443| Apache
    BrowserDesktop -.->|Espejo Alternativo| Vercel

    Apache --> ModRewrite
    ModRewrite --> StaticDir
    Apache --- SSLCert

    StaticDir -->|Embeds & Media| SpotifyCloud
    StaticDir -->|Assets dinámicos| Cloudinary
    StaticDir -->|Streams en vivo| YouTubeCloud
```

---

## 7. Decisiones Arquitectónicas Clave (ADRs)

| ID | Título | Decisión | Motivo / Justificación |
|---|---|---|---|
| **ADR-01** | Stack Frontend | React 19 + TypeScript + Vite | Tiempos de compilación menores a 2s, tipado estricto y soporte para las últimas APIs de concurrencia de React. |
| **ADR-02** | Rutas de SPA en Apache | Archivo `.htaccess` con `mod_rewrite` | Resuelve el clásico error 404 al recargar rutas profundas (`/programs`, `/contacto`) en hosting tradicional Ferozo/Apache. |
| **ADR-03** | Silenciado Inmediato de Audio | Desmontaje de Iframe Spotify | La API de Spotify en un iframe externo restringe el control de volumen por CORS; desmontar y montar el elemento garantiza pausa instantánea. |
| **ADR-04** | Medidores VU Analógicos | Animación SVG con trigonometría | Permite un barrido angular concéntrico exacto de la aguja sobre la escala sin distorsiones por transformaciones CSS básicas. |
| **ADR-05** | Media Kit Imprimible | Reglas CSS `@media print` | Evita generar dos aplicaciones distintas; un mismo componente renderiza vista web interactiva y vista corporativa limpia para PDF/impresión. |
