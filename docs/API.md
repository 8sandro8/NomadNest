# NomadNest API Documentation

## 1. Introducción

La API de NomadNest es una REST API que permite gestionar categorías, alojamientos y comentarios. Proporciona autenticación mediante tokens JWT.

### Base URL
```
http://localhost:3010
```

### Formato de Respuesta
Todas las respuestas son JSON.

### Autenticación
La API utiliza **JWT (JSON Web Tokens)** para autenticar usuarios administradores.

- **JWT**: Tokens Bearer en el header `Authorization`
- **NO se soporta** el sistema legacy `x-admin-token: secret123` (eliminado por seguridad)

---

## 2. Autenticación

### Sistema de Autenticación JWT

La API utiliza tokens JWT para autenticar usuarios administradores. El flujo es:

1. **Login**: Enviar credenciales → Recibir token JWT
2. **Usar token**: Incluir `Authorization: Bearer <token>` en requests protegidos
3. **Verificar sesión**: Endpoint `/api/auth/me` para obtener datos del usuario actual

#### Headers de Autenticación

| Header | Valor | Uso |
|--------|-------|-----|
| `Authorization` | `Bearer <token_jwt>` | JWT (requerido) |

#### Roles
- **Admin**: Acceso total a endpoints protegidos
- **Usuario**: Acceso a comentarios y lectura pública

#### Flujo de Autenticación

```
┌─────────────┐     POST /api/auth/login     ┌─────────────┐
│   Cliente   │ ──────────────────────────► │   Backend   │
│ (login.html)│                            │  (server.js)│
│             │ ◄────────────────────────── │             │
└─────────────┘   { token, user, role }     └─────────────┘
      │                                        │
      ▼ (guardar en localStorage)              ▼
┌─────────────┐                               ┌─────────────┐
│ localStorage│                               │   Database  │
│ {token,user}│                               │  (usuarios) │
└─────────────┘                               └─────────────┘

┌─────────────┐     CRUD + Authorization     ┌─────────────┐
│   Cliente   │ ──────────────────────────► │   Middleware│
│  (app.js)   │  Authorization: Bearer ...  │ (checkAuth) │
└─────────────┘                            └─────────────┘
                                                │
                                                ▼
                                         ┌─────────────┐
                                         │  Allow/Deny │
                                         └─────────────┘
```

##### Paso a Paso

1. **Obtener token**: Enviar credenciales a `POST /api/auth/login`
2. **Guardar token**: Almacenar el token en localStorage del navegador
3. **Usar token**: Incluir `Authorization: Bearer <token>` en cada request
4. **Verificar sesión**: Usar `GET /api/auth/me` para obtener datos del usuario
5. **Cerrar sesión**: Eliminar token del localStorage (logout)

##### Manejo de Errores

| Código | Significado | Acción del Cliente |
|--------|-------------|-------------------|
| 401 | Token expirado o inválido | Redirigir a login.html |
| 403 | No tiene permisos | Mostrar mensaje de error |
| 400 | Validación fallida | Mostrar errores de formulario |

##### Ejemplo: Login desde JavaScript

```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});
const data = await response.json();

if (data.success) {
  // Guardar token
  localStorage.setItem('nomadnest_auth', JSON.stringify({
    token: data.token,
    user: data.user,
    expiresAt: Date.now() + 3600000 // 1 hora
  }));
  
  // Redirigir a página de admin
  window.location.href = '/admin.html';
}

// Usar token en requests
const headers = {
  'Authorization': `Bearer ${data.token}`
};

// Verificar si está logueado
function isLoggedIn() {
  const auth = JSON.parse(localStorage.getItem('nomadnest_auth'));
  return auth && auth.token && auth.expiresAt > Date.now();
}

// Logout
function logout() {
  localStorage.removeItem('nomadnest_auth');
  window.location.href = '/login.html';
}
```

---

### Endpoints de Autenticación

#### POST /api/auth/login

Inicia sesión y obtener un token JWT.

| 属性 | Valor |
|------|-------|
| Método | POST |
| Autenticación | ❌ No requerida |
| Content-Type | application/json |

