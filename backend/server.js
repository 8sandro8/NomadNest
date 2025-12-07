const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer'); // Librería para subir archivos
const path = require('path');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE SUBIDA DE IMÁGENES (MULTER) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Las fotos se guardarán en frontend/img/uploads
        cb(null, '../frontend/img/uploads'); 
    },
    filename: function (req, file, cb) {
        // Nombre único: fecha + nombre original
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

db.run(`CREATE TABLE IF NOT EXISTS alojamientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL,
    imagen TEXT,
    wifi_speed INTEGER
)`);

// --- RUTAS API ---

// 1. LEER TODOS
app.get('/api/alojamientos', (req, res) => {
    db.all("SELECT * FROM alojamientos", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. LEER UNO POR ID (Para la página de detalles)
app.get('/api/alojamientos/:id', (req, res) => {
    const sql = "SELECT * FROM alojamientos WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "No encontrado" });
        res.json(row);
    });
});

// 3. CREAR (Con subida de imagen)
app.post('/api/alojamientos', upload.single('foto'), (req, res) => {
    // Nota: 'foto' es el nombre del campo en el formulario HTML
    
    const { nombre, descripcion, precio, wifi_speed } = req.body;
    
    // Si se subió un archivo, usamos su nombre. Si no, una por defecto.
    let imagenPath = req.file ? `img/uploads/${req.file.filename}` : 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?auto=format&fit=crop&w=500&q=60';

    const sql = "INSERT INTO alojamientos (nombre, descripcion, precio, imagen, wifi_speed) VALUES (?, ?, ?, ?, ?)";
    
    db.run(sql, [nombre, descripcion, precio, imagenPath, wifi_speed], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nombre, descripcion, precio, imagen: imagenPath, wifi_speed });
    });
});

// 4. BORRAR
app.delete('/api/alojamientos/:id', (req, res) => {
    const sql = "DELETE FROM alojamientos WHERE id = ?";
    db.run(sql, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Eliminado" });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 API REST corriendo en http://localhost:${PORT}`);
});