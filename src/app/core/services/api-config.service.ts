import { Injectable } from '@angular/core';
import { environment } from '../config/environment';

/**
 * Servicio para centralizar la configuración de rutas del API
 * Usa este servicio para obtener URLs completas del backend
 */
@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private readonly baseUrl: string = environment.apiUrl;

  constructor() {}

  /**
   * Obtiene la URL base del API
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Construye una URL completa del API
   * @param path - Ruta relativa (ej: 'content/events')
   * @returns URL completa
   */
  getApiUrl(path: string): string {
    // Elimina "/" al inicio si existe
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${this.baseUrl}/${cleanPath}`;
  }

  /**
   * URLs específicas para eventos (solo lectura)
   */
  events = {
    // GET /api/v1/content/events
    index: () => this.getApiUrl('content/events'),
    
    // GET /api/v1/content/events/upcoming
    upcoming: () => this.getApiUrl('content/events/upcoming'),
    
    // GET /api/v1/content/events/recent_past
    recentPast: () => this.getApiUrl('content/events/recent_past'),
    
    // GET /api/v1/content/events/:id
    show: (id: number | string) => this.getApiUrl(`content/events/${id}`)
  };

  /**
   * Agregar aquí más endpoints cuando los necesite
   */
  
}
