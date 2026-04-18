const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'nomadnest.db');

async function main() {
    console.log("🔄 Iniciando reseteo de la base de datos en: " + dbPath);

    // Initialize SQL.js
    const SQL = await initSqlJs();
    
    // Load existing database or create new one
    let db;
    if (fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

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
            categoria_id: 1
        },
        {
            nombre: "Estudio Lago",
            descripcion: "Vistas al agua e inspiración total.",
            precio: 120,
            imagen: "img/uploads/estudio1.jpg",
            wifi_speed: 1000,
            categoria_id: 2
        },
        {
            nombre: "Refugio Mountain",
            descripcion: "Aislado, silencioso y conectado.",
            precio: 95,
            imagen: "img/uploads/refugio1.jpg",
            wifi_speed: 300,
            categoria_id: 1
        },
        {
            nombre: "Domo Forestal",
            descripcion: "Estructura geodésica entre árboles centenarios.",
            precio: 110,
            imagen: "img/uploads/domo1.jpg",
            wifi_speed: 500,
            categoria_id: 3
        }
    ];

    // 1. LIMPIEZA TOTAL
    db.run("DROP TABLE IF EXISTS comentarios");
    db.run("DROP TABLE IF EXISTS alojamientos");
    db.run("DROP TABLE IF EXISTS categorias");
    db.run("DROP TABLE IF EXISTS usuarios");

    // 2. CREACIÓN DE TABLAS
    
    // Tabla USUARIOS (para autenticación)
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla CATEGORIAS
    db.run(`CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT
    )`);

    // Tabla ALOJAMIENTOS
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

    // Tabla COMENTARIOS
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
    categorias.forEach(cat => {
        db.run("INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)", [cat.nombre, cat.descripcion]);
    });

    // Insertar Alojamientos
    alojamientos.forEach(alo => {
        db.run("INSERT INTO alojamientos (nombre, descripcion, precio, imagen, wifi_speed, categoria_id) VALUES (?, ?, ?, ?, ?, ?)", 
            [alo.nombre, alo.descripcion, alo.precio, alo.imagen, alo.wifi_speed, alo.categoria_id]);
    });

    // Insertar Usuarios Demo (con bcrypt)
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.run("INSERT INTO usuarios (username, password_hash, role) VALUES (?, ?, ?)", ['admin', hashedPassword, 'admin']);

    // 4. GUARDAR BASE DE DATOS
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);

    // 5. LOG DE CONFIRMACIÓN
    console.log(`✅ ¡Éxito! Base de datos reseteada con RELACIONES.`);
    console.log(`📊 Se han insertado ${categorias.length} categorías.`);
    console.log(`📊 Se han insertado ${alojamientos.length} alojamientos nuevos.`);
    console.log(`📊 Se han insertado 1 usuario demo (admin/admin123).`);

    db.close();
}

main().catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
});