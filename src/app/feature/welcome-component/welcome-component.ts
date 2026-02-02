import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-component',
  imports: [CommonModule],
  templateUrl: './welcome-component.html',
  styleUrl: './welcome-component.css',
})
export class WelcomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  private autoSlideInterval: any;
  
  // Animación de escritura typewriter
  typewriterWords = ['amor', 'esperanza', 'propósito'];
  currentWordIndex = 0;
  currentWord = '';
  isDeleting = false;
  private typewriterInterval: any;

  constructor(private cdr: ChangeDetectorRef) {}

  // Array de imágenes para el carrusel - puedes reemplazar estas rutas con tus imágenes
  slides = [
    {
      image: 'assets/image/logoms.png', // Reemplaza con tus imágenes
      title: 'Bienvenidos a Morando en Sion',
      description: 'Una comunidad de fe y amor',
    },
    {
      image: 'assets/image/logoms2.png', // Reemplaza con tus imágenes
      title: 'Adoración y Alabanza',
      description: 'Juntos adoramos a nuestro Dios',
    },
    {
      image: 'assets/image/logoms.png', // Reemplaza con tus imágenes
      title: 'Comunidad y Crecimiento',
      description: 'Creciendo juntos en la fe',
    },
  ];

  // Servicios semanales
  weeklyServices = [
    {
      icon: '⛪',
      title: 'Servicios Dominicales',
      schedule: ['7:00 AM', '9:00 AM', '11:00 AM'],
      description: 'Adoración y enseñanza de la Palabra',
      color: '#bd811f',
    },
    {
      icon: '🙏',
      title: 'Lunes de Oración',
      schedule: ['7:00 PM'],
      description: 'Tiempo de intercesión y comunión',
      color: '#d4a049',
    },
    {
      icon: '📖',
      title: 'Devocionales',
      schedule: ['Martes, jueves y sábados', '5:00 AM'],
      description: 'Inicio el día con la Palabra',
      color: '#bd811f',
    },
    {
      icon: '🌅',
      title: 'Ayunos',
      schedule: ['Miércoles y viernes', '9:30 AM'],
      description: 'Dedicación y consagración',
      color: '#d4a049',
    },
    {
      icon: '✨',
      title: 'Viernes de Fe para Milagros',
      schedule: ['7:00 PM'],
      description: 'Noche de fe y milagros',
      color: '#bd811f',
    },
    {
      icon: '🎯',
      title: 'Sábados Misión Josué',
      schedule: ['5:00 PM'],
      description: 'Evangelismo y alcance',
      color: '#d4a049',
    },
  ];

  ngOnInit() {
    this.startAutoSlide();
    this.startTypewriterAnimation();
  }

  startTypewriterAnimation() {
    const type = () => {
      const current = this.typewriterWords[this.currentWordIndex];
      let speed = 100; // Velocidad por defecto
      
      if (this.isDeleting) {
        // Borrando letra por letra
        this.currentWord = current.substring(0, this.currentWord.length - 1);
        speed = 50; // Más rápido al borrar
        
        if (this.currentWord === '') {
          // Palabra borrada, pasar a la siguiente
          this.isDeleting = false;
          this.currentWordIndex = (this.currentWordIndex + 1) % this.typewriterWords.length;
          speed = 500; // Pausa antes de empezar nueva palabra
        }
      } else {
        // Escribiendo letra por letra
        this.currentWord = current.substring(0, this.currentWord.length + 1);
        speed = 100; // Velocidad normal al escribir
        
        if (this.currentWord === current) {
          // Palabra completa, esperar antes de borrar
          speed = 2000; // Esperar 2 segundos
          this.isDeleting = true;
        }
      }

      this.cdr.detectChanges(); // Forzar detección de cambios
      this.typewriterInterval = setTimeout(type, speed);
    };

    // Iniciar después de un pequeño delay
    setTimeout(() => type(), 1000);
  }

  ngOnDestroy() {
    this.stopAutoSlide();
    if (this.typewriterInterval) {
      clearTimeout(this.typewriterInterval);
    }
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambia cada 5 segundos
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
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

  // Imágenes para el carrusel horizontal
  horizontalImages = [
    'assets/image/foto1.jpg',
    'assets/image/foto2.jpg',
    'assets/image/foto3.jpg',
    'assets/image/foto4.jpg',
  ];
}
