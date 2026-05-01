# 📋 Defensa NomadNest - Guía de Referencia Rápida

---

## ⚠️ INFORMACIÓN IMPORTANTE - ANTES DE EMPEZAR

### 🚀 Cómo Arrancar el Proyecto

**1. Arrancar el backend:**
```bash
cd backend
npm install  # Solo si hay nuevas dependencias
node server.js
```
El servidor arranca en: `http://localhost:3010`

**2. Ver la web (frontend):**
```bash
# Opción A: Abrir directamente
# Navega a la carpeta frontend y haz doble clic en index.html

# Opción B: Si el backend está corriendo, acceder a:
# http://localhost:3010/frontend/index.html
```

### 🔐 Credenciales de Acceso

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | admin |
| sandro | sandro89 | user |

### 🌐 URLs de la Web

| Página | URL |
|--------|-----|
| Página principal | `frontend/index.html` |
| Login | `frontend/login.html` |
| Registro | `frontend/register.html` |
| Admin (solo admins) | `frontend/admin.html` |
| Detalle producto | `frontend/detalle.html?id=X` |

### 📁 Estructura del Proyecto

```
NomadNest/
├── backend/              # API Node.js + Express
│   ├── server.js         # Archivo principal (arrancar con node server.js)
│   ├── utils/jwt.js       # Funciones JWT
│   └── nomadnest.db       # Base de datos SQLite
├── frontend/             # HTML + CSS + JS
│   ├── index.html         # Página principal
│   ├── login.html         # Login
│   ├── register.html      # Registro
│   ├── admin.html         # Panel admin
│   ├── detalle.html       # Detalle producto
│   ├── css/               # Estilos
│   │   ├── styles.css     # Estilos principales
│   │   └── login.css      # Estilos login/registro
│   └── js/                # JavaScript
│       ├── app.js         # Lógica principal
│       └── auth.js        # Gestión autenticación
├── docs/                  # Documentación
│   ├── wiki/Home.md       # Wiki de la API
│   └── NomadNest.postman_collection.json
└── README.md
```

### 🔧 Puertos y Servicios

| Servicio | Puerto |
|-----------|--------|
| Backend API | 3010 |
| Frontend (archivo directo) | - |

---

---

# 🎓 LENGUAJES DE MARCAS Y SISTEMAS DE GESTIÓN DE INFORMACIÓN

---

## FASE 1

---

### 📌 Header - Logo de la empresa (imagen)

**Cómo verlo en la web:**
1. Abre `frontend/index.html`
2. Mira la esquina superior izquierda del header
3. Verás el logo SVG (montañas con cabaña)

**Cómo verlo en el código:**
- `frontend/index.html` línea ~60-65
- `frontend/img/logo.svg` (archivo SVG, 1.71 KB)
- `frontend/css/styles.css` línea ~170-180 (clase `.logo-img`)

**Qué hace:** Representa visualmente la marca NomadNest (montañas + cabaña = naturaleza + alojamiento). Cumple el requisito de que el logo sea una imagen.

---

### 📌 Header - Menú de navegación con 3 secciones (Conócenos, Productos, Carrito)

**Cómo verlo en la web:**
1. Abre `frontend/index.html`
2. En el header, debajo del logo, verás los enlaces: **Conócenos | Productos | Contacto | Carrito**

**Cómo verlo en el código:**
- `frontend/index.html` líneas ~75-95 (elemento `<nav>` con `<ul>`)
- `frontend/css/styles.css` líneas ~165-210 (estilos `.nav-list`, `.nav-link`)
- JavaScript: `frontend/js/app.js` línea ~250+ (función `scrollToSection()`)