##### Request Body
```json
{
  "username": "admin",
  "password": "admin123"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| username | string | ✅ | Nombre de usuario (mín. 3 caracteres) |
| password | string | ✅ | Contraseña (mín. 6 caracteres) |

##### Response Exitosa (200)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

##### Response Error (401)
```json
{
  "success": false,
  "error": "Credenciales inválidas"
}
```

##### Response Validación (400)
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "El nombre de usuario es obligatorio",
      "path": "username",
      "location": "body"
    }
  ]
}
```

##### Ejemplo cURL
```bash
curl -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

---

#### GET /api/auth/me

Obtiene los datos del usuario autenticado actualmente.

| 属性 | Valor |
|------|-------|
| Método | GET |
| Autenticación | ✅ Requiere JWT |
| Content-Type | application/json |

##### Headers
```
Authorization: Bearer <token_jwt>
```

##### Response Exitosa (200)
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

##### Response Error (401)
```json
{
  "error": "Token requerido"
}
```
o
```json
{
  "error": "Token inválido o expirado"
}
```

##### Ejemplo cURL
```bash
# Primero obtén el token con /api/auth/login, luego:
curl -X GET http://localhost:3010/api/auth/me \
  -H "Authorization: Bearer <tu_token_jwt>"
```

---

#### POST /api/auth/logout

Cierra la sesión del usuario (invalidar token del lado del cliente).

| 属性 | Valor |
|------|-------|
| Método | POST |
| Autenticación | ✅ Requiere JWT |
| Content-Type | application/json |

##### Headers
```
Authorization: Bearer <token_jwt>
```

##### Response Exitosa (200)
```json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

##### Notas
- El logout se maneja del lado del cliente eliminando el token del localStorage
- El servidor no mantiene blacklist de tokens (para simplificar)

---

#### POST /api/auth/refresh (Opcional)

Renueva el token JWT antes de que expire.

| 属性 | Valor |
|------|-------|
| Método | POST |
| Autenticación | ✅ Requiere JWT válido |
| Content-Type | application/json |

##### Headers
```
Authorization: Bearer <token_jwt>
```

##### Response Exitosa (200)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

##### Notas
- El token actual debe ser válido (no expirado)
- Genera un nuevo token con 1 hora de validez

---

## 3. Endpoints de Categorías

### GET /api/categorias

Obtiene todas las categorías disponibles.

| 属性 | Valor |
|------|-------|
| Método | GET |
| Autenticación | ❌ No requerida |
| Content-Type | application/json |

#### Response Exitosa (200)
```json
[
  {
    "id": 1,
    "nombre": "Hotel",
    "descripcion": "Hoteles tradicionales"
  },
  {
    "id": 2,
    "nombre": "Apartamento",
    "descripcion": "Apartamentos vacateionales"
  }
]
```

#### Códigos de Error
- 500: Error interno del servidor

---

## 4. Endpoints de Alojamientos

### GET /api/alojamientos

Obtiene todos los alojamientos con información de categoría.

| 属性 | Valor |
|------|-------|
| Método | GET |
| Autenticación | ❌ No requerida |
| Content-Type | application/json |

#### Response Exitosa (200)
```json
[
  {
    "id": 1,
    "nombre": "Hotel Centro",
    "descripcion": "Hotel céntrico con todas las comodidades",
    "precio": 120.50,
    "imagen": "img/uploads/1234567890.jpg",
    "wifi_speed": 100,
    "categoria_id": 1,
    "categoria_nombre": "Hotel"
  }
]
```

#### Códigos de Error
- 500: Error interno del servidor

---

### GET /api/alojamientos/:id

Obtiene un alojamiento específico por su ID.

| 属性 | Valor |
|------|-------|
| Método | GET |
| Autenticación | ❌ No requerida |
| Content-Type | application/json |

#### Parámetros de Ruta
- `id` (integer): ID del alojamiento

#### Response Exitosa (200)
```json
{
  "id": 1,
  "nombre": "Hotel Centro",
  "descripcion": "Hotel céntrico con todas las comodidades",
  "precio": 120.50,
  "imagen": "img/uploads/1234567890.jpg",
  "wifi_speed": 100,
  "categoria_id": 1,
  "categoria_nombre": "Hotel"
}
```

#### Códigos de Error
- 404: Alojamiento no encontrado
- 500: Error interno del servidor

---

### POST /api/alojamientos

Crea un nuevo alojamiento. Requiere autenticación de administrador.

| 属性 | Valor |
|------|-------|
| Método | POST |
| Autenticación | ✅ Requiere JWT (role: admin) |
| Content-Type | multipart/form-data |

