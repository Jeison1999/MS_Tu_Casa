import { SafeHtml } from '@angular/platform-browser';

/** Enlace de red social para la sección reutilizable de ministerios. */
export interface MinistrySocialLink {
  name: string;
  url: string;
  description: string;
  /** SVG sanitizado con DomSanitizer (mismo patrón que antes en cada ministerio). */
  icon: SafeHtml;
}

export type MinistrySocialTheme = 'dunamis' | 'escuadron' | 'kaynos';
