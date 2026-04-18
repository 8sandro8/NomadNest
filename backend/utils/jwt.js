const jwt = require('jsonwebtoken');

/**
 * Genera un token de acceso JWT
 * @param {string|number} userId - ID del usuario
 * @returns {string} Token JWT firmado
 */
const generateAccessToken = (userId) => {
    if (!userId) {
        throw new Error('userId es requerido para generar el token');
    }
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

/**
 * Genera un token de refresh JWT
 * @param {string|number} userId - ID del usuario
 * @returns {string} Token JWT firmado
 */
const generateRefreshToken = (userId) => {
    if (!userId) {
        throw new Error('userId es requerido para generar el token');
    }
    return jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @param {boolean} isRefresh - Indica si es un token de refresh
 * @returns {object} Payload decodificado
 * @throws {Error} Si el token es inválido o expirado
 */
const verifyToken = (token, isRefresh = false) => {
    if (!token) {
        throw new Error('Token es requerido para verificar');
    }
    
    const secret = isRefresh 
        ? process.env.JWT_REFRESH_SECRET 
        : process.env.JWT_SECRET;
    
    if (!secret) {
        throw new Error(`JWT_${isRefresh ? 'REFRESH' : ''}SECRET no está configurado en variables de entorno`);
    }
    
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token expirado');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Token inválido');
        }
        throw new Error('Error al verificar el token');
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken
};