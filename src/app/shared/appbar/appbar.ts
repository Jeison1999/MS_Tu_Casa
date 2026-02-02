import { Component } from '@angular/core';

@Component({
  selector: 'app-appbar',
  imports: [],
  templateUrl: './appbar.html',
  styleUrls: ['./appbar.css'],
})
export class Appbar {
  currentDropdown: string | null = null;
  activeNav = 'inicio';
  logoHover = false;
  mobileOpen = false;
  private closeTimeout: any = null;

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
