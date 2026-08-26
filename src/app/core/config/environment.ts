/**
 * Configuración centralizada del entorno
 * Cambia aquí la URL del backend según el ambiente
 */

// export const environment = {
//   production: false,
//   apiUrl: 'http://localhost:3000/api/v1', // Cambia aquí para desarrollo/producción
// };

/**
 * Configuración para producción
 * Descomenta y usa cuando despliegues a producción
 */
export const environment = {
  production: true,
  apiUrl: 'https://api.mstucasa.com/api/v1',
  /**
   * Canal de YouTube para el culto en vivo (gratis).
   * El ID empieza por "UC". YouTube Studio → Canal → Configuración avanzada.
   */
  youtubeChannelId: 'UCmoKp2GAoNCF-F1nETcJXVw',
  youtubeChannelUrl: 'https://www.youtube.com/@Mstucasa-n4l',
  /** Si hay un live concreto, tiene prioridad sobre el canal. */
  youtubeLiveVideoId: '',
};
