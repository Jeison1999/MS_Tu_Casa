import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService, AppTheme } from '../../core/theme.service';
import { ClaudinaryService } from '../../core/claudinary.service';
import { PersonPortalService } from '../../core/services/person-portal.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentTheme: AppTheme = 'default';
  logo1: string;
  portalEnabled = signal(false);

  constructor(
    private themeService: ThemeService,
    private claudinary: ClaudinaryService,
    private personPortal: PersonPortalService
  ) {
    this.logo1 = this.claudinary.getOptimizedImage('logoms_prnuap');
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
    this.personPortal.portal$.subscribe((portal) => {
      this.portalEnabled.set(!!portal?.enabled);
    });
    this.personPortal.loadPortal().subscribe();
  }
}
