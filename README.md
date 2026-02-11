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

## 🛠️ Tecnologías
*   HTML5 & CSS3
*   JavaScript (ES6)
*   Node.js & Express
*   SQLite
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
    npm install
    ```
4.  Arranca el servidor:
    ```bash
    node backend/server.js
    ```
5.  Abre el navegador en `http://localhost:3000/frontend/index.html`.

---
*Hecho por Sandro para el ciclo de DAM.* 💻⛺