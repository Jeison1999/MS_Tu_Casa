import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-component',
  imports: [CommonModule],
  templateUrl: './contact-component.html',
  styleUrl: './contact-component.css',
})
export class ContactComponent {
  churchName = 'Morando en Sion';
  address = 'Calle Ejemplo 123, Ciudad, País';
  phone = '+57 300 000 0000';
  email = 'contacto@morandoension.org';

  socialLinks = [
    {
      name: 'Facebook',
      handle: '@morando_en_sion',
      url: 'https://facebook.com',
      avatar: 'assets/image/foto1.jpg',
    },
    {
      name: 'Instagram',
      handle: '@morando_en_sion',
      url: 'https://instagram.com',
      avatar: 'assets/image/foto3.jpg',
    },
    {
      name: 'YouTube',
      handle: 'Morando en Sion Oficial',
      url: 'https://youtube.com',
      avatar: 'assets/image/foto4.jpg',
    },
  ];
}
