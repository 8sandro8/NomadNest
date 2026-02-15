# NomadNest 2 - Documentación de API REST

Esta API gestiona los alojamientos, categorías y comentarios de la plataforma NomadNest.

## Base URL
`http://localhost:3000/api`

## Autenticación
Para las operaciones de escritura (POST, DELETE) en Alojamientos, se requiere autenticación vía Header.
- **Header**: `x-admin-token`
- **Valor**: `secret123`

---

## Endpoints

### 1. Categorías

#### `GET /categorias`
Obtiene todas las categorías de alojamiento disponibles.

- **Respuesta 200 OK**:
```json
[
  {
    "id": 1,
    "nombre": "Montaña",
    "descripcion": "Aire puro y altitud."
  },
  ...
]
```

### 2. Alojamientos

#### `GET /alojamientos`
Obtiene la lista completa de alojamientos.

- **Respuesta 200 OK**:
```json
[
    {
        "id": 1,
        "nombre": "Cabaña Pines",
        "descripcion": "...",
        "precio": 85,
        "imagen": "img/uploads/cabana1.jpg",
        "wifi_speed": 600,
        "categoria_id": 1,
        "categoria_nombre": "Montaña"
    }
]
```

#### `GET /alojamientos/:id`
Obtiene el detalle de un alojamiento específico.

#### `POST /alojamientos` (Protected)
Crea un nuevo alojamiento. Soporta subida de archivos `multipart/form-data`.

- **Body (FormData)**:
    - `nombre`: String (Required)
    - `descripcion`: String (Required, min 10 chars)
    - `precio`: Number (Required, > 0)
    - `wifi_speed`: Number (Required, > 10)
    - `categoria_id`: Number (Required, ID existente)
    - `foto`: File (Optional, imagen)

- **Respuesta 200 OK**: JSON con el objeto creado.
- **Respuesta 400 Bad Request**: JSON con array de `errors` de validación.
- **Respuesta 401 Unauthorized**: Falta token de admin.

#### `DELETE /alojamientos/:id` (Protected)
Elimina un alojamiento por ID.

### 3. Comentarios

#### `GET /comentarios/:id_alojamiento`
Obtiene los comentarios de un alojamiento.

#### `POST /comentarios`
Publica un nuevo comentario.

- **Body (JSON)**:
    - `alojamiento_id`: Number
    - `usuario`: String
    - `texto`: String

---

## Modelos de Datos

### Alojamiento
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Integer | PK auto-incremental |
| nombre | String | Nombre del nido |
| descripcion | String | Detalles del lugar |
| precio | Real | Precio por noche |
| imagen | String | Ruta relativa o URL |
| wifi_speed | Integer | Velocidad en Mbps |
| categoria_id | Integer | FK -> Categorias |

### Categoría
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Integer | PK auto-incremental |
| nombre | String | Nombre corto |
| descripcion | String | Descripción opcional |
