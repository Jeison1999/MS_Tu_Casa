import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UpcomingEvent {
  id: string;
  title: string;
  date: Date;
  image: string;
  location: string;
}

interface PastEvent {
  title: string;
  dateLabel: string;
  image: string;
  summary: string;
}

@Component({
  selector: 'app-event-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-component.html',
  styleUrl: './event-component.css',
})
export class EventComponent implements OnInit, OnDestroy {
  upcomingEvents: UpcomingEvent[] = [
    {
      id: 'noche-kaynos',
      title: 'Noche de Adoración Kaynos',
      date: new Date('2026-03-15T19:00:00'),
      image: 'assets/image/foto4.jpg',
      location: 'Sede principal – Auditorio',
    },
    {
      id: 'vigilia-juvenil',
      title: 'Vigilia Juvenil',
      date: new Date('2026-04-05T22:00:00'),
      image: 'assets/image/foto3.jpg',
      location: 'Sede principal – Salón Central',
    },
    {
      id: 'encuentro-iglesia',
      title: 'Gran Encuentro de la Iglesia',
      date: new Date('2026-05-01T17:00:00'),
      image: 'assets/image/foto1.jpg',
      location: 'Auditorio Principal',
    },
  ];

  pastEvents: PastEvent[] = [
    {
      title: 'Campaña de Milagros',
      dateLabel: 'Enero 2026',
      image: 'assets/image/foto2.jpg',
      summary: 'Tres noches de fe, salvación y testimonios de sanidad.',
    },
    {
      title: 'Navidad en Familia',
      dateLabel: 'Diciembre 2025',
      image: 'assets/image/foto3.jpg',
      summary: 'Celebración especial con teatro, música y tiempo en familia.',
    },
    {
      title: 'Ayuno Congregacional',
      dateLabel: 'Noviembre 2025',
      image: 'assets/image/foto4.jpg',
      summary: 'Jornada de búsqueda intensa de la presencia de Dios.',
    },
  ];

  countdowns: Record<string, string> = {};
  private timerId: any;

  ngOnInit() {
    this.updateCountdowns();
    this.timerId = setInterval(() => this.updateCountdowns(), 1000);
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private updateCountdowns() {
    const now = Date.now();

    for (const event of this.upcomingEvents) {
      const diff = event.date.getTime() - now;

      if (diff <= 0) {
        this.countdowns[event.id] = '¡El evento ha comenzado!';
        continue;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const parts: string[] = [];
      if (days > 0) {
        parts.push(`${days}d`);
      }
      parts.push(`${hours.toString().padStart(2, '0')}h`);
      parts.push(`${minutes.toString().padStart(2, '0')}m`);
      parts.push(`${seconds.toString().padStart(2, '0')}s`);

      this.countdowns[event.id] = parts.join(' · ');
    }
  }
}
