import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';
import { Announcement, AnnouncementsResponse } from '../models/announcement.model';

/**
 * Servicio para obtener anuncios desde el backend (solo lectura)
 * Proporciona acceso a anuncios activos y publicados para mostrar en la app
 */
@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
  private readonly REQUEST_TIMEOUT = 30000; // 30 segundos

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  /**
   * Obtiene anuncios activos y publicados
   * GET /api/v1/content/announcements/active
   * Solo retorna anuncios listos para mostrar en la app
   * @returns Observable con array de anuncios activos
   */
  getActiveAnnouncements(): Observable<Announcement[]> {
    return this.http.get<AnnouncementsResponse>(
      this.apiConfig.announcements.active()
    ).pipe(
      timeout(this.REQUEST_TIMEOUT),
      map(response => response.announcements),
      catchError(this.handleError)
    );
  }

  /**
   * Maneja errores de HTTP y retorna un mensaje legible
   * @param error - Error HTTP del servidor
   */
  private handleError(error: HttpErrorResponse | TimeoutError) {
    if (error instanceof TimeoutError) {
      console.error('Timeout en petición de anuncios (30s excedido)');
      return throwError(() => ({
        message: 'La petición de anuncios tardó demasiado tiempo. Intenta de nuevo.',
        code: 'TIMEOUT'
      }));
    }

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        console.error('Error de conexión al cargar anuncios');
        return throwError(() => ({
          message: 'No se pudo conectar al servidor de anuncios.',
          code: 'CONNECTION_ERROR'
        }));
      }

      if (error.status >= 500) {
        console.error('Error del servidor:', error.statusText);
        return throwError(() => ({
          message: 'El servidor de anuncios no está disponible. Intenta más tarde.',
          code: 'SERVER_ERROR'
        }));
      }

      if (error.status === 404) {
        console.error('Endpoint de anuncios no encontrado');
        return throwError(() => ({
          message: 'No se encontraron anuncios.',
          code: 'NOT_FOUND'
        }));
      }

      console.error('Error HTTP en anuncios:', error.status, error.message);
      return throwError(() => ({
        message: `Error al cargar anuncios (${error.status}).`,
        code: 'HTTP_ERROR'
      }));
    }

    return throwError(() => ({
      message: 'Error desconocido al cargar anuncios.',
      code: 'UNKNOWN_ERROR'
    }));
  }
}
