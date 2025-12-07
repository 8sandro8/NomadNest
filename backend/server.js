const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer'); // Librería para subir fotos
const path = require('path');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN MULTER (SUBIDA DE FOTOS) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Guardamos las fotos en la carpeta del frontend
        cb(null, '../frontend/img/uploads'); 
    },
    filename: function (req, file, cb) {
        // Generamos un nombre único para que no se repitan
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- BASE DE DATOS ---
const db = new sqlite3.Database('./nomadnest.db', (err) => {
    if (err) console.error(err.message);
    else console.log('✅ Conectado a SQLite.');
});

// 1. Crear tabla ALOJAMIENTOS (Si no existe)
db.run(`CREATE TABLE IF NOT EXISTS alojamientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL,
    imagen TEXT,
    wifi_speed INTEGER
)`);

// 2. Crear tabla COMENTARIOS (AQUÍ ESTÁ LA MAGIA 🪄)
// Esta instrucción crea la tabla automáticamente al arrancar el server
db.run(`CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alojamiento_id INTEGER,
    usuario TEXT,
    texto TEXT,
    fecha TEXT,
    FOREIGN KEY(alojamiento_id) REFERENCES alojamientos(id)
)`);

// --- RUTAS API (ENDPOINTS) ---

// --- A) RUTAS DE ALOJAMIENTOS ---

// Leer todos
app.get('/api/alojamientos', (req, res) => {
    db.all("SELECT * FROM alojamientos", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Leer uno solo (Detalle)
app.get('/api/alojamientos/:id', (req, res) => {
    const sql = "SELECT * FROM alojamientos WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "No encontrado" });
        res.json(row);
    });
});

// Crear nuevo (Con subida de foto)
app.post('/api/alojamientos', upload.single('foto'), (req, res) => {
    const { nombre, descripcion, precio, wifi_speed } = req.body;
    // Si subió foto usamos esa, si no, una por defecto
    let imagenPath = req.file ? `img/uploads/${req.file.filename}` : 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?auto=format&fit=crop&w=500&q=60';

    const sql = "INSERT INTO alojamientos (nombre, descripcion, precio, imagen, wifi_speed) VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [nombre, descripcion, precio, imagenPath, wifi_speed], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nombre, descripcion, precio, imagen: imagenPath, wifi_speed });
    });
});

// Borrar
app.delete('/api/alojamientos/:id', (req, res) => {
    const sql = "DELETE FROM alojamientos WHERE id = ?";
    db.run(sql, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Eliminado" });
    });
});

// --- B) RUTAS DE COMENTARIOS (NUEVAS) ---

// Leer comentarios de una cabaña específica
app.get('/api/comentarios/:id', (req, res) => {
    const sql = "SELECT * FROM comentarios WHERE alojamiento_id = ? ORDER BY id DESC";
    db.all(sql, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Guardar un comentario nuevo
app.post('/api/comentarios', (req, res) => {
    const { alojamiento_id, usuario, texto } = req.body;
    const fecha = new Date().toLocaleDateString('es-ES'); // Pone la fecha de hoy automáticamente

    const sql = "INSERT INTO comentarios (alojamiento_id, usuario, texto, fecha) VALUES (?, ?, ?, ?)";
    db.run(sql, [alojamiento_id, usuario, texto, fecha], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, alojamiento_id, usuario, texto, fecha });
    });
});

// --- ARRANCAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 API REST corriendo en http://localhost:${PORT}`);
});