import { Component, computed, input } from '@angular/core';
import { NgFor } from '@angular/common';
import { MinistrySocialLink, MinistrySocialTheme } from './ministry-social-link.model';

@Component({
  selector: 'app-ministry-social-section',
  standalone: true,
  imports: [NgFor],
  templateUrl: './ministry-social-section.component.html',
  styleUrl: './ministry-social-section.component.css',
})
export class MinistrySocialSectionComponent {
  /** Estilo visual según el ministerio. */
  theme = input.required<MinistrySocialTheme>();

  /** Clases extra en el `<section>` (ej. `dunamis-section` para max-width del layout). */
  sectionClass = input<string>('');

  title = input<string>('Síguenos y conéctate');
  subtitle = input<string>('Mantente al día con todas nuestras actividades y eventos');

  links = input.required<MinistrySocialLink[]>();

  /** Evita choque entre `[class]` y `[ngClass]`: una sola cadena de clases. */
  hostClass = computed(() =>
    ['mss', `mss--${this.theme()}`, this.sectionClass().trim()].filter(Boolean).join(' ')
  );
}
