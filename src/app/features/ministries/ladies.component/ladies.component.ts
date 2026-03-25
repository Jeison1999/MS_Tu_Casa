import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ClaudinaryService } from '../../../core/claudinary.service';
import { MinistrySocialSectionComponent } from '../../../shared/ministry-social-section/ministry-social-section.component';
import { MinistrySocialLink } from '../../../shared/ministry-social-section/ministry-social-link.model';
import { MinistryMomentsSectionComponent } from '../../../shared/ministry-moments-section/ministry-moments-section.component';
import { MinistryMomentAsset } from '../../../shared/ministry-moments-section/ministry-moments-section.model';
import { MinistryWordSectionComponent } from '../../../shared/ministry-word-section/ministry-word-section.component';
import { MinistryWordVerse } from '../../../shared/ministry-word-section/ministry-word-section.model';

@Component({
  selector: 'app-ladies',
  imports: [NgFor, MinistrySocialSectionComponent, MinistryMomentsSectionComponent, MinistryWordSectionComponent],
  templateUrl: './ladies.component.html',
  styleUrl: './ladies.component.css',
})
export class LadiesComponent implements OnInit {
  // Logo Dunamis desde Cloudinary - reemplaza 'dunamis_logo' con tu publicId cuando lo subas
  logo = '';

  leader = {
    name: 'Nombre Líder',
    role: 'Líder de Dunamis',
    photo: '',
    age: 0,
    yearsLeading: 0,
    bio:
      'Reemplaza este texto con una breve descripción de la líder. Aquí puedes contar su corazón de servicio, su llamado y cómo acompaña a las mujeres de la casa a crecer en Cristo.',
  };

  highlightVerse = {
    reference: 'Proverbios 31:25',
    text: 'Fuerza y honor son su vestidura; y se ríe de lo porvenir.',
  };

  verses: MinistryWordVerse[] = [
    {
      reference: 'Proverbios 31:30',
      text: 'Engañosa es la gracia y vana la hermosura; la mujer que teme a Jehová, esa será alabada.',
    },
    {
      reference: 'Tito 2:3-5',
      text: 'Las ancianas asimismo sean reverentes en su porte... que enseñen a las jóvenes a amar a sus maridos y a sus hijos.',
    },
    {
      reference: '1 Pedro 3:3-4',
      text: 'Vuestro atavío no sea el externo... sino el interno, el del corazón, en el incorruptible ornato de un espíritu afable y apacible.',
    },
  ];

  events = [
    {
      title: 'Reunión Dunamis',
      description: 'Tiempo de comunión, palabra y edificación entre mujeres.',
      day: 'Por confirmar',
      time: '--',
      tag: 'Reunión',
    },
    {
      title: 'Retiro de Damas',
      description: 'Un espacio para buscar más de Dios y fortalecer nuestra identidad en Cristo.',
      day: 'Próximamente',
      time: 'Fecha especial',
      tag: 'Evento especial',
    },
    {
      title: 'Ayuno de Damas',
      description: 'Compartir, orar y celebrar juntas la vida en Cristo.',
      day: 'Por confirmar',
      time: '--',
      tag: 'Comunión',
    },
  ];

  momentAssets: MinistryMomentAsset[] = [
    { publicId: 'dunamis_gallery1', alt: 'Encuentro de Dunamis' },
    { publicId: 'dunamis_gallery2', alt: 'Momento especial de Dunamis' },
    { publicId: 'dunamis_gallery3', alt: 'Tiempo de oración de Dunamis' },
  ];

  socialLinks: MinistrySocialLink[] = [];

  constructor(
    private cloudinary: ClaudinaryService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.socialLinks = [
      {
        name: 'Instagram',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
        ),
        url: 'https://instagram.com/tudunamis',
        description: 'Síguenos en Instagram',
      },
      {
        name: 'Facebook',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
        ),
        url: 'https://facebook.com/tudunamis',
        description: 'Encuéntranos en Facebook',
      },
      {
        name: 'WhatsApp',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`
        ),
        url: 'https://wa.me/tunumero',
        description: 'Contáctanos por WhatsApp',
      },
    ];

    // Logo Dunamis - usa asset local; cuando subas a Cloudinary, usa: this.cloudinary.getOptimizedImage('tu_public_id', 700, 90)
    // this.logo = '/assets/dunamis-logo.png';
    this.logo = this.cloudinary.getOptimizedImage('Dunamis_logo_mrnwzt.png', 700, 90);

    // Foto de líder - reemplaza con tu publicId de Cloudinary
    this.leader.photo = this.cloudinary.getOptimizedImage('CVM_0383_wyansd', 1100, 90);

  }
}
