import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Appbar } from './shared/appbar/appbar';
import { Footer } from './shared/footer/footer';
import { SplashScreenComponent } from './shared/animations/splash-screen/splash-screen';
import { AnnouncementsModalComponent } from './shared/announcements-modal/announcements-modal.component';
import { ThemeService, AppTheme } from './core/theme.service';
import { AnnouncementsService } from './core/services/announcements.service';
import { Announcement } from './core/models/announcement.model';
import { routeAnimations } from './shared/animations/route-animations';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    HttpClientModule,
    RouterOutlet,
    Appbar,
    Footer,
    SplashScreenComponent,
    AnnouncementsModalComponent,
  ],
  templateUrl: './app.html',
  animations: [routeAnimations],
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('mscasa');

  // Announcements Modal
  showAnnouncementsModal = false;
  announcements: Announcement[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private themeService: ThemeService,
    private announcementsService: AnnouncementsService
  ) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        const theme = (route?.snapshot.data['theme'] as AppTheme) ?? 'default';
        this.themeService.setTheme(theme);
      });
  }

  ngOnInit() {
    // Cargar anuncios inmediatamente en paralelo (mientras splash está visible)
    // Timing: splash termina en ~1700ms, mostramos anuncios cuando estén listos o pasen ~1500ms
    this.initializeAnnouncements();
  }

  ngOnDestroy() {
    // Cleanup si es necesario
  }

  /**
   * Inicializa el modal de anuncios
   * - Carga anuncios desde el backend en cuanto arranca la app
   * - Muestra el modal en cuanto hay datos (delay corto solo para pintar el DOM)
   * - En recarga completa (F5) vuelve a ejecutarse; no usamos localStorage para ocultarlo
   */
  private initializeAnnouncements() {
    this.announcementsService.getActiveAnnouncements().subscribe({
      next: (announcements) => {
        if (announcements && announcements.length > 0) {
          this.announcements = announcements;

          // Más rápido: un tick breve evita parpadeos; el modal (z-index alto) queda usable enseguida
          setTimeout(() => {
            this.showAnnouncementsModal = true;
          }, 200);
        }
      },
      error: (error) => {
        // Error silencioso: no mostrar modal si hay error
        console.warn('Error loading announcements:', error);
      },
    });
  }

  /**
   * Maneja el cierre del modal de anuncios
   */
  onAnnouncementsModalClose() {
    this.showAnnouncementsModal = false;
  }

  prepareRoute(outlet: RouterOutlet) {
    if (!outlet || !outlet.isActivated) {
      return;
    }
    return outlet.activatedRoute.snapshot.routeConfig?.path;
  }
}

