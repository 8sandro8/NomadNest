# NomadNest API Documentation

## 1. Introducción

La API de NomadNest es una REST API que permite gestionar categorías, alojamientos y comentarios. Proporciona autenticación mediante tokens JWT y un sistema de autenticación legacy.

### Base URL
```
http://localhost:3010
```

### Formato de Respuesta
Todas las respuestas son JSON.

### Autenticación
La API soporta dos mecanismos de autenticación:
- **JWT (Recomendado)**: Tokens Bearer en el header `Authorization`
- **Legacy**: Header `x-admin-token: secret123` (para compatibilidad)

---

## 2. Autenticación

### Sistema de Autenticación

La API utiliza un middleware de autenticación dual que soporta tanto el token JWT como el sistema legacy.

#### Headers de Autenticación

| Header | Valor | Uso |
|--------|-------|-----|
| `Authorization` | `Bearer <token_jwt>` | JWT (recomendado) |
| `x-admin-token` | `secret123` | Legacy (admin) |

#### Roles
- **Admin**: Acceso total a endpoints protegidos
- **Usuario**: Acceso a comentarios y lectura pública

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
| Autenticación | ✅ Requiere admin (`x-admin-token: secret123`) |
| Content-Type | multipart/form-data |

#### Headers
```
x-admin-token: secret123
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
curl -X POST http://localhost:3010/api/alojamientos \
  -H "x-admin-token: secret123" \
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
| Autenticación | ✅ Requiere admin (`x-admin-token: secret123`) |
| Content-Type | application/json |

#### Headers
```
x-admin-token: secret123
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
curl -X PUT http://localhost:3010/api/alojamientos/1 \
  -H "x-admin-token: secret123" \
  -H "Content-Type: application/json" \
  -d '{"precio": 175.00}'
```

---

### DELETE /api/alojamientos/:id

Elimina un alojamiento. Requiere autenticación de administrador.

| 属性 | Valor |
|------|-------|
| Método | DELETE |
| Autenticación | ✅ Requiere admin (`x-admin-token: secret123`) |
| Content-Type | application/json |

#### Headers
```
x-admin-token: secret123
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
curl -X DELETE http://localhost:3010/api/alojamientos/1 \
  -H "x-admin-token: secret123"
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
| Autenticación | ✅ Requiere (`x-admin-token: secret123` o JWT) |
| Content-Type | application/json |

#### Headers
```
x-admin-token: secret123
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
curl -X PUT http://localhost:3010/api/comentarios/1 \
  -H "x-admin-token: secret123" \
  -H "Content-Type: application/json" \
  -d '{"texto": "Texto actualizado del comentario"}'
```

---

### DELETE /api/comentarios/:id

Elimina un comentario. Requiere autenticación (propietario o admin).

| 属性 | Valor |
|------|-------|
| Método | DELETE |
| Autenticación | ✅ Requiere (`x-admin-token: secret123` o JWT) |
| Content-Type | application/json |

#### Headers
```
x-admin-token: secret123
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
curl -X DELETE http://localhost:3010/api/comentarios/1 \
  -H "x-admin-token: secret123"
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

### 6. Crear un alojamiento (requiere admin)
```bash
curl -X POST http://localhost:3010/api/alojamientos \
  -H "x-admin-token: secret123" \
  -F "nombre=Test Hotel" \
  -F "descripcion=Hotel de prueba para testing de API" \
  -F "precio=99" \
  -F "wifi_speed=50" \
  -F "categoria_id=1"
```

### 7. Actualizar precio de alojamiento
```bash
curl -X PUT http://localhost:3010/api/alojamientos/1 \
  -H "x-admin-token: secret123" \
  -H "Content-Type: application/json" \
  -d '{"precio": 125.00}'
```

### 8. Eliminar un alojamiento
```bash
curl -X DELETE http://localhost:3010/api/alojamientos/1 \
  -H "x-admin-token: secret123"
```

### 9. Actualizar un comentario (como admin)
```bash
curl -X PUT http://localhost:3010/api/comentarios/1 \
  -H "x-admin-token: secret123" \
  -H "Content-Type: application/json" \
  -d '{"texto": "Comentario actualizado por admin"}'
```

### 10. Eliminar un comentario (como admin)
```bash
curl -X DELETE http://localhost:3010/api/comentarios/1 \
  -H "x-admin-token: secret123"
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

### Paso 2: Crear un alojamiento como admin
```bash
curl -X POST http://localhost:3010/api/alojamientos \
  -H "x-admin-token: secret123" \
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

### Paso 3: Ver el alojamiento creado
```bash
curl http://localhost:3010/api/alojamientos/10
```

### Paso 4: Crear un comentario
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

### Paso 5: Ver comentarios del alojamiento
```bash
curl http://localhost:3010/api/comentarios/10
```

### Paso 6: Actualizar el precio como admin
```bash
curl -X PUT http://localhost:3010/api/alojamientos/10 \
  -H "x-admin-token: secret123" \
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
El proyecto incluye utilities JWT en `backend/utils/jwt.js` con:
- `generateAccessToken(userId)`: Token válido por 1 hora
- `generateRefreshToken(userId)`: Token válido por 7 días
- `verifyToken(token, isRefresh)`: Verificación de tokens

El sistema de autenticación dual permite migrar gradualmente de `x-admin-token` a JWT.

---

## 11. Referencias

- Backend: `backend/server.js`
- JWT Utils: `backend/utils/jwt.js`
- Frontend: `frontend/js/app.js`
- Puerto por defecto: **3010**