# NomadNest 🌲💻

**Plataforma de gestión de alojamientos para nómadas digitales.**
Proyecto desarrollado como integración de competencias para el ciclo formativo en el **Centro San Valero**.

## 🚀 Descripción
NomadNest es una aplicación web *full-stack* que permite gestionar un catálogo de alojamientos rurales optimizados para el teletrabajo. El proyecto combina diseño emocional, geolocalización, gestión de datos y feedback de usuarios.

### 🌟 Características Destacadas (Edición Final)
* **Gestión de Archivos Reales:** Sistema de subida de imágenes (Uploads) desde el ordenador local al servidor mediante `multer`.
* **Sistema de Opiniones:** Los usuarios pueden dejar comentarios y reseñas en tiempo real (Persistencia en SQLite).
* **Internacionalización (i18n):** Web completamente traducida al Español 🇪🇸 e Inglés 🇬🇧.
* **Geolocalización:** Integración de Google Maps incrustado apuntando a la sede central (Gallur).
* **Identidad Visual:** Diseño UI/UX inmersivo con temática de naturaleza.

## 🛠️ Tecnologías Utilizadas
* **Frontend:** HTML5 Semántico, CSS3, JavaScript Vanilla.
* **Backend:** Node.js, Express.
* **Base de Datos:** SQLite (Tablas: `alojamientos` y `comentarios`).
* **Librerías:** `multer`, `sqlite3`, `cors`, `express-validator`.

## ⚙️ Instalación y Puesta en Marcha

Sigue estos pasos para arrancar el proyecto en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/8sandro8/NomadNest.git](https://github.com/8sandro8/NomadNest.git)