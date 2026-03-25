import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaudinaryService } from '../../../core/claudinary.service';

/** Foto: URL optimizada desde Cloudinary. Dejar vacío para ver placeholder con iniciales. */
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
export class TeamPastoralComponent implements OnInit {
  /**
   * Sustituye cada `public_id` por el definitivo luego de subir las fotos a Cloudinary.
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

  constructor(private cloudinary: ClaudinaryService) {}

  ngOnInit(): void {
    // Fotos (Cloudinary). Reemplaza los public_id por los definitivos.
    // Principales
    this.pastoresPrincipales[0].foto = this.cloudinary.getOptimizedImage('CVM_0400_ndglfu', 1000, 90);
    this.pastoresPrincipales[1].foto = this.cloudinary.getOptimizedImage('CVM_0393_hcsaf0', 1000, 90);

    // Asociados
    this.pastoresAsociados[0].foto = this.cloudinary.getOptimizedImage('CVM_0405_e6osps', 900, 90);
    this.pastoresAsociados[1].foto = this.cloudinary.getOptimizedImage('IMG_0712_xkl1i5', 900, 90);
    this.pastoresAsociados[2].foto = this.cloudinary.getOptimizedImage('CVM_0355_p8bpc9', 900, 90);
    this.pastoresAsociados[3].foto = this.cloudinary.getOptimizedImage('CVM_0359_cq2wkb', 900, 90);
    this.pastoresAsociados[4].foto = this.cloudinary.getOptimizedImage('pastora_susan_rios', 900, 90);
  }

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
