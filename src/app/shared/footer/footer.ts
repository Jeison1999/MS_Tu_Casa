import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { ThemeService, AppTheme } from '../../core/theme.service';
import { ClaudinaryService } from '../../core/claudinary.service';

@Component({
  selector: 'app-footer',
  imports: [NgClass],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentTheme: AppTheme = 'default';
  logo1: string;

  constructor(private themeService: ThemeService, private claudinary: ClaudinaryService) {
    this.logo1 = this.claudinary.getOptimizedImage('logoms_prnuap');
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }
}
