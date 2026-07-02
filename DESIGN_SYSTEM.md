# Design System - Ninja House Programs

## 🎨 Color Palette

### Brand Colors
```css
/* Primary Red */
--color-primary: #E63946; /* Ninja House Red */
--color-primary-light: #F1FAEE;
--color-primary-dark: #A4161A;

/* Pastel Pink */
--color-accent-pink: #FFB3BA;
--color-accent-pink-light: #FFE5E9;
--color-accent-pink-pale: #FFF0F3;

/* Neutral */
--color-white: #FFFFFF;
--color-black: #1A1A1A;
--color-gray-100: #F5F5F5;
--color-gray-300: #E0E0E0;
--color-gray-500: #999999;
--color-gray-700: #333333;
--color-gray-900: #1A1A1A;
```

### Program-Specific Colors
```css
/* ANIMES Y RAMEN */
--program-animes-primary: #7C3AED; /* Purple */
--program-animes-secondary: #E5B8D0; /* Light Pink */
--program-animes-bg: #FFF0F6;

/* OVERHEAD */
--program-overhead-primary: #2563EB; /* Blue */
--program-overhead-secondary: #EF4444; /* Red */
--program-overhead-bg: #F3F4F6;

/* FREAKUENCIA M */
--program-freakuencia-primary: #16A34A; /* Green */
--program-freakuencia-secondary: #FB923C; /* Orange */
--program-freakuencia-bg: #F0FDF4;

/* MALDITO PLÁSTICO */
--program-plastico-primary: #EA580C; /* Orange */
--program-plastico-secondary: #FFFFFF;
--program-plastico-bg: #FEF3C7;

/* CINE INFARTO */
--program-cine-primary: #DC2626; /* Red */
--program-cine-secondary: #FEC5D0; /* Pink */
--program-cine-bg: #FEF2F2;

/* LANZALO */
--program-lanzalo-primary: #E11D48; /* Deep Red */
--program-lanzalo-secondary: #FFB5D0; /* Light Pink */
--program-lanzalo-bg: #FEF3F7;
```

---

## 🔤 Typography

### Font Families
```css
/* Headings - Bold Sans-Serif */
--font-heading: 'Inter', 'Helvetica Neue', sans-serif;
--font-weight-heading: 700; /* Bold */

/* Body Text */
--font-body: 'Inter', 'Helvetica Neue', sans-serif;
--font-weight-body: 400; /* Regular */

/* Accents */
--font-weight-accent: 600; /* Semi-Bold */
```

### Font Sizes
```css
/* Headings */
--text-h1: 48px; /* Page titles */
--text-h2: 36px; /* Section titles */
--text-h3: 28px; /* Subsection */
--text-h4: 24px; /* Program titles */
--text-h5: 20px; /* Card titles */
--text-h6: 16px; /* Small titles */

/* Body */
--text-large: 18px;
--text-body: 16px;
--text-small: 14px;
--text-xs: 12px;

/* Line Heights */
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### Text Styles
```css
/* Headings */
h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-heading);
  line-height: var(--line-height-tight);
  color: var(--color-black);
}

h1 {
  font-size: var(--text-h1);
}

h2 {
  font-size: var(--text-h2);
}

h3, h4 {
  font-size: var(--text-h4);
}

/* Body */
body, p {
  font-family: var(--font-body);
  font-weight: var(--font-weight-body);
  font-size: var(--text-body);
  line-height: var(--line-height-normal);
  color: var(--color-gray-700);
}

/* Small Text */
small, .text-small {
  font-size: var(--text-small);
}
```

---

## 📐 Spacing System

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;

/* Usage */
padding: var(--spacing-md);
margin-bottom: var(--spacing-lg);
gap: var(--spacing-md);
```

---

## 🎨 Component Styles

