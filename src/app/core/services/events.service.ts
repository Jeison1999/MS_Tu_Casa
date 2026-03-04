import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';
import {
  Event,
  EventWithCountdown,
  EventsIndexResponse,
  EventsListResponse,
  EventDetailResponse
} from '../models/event.model';

/**
 * Servicio para obtener eventos desde el backend (solo lectura)
 */
@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private readonly REQUEST_TIMEOUT = 30000; // 30 segundos

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  /**
   * Obtiene todos los eventos (upcoming + recent past)
   * GET /api/v1/content/events
   * @param timeoutMs - Timeout personalizado en milisegundos (opcional)
   */
  getAllEvents(timeoutMs?: number): Observable<EventsIndexResponse> {
    const timeoutValue = timeoutMs || this.REQUEST_TIMEOUT;
    
    return this.http.get<EventsIndexResponse>(this.apiConfig.events.index())
      .pipe(
        timeout(timeoutValue),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene solo eventos próximos con cuenta regresiva
   * GET /api/v1/content/events/upcoming
   */
  getUpcomingEvents(): Observable<EventWithCountdown[]> {
    return this.http.get<EventsListResponse>(this.apiConfig.events.upcoming())
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        map(response => response.events),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene últimos 6 eventos pasados (historial)
   * GET /api/v1/content/events/recent_past
   */
  getRecentPastEvents(): Observable<Event[]> {
    return this.http.get<EventsListResponse>(this.apiConfig.events.recentPast())
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        map(response => response.events),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un evento específico por ID
   * GET /api/v1/content/events/:id
   */
  getEventById(id: number | string): Observable<EventWithCountdown> {
    return this.http.get<EventDetailResponse>(this.apiConfig.events.show(id))
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        map(response => response.event),
        catchError(this.handleError)
      );
  }

  /**
   * Calcula el countdown local (útil si el backend no lo envía)
   */
  calculateCountdown(eventDate: string | Date): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const now = new Date().getTime();
    const eventTime = new Date(eventDate).getTime();
    const distance = eventTime - now;

    if (distance < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  /**
   * Formatea el countdown para mostrar
   */
  formatCountdown(countdown: { days: number; hours: number; minutes: number; seconds: number }): string {
    if (countdown.days > 0) {
      return `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`;
    } else if (countdown.hours > 0) {
      return `${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`;
    } else if (countdown.minutes > 0) {
      return `${countdown.minutes}m ${countdown.seconds}s`;
    } else {
      return `${countdown.seconds}s`;
    }
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';

    // Timeout error
    if (error.name === 'TimeoutError') {
      errorMessage = 'La petición tardó demasiado. Por favor, intenta nuevamente.';
      return throwError(() => new Error(errorMessage));
    }

    // HTTP errors
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // Error del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del servidor
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
          if (error.error.details) {
            errorMessage += ': ' + error.error.details.join(', ');
          }
        } else {
          errorMessage = `Error ${error.status}: ${error.message}`;
        }
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
