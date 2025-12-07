const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { body, validationResult } = require('express-validator'); // Requisito Entornos: Validaciones

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- 1. BASE DE DATOS ---
const db = new sqlite3.Database('./nomadnest.db', (err) => {
    if (err) console.error(err.message);
    else console.log('✅ Conectado a SQLite.');
});

// Crear tabla 'alojamientos'
db.run(`CREATE TABLE IF NOT EXISTS alojamientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL,
    imagen TEXT,
    wifi_speed INTEGER
)`);

// --- 2. RUTAS DE LA API (CRUD) ---

// LEER todos (GET)
app.get('/api/alojamientos', (req, res) => {
    db.all("SELECT * FROM alojamientos", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// CREAR uno nuevo (POST) con Validación
app.post('/api/alojamientos', [
    // Validaciones (Requisito Entornos)
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('precio').isNumeric().withMessage('El precio debe ser un número')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, descripcion, precio, imagen, wifi_speed } = req.body;
    const sql = "INSERT INTO alojamientos (nombre, descripcion, precio, imagen, wifi_speed) VALUES (?, ?, ?, ?, ?)";
    
    db.run(sql, [nombre, descripcion, precio, imagen, wifi_speed], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, ...req.body });
    });
});

// EDITAR (PUT)
app.put('/api/alojamientos/:id', (req, res) => {
    const { nombre, descripcion, precio, imagen, wifi_speed } = req.body;
    const sql = `UPDATE alojamientos SET nombre = ?, descripcion = ?, precio = ?, imagen = ?, wifi_speed = ? WHERE id = ?`;
    
    db.run(sql, [nombre, descripcion, precio, imagen, wifi_speed, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Alojamiento actualizado", changes: this.changes });
    });
});

// BORRAR (DELETE)
app.delete('/api/alojamientos/:id', (req, res) => {
    const sql = "DELETE FROM alojamientos WHERE id = ?";
    db.run(sql, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Alojamiento eliminado", changes: this.changes });
    });
});

// --- 3. ARRANCAR ---
app.listen(PORT, () => {
    console.log(`🚀 API REST corriendo en http://localhost:${PORT}`);
});