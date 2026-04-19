# SDD — Diseño CSS NomadNest

## 1. Diagnóstico

### Problema identificado
- **CSS actual**: 1301 líneas con metodología BEM (`.card__image`, `.hero-carousel__title`)
- **HTML**: Usa clases simples (`.slide-image`, `.hero-title`, `.card-image`)
- **Resultado**: CSS no estiliza el HTML — web visualmente rota

### Comparación de clases

| Sección | Clase HTML (existente) | Clase CSS actual | ¿Funciona? |
|---------|-------------------|-----------------|------------|
| HeroCarrusel | `.slide-image` | `.hero-carousel__image` | ❌ NO |
| HeroCarrusel | `.slide-content` | `.hero-carousel__content` | ❌ NO |
| HeroCarrusel | `.hero-title` | `.hero-carousel__title` | ❌ NO |
| HeroCarrusel | `.hero-subtitle` | `.hero-carousel__subtitle` | ❌ NO |
| About | `.about-section` | `.about__container` | ❌ NO |
| Products | `.products-section` | `.products__grid` | ❌ NO |
| Admin | `.admin-section` | `.admin__title` | ❌ NO |
| Contact | `.contact-section` | `.contact__container` | ❌ NO |
| Cards | `.card-image` | `.card__image` | ❌ NO |
| Cards | `.card-delete-btn` | `.card__delete-btn` | ❌ NO |
| Forms | `.btn-login` | No hay regla | ❌ NO |

---

## 2. Variables CSS (mantener existentes)

Las variables actuales son correctas — se mantienen intactas:

```css
:root {
    /* Colores */
    --color-primary: #255D4A;      /* Verde oscuro - principal */
    --color-secondary: #E08E43;    /* Naranja - accent/CTA */
    --color-accent: #1F2933;      /* Gris oscuro - texto */
    --color-bg: #E8F5E9;          /* Verde muy claro - fondo */

    /* Estados */
    --color-white: #ffffff;
    --color-error: #e74c3c;

    /* Tipografía */
    --font-heading: 'Sora', sans-serif;
    --font-body: 'Nunito', sans-serif;

    /* Spacing, radius, shadows, transiciones */
    --spacing-*: 0.5rem / 1rem / 1.5rem / 2rem / 3rem / 4rem;
    --radius-*: 8px / 10px / 20px / 25px;
    --shadow-*: 0 2px10px / 0 4px15px / 0 10px30px;
    --transition-*: 0.15s / 0.3s ease;
}
```

---

## 3. Reset y Base

```css
/* Reset básico — mantener actual */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-body);
    line-height: 1.6;
    color: var(--color-accent);
    background-color: var(--color-bg);
}

/* Focus visible — mantener actual */
:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
}
```

---

## 4. Reglas CSS por clase HTML

### 4.1 Header / Nav

```css
/* Header */
.main-header {
    background: rgba(255, 255, 255, 0.95);
    padding: var(--spacing-sm) var(--spacing-lg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--shadow-sm);
    position: sticky;
    top: 0;
    z-index: 200;
    backdrop-filter: blur(5px);
}

.logo-img {
    height: 50px;
    transition: transform var(--transition-smooth);
}

.logo-img:hover {
    transform: scale(1.05);
}

.main-nav {
    display: flex;
    align-items: center;
}

.nav-list {
    display: flex;
    gap: var(--spacing-md);
    list-style: none;
    align-items: center;
    flex-wrap: wrap;
}

.nav-link {
    text-decoration: none;
    color: var(--color-primary);
    font-weight: 700;
    transition: color var(--transition-base);
}

.nav-link:hover {
    color: var(--color-secondary);
}

.lang-select {
    padding: 5px 10px;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border-light);
    background: var(--color-white);
    font-weight: bold;
    cursor: pointer;
    color: var(--color-primary);
}

/* Auth */
.btn-login {
    padding: 8px 16px;
    background: var(--color-secondary);
    color: var(--color-white);
    border: none;
    border-radius: var(--radius-sm);
    font-weight: 700;
    cursor: pointer;
    transition: all var(--transition-base);
}

.btn-login:hover {
    background: #ff9f4d;
    transform: translateY(-2px);
}

.login-form {
    display: flex;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
    background: var(--color-white);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
}

.login-input {
    padding: 8px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
}

.btn-login-submit {
    padding: 8px 16px;
    background: var(--color-primary);
    color: var(--color-white);
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
}

.btn-logout {
    padding: 8px 16px;
    background: var(--color-error);
    color: var(--color-white);
    border: none;
    border-radius: var(--radius-sm);
    font-weight: 700;
    cursor: pointer;
}
```

