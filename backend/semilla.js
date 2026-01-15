const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'nomadnest.db'); 

const db = new sqlite3.Database(dbPath);

console.log("🔄 Iniciando reseteo de la base de datos en: " + dbPath);

// Tus datos 
const alojamientos = [
    {
        nombre: "Cabaña Pines",
        descripcion: "Perfecta para deep work. Fibra 600Mb.",
        precio: 85,
        imagen: "img/uploads/cabana1.jpg", 
        wifi_speed: 600
    },
    {
        nombre: "Estudio Lago",
        descripcion: "Vistas al agua e inspiración total.",
        precio: 120,
        imagen: "img/uploads/estudio1.jpg",
        wifi_speed: 1000
    },
    {
        nombre: "Refugio Mountain",
        descripcion: "Aislado, silencioso y conectado.",
        precio: 95,
        imagen: "img/uploads/refugio1.jpg",
        wifi_speed: 300
    }
];

db.serialize(() => {
    // 1. LIMPIEZA TOTAL
    db.run("DROP TABLE IF EXISTS alojamientos");
    db.run("DROP TABLE IF EXISTS comentarios");

    // 2. CREACIÓN DE TABLAS (Esquema limpio)
    db.run(`CREATE TABLE IF NOT EXISTS alojamientos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        descripcion TEXT,
        precio REAL,
        imagen TEXT,
        wifi_speed INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS comentarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alojamiento_id INTEGER,
        usuario TEXT,
        texto TEXT,
        fecha TEXT,
        FOREIGN KEY(alojamiento_id) REFERENCES alojamientos(id)
    )`);

    // 3. INSERCIÓN DE DATOS
    const stmt = db.prepare("INSERT INTO alojamientos (nombre, descripcion, precio, imagen, wifi_speed) VALUES (?, ?, ?, ?, ?)");

    alojamientos.forEach(alo => {
        stmt.run(alo.nombre, alo.descripcion, alo.precio, alo.imagen, alo.wifi_speed);
    });

    stmt.finalize();

    // 4. LOG DE CONFIRMACIÓN REAL
    console.log(`✅ ¡Éxito! Base de datos reseteada.`);
    console.log(`📊 Se han insertado ${alojamientos.length} alojamientos nuevos.`);
});

db.close();