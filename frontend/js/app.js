// --- 1. DICCIONARIO DE IDIOMAS ---
const translations = {
    es: {
        nav_home: "Inicio",
        nav_about: "Quiénes somos",
        nav_nests: "Alojamientos",
        nav_contact: "Contacto",
        hero_title: "Tu oficina en el bosque",
        hero_subtitle: "Cabañas con WiFi de alta velocidad en plena naturaleza.",
        hero_cta: "Explorar Nidos",
        about_title: "🌲 Nuestra Raíz",
        about_p1: "NomadNest nació en Gallur de una necesidad sencilla: queríamos programar escuchando pájaros, no el tráfico.",
        about_p2: "Nuestro objetivo es revitalizar la España Vaciada atrayendo talento digital. Convertimos antiguos refugios en oficinas de alto rendimiento, demostrando que con la formación de San Valero se puede trabajar para cualquier parte del mundo.",
        section_featured: "Nuestros Nidos Destacados",
        admin_title: "🛠️ Gestión de Nidos (CRUD)",
        admin_btn: "Guardar Nuevo Nido",
        contact_title: "📍 Encuentra tu Norte",
        contact_office: "Oficina Central",
        contact_desc: "Ven a visitarnos y tómate un café mientras planeas tu próxima escapada.",
        comments_title: "💬 Opiniones de la Comunidad",
        leave_comment: "Deja tu opinión",
        send_comment: "Publicar Comentario"
    },
    en: {
        nav_home: "Home",
        nav_about: "Who we are",
        nav_nests: "Lodgings",
        nav_contact: "Contact",
        hero_title: "Your office in the woods",
        hero_subtitle: "High-speed WiFi cabins in the middle of nature.",
        hero_cta: "Explore Nests",
        about_title: "🌲 Our Roots",
        about_p1: "NomadNest was born in Gallur from a simple need: we wanted to code listening to birds, not traffic.",
        about_p2: "Our goal is to revitalize rural Spain by attracting digital talent. We turn old shelters into high-performance offices, proving that with training from San Valero you can work for anywhere in the world.",
        section_featured: "Featured Nests",
        admin_title: "🛠️ Nest Management (CRUD)",
        admin_btn: "Save New Nest",
        contact_title: "📍 Find your North",
        contact_office: "Headquarters",
        contact_desc: "Come visit us and have a coffee while planning your next getaway.",
        comments_title: "💬 Community Reviews",
        leave_comment: "Leave a review",
        send_comment: "Post Comment"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products-container')) {
        cargarAlojamientos(); // Home
    }

    // Si estamos en el home (admin section), cargar categorías
    if (document.getElementById('categoria')) {
        cargarCategorias();
    }

    if (document.getElementById('detail-container')) {
        cargarDetalle(); // Detalle
    }

    const formCrear = document.getElementById('form-crear');
    if (formCrear) {
        formCrear.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validarFormulario()) {
                await crearAlojamiento();
            }
        });
    }

    const formComentario = document.getElementById('form-comentario');
    if (formComentario) {
        formComentario.addEventListener('submit', async (e) => {
            e.preventDefault();
            await publicarComentario();
        });
    }

    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
        langSelector.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }
});

function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang][key]) el.innerText = translations[lang][key];
    });
}

// --- VALIDACIÓN FRONTEND ---
function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const precio = document.getElementById('precio').value;
    const desc = document.getElementById('descripcion').value.trim();
    const wifi = document.getElementById('wifi').value;
    const cat = document.getElementById('categoria').value;

    if (!nombre || !precio || !desc || !wifi || !cat) {
        alert("⚠️ Por favor, rellena todos los campos obligatorios.");
        return false;
    }

    if (precio <= 0) {
        alert("⚠️ El precio debe ser mayor que 0.");
        return false;
    }

    if (wifi < 10) {
        alert("⚠️ La velocidad WiFi debe ser al menos 10 Mb.");
        return false;
    }

    return true;
}

