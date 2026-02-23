import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Pastor {
  id: number;
  nombre: string;
  cargo: string;
  icono: string; // Ruta al archivo SVG del avatar
  foto: string; // Ruta a la foto para el panel de biografía
  biografia: string[];
  ministerio: string;
  anios: string;
}

@Component({
  selector: 'app-shepherds.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shepherds.component.html',
  styleUrl: './shepherds.component.css',
  animations: [
    trigger('fadeSlide', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ShepherdsComponent {
  pastoresPrincipales: Pastor[] = [
    {
      id: 1,
      nombre: 'Pedro Ríos',
      cargo: 'Apóstol de la Casa',
      icono: '/assets/svg/hombre.svg',
      foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500',
      ministerio: 'Visión y Dirección Apostólica',
      anios: '25 años de ministerio',
      biografia: [
        'Una biografía es la narración escrita de la vida de una persona real, abarcando desde su nacimiento hasta su muerte o el presente. Funciona como un género narrativo e histórico que detalla hechos, logros, fracasos y contextos importantes, generalmente escritos en tercera persona por alguien más.',
        'Se estructura cronológicamente en introducción, desarrollo y conclusión. Las biografías son fundamentales para preservar la historia, inspirar a otros, ofrecer lecciones de vida y entender el contexto sociocultural de una época.',
        'A través de su trayectoria ministerial, ha guiado a miles de personas en su caminar con Cristo, estableciendo bases sólidas de fe y comunidad.'
      ]
    },
    {
      id: 2,
      nombre: 'María González',
      cargo: 'Pastora Principal',
      icono: '/assets/svg/mujer.svg',
      foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500',
      ministerio: 'Ministerio de Adoración y Familias',
      anios: '20 años de ministerio',
      biografia: [
        'Una biografía es la narración escrita de la vida de una persona real, abarcando desde su nacimiento hasta su muerte o el presente. Funciona como un género narrativo e histórico que detalla hechos, logros, fracasos y contextos importantes, generalmente escritos en tercera persona por alguien más.',
        'Se estructura cronológicamente en introducción, desarrollo y conclusión. Su pasión por la adoración y el fortalecimiento de las familias ha transformado la vida de la congregación.',
        'Con un corazón de sierva, ha dedicado su vida a restaurar hogares y edificar matrimonios sólidos fundamentados en principios bíblicos.'
      ]
    },
    {
      id: 3,
      nombre: 'Juan Martínez',
      cargo: 'Pastor Asociado',
      icono: '/assets/svg/pareja.svg',
      foto: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500',
      ministerio: 'Evangelismo y Misiones',
      anios: '15 años de ministerio',
      biografia: [
        'Una biografía es la narración escrita de la vida de una persona real, abarcando desde su nacimiento hasta su muerte o el presente. Funciona como un género narrativo e histórico que detalla hechos, logros, fracasos y contextos importantes, generalmente escritos en tercera persona por alguien más.',
        'Se estructura cronológicamente en introducción, desarrollo y conclusión. Su llamado especial al evangelismo ha llevado el mensaje de salvación a comunidades enteras.',
        'Con una visión misionera clara, ha establecido múltiples puntos de predicación y ha capacitado a nuevos líderes para expandir el reino de Dios.'
      ]
    }
  ];

  pastorSeleccionado: Pastor = this.pastoresPrincipales[0];

  seleccionarPastor(pastor: Pastor): void {
    this.pastorSeleccionado = pastor;
  }
}