### 4.2 Hero Carrusel

```css
/* Contenedor principal del carrusel */
.hero-carousel {
    position: relative;
    overflow: hidden;
}

.carousel-container {
    position: relative;
}

.carousel-slide {
    display: none;
    position: relative;
    min-height: 85vh;
}

.carousel-slide.active {
    display: block;
    animation: fadeIn 0.5s ease-out;
}

/* Imagen del slide */
.slide-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Contenido superpuesto */
.slide-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: var(--color-white);
    width: 100%;
    max-width: 800px;
    padding: var(--spacing-lg);
}

/* Título */
.hero-title {
    font-family: var(--font-heading);
    font-size: var(--font-size-4xl);
    font-weight: 800;
    margin-bottom: var(--spacing-sm);
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
}

/* Subtítulo */
.hero-subtitle {
    font-size: 1.4rem;
    margin-bottom: var(--spacing-xl);
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

/* Botón CTA */
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 15px 35px;
    background: var(--color-secondary);
    color: var(--color-white);
    border: none;
    border-radius: var(--radius-full);
    font-family: var(--font-body);
    font-weight: 700;
    font-size: var(--font-size-lg);
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 4px 15px rgba(224, 142, 67, 0.4);
    transition: all var(--transition-smooth);
}

.btn-primary:hover {
    background: #ff9f4d;
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 20px rgba(224, 142, 67, 0.6);
}

/* Controles */
.carousel-prev,
.carousel-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.3);
    color: var(--color-white);
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    transition: all var(--transition-base);
}

.carousel-prev {
    left: var(--spacing-md);
}

.carousel-next {
    right: var(--spacing-md);
}

.carousel-prev:hover,
.carousel-next:hover {
    background: rgba(0, 0, 0, 0.6);
    transform: translateY(-50%) scale(1.1);
}

/* Indicadores */
.carousel-indicators {
    position: absolute;
    bottom: var(--spacing-lg);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: var(--spacing-sm);
}

.indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    border: none;
    cursor: pointer;
    transition: all var(--transition-base);
}

.indicator.active,
.indicator:hover {
    background: var(--color-white);
    transform: scale(1.2);
}
```

### 4.3 Secciones

```css
/* About */
.about-section {
    padding: var(--spacing-3xl) var(--spacing-lg);
    background: var(--color-white);
    text-align: center;
}

.container-narrow {
    max-width: 800px;
    margin: 0 auto;
}

.section-title {
    font-family: var(--font-heading);
    color: var(--color-primary);
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-lg);
}

.section-title.text-center {
    text-align: center;
}

.text-body {
    font-size: var(--font-size-base);
    line-height: 1.8;
    color: var(--color-gray);
    margin-bottom: var(--spacing-sm);
}

.mb-1 { margin-bottom: 1rem; }

/* Products */
.products-section {
    padding: var(--spacing-2xl) var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2.5rem;
}

/* Admin */
.admin-section {
    background: var(--color-white);
    box-shadow: var(--shadow-md);
    border: 2px dashed var(--color-border-light);
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    max-width: 1200px;
    margin: var(--spacing-2xl) auto;
}

/* Contact */
.contact-section {
    padding: var(--spacing-xl) var(--spacing-sm);
}

.contact-container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 0;
    max-width: 1100px;
    margin: 0 auto;
    background: var(--color-white);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
}

.contact-info {
    padding: var(--spacing-xl);
    background: var(--color-light);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.contact-subtitle {
    font-family: var(--font-heading);
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-2xl);
}

.contact-desc {
    margin-bottom: var(--spacing-lg);
    color: var(--color-gray);
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 1.5rem;
    color: var(--color-gray);
}

.contact-icon {
    background: var(--color-white);
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: var(--shadow-sm);
    color: var(--color-primary);
}

.map-wrapper {
    height: 100%;
    min-height: 400px;
}

.map-iframe {
    width: 100%;
    height: 100%;
    border: 0;
}
```

