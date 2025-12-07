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
        // MENCIÓN A SAN VALERO AQUÍ
        about_p2: "Nuestro objetivo es revitalizar la España Vaciada atrayendo talento digital. Convertimos antiguos refugios en oficinas de alto rendimiento, demostrando que con la formación de San Valero se puede trabajar para cualquier parte del mundo.",
        section_featured: "Nuestros Nidos Destacados",
        admin_title: "🛠️ Gestión de Nidos (CRUD)",
        admin_btn: "Guardar Nuevo Nido",
        contact_title: "📍 Encuentra tu Norte",
        contact_office: "Oficina Central",
        contact_desc: "Ven a visitarnos y tómate un café mientras planeas tu próxima escapada."
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
        // MENCIÓN A SAN VALERO EN INGLÉS
        about_p2: "Our goal is to revitalize rural Spain by attracting digital talent. We turn old shelters into high-performance offices, proving that with training from San Valero you can work for anywhere in the world.",
        section_featured: "Featured Nests",
        admin_title: "🛠️ Nest Management (CRUD)",
        admin_btn: "Save New Nest",
        contact_title: "📍 Find your North",
        contact_office: "Headquarters",
        contact_desc: "Come visit us and have a coffee while planning your next getaway."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Detectar si estamos en la página principal o en detalles
    if (document.getElementById('products-container')) {
        cargarAlojamientos(); // Estamos en index.html
    } else if (document.getElementById('detail-container')) {
        cargarDetalle(); // Estamos en detalle.html
    }

    // Evento CREAR con FOTO
    const form = document.getElementById('form-crear');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await crearAlojamiento();
        });
    }

    // Evento IDIOMA
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

// --- INDEX: CARGAR TODOS ---
async function cargarAlojamientos() {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/alojamientos?t=${Date.now()}`);
        const alojamientos = await respuesta.json();
        
        const contenedor = document.getElementById('products-container');
        contenedor.innerHTML = ''; 

        alojamientos.forEach(alo => {
            // Manejo de URL de imagen
            const imagenUrl = alo.imagen && (alo.imagen.startsWith('http') || alo.imagen.startsWith('img/'))
                ? alo.imagen 
                : `img/${alo.imagen || 'default.jpg'}`;

            const tarjeta = document.createElement('article');
            tarjeta.className = 'card';
            tarjeta.innerHTML = `
                <div class="card-image" style="background-image: url('${imagenUrl}'); background-size: cover; background-position: center; height: 200px; position: relative;">
                    <button onclick="borrarAlojamiento(${alo.id})" style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">X</button>
                </div>
                <div class="card-content">
                    <h3>${alo.nombre}</h3>
                    <p>${alo.descripcion}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0;">
                        <span class="price">${alo.precio}€ / noche</span>
                        <span style="font-size: 0.9rem; color: #F2994A; font-weight: bold;">⚡ ${alo.wifi_speed} Mb</span>
                    </div>
                    <a href="detalle.html?id=${alo.id}" class="btn-secondary" style="display:block; text-align:center; text-decoration:none;">Ver detalles</a>
                </div>
            `;
            contenedor.appendChild(tarjeta);
        });
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

// --- DETALLES: CARGAR UNO SOLO ---
async function cargarDetalle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) return;

    try {
        const respuesta = await fetch(`http://localhost:3000/api/alojamientos/${id}`);
        const alo = await respuesta.json();

        const imagenUrl = alo.imagen && (alo.imagen.startsWith('http') || alo.imagen.startsWith('img/'))
            ? alo.imagen 
            : `img/${alo.imagen || 'default.jpg'}`;

        document.getElementById('detail-img').src = imagenUrl;
        document.getElementById('detail-title').innerText = alo.nombre;
        document.getElementById('detail-desc').innerText = alo.descripcion;
        document.getElementById('detail-price').innerText = `${alo.precio}€ / noche`;
        document.getElementById('detail-wifi').innerText = `⚡ ${alo.wifi_speed} Mb Fibra Óptica`;

    } catch (error) {
        console.error("Error cargando detalle:", error);
    }
}

// --- CREAR CON FOTO (FormData) ---
async function crearAlojamiento() {
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const wifi_speed = document.getElementById('wifi').value;
    const fotoInput = document.getElementById('foto');

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('wifi_speed', wifi_speed);
    
    if (fotoInput.files[0]) {
        formData.append('foto', fotoInput.files[0]);
    }

    try {
        const respuesta = await fetch('http://localhost:3000/api/alojamientos', {
            method: 'POST',
            body: formData
        });

        if (respuesta.ok) {
            alert("✅ ¡Alojamiento creado con foto!");
            document.getElementById('form-crear').reset();
            cargarAlojamientos(); 
        } else {
            alert("Error al guardar.");
        }
    } catch (error) {
        console.error("Error creando:", error);
    }
}

window.borrarAlojamiento = async function(id) {
    if (confirm("¿Borrar alojamiento?")) {
        await fetch(`http://localhost:3000/api/alojamientos/${id}`, { method: 'DELETE' });
        cargarAlojamientos();
    }
}