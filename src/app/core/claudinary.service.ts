import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClaudinaryService {
  private cloudName : string = 'dsm6diilz'
  private UrlBase: string = `https://res.cloudinary.com/${this.cloudName}/image/upload/`;
  // Defaults para mejorar nitidez sin tocar cada componente.
  // Esto aumenta un poco el peso/costo de carga, pero mejora calidad.
  private readonly defaultImageQuality = 90;
  private readonly defaultVideoQuality = 85;

  // Método para obtener URL básica
  getImage(publicId: string): string{
    // Optimiza por defecto (sin que el usuario tenga que pasar width/quality).
    const w = 'w_auto';
    const q = `q_${this.defaultImageQuality}`;
    const format = 'f_auto';
    return `${this.UrlBase}${w},dpr_auto,${q},${format}/${publicId}`;
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
    // Si no pasan quality, usamos un default más alto para mejorar nitidez.
    const q = quality ? `q_${quality}` : `q_${this.defaultImageQuality}`;
    const format = 'f_auto';
    return `${this.UrlBase}${w},dpr_auto,${q},${format}/${publicId}`;
  }

  // Método para videos optimizados
  getOptimizedVideo(publicId: string, width?: number, quality?: number): string {
    const videoUrlBase = `https://res.cloudinary.com/${this.cloudName}/video/upload/`;
    const w = width ? `w_${width}` : 'w_auto';
    // Si no pasan quality, usamos un default más alto.
    const q = quality ? `q_${quality}` : `q_${this.defaultVideoQuality}`;
    return `${videoUrlBase}${w},${q}/${publicId}`;
  }

  // Método unificado que detecta automáticamente si es imagen o video
  getOptimizedMedia(publicId: string, width?: number, quality?: number): { url: string; type: 'image' | 'video' } {
    // Detectar si es video basándose en el nombre del archivo
    const isVideo = /video|\.mp4|\.mov|\.avi|\.webm|\.mkv/i.test(publicId);
    
    if (isVideo) {
      return {
        url: this.getOptimizedVideo(publicId, width, quality),
        type: 'video'
      };
    } else {
      return {
        url: this.getOptimizedImage(publicId, width, quality),
        type: 'image'
      };
    }
  }
}

