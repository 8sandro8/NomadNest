# NomadNest 🌲💻

**Plataforma de gestión de alojamientos para nómadas digitales.**
Proyecto desarrollado como integración de competencias para el ciclo formativo en el **Centro San Valero**.

## 🚀 Descripción
NomadNest es una aplicación web *full-stack* que permite gestionar un catálogo de alojamientos rurales optimizados para el teletrabajo. El proyecto combina diseño emocional, geolocalización y gestión de datos.

### 🌟 Características Destacadas (Edición Final)
* **Gestión de Archivos Reales:** Sistema de subida de imágenes (Uploads) desde el ordenador local al servidor mediante `multer`.
* **Internacionalización (i18n):** Web completamente traducida al Español 🇪🇸 e Inglés 🇬🇧 con cambio en tiempo real.
* **Geolocalización:** Integración de Google Maps incrustado apuntando a la sede central (Gallur).
* **Identidad Visual:** Diseño UI/UX inmersivo con temática de naturaleza y "glassmorphism".
* **CRUD Completo:** Crear, Leer, Detalle individual y Borrar alojamientos.

## 🛠️ Tecnologías Utilizadas
* **Frontend:** HTML5 Semántico, CSS3 (Grid/Flexbox/Variables), JavaScript Vanilla (Fetch API).
* **Backend:** Node.js, Express.
* **Librerías Clave:** * `multer` (Gestión de ficheros/imágenes).
    * `sqlite3` (Persistencia de datos).
    * `cors` & `express-validator`.
* **Base de Datos:** SQLite (Fichero local `nomadnest.db`).
* **Control de Versiones:** Git & GitHub (Flujo Gitflow).

## ⚙️ Instalación y Puesta en Marcha

Sigue estos pasos para arrancar el proyecto en tu máquina local:

### 1. Prerrequisitos
Tener instalado [Node.js](https://nodejs.org/) y Git.

### 2. Clonar el repositorio
```bash
git clone [https://github.com/8sandro8/NomadNest.git](https://github.com/8sandro8/NomadNest.git)