### 4.4 Cards (Products)

```css
/* Card base */
.card {
    background: var(--color-white);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    transition: all var(--transition-smooth);
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(37, 93, 74, 0.1);
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-hover);
}

/* Imagen */
.card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

/* Contenido */
.card-content {
    padding: 1.8rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.card-title {
    font-family: var(--font-heading);
    color: var(--color-primary);
    font-size: var(--font-size-xl);
    margin-bottom: 0.8rem;
}

.card-price {
    font-weight: 800;
    font-size: var(--font-size-xl);
    color: var(--color-accent);
}

.card-wifi {
    font-size: var(--font-size-sm);
    color: var(--color-secondary);
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 5px;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}

/* Delete button */
.card-delete-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--color-error);
    color: var(--color-white);
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    transition: background var(--transition-fast);
}

.card-delete-btn:hover {
    background: var(--color-error-dark);
}
```

### 4.5 Forms (Admin)

```css
/* Formulario admin */
.admin-form {
    display: grid;
    gap: var(--spacing-md);
    max-width: 700px;
    margin: 0 auto;
}

.form-fieldset {
    border: none;
    padding: 0;
    margin: 0;
}

.form-legend {
    font-weight: bold;
    color: var(--color-primary);
    padding-bottom: var(--spacing-xs);
    margin-bottom: var(--spacing-sm);
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.form-label {
    font-weight: bold;
    color: var(--color-primary);
}

.form-input {
    padding: 0.8rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    width: 100%;
    font-family: var(--font-body);
    font-size: var(--font-size-base);
    transition: all var(--transition-base);
}

.form-input::placeholder {
    color: var(--color-gray-light);
}

.form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(37, 93, 74, 0.1);
}

.form-input-file {
    padding: 0.8rem;
    background: var(--color-white);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
}

.form-select {
    padding: 0.8rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    width: 100%;
    font-family: var(--font-body);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.form-help {
    font-size: var(--font-size-xs);
    color: var(--color-gray);
}

.btn-block {
    width: 100%;
    margin-top: var(--spacing-sm);
}
```

### 4.6 Footer

```css
.main-footer {
    background: var(--color-primary);
    color: var(--color-white);
    padding: var(--spacing-xl) 0;
    margin-top: var(--spacing-2xl);
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
}

.footer-address {
    font-style: normal;
}

.footer-contact-title {
    font-weight: bold;
    margin-bottom: var(--spacing-sm);
}

.footer-contact-grid {
    display: flex;
    gap: var(--spacing-lg);
    justify-content: center;
    flex-wrap: wrap;
}

.contact-link {
    color: var(--color-white);
    text-decoration: none;
    transition: color var(--transition-base);
}

.contact-link:hover {
    color: var(--color-secondary);
}

.social-links {
    display: flex;
    gap: var(--spacing-md);
}

.social-icon {
    color: var(--color-white);
    font-size: 1.8rem;
    transition: all var(--transition-base);
}

.social-icon:hover {
    color: var(--color-secondary);
    transform: translateY(-5px);
}

.footer-copyright {
    margin-top: var(--spacing-lg);
    opacity: 0.9;
}
```

### 4.7 Utilidades

```css
.hidden {
    display: none !important;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.text-center { text-align: center; }
```

### 4.8 Animaciones (keyframes)

```css
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
```

---

## 5. Media Queries (responsive)

```css
/* Tablets */
@media (max-width: 768px) {
    .main-header {
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .nav-list {
        gap: var(--spacing-sm);
    }

    .hero-title {
        font-size: var(--font-size-3xl);
    }

    .hero-subtitle {
        font-size: 1.1rem;
    }

    .contact-container {
        grid-template-columns: 1fr;
    }

    .map-wrapper {
        height: 300px;
    }

    .products-grid {
        grid-template-columns: 1fr;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }
}

/* Mobile */
@media (max-width: 480px) {
    :root {
        --font-size-4xl: 2.5rem;
    }

    .main-header {
        padding: var(--spacing-sm);
    }

    .products-grid {
        gap: var(--spacing-md);
    }

    .contact-info {
        padding: var(--spacing-lg);
    }

    .footer-contact-grid {
        flex-direction: column;
        gap: var(--spacing-sm);
    }
}
```

