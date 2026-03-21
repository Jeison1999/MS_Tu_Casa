import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Announcement } from '../../core/models/announcement.model';

/**
 * Componente Modal para mostrar anuncios en carrusel
 * Controlado desde el parent (app.ts)
 * 
 * Uso:
 * <app-announcements-modal 
 *   [showModal]="showAnnouncementsModal" 
 *   [announcements]="announcements"
 *   (closeModal)="onAnnouncementsModalClose()">
 * </app-announcements-modal>
 */
@Component({
  selector: 'app-announcements-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcements-modal.component.html',
  styleUrl: './announcements-modal.component.css',
})
export class AnnouncementsModalComponent implements OnInit {
  @Input() showModal = false;
  @Input() announcements: Announcement[] = [];
  @Output() closeModal = new EventEmitter<void>();

  currentIndex = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // No hay necesidad inicialmente
  }

  /**
   * Navega al anuncio anterior (con wrap)
   */
  prev() {
    if (this.announcements.length === 0) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.announcements.length) %
      this.announcements.length;
    this.cdr.detectChanges();
  }

  /**
   * Navega al anuncio siguiente (con wrap)
   */
  next() {
    if (this.announcements.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.announcements.length;
    this.cdr.detectChanges();
  }

  /**
   * Cierra el modal y emite evento al parent
   */
  close() {
    this.closeModal.emit();
  }

  /**
   * Retorna el anuncio actual a mostrar
   */
  get currentAnnouncement(): Announcement | null {
    if (this.announcements.length === 0) return null;
    return this.announcements[this.currentIndex];
  }

  /**
   * Retorna el texto del indicador de página (ej: "1 / 3")
   */
  get pageIndicator(): string {
    if (this.announcements.length === 0) return '0 / 0';
    return `${this.currentIndex + 1} / ${this.announcements.length}`;
  }

  /**
   * Maneja clicks en el overlay para cerrar el modal
   */
  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  /**
   * Asegura reproducción al cargarse el video.
   * Nota: muchos navegadores bloquean autoplay si no está muted.
   */
  onAnnouncementVideoLoaded(event: Event) {
    const video = event.target as HTMLVideoElement | null;
    if (!video) return;

    // Intenta reproducir; si el navegador bloquea autoplay, no rompemos la UI.
    video.play().catch(() => {});
  }
}
