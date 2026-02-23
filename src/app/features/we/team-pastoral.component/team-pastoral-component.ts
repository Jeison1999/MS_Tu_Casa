import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pastor {
  nombre: string;
  cargo: string;
  foto: string;
  equipo?: Pastor[];
}

@Component({
  selector: 'app-team-pastoral-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-pastoral-component.html',
  styleUrl: './team-pastoral-component.css',
})
export class TeamPastoralComponent {
  pastoresPrincipales: Pastor[] = [
    {
      nombre: 'Pastor Principal 1',
      cargo: 'Pastor General',
      foto: 'assets/image/foto1.jpg',
      equipo: [
        {
          nombre: 'Pastor de Jóvenes',
          cargo: 'Ministerio Juvenil',
          foto: 'assets/image/foto2.jpg',
          equipo: [
            {
              nombre: 'Líder de Alabanza',
              cargo: 'Alabanza Jóvenes',
              foto: 'assets/image/foto3.jpg'
            },
            {
              nombre: 'Líder de Células',
              cargo: 'Grupos Pequeños',
              foto: 'assets/image/foto4.jpg'
            }
          ]
        },
        {
          nombre: 'Pastor de Niños',
          cargo: 'Ministerio Infantil',
          foto: 'assets/image/foto3.jpg',
          equipo: [
            {
              nombre: 'Maestra Principal',
              cargo: 'Enseñanza',
              foto: 'assets/image/foto1.jpg'
            }
          ]
        }
      ]
    },
    {
      nombre: 'Pastor Principal 2',
      cargo: 'Pastor Asociado',
      foto: 'assets/image/foto2.jpg',
      equipo: [
        {
          nombre: 'Pastor de Familias',
          cargo: 'Ministerio Familiar',
          foto: 'assets/image/foto4.jpg',
          equipo: [
            {
              nombre: 'Consejero Matrimonial',
              cargo: 'Matrimonios',
              foto: 'assets/image/foto2.jpg'
            },
            {
              nombre: 'Líder de Mujeres',
              cargo: 'Ministerio Femenil',
              foto: 'assets/image/foto1.jpg'
            }
          ]
        },
        {
          nombre: 'Pastor de Evangelismo',
          cargo: 'Misiones y Alcance',
          foto: 'assets/image/foto1.jpg',
          equipo: [
            {
              nombre: 'Coordinador de Eventos',
              cargo: 'Eventos Especiales',
              foto: 'assets/image/foto3.jpg'
            }
          ]
        }
      ]
    }
  ];
}