---

## 6. Estructura del CSS final

```
styles.css
├── 1. Custom Properties (:root)
├── 2. Reset & Base
├── 3. Header / Nav
│   └── .main-header, .logo-img, .main-nav, .nav-list, .nav-link
│   └── .btn-login, .login-form, .btn-logout
├── 4. Hero Carrusel
│   └── .hero-carousel, .carousel-slide, .slide-image, .slide-content
│   └── .hero-title, .hero-subtitle, .btn-primary
│   └── .carousel-prev, .carousel-next, .carousel-indicators, .indicator
├── 5. Secciones
│   ├── .about-section (y .container-narrow, .section-title, .text-body)
│   ├── .products-section (y .products-grid)
│   ├── .admin-section (y .admin-form, forms)
│   └── .contact-section (y .contact-container, .contact-info, .map-wrapper)
├── 6. Cards
│   └── .card, .card-image, .card-content, .card-title, .card-price, .card-wifi, .card-footer
├── 7. Forms
│   └── .admin-form, .form-fieldset, .form-grid, .form-field, .form-label, .form-input
├── 8. Footer
│   └── .main-footer, .footer-content, .footer-address, etc.
├── 9. Utilidades
│   └── .hidden, .visually-hidden, .text-center
├── 10. Animaciones (@keyframes fadeIn)
└── 11. Media Queries
```

---

## 7. Notas de implementación

1. **No inventar clases nuevas** — usar exactamente las del HTML
2. **Mantener variables existentes** — ya están probadas
3. **Mobile-first** — no necesario reescribir todo, media queries funcionan
4. **Eliminar código BEM obsoleto** — no copiar las clases `.__xxx` del CSS viejo
5. **Preservar funcionalidad JS** — las clases son selectores de `app.js`, no modificar

---

## 8. Estado Final del Proyecto (19/04/2026)

### ✅ MVP COMPLETADO Y ENTREGADO

**Estado:** Proyecto NomadNest completado, funcional y entregado para DAM.

#### 🔧 Correcciones Implementadas:
1. **CSS reescrito**: 465 líneas limpias (vs 1301 anteriores)
2. **Carrusel funcional**: JavaScript implementado, 3 fotos reales de nidos
3. **Vista previa arreglada**: `object-fit: cover` para imágenes
4. **Botones horizontalizados**: `.card-actions` con `flex-direction: row`
5. **Página detalles diseñada**: Grid 60/40, ~150 líneas CSS nuevas
6. **Login eliminado**: No requerido en MVP según PRD
7. **Proyecto limpiado**: Eliminado `NomadNest-master/`, archivos duplicados

#### 📊 Métricas Finales:
- **Frontend**: HTML5 semántico, CSS3 avanzado, Vanilla JS
- **Backend**: Node.js/Express, SQLite, CRUD completo
- **Documentación**: API.md (673 líneas), Postman collection, README
- **CI/CD**: `.github/workflows/ci.yml` implementado
- **Git**: PR #4 creado para entrega final

#### 🎓 Listo para Entrega DAM:
- **Lenguajes de Marcas**: ✅ HTML5, CSS3 avanzado, responsive
- **Entornos de Desarrollo**: ✅ Node.js, Git, CI/CD, documentación, PR workflow completo
- **Digitalización**: ✅ Proyecto web completo, funcional, CI/CD operativo

#### 🔧 Fixes Finales CI/CD (19/04/2026):
- **PR #6**: Fix package-lock.json desincronizado y timeout workflow
- **Problema 1**: `package-lock.json` sin `sqlite3@5.1.7` → Regenerado completo
- **Problema 2**: CI atascado 17min en syntax check → Cambiado `require()` por `node --check`
- **Resultado**: Todos los checks pasan ✅ (backend-check, build, lint-basic)

**Commit final:** `eec2493`  
**Pull Request Final:** https://github.com/8sandro8/NomadNest/pull/6  
**Repositorio:** https://github.com/8sandro8/NomadNest  
**Estado CI/CD:** ✅ 3/3 checks PASSING

---

*Documentación actualizada el 19/04/2026 - Proyecto COMPLETADO con CI/CD funcionando*