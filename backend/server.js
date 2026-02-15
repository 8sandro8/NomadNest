const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const app = express();
const PORT = 3010;

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

// --- MIDDLEWARE DE AUTENTICACIÓN (Simulado) ---
const checkAuth = (req, res, next) => {
    // En un caso real, verificaríamos un token JWT o sesión.
    // Para este ejercicio académico, asumimos que si llega el header 'x-admin-token' con 'secret123', es admin.
    const token = req.headers['x-admin-token'];
    if (token === 'secret123') {
        next();
    } else {
        res.status(401).json({ error: "Acceso no autorizado. Se requiere ser Administrador." });
    }
};

// --- BASE DE DATOS ---
const dbPath = path.join(__dirname, 'nomadnest.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error(err.message);
    else console.log('✅ Conectado a SQLite en: ' + dbPath);
});

// Habilitar claves foráneas
db.run("PRAGMA foreign_keys = ON");

// --- RUTAS DE LA API ---

// GET Todas las categorías
app.get('/api/categorias', (req, res) => {
    db.all("SELECT * FROM categorias", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET Alojamientos (con Join opcional para ver nombre de categoría)
app.get('/api/alojamientos', (req, res) => {
    const sql = `
        SELECT a.*, c.nombre as categoria_nombre 
        FROM alojamientos a 
        LEFT JOIN categorias c ON a.categoria_id = c.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/alojamientos/:id', (req, res) => {
    const sql = `
        SELECT a.*, c.nombre as categoria_nombre 
        FROM alojamientos a 
        LEFT JOIN categorias c ON a.categoria_id = c.id
        WHERE a.id = ?
    `;
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "No encontrado" });
        res.json(row);
    });
});

// POST Crear Alojamiento con VALIDACIÓN y AUTH
app.post('/api/alojamientos',
    checkAuth, // 1. Proteger ruta
    upload.single('foto'), // 2. Subir archivo
    // 3. Validaciones
    [
        body('nombre').notEmpty().withMessage('El nombre es obligatorio').trim().escape(),
        body('descripcion').notEmpty().isLength({ min: 10 }).withMessage('La descripción debe ser detallada (min 10 caracteres)'),
        body('precio').isNumeric().withMessage('El precio debe ser un número'),
        body('wifi_speed').isInt({ min: 10 }).withMessage('La velocidad WiFi debe ser válida (> 10Mb)'),
        body('categoria_id').isInt().withMessage('Debes seleccionar una categoría válida')
    ],
    (req, res) => {
        // 4. Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre, descripcion, precio, wifi_speed, categoria_id } = req.body;

        // Imagen por defecto si no se sube una
        let imagenPath = req.file ? `img/uploads/${req.file.filename}` : 'img/default.jpg';

        const sql = "INSERT INTO alojamientos (nombre, descripcion, precio, imagen, wifi_speed, categoria_id) VALUES (?, ?, ?, ?, ?, ?)";
        db.run(sql, [nombre, descripcion, precio, imagenPath, wifi_speed, categoria_id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, nombre, descripcion, precio, imagen: imagenPath, wifi_speed, categoria_id });
        });
    }
);

// PUT Actualizar Alojamiento (NUEVO - Completa el CRUD)
app.put('/api/alojamientos/:id', checkAuth, [
    body('precio').isNumeric().withMessage('El precio debe ser un número')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const sql = "UPDATE alojamientos SET precio = ? WHERE id = ?";
    db.run(sql, [req.body.precio, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "No encontrado" });
        res.json({ message: "Precio actualizado correctamente" });
    });
});

// PUT Actualizar Precio (Protegido)
app.put('/api/alojamientos/:id',
    checkAuth,
    [
        body('precio').isNumeric().withMessage('El precio debe ser un número')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { precio } = req.body;
        const sql = "UPDATE alojamientos SET precio = ? WHERE id = ?";

        db.run(sql, [precio, req.params.id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: "No encontrado" });
            res.json({ message: "Precio actualizado correctamente" });
        });
    }
);

// DELETE Eliminar Alojamiento (Protegido)
app.delete('/api/alojamientos/:id', checkAuth, (req, res) => {
    const sql = "DELETE FROM alojamientos WHERE id = ?";
    db.run(sql, req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "No encontrado" });
        res.json({ message: "Eliminado correctamente" });
    });
});

// RUTAS DE COMENTARIOS

app.get('/api/comentarios/:id', (req, res) => {
    const sql = "SELECT * FROM comentarios WHERE alojamiento_id = ? ORDER BY id DESC";
    db.all(sql, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/comentarios',
    [
        body('usuario').notEmpty().trim().escape().withMessage('El nombre de usuario es obligatorio'),
        body('texto').notEmpty().trim().escape().withMessage('El comentario no puede estar vacío'),
        body('alojamiento_id').isInt().withMessage('ID de alojamiento inválido')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { alojamiento_id, usuario, texto } = req.body;
        const fecha = new Date().toLocaleDateString('es-ES');

        const sql = "INSERT INTO comentarios (alojamiento_id, usuario, texto, fecha) VALUES (?, ?, ?, ?)";
        db.run(sql, [alojamiento_id, usuario, texto, fecha], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, alojamiento_id, usuario, texto, fecha });
        });
    }
);

// --- ARRANCAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 API REST corriendo en http://localhost:${PORT}`);
    console.log(`🔐 Admin Token: secret123`);
});