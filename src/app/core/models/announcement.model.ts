/**
 * Modelo de datos para Anuncios
 * Interfaz que refleja la estructura del backend Rails
 */
export interface Announcement {
  id: number;
  title: string;
  description?: string;
  media_url: string;
  media_type: 'image' | 'video';
  aspect_ratio?: string;
  is_active: boolean;
  published_at: string;
  created_at: string;
}

/**
 * Respuesta del servidor para anuncios
 */
export interface AnnouncementsResponse {
  announcements: Announcement[];
  meta: {
    total: number;
  };
}
