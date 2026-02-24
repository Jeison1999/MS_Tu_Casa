import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaudinaryService } from '../../core/claudinary.service';

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

  // Logo desde Cloudinary
  logoUrl = '';

  // Array de imágenes para el carrusel desde Cloudinary
  slides: any[] = [];

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

  // Imágenes para el carrusel horizontal desde Cloudinary
  horizontalImages: string[] = [];

  // Variables para controlar la galería horizontal
  isHorizontalPaused = false;
  horizontalScrollPosition = 0;

  constructor(
    private cdr: ChangeDetectorRef, 
    private cloudinary: ClaudinaryService
  ) {}


  ngOnInit() {
    this.initializeSlides();
    this.initializeHorizontalImages();
    this.startAutoSlide();
    this.startTypewriterAnimation();
    
  }
  
  initializeSlides() {
    this.logoUrl = this.cloudinary.getImage('logoms2_exyhn7'); 
    
    
    this.slides = [
      {
        image: this.cloudinary.getOptimizedImage('pastores_ykxdhl', 1200), // Reemplaza 'pastores_ykxdhl' con el ID de tu imagen
        title: 'Bienvenidos a Morando en Sion',
        description: 'Una comunidad de fe y amor',
      },
      {
        image: this.cloudinary.getOptimizedImage('foto2_u6lmqh', 1200), // Reemplaza con el ID de Cloudinary
        title: 'Adoración y Alabanza',
        description: 'Juntos adoramos a nuestro Dios',
      },
      {
        image: this.cloudinary.getOptimizedImage('foto4_l165ha', 1200), // Reemplaza con el ID de Cloudinary
        title: 'Comunidad y Crecimiento',
        description: 'Creciendo juntos en la fe',
      },
    ];
  }

  initializeHorizontalImages() {
    this.horizontalImages = [
      this.cloudinary.getOptimizedImage('633167068_1338947984943794_2795937529331384989_n.jpg_eslwjb', 1200),
      this.cloudinary.getOptimizedImage('630151745_1330991882406071_5872849914101460167_n.jpg_bbu95p', 1200),
      this.cloudinary.getOptimizedImage('624574352_1324150723090187_5699530119309604273_n.jpg_srlfqi', 1200),
      this.cloudinary.getOptimizedImage('625369817_1324155006423092_8417031743962407014_n.jpg_njoppq', 1200),
    ];
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

  // Métodos para la galería horizontal
  onHorizontalTouchStart(event: TouchEvent) {
    this.isHorizontalPaused = true;
  }

  onHorizontalTouchEnd(event: TouchEvent) {
    // Reanudar animación inmediatamente
    this.isHorizontalPaused = false;
  }

  onHorizontalMouseEnter() {
    // Solo pausar en desktop (no en mobile)
    if (window.innerWidth > 768) {
      this.isHorizontalPaused = true;
    }
  }

  onHorizontalMouseLeave() {
    this.isHorizontalPaused = false;
  }

}
