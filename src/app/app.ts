import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Appbar } from "./shared/appbar/appbar";
import { Footer } from "./shared/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Appbar, Footer],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('mscasa');
}
