const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./nomadnest.db');

const alojamientos = [
    {
        nombre: "Cabaña Pines",
        descripcion: "Perfecta para deep work. Fibra 600Mb.",
        precio: 85,
        imagen: "cabana1.jpg",
        wifi_speed: 600
    },
    {
        nombre: "Estudio Lago",
        descripcion: "Vistas al agua e inspiración total.",
        precio: 120,
        imagen: "estudio1.jpg",
        wifi_speed: 1000
    },
    {
        nombre: "Refugio Mountain",
        descripcion: "Aislado, silencioso y conectado.",
        precio: 95,
        imagen: "refugio1.jpg",
        wifi_speed: 300
    }
];

db.serialize(() => {
    const stmt = db.prepare("INSERT INTO alojamientos (nombre, descripcion, precio, imagen, wifi_speed) VALUES (?, ?, ?, ?, ?)");
    
    alojamientos.forEach(alo => {
        stmt.run(alo.nombre, alo.descripcion, alo.precio, alo.imagen, alo.wifi_speed);
    });
    
    stmt.finalize();
    console.log("✅ 3 Alojamientos insertados correctamente.");
});

db.close();