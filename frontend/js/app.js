document.addEventListener('DOMContentLoaded', () => {
    cargarAlojamientos();

    // Evento para CREAR (Create)
    const form = document.getElementById('form-crear');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await crearAlojamiento();
        });
    }
});

// --- LEER (READ) ---
async function cargarAlojamientos() {
    try {
        // El ?t=timestamp evita que la API nos devuelva datos viejos
        const respuesta = await fetch(`http://localhost:3000/api/alojamientos?t=${Date.now()}`);
        const alojamientos = await respuesta.json();
        renderizarAlojamientos(alojamientos);
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

// --- PINTAR HTML ---
function renderizarAlojamientos(datos) {
    const contenedor = document.getElementById('products-container');
    contenedor.innerHTML = ''; 

    datos.forEach(alo => {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'card';
        tarjeta.innerHTML = `
            <div class="card-image" style="background-color: #ddd; height: 200px; position: relative;">
                <button onclick="borrarAlojamiento(${alo.id})" style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-weight:bold;">X</button>
            </div>
            <div class="card-content">
                <h3>${alo.nombre}</h3>
                <p>${alo.descripcion}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0;">
                    <span class="price">${alo.precio}€ / noche</span>
                    <span style="font-size: 0.9rem; color: #F2994A; font-weight: bold;">⚡ ${alo.wifi_speed} Mb</span>
                </div>
                <button class="btn-secondary">Ver detalles</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

// --- CREAR (CREATE) ---
async function crearAlojamiento() {
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const wifi_speed = document.getElementById('wifi').value;

    try {
        const respuesta = await fetch('http://localhost:3000/api/alojamientos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, descripcion, precio, wifi_speed, imagen: 'default.jpg' })
        });

        if (respuesta.ok) {
            alert("✅ ¡Alojamiento creado!");
            document.getElementById('form-crear').reset();
            cargarAlojamientos(); // Recargar la lista
        } else {
            alert("Error al guardar.");
        }
    } catch (error) {
        console.error("Error creando:", error);
    }
}

// --- BORRAR (DELETE) ---
// Hacemos la función global para que el HTML pueda verla
window.borrarAlojamiento = async function(id) {
    if (confirm("¿Seguro que quieres borrar este nido?")) {
        try {
            await fetch(`http://localhost:3000/api/alojamientos/${id}`, {
                method: 'DELETE'
            });
            cargarAlojamientos(); // Recargar la lista
        } catch (error) {
            console.error("Error borrando:", error);
        }
    }
}