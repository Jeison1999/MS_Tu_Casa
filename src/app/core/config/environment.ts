/**
 * Configuración centralizada del entorno
 * Cambia aquí la URL del backend según el ambiente
 */

export const environment = {
  production: false,
  apiUrl: 'https://ms-backend-r8lr.onrender.com/api/v1', // Cambia aquí para desarrollo/producción
};

/**
 * Configuración para producción
 * Descomenta y usa cuando despliegues a producción
 */
// export const environment = {
//   production: true,
//   apiUrl: 'https://tu-dominio.com/api/v1',
// };
