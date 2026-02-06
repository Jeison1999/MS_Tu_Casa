import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppTheme = 'default' | 'youth';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<AppTheme>('default');
  readonly theme$ = this.themeSubject.asObservable();

  setTheme(theme: AppTheme) {
    this.themeSubject.next(theme);
  }

  get currentTheme(): AppTheme {
    return this.themeSubject.value;
  }
}
