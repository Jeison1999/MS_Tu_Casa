import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { ThemeService, AppTheme } from '../../core/theme.service';

@Component({
  selector: 'app-footer',
  imports: [NgClass],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentTheme: AppTheme = 'default';

  constructor(private themeService: ThemeService) {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }
}
