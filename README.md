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
    *   Mapa de ubicación (Google Maps).
    *   Sistema de autenticación JWT para administración.

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
5.  Abre el navegador en `http://localhost:3000/frontend/index.html`.

## 🔐 Cómo autenticarse

El sistema usa autenticación JWT. Las credenciales por defecto son:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |

### Pasos para probar el sistema completo:

1.  **Inicia el backend** (si no lo has hecho):
    ```bash
    cd backend
    node server.js
    ```

2.  **Abre la página de login**:
    Ve a `http://localhost:3000/frontend/login.html`

3.  **Inicia sesión**:
    - Usuario: `admin`
    - Contraseña: `admin123`
    - Click en "Iniciar Sesión"

4.  **Accede al panel de administración**:
    Tras el login exitoso, serás redirigido a `admin.html` donde podrás:
    - Crear nuevos alojamientos
    - Editar precios
    - Eliminar alojamientos
    - Moderar comentarios

### Probando la API con curl

```bash
# 1. Login para obtener token
TOKEN=$(curl -s -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.token')

# 2. Ver datos del usuario actual
curl -X GET http://localhost:3010/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 3. Crear un alojamiento (requiere auth)
curl -X POST http://localhost:3010/api/alojamientos \
  -H "Authorization: Bearer $TOKEN" \
  -F "nombre=Mi Cabaña" \
  -F "descripcion=Una cabaña muy acogedora en el bosque" \
  -F "precio=80" \
  -F "wifi_speed=50" \
  -F "categoria_id=2"
```

### Archivos del sistema de autenticación

| Archivo | Descripción |
|---------|-------------|
| `backend/server.js` | Endpoints de autenticación (/api/auth/*) |
| `backend/utils/jwt.js` | Utilidades JWT (generar/verificar tokens) |
| `frontend/js/auth.js` | Librería cliente para gestionar auth |
| `frontend/login.html` | Página de login |

### Notas de seguridad

- El token JWT expira después de **1 hora**
- El sistema legacy `x-admin-token: secret123` fue eliminado por seguridad
- Los tokens se almacenan en `localStorage` del navegador
- Si el token expira, serás redirigido automáticamente a la página de login

---
*Hecho por Sandro para el ciclo de DAM.* 💻⛺