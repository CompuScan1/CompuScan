/**
 * Formatea una fecha a string en formato local
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  return fecha.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formatea el estado a un texto legible
 * @param {string} estado - Estado a formatear
 * @returns {string} Estado formateado
 */
export const formatearEstado = (estado) => {
  const estados = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    entrada: 'Entrada',
    salida: 'Salida'
  };
  return estados[estado] || estado;
};

/**
 * Valida el formato del número de serie
 * @param {string} serial - Número de serie a validar
 * @returns {boolean} true si es válido
 */
export const validarSerial = (serial) => {
  return serial.length >= 5;
};

/**
 * Valida el formato del RFID
 * @param {string} rfid - RFID a validar
 * @returns {boolean} true si es válido
 */
export const validarRFID = (rfid) => {
  return /^[A-Z0-9]{8,}$/.test(rfid);
};

/**
 * Calcula estadísticas de asistencia
 * @param {Array<import('../types').Asistencia>} asistencias - Lista de asistencias
 * @returns {{totalEntradas: number, totalSalidas: number, promedioTiempo: number}} Estadísticas
 */
export const calcularEstadisticas = (asistencias) => {
  return {
    totalEntradas: asistencias.filter(a => a.tipo === 'entrada').length,
    totalSalidas: asistencias.filter(a => a.tipo === 'salida').length,
    promedioTiempo: 0 // Implementar cálculo
  };
};

/**
 * Filtra equipos por usuario
 * @param {Array<import('../types').Equipo>} equipos - Lista de equipos
 * @param {string} usuarioId - ID del usuario
 * @returns {Array<import('../types').Equipo>} Equipos filtrados
 */
export const filtrarEquiposPorUsuario = (equipos, usuarioId) => {
  return equipos.filter(equipo => equipo.usuarioId === usuarioId);
};

/**
 * Ordena elementos por fecha
 * @param {Array<{fecha: Date}>} items - Lista de elementos
 * @param {'asc'|'desc'} [orden='desc'] - Orden de clasificación
 * @returns {Array<{fecha: Date}>} Elementos ordenados
 */
export const ordenarPorFecha = (items, orden = 'desc') => {
  return [...items].sort((a, b) => {
    const fechaA = new Date(a.fecha).getTime();
    const fechaB = new Date(b.fecha).getTime();
    return orden === 'asc' ? fechaA - fechaB : fechaB - fechaA;
  });
}; 