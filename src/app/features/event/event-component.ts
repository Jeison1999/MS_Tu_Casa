import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EventsService } from '../../core/services/events.service';
import { ApiConfigService } from '../../core/services/api-config.service';
import { Event, EventWithCountdown } from '../../core/models/event.model';

@Component({
  selector: 'app-event-component',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [EventsService, ApiConfigService],
  templateUrl: './event-component.html',
  styleUrl: './event-component.css',
})
export class EventComponent implements OnInit, OnDestroy {
  // Datos del backend
  upcomingEvents: EventWithCountdown[] = [];
  pastEvents: Event[] = [];
  
  // Estados de carga y errores
  isLoading = true;
  error: string | null = null;
  hasTriedOnce = false;
  
  // Modal
  showModal = false;
  selectedEvent: EventWithCountdown | Event | null = null;
  
  // Contadores locales
  countdowns: Record<number, string> = {};
  private timerId: any;

  constructor(
    private eventsService: EventsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadEvents();
    // NO iniciar el timer aquí, se iniciará cuando los datos carguen
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  /**
   * Carga los eventos desde el backend
   */
  private loadEvents() {
    this.isLoading = true;
    this.error = null;

    // Timeout más corto en reintentos (10 segundos después del primer intento)
    const timeoutMs = this.hasTriedOnce ? 10000 : 30000;

    // Cargar todos los eventos a la vez
    this.eventsService.getAllEvents(timeoutMs).subscribe({
      next: (response) => {
        this.upcomingEvents = response.upcoming;
        this.pastEvents = response.recent_past;
        this.isLoading = false;
        this.hasTriedOnce = false;
        this.updateCountdowns();
        
        // Limpiar timer anterior si existe
        if (this.timerId) {
          clearInterval(this.timerId);
        }
        
        // Iniciar el timer solo si hay eventos próximos
        if (this.upcomingEvents.length > 0) {
          this.timerId = setInterval(() => this.updateCountdowns(), 1000);
        }
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.hasTriedOnce = true;
        
        if (error && error.message) {
          this.error = error.message;
        } else if (typeof error === 'string') {
          this.error = error;
        } else {
          this.error = 'No se pudieron cargar los eventos. Por favor, intenta de nuevo.';
        }
        
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

  }

  /**
   * Actualiza los contadores regresivos cada segundo
   */
  private updateCountdowns() {
    const now = Date.now();

    for (const event of this.upcomingEvents) {
      const eventDate = new Date(event.event_date);
      const diff = eventDate.getTime() - now;

      if (diff <= 0) {
        this.countdowns[event.id] = '¡El evento ha comenzado!';
        continue;
      }

      // Calcular countdown en tiempo real (no usar el del backend)
      const countdown = this.eventsService.calculateCountdown(event.event_date);
      this.countdowns[event.id] = this.eventsService.formatCountdown(countdown);
    }
    
    // Forzar detección de cambios para actualizar la UI
    this.cdr.detectChanges();
  }

  /**
   * Reintenta cargar los eventos
   */
  retry() {
    this.loadEvents();
  }

  /**
   * Abre el modal con los detalles del evento
   */
  openEventModal(event: EventWithCountdown | Event) {
    this.selectedEvent = event;
    this.showModal = true;
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra el modal
   */
  closeModal() {
    this.showModal = false;
    this.selectedEvent = null;
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  }

  /**
   * Formatea la fecha para mostrar en cards de eventos pasados
   */
  formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  }
}
