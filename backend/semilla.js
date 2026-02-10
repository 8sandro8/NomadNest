const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'nomadnest.db'); 
const db = new sqlite3.Database(dbPath);

console.log("🔄 Iniciando reseteo de la base de datos en: " + dbPath);

// --- DATOS SEMILLA ---
const categorias = [
    { nombre: "Montaña", descripcion: "Aire puro y altitud." },
    { nombre: "Lago", descripcion: "Relax junto al agua." },
    { nombre: "Bosque", descripcion: "Inmersión total en la naturaleza." }
];

const alojamientos = [
    {
        nombre: "Cabaña Pines",
        descripcion: "Perfecta para deep work. Para los amantes de la montaña y el frío. Fibra 600Mb.",
        precio: 85,
        imagen: "img/uploads/cabana1.jpg", 
        wifi_speed: 600,
        categoria_id: 1 // Montaña
    },
    {
        nombre: "Estudio Lago",
        descripcion: "Vistas al agua e inspiración total.",
        precio: 120,
        imagen: "img/uploads/estudio1.jpg",
        wifi_speed: 1000,
        categoria_id: 2 // Lago
    },
    {
        nombre: "Refugio Mountain",
        descripcion: "Aislado, silencioso y conectado.",
        precio: 95,
        imagen: "img/uploads/refugio1.jpg",
        wifi_speed: 300,
        categoria_id: 1 // Montaña
    },
    {
        nombre: "Domo Forestal",
        descripcion: "Estructura geodésica entre árboles centenarios.",
        precio: 110,
        imagen: "img/uploads/domo1.jpg",
        wifi_speed: 500,
        categoria_id: 3 // Bosque
    }
];

db.serialize(() => {
    // 1. LIMPIEZA TOTAL
    db.run("DROP TABLE IF EXISTS comentarios");
    db.run("DROP TABLE IF EXISTS alojamientos");
    db.run("DROP TABLE IF EXISTS categorias"); // Borramos primero las tablas dependientes o en orden inverso

    // 2. CREACIÓN DE TABLAS (Esquema relacional)
    
    // Tabla CATEGORIAS (Padre)
    db.run(`CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT
    )`);

    // Tabla ALOJAMIENTOS (Hija de Categorias)
    db.run(`CREATE TABLE IF NOT EXISTS alojamientos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio REAL,
        imagen TEXT,
        wifi_speed INTEGER,
        categoria_id INTEGER,
        FOREIGN KEY(categoria_id) REFERENCES categorias(id)
    )`);

    // Tabla COMENTARIOS (Hija de Alojamientos)
    db.run(`CREATE TABLE IF NOT EXISTS comentarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alojamiento_id INTEGER,
        usuario TEXT,
        texto TEXT,
        fecha TEXT,
        FOREIGN KEY(alojamiento_id) REFERENCES alojamientos(id) ON DELETE CASCADE
    )`);

    // 3. INSERCIÓN DE DATOS
    
    // Insertar Categorias
    const stmtCat = db.prepare("INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)");
    categorias.forEach(cat => {
        stmtCat.run(cat.nombre, cat.descripcion);
    });
    stmtCat.finalize();

    // Insertar Alojamientos
    const stmtAlo = db.prepare("INSERT INTO alojamientos (nombre, descripcion, precio, imagen, wifi_speed, categoria_id) VALUES (?, ?, ?, ?, ?, ?)");
    alojamientos.forEach(alo => {
        stmtAlo.run(alo.nombre, alo.descripcion, alo.precio, alo.imagen, alo.wifi_speed, alo.categoria_id);
    });
    stmtAlo.finalize();

    // 4. LOG DE CONFIRMACIÓN REAL
    console.log(`✅ ¡Éxito! Base de datos reseteada con RELACIONES.`);
    console.log(`📊 Se han insertado ${categorias.length} categorías.`);
    console.log(`📊 Se han insertado ${alojamientos.length} alojamientos nuevos.`);
});

db.close();