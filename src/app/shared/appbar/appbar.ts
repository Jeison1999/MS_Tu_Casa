import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { ThemeService, AppTheme } from '../../core/theme.service';

@Component({
  selector: 'app-appbar',
  imports: [NgClass],
  templateUrl: './appbar.html',
  styleUrls: ['./appbar.css'],
})
export class Appbar {
  currentDropdown: string | null = null;
  activeNav = 'inicio';
  logoHover = false;
  mobileOpen = false;
  private closeTimeout: any = null;
  currentTheme: AppTheme = 'default';

  constructor(private themeService: ThemeService) {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  toggleDropdown(name: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Cancelar cualquier timeout pendiente
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
    
    if (this.currentDropdown === name) {
      this.currentDropdown = null;
    } else {
      this.currentDropdown = name;
    }
  }

  startCloseDropdown() {
    // Dar tiempo para mover el mouse dentro del dropdown
    this.closeTimeout = setTimeout(() => {
      this.currentDropdown = null;
      this.closeTimeout = null;
    }, 150);
  }

  cancelCloseDropdown() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }

  hideDropdown() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
    this.currentDropdown = null;
  }

  setActive(nav: string) {
    this.activeNav = nav;
    this.hideDropdown();
  }

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeAll() {
    this.hideDropdown();
    this.mobileOpen = false;
  }
}
