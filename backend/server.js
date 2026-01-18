const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE RUTAS ESTÁTICAS (FOTOS) ---
app.use('/img/uploads', express.static(path.join(__dirname, '../frontend/img/uploads')));

// --- CONFIGURACIÓN MULTER (SUBIDA DE FOTOS) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../frontend/img/uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- BASE DE DATOS ---
const dbPath = path.join(__dirname, 'nomadnest.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error(err.message);
    else console.log('✅ Conectado a SQLite en: ' + dbPath);
});

// 1. Crear tabla ALOJAMIENTOS
db.run(`CREATE TABLE IF NOT EXISTS alojamientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL,
    imagen TEXT,
    wifi_speed INTEGER
)`);

// 2. Crear tabla COMENTARIOS 
db.run(`CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alojamiento_id INTEGER,
    usuario TEXT,
    texto TEXT,
    fecha TEXT,
    FOREIGN KEY(alojamiento_id) REFERENCES alojamientos(id)
)`);

// --- RUTAS DE LA API ---

app.get('/api/alojamientos', (req, res) => {
    db.all("SELECT * FROM alojamientos", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/alojamientos/:id', (req, res) => {
    const sql = "SELECT * FROM alojamientos WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "No encontrado" });
        res.json(row);
    });
});

app.post('/api/alojamientos', upload.single('foto'), (req, res) => {
    const { nombre, descripcion, precio, wifi_speed } = req.body;
    
    let imagenPath = req.file ? `img/uploads/${req.file.filename}` : 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?auto=format&fit=crop&w=500&q=60';

    const sql = "INSERT INTO alojamientos (nombre, descripcion, precio, imagen, wifi_speed) VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [nombre, descripcion, precio, imagenPath, wifi_speed], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nombre, descripcion, precio, imagen: imagenPath, wifi_speed });
    });
});

app.delete('/api/alojamientos/:id', (req, res) => {
    const sql = "DELETE FROM alojamientos WHERE id = ?";
    db.run(sql, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Eliminado" });
    });
});

// Rutas de Comentarios
app.get('/api/comentarios/:id', (req, res) => {
    const sql = "SELECT * FROM comentarios WHERE alojamiento_id = ? ORDER BY id DESC";
    db.all(sql, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/comentarios', (req, res) => {
    const { alojamiento_id, usuario, texto } = req.body;
    const fecha = new Date().toLocaleDateString('es-ES');

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