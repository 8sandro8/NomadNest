const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('./utils/jwt');
require('dotenv').config();
const initSqlJs = require('sql.js');

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

// --- MIDDLEWARE DE AUTENTICACIÓN (JWT + Legacy) ---
const checkAuth = (req, res, next) => {
    // 1. Intentar JWT real primero
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = verifyToken(token);
            db.get("SELECT id, username, role FROM usuarios WHERE id = ?", [decoded.userId], (err, user) => {
                if (err) return res.status(500).json({ error: 'Error consultando usuario' });
                if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
                req.user = { userId: user.id, username: user.username, role: user.role };
                // Verificar que sea admin
                if (user.role !== 'admin') {
                    return res.status(403).json({ error: "Se requiere ser Administrador." });
                }
                next();
            });
            return;
        } catch (e) {
            // JWT inválido, intentar legacy
        }
    }
    
    // 2. Fallback legacy x-admin-token
    const legacyToken = req.headers['x-admin-token'];
    if (legacyToken === 'secret123') {
        req.user = { userId: 1, username: 'admin', role: 'admin' };
        next();
    } else {
        res.status(401).json({ error: "Acceso no autorizado. Se requiere ser Administrador." });
    }
};

// Middleware dual: JWT REAL + legacy (soporta ambos para backward compatibility)
const authenticate = (req, res, next) => {
    // 1. Intentar JWT real primero
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = verifyToken(token);
            // Buscar usuario en BD para obtener role
            db.get("SELECT id, username, role FROM usuarios WHERE id = ?", [decoded.userId], (err, user) => {
                if (err) return res.status(500).json({ error: 'Error consultando usuario' });
                if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
                req.user = { userId: user.id, username: user.username, role: user.role };
                next();
            });
            return;
        } catch (e) {
            // JWT inválido, intentar legacy
        }
    }
    
    // 2. Fallback legacy x-admin-token (para backward)
    const legacyToken = req.headers['x-admin-token'];
    if (legacyToken === 'secret123') {
        req.user = { userId: 1, username: 'admin', role: 'admin' };
        return next();
    }
    
    // 3. Ambos fallaron
    return res.status(401).json({ error: "Acceso no autorizado" });
};

// Middleware para verificar solo JWT (sin legacy)
const requireJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Token requerido" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token);
        db.get("SELECT id, username, role FROM usuarios WHERE id = ?", [decoded.userId], (err, user) => {
            if (err) return res.status(500).json({ error: 'Error consultando usuario' });
            if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
            req.user = { userId: user.id, username: user.username, role: user.role };
            next();
        });
    } catch (e) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
};

// --- BASE DE DATOS ---
const dbPath = path.join(__dirname, 'nomadnest.db');
const Database = require('./sqlite3-shim');
const db = new Database(dbPath, (err) => {
    if (err) console.error(err.message);
    else console.log('✅ Conectado a SQLite en: ' + dbPath);
});

// Habilitar claves foráneas
db.run("PRAGMA foreign_keys = ON");

// Almacenamiento en memoria para refresh tokens(invalidados)
const invalidatedRefreshTokens = new Set();

// --- RUTAS DE AUTENTICACIÓN ---

// POST /api/auth/login
app.post('/api/auth/login', [
    body('username').notEmpty().trim().withMessage('Usuario requerido'),
    body('password').notEmpty().withMessage('Contraseña requerida')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }

    const { username, password } = req.body;

    db.get("SELECT * FROM usuarios WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (!user) return res.status(401).json({ success: false, error: 'Credenciales inválidas' });

        const validPassword = bcrypt.compareSync(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.json({
            success: true,
            accessToken,
            refreshToken,
            user: { id: user.id, username: user.username, role: user.role }
        });
    });
});

// POST /api/auth/refresh
app.post('/api/auth/refresh', [
    body('refreshToken').notEmpty().withMessage('Refresh token requerido')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }

    const { refreshToken } = req.body;

    // Verificar si está invalidado
    if (invalidatedRefreshTokens.has(refreshToken)) {
        return res.status(401).json({ success: false, error: 'Token invalidado' });
    }

    try {
        const decoded = verifyToken(refreshToken, true);
        
        db.get("SELECT id, username, role FROM usuarios WHERE id = ?", [decoded.userId], (err, user) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            if (!user) return res.status(401).json({ success: false, error: 'Usuario no encontrado' });

            const newAccessToken = generateAccessToken(user.id);

            res.json({
                success: true,
                accessToken: newAccessToken,
                user: { id: user.id, username: user.username, role: user.role }
            });
        });
    } catch (e) {
        return res.status(401).json({ success: false, error: 'Refresh token inválido o expirado' });
    }
});

// POST /api/auth/logout
app.post('/api/auth/logout', requireJWT, (req, res) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = verifyToken(token, true);
            invalidatedRefreshTokens.add(token);
        } catch (e) {
            // Ignorar errores al logout
        }
    }
    res.json({ success: true, message: 'Logout exitoso' });
});