### Program Card
```css
.program-card {
  background: linear-gradient(135deg, white 0%, var(--program-bg) 100%);
  border-radius: 12px;
  padding: var(--spacing-lg);
  border: 2px solid var(--program-primary);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  position: relative;
}

.program-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(230, 57, 70, 0.15);
}

/* Wavy Top Decoration */
.program-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 12px;
  background: var(--program-primary);
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  opacity: 0.8;
}

.program-card-content {
  padding-top: var(--spacing-md);
}

.program-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.program-card-title {
  font-size: var(--text-h4);
  font-weight: var(--font-weight-heading);
  color: var(--color-black);
  margin: 0;
}

.program-card-schedule {
  font-size: var(--text-small);
  color: var(--program-primary);
  font-weight: var(--font-weight-accent);
  margin-top: var(--spacing-xs);
}

.program-card-description {
  font-size: var(--text-small);
  color: var(--color-gray-700);
  margin: var(--spacing-md) 0;
  line-height: var(--line-height-relaxed);
}

.program-card-talents {
  margin-top: var(--spacing-md);
  border-top: 1px solid var(--color-gray-300);
  padding-top: var(--spacing-md);
}

.program-card-talents-label {
  font-size: var(--text-xs);
  font-weight: var(--font-weight-accent);
  color: var(--color-gray-500);
  text-transform: uppercase;
  margin-bottom: var(--spacing-sm);
}

.program-card-talents-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.program-card-talents-list li {
  font-size: var(--text-small);
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-xs);
}

.program-card-talents-list a {
  color: var(--program-primary);
  text-decoration: none;
  font-weight: var(--font-weight-accent);
}

.program-card-talents-list a:hover {
  text-decoration: underline;
}
```

### Section Header
```css
.section-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  position: relative;
}

.section-header::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: var(--color-primary);
  border-radius: 2px;
}

.section-header h2 {
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-black);
  margin-bottom: var(--spacing-md);
}

.section-header p {
  color: var(--color-gray-700);
  max-width: 600px;
  margin: 0 auto;
}
```

### Logo Badge
```css
.program-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: var(--program-primary);
  border-radius: 8px;
  color: white;
  font-weight: var(--font-weight-heading);
  font-size: var(--text-h6);
}

.program-badge.animes {
  background: var(--program-animes-primary);
}

.program-badge.overhead {
  background: var(--program-overhead-primary);
}

.program-badge.freakuencia {
  background: var(--program-freakuencia-primary);
}

.program-badge.plastico {
  background: var(--program-plastico-primary);
}

.program-badge.cine {
  background: var(--program-cine-primary);
}

.program-badge.lanzalo {
  background: var(--program-lanzalo-primary);
}
```

---

## 🎬 Animations

```css
/* Smooth Transitions */
--transition-fast: 150ms ease-in-out;
--transition-normal: 300ms ease-in-out;
--transition-slow: 500ms ease-in-out;

/* Hover Effects */
.interactive {
  transition: all var(--transition-normal);
}

.interactive:hover {
  color: var(--color-primary);
}

/* Wavy Animation */
@keyframes wave {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.wave {
  animation: wave var(--transition-slow) ease-in-out infinite;
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Medium devices */
--breakpoint-lg: 1024px;  /* Large devices */
--breakpoint-xl: 1280px;  /* Extra large */

/* Media Query Examples */
@media (min-width: 768px) {
  .program-card {
    padding: var(--spacing-xl);
  }
}

@media (min-width: 1024px) {
  .program-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .program-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 🔍 Usage Examples

### Basic Program Section
```jsx
<section className="programs-section">
  <header className="section-header">
    <h2>Verticales de Influencia Geek</h2>
    <p>Nuestros programas principales</p>
  </header>
  
  <div className="program-grid">
    {programs.map(program => (
      <article 
        key={program.id}
        className="program-card"
        style={{
          '--program-primary': program.color,
          '--program-bg': program.bgColor
        }}
      >
        <h3 className="program-card-title">{program.name}</h3>
        <p className="program-card-schedule">{program.schedule}</p>
        <p className="program-card-description">{program.description}</p>
        <div className="program-card-talents">
          <p className="program-card-talents-label">Talentos</p>
          <ul className="program-card-talents-list">
            {program.talents.map(talent => (
              <li key={talent.id}>
                <a href={talent.url}>{talent.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </article>
    ))}
  </div>
</section>
```

---

## 📋 Implementation Checklist

- [ ] Install typography fonts (Inter or similar)
- [ ] Create CSS custom properties file
- [ ] Build program card component
- [ ] Implement color system
- [ ] Add responsive grid layout
- [ ] Create section headers with wavy decoration
- [ ] Implement hover animations
- [ ] Test on mobile, tablet, desktop
- [ ] Verify color contrast for accessibility
- [ ] Optimize images for each program

---

*Design System v1.0 - Ninja House Program Cards*
