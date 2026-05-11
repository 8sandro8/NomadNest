# NomadNest 🌲

**Proyecto de Gestión de Alojamientos Rurales**

¡Hola! 👋 Este es mi proyecto final para el curso de 1º de DAM (Desarrollo de Aplicaciones Multiplataforma). La idea es conectar a nómadas digitales con cabañas en zonas rurales de España.

Lo he hecho usando lo que hemos aprendido en clase: **Lenguajes de Marcas** (HTML/CSS), **Entornos de Desarrollo** (Git/GitHub) y un poco de **Programación** (JS y Node).

## 🚀 ¿Qué hace la web?
Básicamente es una web donde puedes ver alojamientos, filtrar por categorías y dejar comentarios.
*   **Front:** HTML5 semántico y CSS (sin frameworks, todo a mano con Flexbox y Grid).
*   **Back:** Un servidor sencillo en Node.js con Express.
*   **Base de Datos:** SQLite para que sea fácil de mover.
*   **Funcionalidades:**
    *   Ver listado de cabañas.
    *   Subir fotos reales desde tu PC (usando `multer`).
    *   Dejar comentarios que se guardan de verdad.
    *   Mapa de ubicación (OpenStreetMap).
    *   Sistema de autenticación JWT para administración.
    *   CRUD completo de alojamientos y categorías.

## 🛠️ Tecnologías
*   HTML5 & CSS3
*   JavaScript (ES6)
*   Node.js & Express
*   SQLite
*   JWT (JSON Web Tokens) para autenticación
*   Git & GitHub

## ⚙️ Cómo probarlo
Si quieres correrlo en tu ordenador:

1.  Bájate el código:
    ```bash
    git clone https://github.com/8sandro8/NomadNest.git
    ```
2.  Entra en la carpeta:
    ```bash
    cd NomadNest
    ```
3.  Instala lo necesario (tienes que tener Node instalado):
    ```bash
    cd backend
    npm install
    cd ..
    ```
4.  Arranca el servidor:
    ```bash
    cd backend
    node server.js
    ```
5.  Abre el navegador en `http://localhost:3010/frontend/index.html`

## 🔐 Cómo autenticarse

El sistema usa autenticación JWT. Las credenciales por defecto son:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| sandro | sandro89 | Usuario |

### Pasos para probar el sistema completo:

1.  **Inicia el backend** (si no lo has hecho):
    ```bash
    cd backend
    node server.js
    ```

2.  **Abre la página principal**:
    Ve a `http://localhost:3010/frontend/index.html`

3.  **Inicia sesión como admin**:
    - Click en "Acceder" (esquina superior derecha)
    - Usuario: `admin`
    - Contraseña: `admin123`
    - Click en "Iniciar Sesión"

4.  **Accede al panel de administración**:
    Tras el login exitoso, serás redirigido a index.html donde podrás:
    - Crear nuevos alojamientos con fotos
    - Editar precios
    - Eliminar alojamientos
    - Gestionar categorías (crear/editar/eliminar)
    - Moderar comentarios

### Probando la API con curl

```bash
# 1. Login para obtener token
TOKEN=$(curl -s -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.accessToken')

# 2. Ver datos del usuario actual
curl -X GET http://localhost:3010/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 3. Ver categorías
curl -X GET http://localhost:3010/api/categorias

# 4. Crear un alojamiento (requiere auth)
curl -X POST http://localhost:3010/api/alojamientos \
  -H "Authorization: Bearer $TOKEN" \
  -F "nombre=Mi Cabaña" \
  -F "descripcion=Una cabaña muy acogedora en el bosque" \
  -F "precio=80" \
  -F "wifi_speed=50" \
  -F "categoria_id=2"
```

## 📁 Estructura del Proyecto

```
NomadNest/
├── backend/
│   ├── server.js         # API REST + Express
│   ├── utils/jwt.js      # Utilidades JWT
│   ├── sqlite3-shim.js   # Compatibilidad sql.js
│   ├── semilla.js        # Crear BD con datos
│   └── nomadnest.db      # Base de datos SQLite
├── frontend/
│   ├── index.html        # Página principal
│   ├── login.html        # Login
│   ├── register.html     # Registro
│   ├── detalle.html      # Detalle alojamiento
│   ├── admin.html        # Panel admin
│   ├── css/              # Estilos
│   └── js/               # JavaScript
├── docs/
│   ├── wiki/             # Wiki de la API
│   ├── API.md             # Documentación API
│   └── NomadNest.postman_collection.json
└── README.md
```

## 📊 API Endpoints

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/register | Registrarse |
| POST | /api/auth/logout | Cerrar sesión |
| GET | /api/auth/me | Ver usuario actual |

### Alojamientos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/alojamientos | Listar todos |
| GET | /api/alojamientos/:id | Ver uno |
| POST | /api/alojamientos | Crear (admin) |
| PUT | /api/alojamientos/:id | Actualizar (admin) |
| DELETE | /api/alojamientos/:id | Eliminar (admin) |

### Categorías
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/categorias | Listar todas |
| POST | /api/categorias | Crear (admin) |
| PUT | /api/categorias/:id | Actualizar (admin) |
| DELETE | /api/categorias/:id | Eliminar (admin) |

### Comentarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/comentarios/:id | Ver de alojamiento |
| POST | /api/comentarios | Crear |
| PUT | /api/comentarios/:id | Editar |
| DELETE | /api/comentarios/:id | Eliminar |

## 📋 Colección Postman

Importa `docs/NomadNest.postman_collection.json` en Postman para probar todos los endpoints fácilmente.

## 📖 Wiki

La documentación completa de la API está en la [Wiki de GitHub](https://github.com/8sandro8/NomadNest/wiki).

---

*Hecho por Sandro para el ciclo de DAM.* 💻⛺