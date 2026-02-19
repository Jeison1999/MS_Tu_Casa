import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClaudinaryService {
  private cloudName : string = 'dsm6diilz'
  private UrlBase: string = `https://res.cloudinary.com/${this.cloudName}/image/upload/`;

  // Método para obtener URL básica
  getImage(publicId: string): string{
    return `${this.UrlBase}${publicId}`
  }

   // Método con transformaciones (opcional)
  getImageWithTransform(publicId: string, transformations?: string): string {
    return transformations 
      ? `${this.UrlBase}${transformations}/${publicId}`
      : this.getImage(publicId);
  }

  // Método para imágenes optimizadas
  getOptimizedImage(publicId: string, width?: number, quality?: number): string {
    const w = width ? `w_${width}` : 'w_auto';
    const q = quality ? `q_${quality}` : 'q_auto';
    const format = 'f_auto';
    return `${this.UrlBase}${w},${q},${format}/${publicId}`;
  }
}

