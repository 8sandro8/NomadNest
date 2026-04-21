// =============================================================================
// NomadNest Auth Library - Frontend JWT Authentication
// =============================================================================
// Provee gestión de autenticación JWT para el frontend

const AUTH_STORAGE_KEY = 'nomadnest_auth';
const LOGIN_PAGE = '/login.html';
const ADMIN_PAGE = '/admin.html';
const API_BASE = 'http://localhost:3010';

// --- Auth Object (Namespace) ---
const Auth = {
    /**
     * Realiza login con credenciales
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @returns {Promise<{success: boolean, user?: object, error?: string}>}
     */
    async login(username, password) {
        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Guardar token y user en localStorage
                // Backend retorna accessToken, no token
                this.saveAuth({
                    token: data.accessToken,
                    user: data.user,
                    expiresAt: Date.now() + (60 * 60 * 1000) // 1 hora
                });
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error || 'Credenciales inválidas' };
            }
        } catch (error) {
            console.error('Auth.login error:', error);
            return { success: false, error: 'Error de conexión' };
        }
    },

    /**
     * Cierra sesión: limpia localStorage y redirige a login
     */
    logout() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        window.location.href = LOGIN_PAGE;
    },

    /**
     * Obtiene el token JWT del localStorage
     * @returns {string|null}
     */
    getToken() {
        const auth = this.getAuthData();
        return auth?.token || null;
    },

    /**
     * Obtiene los headers de autenticación para fetch
     * @returns {object} Headers con Authorization: Bearer <token>
     */
    getAuthHeaders() {
        const token = this.getToken();
        if (!token) return {};
        return { 'Authorization': `Bearer ${token}` };
    },

    /**
     * Verifica si el usuario está logueado y el token no está expirado
     * @returns {boolean}
     */
    isLoggedIn() {
        const auth = this.getAuthData();
        if (!auth || !auth.token) return false;
        
        // Verificar expiración
        if (auth.expiresAt && Date.now() > auth.expiresAt) {
            this.logout(); // Token expirado, logout automático
            return false;
        }
        
        return true;
    },

    /**
     * Obtiene el objeto usuario del localStorage
     * @returns {object|null}
     */
    getUser() {
        const auth = this.getAuthData();
        return auth?.user || null;
    },

    /**
     * Lee datos de autenticación del localStorage
     * @returns {object|null}
     */
    getAuthData() {
        try {
            const stored = localStorage.getItem(AUTH_STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error('Error reading auth data:', e);
            return null;
        }
    },

    /**
     * Guarda datos de autenticación en localStorage
     * @param {object} authData - { token, user, expiresAt }
     */
    saveAuth(authData) {
        try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
        } catch (e) {
            console.error('Error saving auth data:', e);
        }
    },

    /**
     * Maneja errores de autenticación (401 Unauthorized)
     * Detecta status 401, limpia localStorage y redirige a login
     * @param {Response} response - Response object de fetch
     * @returns {boolean} true si el error fue manejado (401), false si no
     */
    async handleAuthError(response) {
        if (response.status === 401) {
            // Token inválido o expirado - limpiar y redirigir
            localStorage.removeItem(AUTH_STORAGE_KEY);
            window.location.href = LOGIN_PAGE;
            return true;
        }
        return false;
    },

    /**
     * Verifica que el usuario tenga rol admin
     * @returns {boolean}
     */
    isAdmin() {
        const user = this.getUser();
        return user?.role === 'admin';
    },

    /**
     * Requiere autenticación: redirige a login si no está logueado
     */
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = LOGIN_PAGE;
        }
    },

    /**
     * Requiere rol admin: redirige a login si no es admin
     */
    requireAdmin() {
        this.requireAuth();
        if (!this.isAdmin()) {
            // No es admin - podría mostrar error o redirigir a página pública
            console.warn('Access denied: admin role required');
        }
    }
};

// --- Refresh Token (Opcional - Fase futura) ---
/**
 * Intenta renovar el token usando el endpoint de refresh
 * Nota: Requiere que el backend tenga /api/auth/refresh implementado
 * @returns {Promise<boolean>}
 */
Auth.refreshToken = async function() {
    try {
        const response = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: 'POST',
            headers: this.getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                this.saveAuth({
                    token: data.token,
                    user: data.user || this.getUser(),
                    expiresAt: Date.now() + (60 * 60 * 1000)
                });
                return true;
            }
        }
        // Refresh falló - hacer logout
        this.logout();
        return false;
    } catch (error) {
        console.error('Auth.refreshToken error:', error);
        this.logout();
        return false;
    }
};

// --- Auto-check en páginas protegidas ---
// Verificar autenticación al cargar páginas que requieren auth
if (typeof window !== 'undefined') {
    window.Auth = Auth;
    
    // Helper global para verificar auth en páginas protegidas
    window.requireAuth = () => Auth.requireAuth();
    window.requireAdmin = () => Auth.requireAdmin();
}