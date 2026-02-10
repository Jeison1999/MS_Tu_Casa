import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Appbar } from './shared/appbar/appbar';
import { Footer } from './shared/footer/footer';
import { SplashScreenComponent } from './shared/animations/splash-screen/splash-screen';
import { ThemeService, AppTheme } from './core/theme.service';
import { routeAnimations } from './shared/animations/route-animations';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Appbar, Footer, SplashScreenComponent],
  templateUrl: './app.html',
  animations: [routeAnimations],
})
export class App {
  protected readonly title = signal('mscasa');

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private themeService: ThemeService
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

  prepareRoute(outlet: RouterOutlet) {
    if (!outlet || !outlet.isActivated) {
      return;
    }
    return outlet.activatedRoute.snapshot.routeConfig?.path;
  }
}
