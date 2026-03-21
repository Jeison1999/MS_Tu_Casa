import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Foto: URL completa de Cloudinary cuando esté disponible (ej. https://res.cloudinary.com/.../image/upload/...). Dejar vacío para ver placeholder con iniciales. */
export interface MiembroPastoral {
  nombre: string;
  cargo: string;
  foto: string;
}

@Component({
  selector: 'app-team-pastoral-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-pastoral-component.html',
  styleUrl: './team-pastoral-component.css',
})
export class TeamPastoralComponent {
  /**
   * Sustituye cada cadena vacía por la URL de Cloudinary de esa persona.
   * Ejemplo: 'https://res.cloudinary.com/TU_CLOUD/image/upload/v1/carpeta/pedro-rios.jpg'
   */
  pastoresPrincipales: MiembroPastoral[] = [
    {
      nombre: 'Ap. Pedro Rios',
      cargo: 'Pastor principal',
      foto: '',
    },
    {
      nombre: 'Ap. Doris de Rios',
      cargo: 'Pastora principal',
      foto: '',
    },
  ];

  pastoresAsociados: MiembroPastoral[] = [
    { nombre: 'Pra. Diana Dimuro', cargo: 'Pastora asociada', foto: '' },
    { nombre: 'Pr. Jair Vargas', cargo: 'Pastor asociado', foto: '' },
    { nombre: 'Pra. Yisel Turizo', cargo: 'Pastora asociada', foto: '' },
    { nombre: 'Pr. Jaime Fernández', cargo: 'Pastor asociado', foto: '' },
    { nombre: 'Pra. Susan Rios', cargo: 'Pastora asociada', foto: '' },
  ];

  /** Iniciales para placeholder cuando aún no hay imagen */
  iniciales(nombre: string): string {
    const partes = nombre
      .replace(/^Ap\.|Pra\.|Pr\./gi, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (partes.length === 0) return '?';
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }
}
