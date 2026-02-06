import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-youths.component',
  imports: [NgFor,],
  templateUrl: './youths.component.html',
  styleUrl: './youths.component.css',
})
export class YouthsComponent implements OnInit, OnDestroy {
  // Logo del ministerio (ajusta la ruta si usas otro archivo)
  logo = 'assets/image/kg.png';

  leaders = [
    {
      name: 'Juan Pérez',
      role: 'Líder de Jóvenes',
      photo: 'assets/image/foto1.jpg',
    },
    {
      name: 'María López',
      role: 'Coprotagonista Kaynos Generación',
      photo: 'assets/image/foto3.jpg',
    },
  ];

  highlightVerse = {
    reference: '1 Timoteo 4:12',
    text: 'Ninguno tenga en poco tu juventud, sino sé ejemplo de los creyentes en palabra, conducta, amor, espíritu, fe y pureza.',
  };

  verses = [
    {
      reference: 'Salmo 119:9',
      text: '¿Con qué limpiará el joven su camino? Con guardar tu palabra.',
    },
    {
      reference: 'Jeremías 1:7-8',
      text: 'No digas: Soy un niño; porque a todo lo que te envíe irás tú, y dirás todo lo que te mande.',
    },
    {
      reference: 'Romanos 12:2',
      text: 'No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento.',
    },
  ];

  events = [
    {
      title: 'Noche Kaynos',
      description: 'Adoración, Palabra y tiempo de conexión entre jóvenes.',
      day: 'Viernes',
      time: '7:30 PM',
      tag: 'Reunión semanal',
    },
    {
      title: 'Campamento Juvenil',
      description: 'Un fin de semana para buscar más de Dios y fortalecer amistades.',
      day: 'Próximamente',
      time: 'Fecha especial',
      tag: 'Evento especial',
    },
    {
      title: 'Salidas Evangelísticas',
      description: 'Llevar el mensaje de Jesús a nuestra ciudad.',
      day: 'Mensual',
      time: 'Sábados',
      tag: 'Misión',
    },
  ];

  gallery = [
    'assets/image/foto1.jpg',
    'assets/image/foto3.jpg',
    'assets/image/foto4.jpg',
  ];

  currentSlide = 0;
  private autoSlideInterval: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  private startAutoSlide() {
    if (!this.gallery || this.gallery.length === 0) {
      return;
    }

    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  private stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  nextSlide() {
    if (!this.gallery || this.gallery.length === 0) {
      return;
    }
    this.currentSlide = (this.currentSlide + 1) % this.gallery.length;
  }

  prevSlide() {
    if (!this.gallery || this.gallery.length === 0) {
      return;
    }
    this.currentSlide =
      (this.currentSlide - 1 + this.gallery.length) % this.gallery.length;
  }

  goToSlide(index: number) {
    if (!this.gallery || this.gallery.length === 0) {
      return;
    }
    this.currentSlide = index;
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  onCarouselMouseEnter() {
    this.stopAutoSlide();
  }

  onCarouselMouseLeave() {
    this.startAutoSlide();
  }
}
