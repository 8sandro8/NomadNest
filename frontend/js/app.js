// =============================================================================
// NomadNest App.js - MVP Simplificado (JWT Auth)
// =============================================================================
// Autenticación JWT mediante Auth library (frontend/js/auth.js)
// Las funciones CRUD usan Auth.getAuthHeaders() para Authorization: Bearer <token>

// --- I18N ---
const translations = {
    es: {
        nav_home: "Inicio",
        nav_about: "Conócenos",
        nav_products: "Productos",
        nav_contact: "Contacto",
        nav_cart: "Carrito",
        nav_profile: "Ver perfil",
        nav_logout: "Cerrar sesión",
        hero_title: "Tu oficina en el bosque",
        hero_subtitle: "Cabañas con WiFi de alta velocidad en plena naturaleza.",
        hero_cta: "Explorar Nidos",
        about_title: "🌲 Nuestra Raíz",
        about_p1: "NomadNest nació en Gallur de una necesidad sencillos: queríamos programar escuchando pájaros, no el tráfico.",
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
        nav_about: "About Us",
        nav_products: "Products",
        nav_contact: "Contact",
        nav_cart: "Cart",
        nav_profile: "View Profile",
        nav_logout: "Logout",
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

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // Home: cargar alojamientos
    if (document.getElementById('products-container')) {
        cargarAlojamientos();
    }

    // Home: cargar categorías para el form admin
    if (document.getElementById('categoria')) {
        cargarCategorias();
    }

    // Detail page
    if (document.getElementById('detail-container')) {
        cargarDetalle();
    }

    // Form crear alojamiento (admin CRUD)
    const formCrear = document.getElementById('form-crear');
    if (formCrear) {
        formCrear.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validarFormulario()) {
                await crearAlojamiento();
            }
        });
    }

    // Form comentario
    const formComentario = document.getElementById('form-comentario');
    if (formComentario) {
        formComentario.addEventListener('submit', async (e) => {
            e.preventDefault();
            await publicarComentario();
        });
    }

    // Language selector
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
        langSelector.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }
});

// --- I18N ---
function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang][key]) el.innerText = translations[lang][key];
    });
}

// --- VALIDACIÓN ---
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

// --- CARGAR DATOS ---
async function cargarCategorias() {
    try {
        const res = await fetch('http://localhost:3010/api/categorias');
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

async function cargarAlojamientos() {
    try {
        const respuesta = await fetch(`http://localhost:3010/api/alojamientos?t=${Date.now()}`);
        const alojamientos = await respuesta.json();

        const contenedor = document.getElementById('products-container');
        contenedor.innerHTML = '';

        alojamientos.forEach(alo => {
            const imagenUrl = alo.imagen && (alo.imagen.startsWith('http') || alo.imagen.startsWith('img/'))
                ? alo.imagen
                : `img/${alo.imagen || 'default.jpg'}`;

            const tarjeta = document.createElement('article');
            tarjeta.className = 'card';

            tarjeta.innerHTML = `
                <div class="card-image">
                    <button class="card-delete-btn" onclick="borrarAlojamiento(${alo.id})">X</button>
                </div>
                <div class="card-content">
                    <div>
                        <h3>${alo.nombre}</h3>
                        <p>${alo.descripcion}</p>
                        ${alo.categoria_nombre ? `<small class="card-category-small">${alo.categoria_nombre}</small>` : ''}
                    </div>
                    <div class="card-footer">
                        <span class="price">${alo.precio}€ / noche</span>
                        <span class="wifi-badge">⚡ ${alo.wifi_speed} Mb</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-secondary" onclick="editarPrecio(${alo.id}, ${alo.precio})">✏️ Editar Precio</button>
                        <a href="detalle.html?id=${alo.id}" class="btn-secondary btn-details-link">Ver detalles</a>
                    </div>
                </div>
            `;
            tarjeta.querySelector('.card-image').style.backgroundImage = `url('${imagenUrl}')`;
            contenedor.appendChild(tarjeta);
        });
    } catch (error) {
        console.error(error);
        alert("❌ Error de conexión: No se pudo cargar el alojamiento.");
    }
}

async function cargarDetalle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    try {
        const respAlo = await fetch(`http://localhost:3010/api/alojamientos/${id}`);
        const alo = await respAlo.json();

        const imagenUrl = alo.imagen && (alo.imagen.startsWith('http') || alo.imagen.startsWith('img/'))
            ? alo.imagen : `img/${alo.imagen || 'default.jpg'}`;

        document.getElementById('detail-img').src = imagenUrl;
        document.getElementById('detail-title').innerText = alo.nombre;
        document.getElementById('detail-desc').innerText = alo.descripcion;
        document.getElementById('detail-price').innerText = `${alo.precio}€ / noche`;
        document.getElementById('detail-wifi').innerText = `⚡ ${alo.wifi_speed} Mb Fibra Óptica`;

        cargarComentarios(id);
    } catch (error) { console.error(error); }
}

async function cargarComentarios(idAlojamiento) {
    try {
        const respuesta = await fetch(`http://localhost:3010/api/comentarios/${idAlojamiento}`);
        const comentarios = await respuesta.json();

        const lista = document.getElementById('comments-list');
        lista.innerHTML = '';

        if (comentarios.length === 0) {
            lista.innerHTML = '<p class="comment-empty-msg">Sé el primero en opinar.</p>';
            return;
        }

        comentarios.forEach(c => {
            const item = document.createElement('div');
            item.className = 'comment-item-styled';
            item.innerHTML = `
                <div class="comment-header-styled">
                    <strong class="comment-author-styled">${c.usuario}</strong>
                    <span class="comment-date-styled">${c.fecha}</span>
                </div>
                <p class="comment-body-styled">${c.texto}</p>
            `;
            lista.appendChild(item);
        });
    } catch (error) { console.error(error); }
}

// --- COMENTARIOS ---
async function publicarComentario() {
    const params = new URLSearchParams(window.location.search);
    const idAlojamiento = params.get('id');

    const usuario = document.getElementById('comentario-usuario').value;
    const texto = document.getElementById('comentario-texto').value;

    try {
        const respuesta = await fetch('http://localhost:3010/api/comentarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alojamiento_id: idAlojamiento, usuario, texto })
        });

        if (respuesta.ok) {
            document.getElementById('form-comentario').reset();
            cargarComentarios(idAlojamiento);
        } else {
            alert("Error al enviar comentario");
        }
    } catch (error) { console.error(error); }
}

