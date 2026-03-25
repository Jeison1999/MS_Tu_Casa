import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MinistryWordTheme, MinistryWordVerse } from './ministry-word-section.model';

@Component({
  selector: 'app-ministry-word-section',
  imports: [],
  templateUrl: './ministry-word-section.component.html',
  styleUrl: './ministry-word-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistryWordSectionComponent {
  theme = input.required<MinistryWordTheme>();
  sectionClass = input<string>('');

  title = input.required<string>();
  description = input<string>('');

  verses = input.required<MinistryWordVerse[]>();

  hostClass = computed(() =>
    ['mws', `mws--${this.theme()}`, this.sectionClass().trim()].filter(Boolean).join(' ')
  );
}