**Qué hace:** Permite navegación entre las secciones de la página. Cada enlace hace scroll a la sección correspondiente (#about, #products, #contact, #cart).

---

### 📌 Zona principal - Carrusel de imágenes

**Cómo verlo en la web:**
1. Abre `frontend/index.html`
2. Justo debajo del header hay una zona con imágenes grandes que cambian automáticamente (cada 5 segundos)
3. Tiene flechas izq/derecha y indicadores abajo

**Cómo verlo en el código:**
- `frontend/index.html` líneas ~110-180 (sección `<section id="hero">` con `.carousel`)
- `frontend/css/styles.css` líneas ~280-430 (estilos carrusel, `.carousel-slide`, etc.)
- `frontend/js/app.js` líneas ~100-200 (lógica carrusel: autoplay, prev/next)

**Qué hace:** Muestra destacados/imágenes promocionales de los alojamientos. Animación automática + controles manuales.

---

### 📌 Zona productos/servicios - Grid con 3+ productos (Imagen, Título, Descripción)

**Cómo verlo en la web:**
1. Abre `frontend/index.html`
2. Busca la sección "Nuestros Nidos Destacados"
3. Verás 3 cards con: imagen, título (Cabaña Pines, Estudio Lago, Refugio Mountain), descripción, precio, velocidad WiFi

**Cómo verlo en el código:**
- `frontend/index.html` líneas ~200-280 (sección `#products` con `.products-grid`)
- `frontend/css/styles.css` líneas ~560-650 (estilos `.card`, `.products-grid`)
- Imágenes: `frontend/img/uploads/cabana1.jpg`, `estudio1.jpg`, `refugio1.jpg`

**Qué hace:** Muestra catálogos de alojamientos disponibles con información relevante (nombre, descripción, precio, categoría).

---

### 📌 Sección productos - Maquetada con Flexbox o CSS Grid (obligatorio)

**Cómo verlo en el código:**
- `frontend/css/styles.css` líneas ~590-600
```css
.products-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
}
```

**Qué hace:** Usa CSS Grid para crear layout responsivo de tarjetas. Garantiza organización visual de productos.

---

### 📌 Formulario de contacto

**Cómo verlo en la web:**
1. Abre `frontend/index.html`
2. Ve a la sección "Encuentra tu Norte" (scroll abajo)
3. Formulario con campos: Nombre, Email, Mensaje + botón "Enviar Mensaje"

**Cómo verlo en el código:**
- `frontend/index.html` líneas ~330-380 (sección `#contact` con `<form>`)
- `frontend/css/styles.css` líneas ~800-870 (estilos `.contact-form`, `.form-grid`)
- `frontend/js/app.js` líneas ~50-90 (función `handleContactForm()`)

**Qué hace:** Permite a usuarios enviar mensajes de contacto. Validación frontend + simulación envío.

---

### 📌 Acceso a redes sociales (con iconos) y datos de contacto

**Cómo verlo en la web:**
1. Abre `frontend/index.html`
2. En el footer (parte inferior): iconos Instagram, Twitter, Facebook
3. Datos de contacto: dirección, email, teléfono

**Cómo verlo en el código:**
- `frontend/index.html` líneas ~385-420 (footer con `.social-icons`)
- `frontend/css/styles.css` líneas ~840-870 (estilos `.social-icon`, `.contact-info`)
- Iconos: FontAwesome (CDN en `<head>`)

**Qué hace:** Proporciona enlaces a redes sociales y datos de contacto de la empresa.

---

### 📌 Footer

**Cómo verlo en la web:**
1. Abre `frontend/index.html`
2. Scrollea hasta el final
3. Verás: © 2026 NomadNest - Diseñado con ❤️ en Aragón

**Cómo verlo en el código:**
- `frontend/index.html` líneas ~385-430 (elemento `<footer class="footer">`)
- `frontend/css/styles.css` líneas ~880-920 (estilos `.footer`)

**Qué hace:** Pie de página con información de copyright y créditos.

---

## FASE 2

---

### 📌 Diseño responsive (móvil hasta 768px)

**Cómo verificarlo:**
1. Abre `frontend/index.html` en Chrome
2. Pulsa F12 → Developer Tools
3. Click en icono de dispositivo (Toggle device toolbar)
4. Selecciona "Mobile" o cambia width a 375px

**Cómo verlo en el código:**
- `frontend/css/styles.css` líneas ~1155-1230
```css
@media (max-width: 768px) {
    .main-header { flex-direction: column; }
    .products-grid { grid-template-columns: 1fr; }
    .contact-container { grid-template-columns: 1fr; }
    /* ... más ajustes responsive */
}
```

**Qué hace:** La página se adapta a pantallas pequeñas (móviles) reorganizando layouts, ajustando tamaños de fuente y ocultando elementos no esenciales.

---

## FASE 3

---

### 📌 Animaciones y transiciones suaves (hover en tarjetas, botones, imágenes)

**Cómo verlo en la web:**
1. Abre `frontend/index.html`
2. Pasa el ratón sobre:
   - Cards de productos → suben ligeramente con sombra
   - Botones → cambian de color
   - Nav links → cambio de color suave
   - Logo → efecto scale

**Cómo verlo en el código:**
- `frontend/css/styles.css` líneas ~65-70 (variables de transición)
- `frontend/css/styles.css` líneas ~360-370 (`.btn-primary:hover`)
- `frontend/css/styles.css` líneas ~605-607 (`.card:hover`)
- `frontend/css/styles.css` líneas ~898-906 (@keyframes fadeIn)

**Qué hace:** Efectos visuales que mejoran la experiencia de usuario (UX) sin ser intrusivos.

---

## REQUISITOS TÉCNICOS

---

### 📌 HTML semántico (header, nav, main, section, footer, etc.)

**Cómo verlo en el código:**
- `frontend/index.html` - estructura completa:
  - `<header class="main-header">` línea ~55
  - `<nav>` línea ~70
  - `<main>` línea ~105
  - `<section id="hero">` línea ~110
  - `<section id="about">` línea ~185
  - `<section id="products">` línea ~195
  - `<section id="contact">` línea ~320
  - `<footer class="footer">` línea ~385

**Qué hace:** Usa etiquetas HTML5 semánticas正确的结构 del contenido. Mejor accesibilidad y SEO.

---

### 📌 CSS externo (no se aceptan estilos en línea)

**Cómo verificarlo:**
1. Abre Chrome DevTools → Elements
2. Click en cualquier elemento → revisa pane Styles
3. Todos los estilos vienen de archivos .css, NO de `style=""` inline

**Cómo verlo en el código:**
- `frontend/index.html` línea ~15-20
```html
<link rel="stylesheet" href="css/styles.css">
```
- `frontend/admin.html` línea ~11-12
- `frontend/login.html` línea ~10-12
- **NO EXISTE** ningún `style=""` en los HTML

**Qué hace:** Separa contenido (HTML) de presentación (CSS). Código más limpio y mantenible.

---

### 📌 Buen uso de clases y selectores (no selectores de etiqueta)

**Cómo verificarlo:**
```bash
# En proyecto, busca selectores de etiqueta en CSS:
grep -r "^body\|^div\|^p\|^span" frontend/css/
# Debería devolver 0 resultados para selectores sin clase
```

**Cómo verlo en el código:**
- `frontend/css/styles.css` - todo usa selectores de clase:
  - `.main-header` no `header`
  - `.nav-list` no `ul`
  - `.card-title` no `h3`
  - `.btn-primary` no `button`

**Qué hace:** Selectores de clase son más específicos y mantenibles que selectores de etiqueta.

---

### 📌 Código limpio, indentado y organizado

**Cómo verificarlo:**
- Abre cualquier archivo CSS o JS
- Sangría consistente (4 espacios o 2 espacios)
- Comentarios organizados por secciones
- Líneas en blanco separating bloques lógicos

**Ejemplo en código:**
- `frontend/css/styles.css` líneas ~1-20 (comentarios sección)
- Variables CSS organizadas: `:root` línea ~30

**Qué hace:** Código más fácil de leer, mantener y depurar.

---

---

# 🎓 ENTORNOS DE DESARROLLO

---

## REQUISITOS OBLIGATORIOS (1 punto cada uno)

---

### 📌 Backend - CRUD completo para 2+ elementos (API REST)

**Cómo verlo en el código:**
- `backend/server.js` líneas ~267-650 (todas las rutas API)
  - **Alojamientos CRUD:** líneas ~270-520
    - GET `/api/alojamientos` - listar todos
    - GET `/api/alojamientos/:id` - obtener uno
    - POST `/api/alojamientos` - crear
    - PUT `/api/alojamientos/:id` - actualizar
    - DELETE `/api/alojamientos/:id` - eliminar
  - **Categorías CRUD:** líneas ~267-380
    - GET `/api/categorias`
    - POST `/api/categorias` (protegido admin)
    - DELETE `/api/categorias/:id` (protegido admin)
  - **Comentarios CRUD:** líneas ~520-640
    - GET `/api/alojamientos/:id/comentarios`
    - POST `/api/comentarios` - crear
    - DELETE `/api/comentarios/:id` (protegido)

**Qué hace:** Backend completo tipo REST que gestiona datos de alojamientos, categorías y comentarios.

---

### 📌 Frontend - CRUD completo para 2+ elementos

**Cómo verlo en la web:**
1. Login como admin (admin/admin123)
2. En index.html, sección "Gestión de Nidos (CRUD)":
   - **CREATE:** Formulario para crear nuevo alojamiento
   - **READ:** Lista de productos ya visibles
   - **UPDATE:** Botón "✏️ Editar Precio" en cada card
   - **DELETE:** Botón "✏️" con opción de eliminar (línea inferior derecha)

**Cómo verlo en el código:**
- `frontend/index.html` líneas ~240-310 (formulario crear + botones editar/eliminar)
- `frontend/js/app.js` líneas ~150-300 (funciones CRUD: `createAlojamiento()`, `updateAlojamiento()`, `deleteAlojamiento()`)
- `frontend/js/app.js` líneas ~350-450 (carga inicial de productos)

**Qué hace:** Permite gestión completa de alojamientos desde el frontend.

---

### 📌 Repositorio GitHub con README e instrucciones de puesta en marcha

**Cómo verlo:**
- Repo: https://github.com/8sandro8/NomadNest
- README.md en raíz del proyecto

**Contenido del README:**
- Descripción del proyecto
- Instrucciones de instalación (npm install)
- Instrucciones de arranque (node server.js)
- Credenciales de acceso
- Rutas principales de la API

**Qué hace:** Documentación básica para que cualquiera pueda poner en marcha el proyecto.

---

### 📌 Gestión mediante ramas y Pull Requests

**Cómo verlo:**
```bash
# Ver ramas creadas:
git branch -a

# Ver PRs cerrados:
gh pr list --state closed
```

**Ramas principales:**
- `main` - rama principal (producción)
- `feature/fix-seguridad-jwt` - implementación JWT
- `release/final-mvp` - entrega MVP
- `release/final-entrega` - entrega final

**PRs合并ados:** 9 PRs fusionados a main

**Qué hace:** Workflow profesional con revisión de código antes de merging.

---

## OTRAS FUNCIONALIDADES (1 punto cada uno)

---

### 📌 Elementos del modelo de datos se relacionan entre sí

**Cómo verlo en el código:**
- `backend/server.js` líneas ~530-560
```javascript
// Comentarios linked a alojamientos
db.all("SELECT * FROM comentarios WHERE alojamiento_id = ?", [alojamientoId], ...)
```
- `backend/semilla.js` líneas ~100-115
```sql
CREATE TABLE comentarios (
    id INTEGER PRIMARY KEY,
    alojamiento_id INTEGER,
    FOREIGN KEY(alojamiento_id) REFERENCES alojamientos(id)
)
```

**Qué hace:** Los comentarios están relacionados con alojamientos específicos. Mostrando relaciones lógicas entre entidades.

---

### 📌 Zona protegida mediante usuario/contraseña (login)

**Cómo verlo en la web:**
1. Abre `frontend/index.html`
2. Click en botón "Acceder" (esquina superior derecha)
3. Redirige a `login.html`
4. Usa credenciales: `admin` / `admin123`
5. Tras login, tienes acceso a:
   - Sección admin con gestión CRUD
   - Botón "Ver perfil" → admin.html

**Cómo verlo en el código:**
- `backend/server.js` líneas ~130-180 (endpoint POST /api/auth/login)
- `backend/server.js` líneas ~260-270 (endpoint GET /api/auth/me)
- `frontend/js/auth.js` - librería completa de autenticación
- `frontend/login.html` - formulario de login
- `frontend/admin.html` - página protegida que verifica sesión

**Qué hace:** Sistema de autenticación JWT que protege zonas de administración.

---

### 📌 Validación backend con express-validator

**Cómo verlo en el código:**
- `backend/server.js` líneas ~130-145
```javascript
const loginValidations = [
    body('username').trim().notEmpty().withMessage('Usuario requerido'),
    body('password').notEmpty().withMessage('Contraseña requerida')
];
```
- `backend/server.js` líneas ~195-210
```javascript
const registerValidations = [
    body('username').trim().notEmpty().isLength({ min: 3 })...,
    body('password').notEmpty().isLength({ min: 8 })...,
    body('confirmPassword').notEmpty()...
];
```

**Qué hace:** Valida datos en backend antes de procesarlos. Responde con errores 400 si la validación falla.

---

### 📌 Validación frontend antes de enviar al backend

**Cómo verlo en la web:**
1. Abre `frontend/register.html`
2. Intenta enviar formulario vacío → error "Este campo es requerido"
3. Intenta password corta → error "La contraseña debe tener al menos 8 caracteres"
4. Intenta passwords diferentes → error "Las contraseñas no coinciden"

**Cómo verlo en el código:**
- `frontend/js/auth.js` líneas ~50-150 (validación registro)
- `frontend/login.html` línea ~30-50 (validación login)
- Atributos HTML5 como `required`, `minlength`

**Qué hace:** Validación cliente antes de enviar datos, mejor UX y menos tráfico innecesario.

---

### 📌 Wiki con especificación de la API

**Cómo verlo:**
- URL: https://github.com/8sandro8/NomadNest/wiki
- Archivo local: `docs/wiki/Home.md`
- Documentación: `docs/API.md`

**Contenido:**
- Endpoints de autenticación (login, register, logout, me)
- CRUD de alojamientos
- CRUD de categorías
- CRUD de comentarios
- Formatos de request/response

**Qué hace:** Documentación técnica completa de la API para consumo externo.

---

### 📌 Colección Postman con requests de ejemplo

**Cómo verlo:**
- Archivo: `docs/NomadNest.postman_collection.json`
- Importar en Postman para probar todos los endpoints

**Qué hace:** Permite probar la API fácilmente con colecciones preconfiguradas.

---

### 📌 API incluye operación para trabajar con imágenes

**Cómo verlo en el código:**
- `backend/server.js` líneas ~20-30 (configuración multer)
- `backend/server.js` líneas ~500-540
```javascript
// POST /api/alojamientos con upload de imagen
app.post('/api/alojamientos', requireAuth, upload.single('imagen'), ...)
```

**Cómo verlo en la web:**
1. Login como admin
2. En formulario "Gestión de Nidos", campo "📸 Añadir Foto Principal"
3. Selecciona archivo de imagen
4. La imagen se guarda en `frontend/img/uploads/`

**Qué hace:** Permite subir imágenes de alojamientos via API con multer (almacenamiento disco).

---

## 📊 Modelo de Datos - Relaciones

```
┌─────────────┐       ┌───────────────┐
│ categorias  │       │  alojamientos │
│─────────────│       │───────────────│
│ id (PK)     │       │ id (PK)       │
│ nombre      │◄──────│ categoria_id  │
│ descripcion │       │ ...           │
└─────────────┘       └───────────────┘
                            │
                            │ 1:N
                            ▼
                     ┌─────────────┐
                     │ comentarios │
                     │─────────────│
                     │ id (PK)     │
                     │ alojamiento_id (FK)
                     │ texto       │
                     │ autor       │
                     │ fecha       │
                     └─────────────┘
```

---

## 🗂️ Índice Rápido de Archivos por Funcionalidad

| Funcionalidad | Archivos |
|---------------|----------|
| Backend API | `backend/server.js` |
| Autenticación JWT | `backend/utils/jwt.js`, `frontend/js/auth.js` |
| Base de datos | `backend/nomadnest.db`, `backend/semilla.js` |
| Frontend principal | `frontend/index.html`, `frontend/js/app.js` |
| Login/Registro | `frontend/login.html`, `frontend/register.html`, `frontend/css/login.css` |
| Admin panel | `frontend/admin.html` |
| Estilos | `frontend/css/styles.css`, `frontend/css/login.css` |
| Wiki | `docs/wiki/Home.md` |
| API Docs | `docs/API.md` |
| Postman | `docs/NomadNest.postman_collection.json` |

---

## 🎯 Checklist de Defensa

| Punto | Estado | Verificado |
|-------|--------|------------|
| FASE 1 - Header/logo | ✅ | |
| FASE 1 - Menú 3 secciones | ✅ | |
| FASE 1 - Carrusel | ✅ | |
| FASE 1 - Grid 3+ productos | ✅ | |
| FASE 1 - Formulario contacto | ✅ | |
| FASE 1 - Redes sociales iconos | ✅ | |
| FASE 1 - Footer | ✅ | |
| FASE 2 - Responsive | ✅ | |
| FASE 3 - Animaciones | ✅ | |
| TÉCNICO - HTML semántico | ✅ | |
| TÉCNICO - CSS externo | ✅ | |
| TÉCNICO - Clases (no etiqueta) | ✅ | |
| ENTORNO - Backend CRUD 2+ | ✅ | |
| ENTORNO - Frontend CRUD 2+ | ✅ | |
| ENTORNO - GitHub + README | ✅ | |
| ENTORNO - Ramas + PRs | ✅ | |
| ENTORNO - Relaciones datos | ✅ | |
| ENTORNO - Login JWT | ✅ | |
| ENTORNO - express-validator | ✅ | |
| ENTORNO - Validación frontend | ✅ | |
| ENTORNO - Wiki API | ✅ | |
| ENTORNO - Postman collection | ✅ | |
| ENTORNO - Upload imágenes | ✅ | |

---

*Documento generado para defensa del proyecto NomadNest*
*Última actualización: 2 de mayo de 2026*