# Wiki de NomadNest
## Información General
Proyecto de 1º de DAM para gestionar alojamientos rurales para nómadas digitales.
## Tecnologías
- Backend: Node.js + Express
- Base de datos: SQLite  
- Frontend: HTML5 + CSS3 + JavaScript
- Auth: JWT
## Endpoints
### Autenticación
| Método | Ruta             | Descripción        |
| ------ | ---------------- | ------------------ |
| POST   | /api/auth/login  | Iniciar sesión     |
| POST   | /api/auth/logout | Cerrar sesión      |
| GET    | /api/auth/me     | Ver usuario actual |
### Categorías
| Método | Ruta                | Descripción        |
| ------ | ------------------- | ------------------ |
| GET    | /api/categorias     | Ver todas          |
| POST   | /api/categorias     | Crear (admin)      |
| PUT    | /api/categorias/:id | Actualizar (admin) |
| DELETE | /api/categorias/:id | Eliminar (admin)   |
### Alojamientos
| Método | Ruta                  | Descripción               |
| ------ | --------------------- | ------------------------- |
| GET    | /api/alojamientos     | Ver todos                 |
| GET    | /api/alojamientos/:id | Ver uno                   |
| POST   | /api/alojamientos     | Crear (admin)             |
| PUT    | /api/alojamientos/:id | Actualizar precio (admin) |
| DELETE | /api/alojamientos/:id | Eliminar (admin)          |
## Credenciales
admin / admin123
---
*Por Sandro para DAM*
---