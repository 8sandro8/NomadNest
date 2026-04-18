// Shim de compatibilidad: sqlite3 → sql.js
// Este shim permite que server.js funcione usando sql.js internamente
// Necesita que sql.js esté inicializado (ver initSqlJs en el código que lo usa)

const path = require('path');

class DatabaseShim {
    constructor(filename, options, callback) {
        this.filename = filename;
        this.db = null;
        this.ready = false;
        
        // Inicializar sql.js asíncronamente
        this._init(callback);
    }

    _init(callback) {
        const initSqlJs = require('sql.js');
        
        initSqlJs().then(SQL => {
            // Intentar cargar base de datos existente
            const fs = require('fs');
            if (this.filename && this.filename !== ':memory:' && fs.existsSync(this.filename)) {
                const fileBuffer = fs.readFileSync(this.filename);
                this.db = new SQL.Database(fileBuffer);
            } else {
                this.db = new SQL.Database();
            }
            
            // Habilitar claves foráneas
            this.db.run("PRAGMA foreign_keys = ON");
            
            this.ready = true;
            if (callback) callback(null);
        }).catch(err => {
            if (callback) callback(err);
        });
    }

    // Esperar a que la DB esté lista
    _wait(callback) {
        if (this.ready) {
            if (callback) callback();
            return;
        }
        
        const checkReady = () => {
            if (this.ready) {
                if (callback) callback();
            } else {
                setTimeout(checkReady, 50);
            }
        };
        checkReady();
    }

    run(sql, params, callback) {
        this._wait(() => {
            try {
                if (params && typeof params === 'function') {
                    callback = params;
                    params = [];
                }
                params = params || [];
                
                this.db.run(sql, params);
                
                if (callback) {
                    callback(null, { changes: this.db.getRowsModified() });
                }
            } catch (err) {
                if (callback) callback(err);
            }
        });
    }

    get(sql, params, callback) {
        this._wait(() => {
            try {
                if (params && typeof params === 'function') {
                    callback = params;
                    params = [];
                }
                params = params || [];
                
                const stmt = this.db.prepare(sql);
                stmt.bind(params);
                
                if (stmt.step()) {
                    const row = stmt.getAsObject();
                    stmt.free();
                    process.nextTick(() => callback(null, row));
                } else {
                    stmt.free();
                    process.nextTick(() => callback(null, undefined));
                }
            } catch (err) {
                process.nextTick(() => callback(err));
            }
        });
    }

    all(sql, params, callback) {
        this._wait(() => {
            try {
                if (params && typeof params === 'function') {
                    callback = params;
                    params = [];
                }
                params = params || [];
                
                const stmt = this.db.prepare(sql);
                stmt.bind(params);
                
                const rows = [];
                while (stmt.step()) {
                    rows.push(stmt.getAsObject());
                }
                stmt.free();
                
                process.nextTick(() => callback(null, rows));
            } catch (err) {
                process.nextTick(() => callback(err));
            }
        });
    }

    each(sql, params, callback, complete) {
        this._wait(() => {
            try {
                if (params && typeof params === 'function') {
                    complete = callback;
                    callback = params;
                    params = [];
                }
                params = params || [];
                
                const stmt = this.db.prepare(sql);
                stmt.bind(params);
                
                const rows = [];
                while (stmt.step()) {
                    callback(null, stmt.getAsObject());
                }
                stmt.free();
                
                if (complete) complete();
            } catch (err) {
                if (callback) callback(err);
                if (complete) complete();
            }
        });
    }

    serialize(fn) {
        fn.call(this);
    }

    parallelize(fn) {
        fn.call(this);
    }

    close(callback) {
        this._wait(() => {
            try {
                // Guardar cambios al cerrar
                if (this.filename !== ':memory:') {
                    const fs = require('fs');
                    const data = this.db.export();
                    Buffer.from(data).copy(fs.createWriteStream(this.filename));
                }
                this.db.close();
                if (callback) process.nextTick(() => callback());
            } catch (err) {
                if (callback) process.nextTick(() => callback(err));
            }
        });
    }

    configure(option, value) {
        // sql.js tiene opciones diferentes
    }

    timeout(ms) {
        this.db.run(`PRAGMA busy_timeout = ${ms}`);
    }
}

// Export compatible con require('sqlite3').verbose()
// Exports.Database permite: new sqlite3.Database()
module.exports = DatabaseShim;
module.exports.Database = DatabaseShim; 
module.exports.verbose = () => DatabaseShim;