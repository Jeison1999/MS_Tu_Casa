/**
 * Configuración centralizada del entorno
 * Cambia aquí la URL del backend según el ambiente
 */

// Local
// export const environment = {
//   production: false,
//   apiUrl: 'http://localhost:3000/api/v1',
// };

/**
 * Backend de producción
 */
export const environment = {
  production: false,
  apiUrl: 'https://api.mstucasa.com/api/v1',
  /**
   * Canal de YouTube para el culto en vivo (gratis).
   * El ID empieza por "UC". YouTube Studio → Canal → Configuración avanzada.
   */
  youtubeChannelId: 'UCmoKp2GAoNCF-F1nETcJXVw',
  youtubeChannelUrl: 'https://www.youtube.com/@Mstucasa-n4l',
  /**
   * ID del live actual (youtu.be/XXXX → XXXX).
   * El embed del canal suele fallar en mstucasa.com; este ID sí se puede incrustar.
   * Si el próximo culto crea otro live, actualiza este valor.
   */
  youtubeLiveVideoId: 'o4MZzCdc6Ls',
};
