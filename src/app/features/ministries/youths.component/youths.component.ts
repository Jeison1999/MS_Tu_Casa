import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor } from '@angular/common';
import { ClaudinaryService } from '../../../core/claudinary.service';

@Component({
  selector: 'app-youths.component',
  imports: [NgFor,],
  templateUrl: './youths.component.html',
  styleUrl: './youths.component.css',
})
export class YouthsComponent implements OnInit, OnDestroy {
  // Logo del ministerio desde Cloudinary
  logo = '';

  leaders = [
    {
      name: 'Juan Pérez',
      role: 'Líder de Jóvenes',
      photo: '',
    },
    {
      name: 'María López',
      role: 'Coprotagonista Kaynos Generación',
      photo: '',
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

  gallery: string[] = [];

  currentSlide = 0;
  private autoSlideInterval: any;

  constructor(private cloudinary: ClaudinaryService) {}

  ngOnInit() {
    // Cargar logo desde Cloudinary
    this.logo = this.cloudinary.getOptimizedImage('kg_ghg3ii', 400);

    // Cargar fotos de líderes desde Cloudinary
    this.leaders[0].photo = this.cloudinary.getOptimizedImage('foto1_jovenes', 600);
    this.leaders[1].photo = this.cloudinary.getOptimizedImage('foto3_jovenes', 600);

    // Cargar galería desde Cloudinary
    this.gallery = [
      this.cloudinary.getOptimizedImage('569881451_18415657786116943_1280062635155265105_n.jpg_bd7xwo', 1200),
      this.cloudinary.getOptimizedImage('623198584_18428389108116943_3842377834010274228_n.jpg_h2alxh', 1200),
      this.cloudinary.getOptimizedImage('564914027_18415658020116943_7314714588104197933_n.jpg_hynjek', 1200),
    ];

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
