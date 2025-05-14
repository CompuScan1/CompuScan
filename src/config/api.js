const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Rutas de la API
 * @type {Object}
 */
export const API_ROUTES = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    refresh: `${API_BASE_URL}/auth/refresh`
  },
  users: {
    base: `${API_BASE_URL}/users`,
    profile: `${API_BASE_URL}/users/profile`,
    byId: (id) => `${API_BASE_URL}/users/${id}`,
    byRFID: (rfid) => `${API_BASE_URL}/users/rfid/${rfid}`
  },
  equipos: {
    base: `${API_BASE_URL}/equipos`,
    byId: (id) => `${API_BASE_URL}/equipos/${id}`,
    byUser: (userId) => `${API_BASE_URL}/equipos/user/${userId}`,
    bySerial: (serial) => `${API_BASE_URL}/equipos/serial/${serial}`
  },
  asistencias: {
    base: `${API_BASE_URL}/asistencias`,
    byId: (id) => `${API_BASE_URL}/asistencias/${id}`,
    byUser: (userId) => `${API_BASE_URL}/asistencias/user/${userId}`,
    byDate: (date) => `${API_BASE_URL}/asistencias/date/${date}`,
    estadisticas: `${API_BASE_URL}/asistencias/estadisticas`
  }
};

/**
 * Configuración de la API
 * @type {Object}
 */
export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // 10 segundos
  retries: 3
}; 