#### Headers
```
Authorization: Bearer <token_jwt>
```

#### Request Body (form-data)
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| nombre | string | ✅ | Nombre del alojamiento |
| descripcion | string | ✅ | Descripción (mín. 10 caracteres) |
| precio | number | ✅ | Precio por noche |
| wifi_speed | integer | ✅ | Velocidad WiFi en Mbps (>10) |
| categoria_id | integer | ✅ | ID de la categoría |
| foto | file | ❌ | Imagen del alojamiento |

#### Response Exitosa (200)
```json
{
  "id": 5,
  "nombre": "Nuevo Alojamiento",
  "descripcion": "Descripción del nuevo alojamiento",
  "precio": 150,
  "imagen": "img/uploads/1234567890.jpg",
  "wifi_speed": 50,
  "categoria_id": 2
}
```

#### Códigos de Error
- 400: Error de validación
- 401: No autorizado
- 500: Error interno del servidor

#### Ejemplo cURL
```bash
# Primero haz login para obtener el token:
TOKEN=$(curl -s -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.token')

# Luego usa el token para crear el alojamiento:
curl -X POST http://localhost:3010/api/alojamientos \
  -H "Authorization: Bearer $TOKEN" \
  -F "nombre=Hotel Playa" \
  -F "descripcion=Hotel frente a la playa con vista al mar" \
  -F "precio=180" \
  -F "wifi_speed=100" \
  -F "categoria_id=1" \
  -F "foto=@/ruta/a/imagen.jpg"
```

---

### PUT /api/alojamientos/:id

Actualiza el precio de un alojamiento. Requiere autenticación de administrador.

| 属性 | Valor |
|------|-------|
| Método | PUT |
| Autenticación | ✅ Requiere JWT (role: admin) |
| Content-Type | application/json |

#### Headers
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

#### Request Body
```json
{
  "precio": 175.00
}
```

#### Response Exitosa (200)
```json
{
  "message": "Precio actualizado correctamente"
}
```

#### Códigos de Error
- 400: Error de validación
- 401: No autorizado
- 404: Alojamiento no encontrado
- 500: Error interno del servidor

#### Ejemplo cURL
```bash
TOKEN=$(curl -s -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.token')

curl -X PUT http://localhost:3010/api/alojamientos/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"precio": 175.00}'
```

---

### DELETE /api/alojamientos/:id

Elimina un alojamiento. Requiere autenticación de administrador.

| 属性 | Valor |
|------|-------|
| Método | DELETE |
| Autenticación | ✅ Requiere JWT (role: admin) |
| Content-Type | application/json |

#### Headers
```
Authorization: Bearer <token_jwt>
```

#### Response Exitosa (200)
```json
{
  "message": "Eliminado correctamente"
}
```

#### Códigos de Error
- 401: No autorizado
- 404: Alojamiento no encontrado
- 500: Error interno del servidor

