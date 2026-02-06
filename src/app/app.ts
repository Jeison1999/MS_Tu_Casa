import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Appbar } from "./shared/appbar/appbar";
import { Footer } from "./shared/footer/footer";
import { ThemeService, AppTheme } from './core/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Appbar, Footer],
  templateUrl: './app.html',
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
}
