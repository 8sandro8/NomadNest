// preload.js - debe cargarse ANTES de cualquier otro módulo que use require('sqlite3')
// Interceptor de require para redirigir sqlite3 al shim basado en sql.js

const Module = require('module');
const originalResolve = Module._resolveFilename;

// Interceptar resolución de módulos
Module._resolveFilename = function(request, parent, isMain, options) {
    if (request === 'sqlite3' || request === 'sqlite3-binding') {
        // Redirigir a nuestro shim
        const shimPath = require('path').join(__dirname, 'sqlite3-shim.js');
        return originalResolve.call(this, shimPath, parent, isMain, options);
    }
    return originalResolve.call(this, request, parent, isMain, options);
};

// También necesitamos resolver el paquete correctamente
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    if (id === 'sqlite3') {
        return require('./sqlite3-shim');
    }
    return originalRequire.call(this, id);
};

console.log('✅ SQLite3 shim pre-cargado');