#### Ejemplo cURL
```bash
TOKEN=$(curl -s -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.token')

curl -X DELETE http://localhost:3010/api/alojamientos/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. Endpoints de Comentarios

### GET /api/comentarios/:id

Obtiene los comentarios de un alojamiento específico.

| 属性 | Valor |
|------|-------|
| Método | GET |
| Autenticación | ❌ No requerida |
| Content-Type | application/json |

#### Parámetros de Ruta
- `id` (integer): ID del alojamiento

#### Response Exitosa (200)
```json
[
  {
    "id": 1,
    "alojamiento_id": 1,
    "usuario": "juan123",
    "texto": "Excelente ubicación y servicio",
    "fecha": "18/04/2026"
  },
  {
    "id": 2,
    "alojamiento_id": 1,
    "usuario": "maria456",
    "texto": "Muy limpio y cómodo",
    "fecha": "17/04/2026"
  }
]
```

#### Códigos de Error
- 500: Error interno del servidor

#### Ejemplo cURL
```bash
curl http://localhost:3010/api/comentarios/1
```

---

### POST /api/comentarios

Crea un nuevo comentario para un alojamiento.

| 属性 | Valor |
|------|-------|
| Método | POST |
| Autenticación | ❌ No requerida |
| Content-Type | application/json |

#### Request Body
```json
{
  "alojamiento_id": 1,
  "usuario": "juan123",
  "texto": "Excelente hotel, muy recomendable"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| alojamiento_id | integer | ✅ | ID del alojamiento |
| usuario | string | ✅ | Nombre de usuario |
| texto | string | ✅ | Contenido del comentario |

#### Response Exitosa (200)
```json
{
  "id": 3,
  "alojamiento_id": 1,
  "usuario": "juan123",
  "texto": "Excelente hotel, muy recomendable",
  "fecha": "18/04/2026"
}
```

#### Códigos de Error
- 400: Error de validación
- 500: Error interno del servidor

#### Ejemplo cURL
```bash
curl -X POST http://localhost:3010/api/comentarios \
  -H "Content-Type: application/json" \
  -d '{
    "alojamiento_id": 1,
    "usuario": "juan123",
    "texto": "Excelente hotel, muy recomendable"
  }'
```

---

### PUT /api/comentarios/:id

Actualiza un comentario existente. Requiere autenticación (propietario o admin).

| 属性 | Valor |
|------|-------|
| Método | PUT |
| Autenticación | ✅ Requiere JWT (propietario o admin) |
| Content-Type | application/json |

#### Headers
```
Authorization: Bearer <token_jwt>
```

#### Request Body
```json
{
  "texto": "Texto actualizado del comentario"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| texto | string | ❌ | Nuevo texto del comentario |
| usuario | string | ❌ | Nuevo nombre de usuario |

#### Response Exitosa (200)
```json
{
  "id": 1,
  "alojamiento_id": 1,
  "usuario": "juan123",
  "texto": "Texto actualizado del comentario",
  "fecha": "18/04/2026"
}
```

#### Códigos de Error
- 400: Error de validación
- 401: No autorizado
- 403: Prohibido (no eres el propietario ni admin)
- 404: Comentario no encontrado
- 500: Error interno del servidor

#### Ejemplo cURL
```bash
TOKEN=$(curl -s -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.token')

curl -X PUT http://localhost:3010/api/comentarios/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"texto": "Texto actualizado del comentario"}'
```

---

### DELETE /api/comentarios/:id

Elimina un comentario. Requiere autenticación (propietario o admin).

| 属性 | Valor |
|------|-------|
| Método | DELETE |
| Autenticación | ✅ Requiere JWT (propietario o admin) |
| Content-Type | application/json |

#### Headers
```
Authorization: Bearer <token_jwt>
```

#### Response Exitosa (200)
```json
{
  "message": "Comentario eliminado correctamente",
  "id": 1
}
```

#### Códigos de Error
- 401: No autorizado
- 403: Prohibido (no eres el propietario ni admin)
- 404: Comentario no encontrado
- 500: Error interno del servidor

#### Ejemplo cURL
```bash
TOKEN=$(curl -s -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.token')

curl -X DELETE http://localhost:3010/api/comentarios/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 6. Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 400 | Bad Request - Error de validación o parámetros inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - No tienes permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error interno del servidor |

---

## 7. Errores de Validación

Cuando la validación falla (especialmente en POST/PUT), el servidor devuelve un array con los errores:

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "El nombre es obligatorio",
      "path": "nombre",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "La descripción debe ser detallada (min 10 caracteres)",
      "path": "descripcion",
      "location": "body"
    }
  ]
}
```

---

## 8. Pruebas Rápidas

### 1. Listar todas las categorías
```bash
curl http://localhost:3010/api/categorias
```

### 2. Listar todos los alojamientos
```bash
curl http://localhost:3010/api/alojamientos
```

### 3. Obtener un alojamiento específico
```bash
curl http://localhost:3010/api/alojamientos/1
```

### 4. Ver comentarios de un alojamiento
```bash
curl http://localhost:3010/api/comentarios/1
```

### 5. Crear un comentario (sin auth)
```bash
curl -X POST http://localhost:3010/api/comentarios \
  -H "Content-Type: application/json" \
  -d '{"alojamiento_id": 1, "usuario": "testuser", "texto": "Gran experiencia"}'
```

### 6. Iniciar sesión como admin
```bash
curl -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```
Guarda el token recibido para los siguientes pasos.

### 7. Crear un alojamiento (requiere auth)
```bash
# Establece el token primero:
TOKEN="tu_token_aqui"