// GET /api/auth/me
app.get('/api/auth/me', requireJWT, (req, res) => {
    res.json({ success: true, user: req.user });
});

// --- RUTAS DE LA API ---

// GET Todas las categorías
app.get('/api/categorias', (req, res) => {
    db.all("SELECT * FROM categorias", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST Crear categoría (solo admin)
app.post('/api/categorias', authenticate, [
    body('nombre').notEmpty().trim().withMessage('El nombre es obligatorio'),
    body('descripcion').optional().trim()
], (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Solo administradores pueden crear categorías' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, descripcion } = req.body;

    db.run("INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)", [nombre, descripcion || ''], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nombre, descripcion: descripcion || '' });
    });
});

// PUT Actualizar categoría (solo admin)
app.put('/api/categorias/:id', authenticate, [
    body('nombre').optional().notEmpty().trim().withMessage('El nombre no puede estar vacío'),
    body('descripcion').optional().trim()
], (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Solo administradores pueden modificar categorías' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, descripcion } = req.body;
    const updates = [];
    const values = [];

    if (nombre) { updates.push('nombre = ?'); values.push(nombre); }
    if (descripcion !== undefined) { updates.push('descripcion = ?'); values.push(descripcion); }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    values.push(req.params.id);
    const sql = `UPDATE categorias SET ${updates.join(', ')} WHERE id = ?`;

    db.run(sql, values, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
        db.get("SELECT * FROM categorias WHERE id = ?", [req.params.id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        });
    });
});

// DELETE Eliminar categoría (solo admin, si no tiene alojamientos)
app.delete('/api/categorias/:id', authenticate, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Solo administradores pueden eliminar categorías' });
    }

    // Verificar si tiene alojamientos asociados
    db.get("SELECT COUNT(*) as count FROM alojamientos WHERE categoria_id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row && row.count > 0) {
            return res.status(400).json({ error: 'No se puede eliminar categoría con alojamientos asociados' });
        }

        db.run("DELETE FROM categorias WHERE id = ?", [req.params.id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
            res.json({ message: 'Categoría eliminada correctamente' });
        });
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

// PUT Actualizar Comentario (PATCH-like - solo owner o admin) - T012
app.put('/api/comentarios/:id',
    authenticate,
    [
        body('texto').optional().notEmpty().trim().escape().withMessage('El texto no puede estar vacío'),
        body('usuario').optional().trim().escape()
    ],
    (req, res) => {
        // Validación de express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Verificar que el comentario existe
        db.get("SELECT * FROM comentarios WHERE id = ?", [req.params.id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: 'Comentario no encontrado' });

            // Verificar permisos: owner o admin
            const isOwner = req.user.username === row.usuario;
            const isAdmin = req.user.role === 'admin';

            if (!isOwner && !isAdmin) {
                return res.status(403).json({ error: 'No autorizado. Solo el autor o un administrador pueden actualizar.' });
            }

            // Construir SQL dinámico basado en campos proporcionados
            const updates = [];
            const values = [];

            if (req.body.texto !== undefined) {
                updates.push("texto = ?");
                values.push(req.body.texto);
            }
            if (req.body.usuario !== undefined) {
                updates.push("usuario = ?");
                values.push(req.body.usuario);
            }

            if (updates.length === 0) {
                return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
            }

            values.push(req.params.id);
            const sql = `UPDATE comentarios SET ${updates.join(', ')} WHERE id = ?`;

            db.run(sql, values, function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Comentario no encontrado' });
                }

                // Retornar comentario actualizado
                db.get("SELECT * FROM comentarios WHERE id = ?", [req.params.id], (err, updatedRow) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(200).json(updatedRow);
                });
            });
        });
    }
);

// DELETE Eliminar Comentario - T013
app.delete('/api/comentarios/:id',
    authenticate,
    (req, res) => {
        // Verificar que el comentario existe
        db.get("SELECT * FROM comentarios WHERE id = ?", [req.params.id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: 'Comentario no encontrado' });

            // Verificar permisos: owner o admin
            const isOwner = req.user.username === row.usuario;
            const isAdmin = req.user.role === 'admin';

            if (!isOwner && !isAdmin) {
                return res.status(403).json({ error: 'No autorizado. Solo el autor o un administrador pueden eliminar.' });
            }

            // Ejecutar DELETE
            db.run("DELETE FROM comentarios WHERE id = ?", [req.params.id], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Comentario no encontrado' });
                }

                res.status(200).json({ 
                    message: 'Comentario eliminado correctamente', 
                    id: req.params.id 
                });
            });
        });
    }
);

// --- ARRANCAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 API REST corriendo en http://localhost:${PORT}`);
    console.log(`🔐 Admin Token: secret123`);
});