// --- CRUD ADMIN (con token hardcodeado) ---
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
        const respuesta = await fetch('http://localhost:3010/api/alojamientos', {
            method: 'POST',
            headers: { ...Auth.getAuthHeaders() },
            body: formData
        });

        if (respuesta.ok) {
            alert("✅ ¡Alojamiento creado!");
            document.getElementById('form-crear').reset();
            cargarAlojamientos();
        } else {
            // Manejar 401 - redirigir a login
            if (await Auth.handleAuthError(respuesta)) return;
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
        const response = await fetch(`http://localhost:3010/api/alojamientos/${id}`, {
            method: 'DELETE',
            headers: { ...Auth.getAuthHeaders() }
        });
        
        if (response.ok) {
            alert("✅ Alojamiento eliminado correctamente");
            cargarAlojamientos();
        } else {
            // Manejar 401 - redirigir a login
            if (await Auth.handleAuthError(response)) return;
            const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
            alert("❌ Error al eliminar: " + (errorData.error || "Error HTTP " + response.status));
        }
    }
}

window.editarPrecio = async function (id, precioActual) {
    const nuevoPrecio = prompt(`Introduce el nuevo precio para la cabaña (Actual: ${precioActual}€):`, precioActual);
    if (nuevoPrecio && !isNaN(nuevoPrecio) && nuevoPrecio !== precioActual.toString()) {
        try {
            const respuesta = await fetch(`http://localhost:3010/api/alojamientos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...Auth.getAuthHeaders() },
                body: JSON.stringify({ precio: parseFloat(nuevoPrecio) })
            });
            if (respuesta.ok) {
                alert("✅ Precio actualizado correctamente");
                cargarAlojamientos();
            } else {
                // Manejar 401 - redirigir a login
                if (await Auth.handleAuthError(respuesta)) return;
                alert("❌ Error al actualizar el precio");
            }
        } catch (error) { console.error(error); }
    }
};

// =============================================================================
// CARRUSEL - Lógica JavaScript
// =============================================================================
const carousel = {
    slides: [],
    currentIndex: 0,
    intervalId: null,
    autoplayDelay: 5000,

    init() {
        const container = document.querySelector('.carousel-container');
        if (!container) return;

        this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
        if (this.slides.length === 0) return;

        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const indicators = document.querySelectorAll('.indicator');

        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());

        indicators.forEach((ind, idx) => {
            ind.addEventListener('click', () => this.goTo(idx));
        });

        this.startAutoplay();
        container.addEventListener('mouseenter', () => this.stopAutoplay());
        container.addEventListener('mouseleave', () => this.startAutoplay());
    },

    goTo(index) {
        if (index < 0 || index >= this.slides.length) return;
        if (index === this.currentIndex) return;

        this.slides[this.currentIndex].classList.remove('active');
        this.slides[this.currentIndex].setAttribute('aria-selected', 'false');

        const indicators = document.querySelectorAll('.indicator');
        if (indicators[this.currentIndex]) {
            indicators[this.currentIndex].classList.remove('active');
            indicators[this.currentIndex].setAttribute('aria-selected', 'false');
        }

        this.currentIndex = index;

        this.slides[this.currentIndex].classList.add('active');
        this.slides[this.currentIndex].setAttribute('aria-selected', 'true');

        if (indicators[this.currentIndex]) {
            indicators[this.currentIndex].classList.add('active');
            indicators[this.currentIndex].setAttribute('aria-selected', 'true');
        }
    },

    prev() {
        const newIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
        this.goTo(newIndex);
    },

    next() {
        const newIndex = this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1;
        this.goTo(newIndex);
    },

    startAutoplay() {
        this.stopAutoplay();
        this.intervalId = setInterval(() => this.next(), this.autoplayDelay);
    },

    stopAutoplay() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
};

// --- ACTUALIZAR BOTON USUARIO SEGUN AUTH ---
function updateUserButton() {
    const userMenu = document.getElementById('user-menu');
    const userDropdown = document.getElementById('user-dropdown');
    const btnUser = document.getElementById('btn-user');
    const btnLogin = document.getElementById('btn-login');
    const userBtnText = document.getElementById('user-btn-text');
    const loginBtnText = document.getElementById('login-btn-text');

    if (Auth.isLoggedIn()) {
        const user = Auth.getUser();
        
        // Ocultar botón login, mostrar dropdown de usuario
        if (btnLogin) btnLogin.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        
        // Actualizar botón con nombre de usuario
        if (btnUser) {
            btnUser.classList.add('logged-in');
            btnUser.href = '#';
            if (userBtnText) userBtnText.textContent = user?.username || 'Mi Cuenta';
            btnUser.setAttribute('aria-label', `Cuenta de ${user?.username}`);
        }
    } else {
        // Mostrar botón login, ocultar dropdown
        if (btnLogin) btnLogin.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Toggle dropdown de usuario
document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('user-menu');
    const userDropdown = document.getElementById('user-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (!userMenu || !userDropdown) return;

    // Toggle dropdown al hacer click en el botón de usuario
    if (e.target.closest('#btn-user') && Auth.isLoggedIn()) {
        e.preventDefault();
        userDropdown.classList.toggle('show');
        e.stopPropagation();
        return;
    }

    // Cerrar dropdown al hacer click fuera
    if (!e.target.closest('#user-menu')) {
        userDropdown.classList.remove('show');
    }
});

// Logout handler
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            performLogout();
        });
    }
});

// Función de logout
function performLogout() {
    // Limpiar token JWT
    localStorage.removeItem('nomadnest_auth');
    
    // Actualizar botón a estado no logged in
    updateUserButton();
    
    // Redirigir a login
    window.location.href = 'login.html';
}

// Función helpers para carousel
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Ejecutar al cargar
if (document.getElementById('btn-user') || document.getElementById('btn-login')) {
    updateUserButton();
}

// --- FORMULARIO DE CONTACTO ---
const formContacto = document.getElementById('form-contacto');
if (formContacto) {
    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault();
        const statusEl = document.getElementById('contacto-status');
        const nombre = document.getElementById('contacto-nombre').value.trim();
        const email = document.getElementById('contacto-email').value.trim();
        const mensaje = document.getElementById('contacto-mensaje').value.trim();

        // Validación frontend
        if (!nombre || !email || !mensaje) {
            statusEl.textContent = 'Por favor, rellena todos los campos.';
            statusEl.className = 'form-status error';
            return;
        }

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            statusEl.textContent = 'Por favor, introduce un email válido.';
            statusEl.className = 'form-status error';
            return;
        }

        // Simular envío (no hay backend para esto)
        statusEl.textContent = '¡Gracias por contactarnos! Te responderemos pronto.';
        statusEl.className = 'form-status success';
        formContacto.reset();

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.className = 'form-status';
        }, 5000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carousel.init();
});