curl -X POST http://localhost:3010/api/alojamientos \
  -H "Authorization: Bearer $TOKEN" \
  -F "nombre=Test Hotel" \
  -F "descripcion=Hotel de prueba para testing de API" \
  -F "precio=99" \
  -F "wifi_speed=50" \
  -F "categoria_id=1"
```

### 8. Actualizar precio de alojamiento
```bash
TOKEN="tu_token_aqui"

curl -X PUT http://localhost:3010/api/alojamientos/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"precio": 125.00}'
```

### 9. Eliminar un alojamiento
```bash
TOKEN="tu_token_aqui"

curl -X DELETE http://localhost:3010/api/alojamientos/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 10. Actualizar un comentario (como admin)
```bash
TOKEN="tu_token_aqui"

curl -X PUT http://localhost:3010/api/comentarios/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"texto": "Comentario actualizado por admin"}'
```

### 11. Eliminar un comentario (como admin)
```bash
TOKEN="tu_token_aqui"

curl -X DELETE http://localhost:3010/api/comentarios/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 9. Flujo Completo de Ejemplo

### Paso 1: Listar categorías disponibles
```bash
curl http://localhost:3010/api/categorias
```
Response:
```json
[{"id": 1, "nombre": "Hotel", "descripcion": "Hoteles tradicionales"}, ...]
```

### Paso 2: Iniciar sesión como admin
```bash
curl -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```
Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

Guarda el token para usarlo en los siguientes pasos.

### Paso 3: Crear un alojamiento como admin
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3010/api/alojamientos \
  -H "Authorization: Bearer $TOKEN" \
  -F "nombre=Hotel Playa" \
  -F "descripcion=Hotel frente a la playa con vistas al mar" \
  -F "precio=150" \
  -F "wifi_speed=100" \
  -F "categoria_id=1"
```
Response:
```json
{
  "id": 10,
  "nombre": "Hotel Playa",
  "descripcion": "Hotel frente a la playa con vistas al mar",
  "precio": 150,
  "imagen": "img/default.jpg",
  "wifi_speed": 100,
  "categoria_id": 1
}
```

### Paso 4: Ver el alojamiento creado
```bash
curl http://localhost:3010/api/alojamientos/10
```

### Paso 5: Crear un comentario
```bash
curl -X POST http://localhost:3010/api/comentarios \
  -H "Content-Type: application/json" \
  -d '{"alojamiento_id": 10, "usuario": "turista1", "texto": "Excelente ubicación"}'
```
Response:
```json
{
  "id": 5,
  "alojamiento_id": 10,
  "usuario": "turista1",
  "texto": "Excelente ubicación",
  "fecha": "18/04/2026"
}
```

### Paso 6: Ver comentarios del alojamiento
```bash
curl http://localhost:3010/api/comentarios/10
```

### Paso 7: Actualizar el precio como admin
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X PUT http://localhost:3010/api/alojamientos/10 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"precio": 175}'
```

---

## 10. Notas Adicionales

### Imágenes
- Las imágenes se almacenan en `frontend/img/uploads/`
- Las imágenes se sirven desde `http://localhost:3010/img/uploads/`
- Si no se proporciona imagen, se usa `img/default.jpg`

### Validaciones
- **Alojamientos**: Nombre obligatorio, descripción mínimo 10 caracteres, precio numérico, WiFi > 10 Mbps
- **Comentarios**: Usuario y texto obligatorios

### Autenticación JWT
El proyecto utiliza utilities JWT en `backend/utils/jwt.js` con:
- `generateAccessToken(userId)`: Token válido por 1 hora
- `generateRefreshToken(userId)`: Token válido por 7 días
- `verifyToken(token, isRefresh)`: Verificación de tokens

**Importante**: El sistema legacy `x-admin-token: secret123` fue eliminado por seguridad. Todas las operaciones administrativas requieren JWT.

---

## 11. Referencias

- Backend: `backend/server.js`
- JWT Utils: `backend/utils/jwt.js`
- Frontend: `frontend/js/app.js`
- Puerto por defecto: **3010**

## 12. Changelog

### 2026-04-21 - Actualización de Seguridad
- Sistema de autenticación migrado de token hardcodeado a JWT
- Nuevos endpoints: `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
- Eliminación del sistema legacy `x-admin-token: secret123`
- Todas las operaciones administrativas requieren `Authorization: Bearer <token>`
- Nueva página de login: `frontend/login.html`
- Nueva librería de autenticación: `frontend/js/auth.js`