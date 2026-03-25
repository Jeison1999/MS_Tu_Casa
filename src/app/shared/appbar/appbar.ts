import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService, AppTheme } from '../../core/theme.service';
import { ClaudinaryService } from '../../core/claudinary.service';

@Component({
  selector: 'app-appbar',
  imports: [NgClass, RouterModule],
  templateUrl: './appbar.html',
  styleUrls: ['./appbar.css'],
})
export class Appbar {
  [x: string]: any;
  currentDropdown: string | null = null;
  mobileDropdown: string | null = null;
  logoHover = false;
  mobileOpen = false;
  private closeTimeout: any = null;
  currentTheme: AppTheme = 'default';
  readonly logo1: string;
  
  // Scroll behavior
  isHidden = false;
  private lastScrollTop = 0;
  private scrollThreshold = 10;
  private nextIsHidden: boolean | null = null;
  private rafId: number | null = null;
  private readonly handleScrollBound: () => void;

  constructor(private themeService: ThemeService, private claudinary: ClaudinaryService) {
    this.logo1 = this.claudinary.getOptimizedImage('logoms_prnuap');
    this.handleScrollBound = this.handleScroll.bind(this);
    this.currentTheme = this.themeService.currentTheme;
    
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  ngOnInit() {
    window.addEventListener('scroll', this.handleScrollBound);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.handleScrollBound);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.nextIsHidden = null;
  }

  private handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Si estamos en la parte superior, siempre mostrar
    if (scrollTop <= 100) {
      this.queueIsHidden(false);
      this.lastScrollTop = scrollTop;
      return;
    }
    
    // Detectar dirección del scroll
    if (Math.abs(scrollTop - this.lastScrollTop) > this.scrollThreshold) {
      if (scrollTop > this.lastScrollTop) {
        // Scrolling hacia abajo - ocultar
        this.queueIsHidden(true);
      } else {
        // Scrolling hacia arriba - mostrar
        this.queueIsHidden(false);
      }
      this.lastScrollTop = scrollTop;
    }
  }

  /**
   * Para evitar NG0100 (ExpressionChangedAfterItHasBeenCheckedError),
   * no modificamos `isHidden` en el mismo ciclo sincrónico del evento.
   */
  private queueIsHidden(value: boolean) {
    if (this.isHidden === value) return;
    this.nextIsHidden = value;
    if (this.rafId !== null) return;

    this.rafId = requestAnimationFrame(() => {
      if (this.nextIsHidden !== null) {
        this.isHidden = this.nextIsHidden;
      }
      this.nextIsHidden = null;
      this.rafId = null;
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

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }

  toggleMobileDropdown(name: string) {
    this.mobileDropdown = this.mobileDropdown === name ? null : name;
  }

  closeAll() {
    this.hideDropdown();
    this.mobileOpen = false;
    this.mobileDropdown = null;
  }
}