// --- API: CARGAR CATEGORIAS ---
async function cargarCategorias() {
    try {
        const res = await fetch('http://localhost:3000/api/categorias');
        const categorias = await res.json();
        const select = document.getElementById('categoria');
        select.innerHTML = '<option value="">Selecciona una categoría...</option>';
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}

// --- HOME ---
async function cargarAlojamientos() {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/alojamientos?t=${Date.now()}`);
        const alojamientos = await respuesta.json();

        const contenedor = document.getElementById('products-container');
        contenedor.innerHTML = '';

        alojamientos.forEach(alo => {
            const imagenUrl = alo.imagen && (alo.imagen.startsWith('http') || alo.imagen.startsWith('img/'))
                ? alo.imagen
                : `img/${alo.imagen || 'default.jpg'}`;

            const tarjeta = document.createElement('article');
            tarjeta.className = 'card';

            // Renderizado seguro sin estilos en línea (usando clases definidas en CSS)
            tarjeta.innerHTML = `
                <div class="card-image">
                    <button class="card-delete-btn" onclick="borrarAlojamiento(${alo.id})">X</button>
                </div>
                <div class="card-content">
                    <div>
                        <h3 class="card-title">${alo.nombre}</h3>
                        <p class="card-description">${alo.descripcion}</p>
                        ${alo.categoria_nombre ? `<small class="card-category-text">${alo.categoria_nombre}</small>` : ''}
                    </div>
                    <div class="card-footer">
                        <span class="price">${alo.precio}€ / noche</span>
                        <span class="wifi-badge">⚡ ${alo.wifi_speed} Mb</span>
                    </div>
                    <a href="detalle.html?id=${alo.id}" class="btn-secondary btn-details">Ver detalles</a>
                </div>
            `;
            // Aplicar imagen de fondo dinámicamente sin usar atributo style en el HTML string
            tarjeta.querySelector('.card-image').style.backgroundImage = `url('${imagenUrl}')`;
            contenedor.appendChild(tarjeta);
        });
    } catch (error) {
        console.error(error);
        alert("❌ Error de conexión: No se pudo cargar el alojamiento.");
    }
}

// --- DETALLE ---
async function cargarDetalle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    try {
        // 1. Cargar Info Alojamiento
        const respAlo = await fetch(`http://localhost:3000/api/alojamientos/${id}`);
        const alo = await respAlo.json();

        const imagenUrl = alo.imagen && (alo.imagen.startsWith('http') || alo.imagen.startsWith('img/'))
            ? alo.imagen : `img/${alo.imagen || 'default.jpg'}`;

        document.getElementById('detail-img').src = imagenUrl;
        document.getElementById('detail-title').innerText = alo.nombre;
        document.getElementById('detail-desc').innerText = alo.descripcion;
        document.getElementById('detail-price').innerText = `${alo.precio}€ / noche`;
        document.getElementById('detail-wifi').innerText = `⚡ ${alo.wifi_speed} Mb Fibra Óptica`;

        // 2. Cargar Comentarios
        cargarComentarios(id);

    } catch (error) { console.error(error); }
}

// --- COMENTARIOS ---
async function cargarComentarios(idAlojamiento) {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/comentarios/${idAlojamiento}`);
        const comentarios = await respuesta.json();

        const lista = document.getElementById('comments-list');
        lista.innerHTML = '';

        if (comentarios.length === 0) {
            lista.innerHTML = '<p class="comment-empty">Sé el primero en opinar.</p>';
            return;
        }

        comentarios.forEach(c => {
            const item = document.createElement('div');
            item.className = 'comment-item';
            item.innerHTML = `
                <div class="comment-header">
                    <strong class="comment-author">${c.usuario}</strong>
                    <span class="comment-date">${c.fecha}</span>
                </div>
                <p class="comment-text">${c.texto}</p>
            `;
            lista.appendChild(item);
        });
    } catch (error) { console.error(error); }
}

async function publicarComentario() {
    const params = new URLSearchParams(window.location.search);
    const idAlojamiento = params.get('id');

    const usuario = document.getElementById('comentario-usuario').value;
    const texto = document.getElementById('comentario-texto').value;

    try {
        const respuesta = await fetch('http://localhost:3000/api/comentarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alojamiento_id: idAlojamiento, usuario, texto })
        });

        if (respuesta.ok) {
            document.getElementById('form-comentario').reset();
            cargarComentarios(idAlojamiento); // Recargar la lista
        } else {
            alert("Error al enviar comentario");
        }
    } catch (error) { console.error(error); }
}

async function crearAlojamiento() {
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const wifi_speed = document.getElementById('wifi').value;
    const categoria = document.getElementById('categoria').value;
    const fotoInput = document.getElementById('foto');

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('wifi_speed', wifi_speed);
    formData.append('categoria_id', categoria);

    if (fotoInput.files[0]) {
        formData.append('foto', fotoInput.files[0]);
    }

    try {
        const respuesta = await fetch('http://localhost:3000/api/alojamientos', {
            method: 'POST',
            headers: {
                // Header simulado de admin para pasar el middleware
                'x-admin-token': 'secret123'
            },
            body: formData
        });

        if (respuesta.ok) {
            alert("✅ ¡Alojamiento creado!");
            document.getElementById('form-crear').reset();
            cargarAlojamientos();
        } else {
            const data = await respuesta.json();
            if (data.errors) {
                let msg = "Errores de validación:\n";
                data.errors.forEach(err => msg += `- ${err.msg}\n`);
                alert(msg);
            } else {
                alert("Error: " + (data.error || "Desconocido"));
            }
        }
    } catch (error) { console.error(error); }
}

window.borrarAlojamiento = async function (id) {
    if (confirm("¿Borrar alojamiento?")) {
        await fetch(`http://localhost:3000/api/alojamientos/${id}`, {
            method: 'DELETE',
            headers: { 'x-admin-token': 'secret123' }
        });
        cargarAlojamientos();
    }
}