import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome/welcome-component';
import { YouthsComponent } from './features/ministries/youths.component/youths.component';
import { ContactComponent } from './features/contact/contact-component';
import { EventComponent } from './features/event/event-component';
import { TeamPastoralComponent } from './features/we/team-pastoral.component/team-pastoral-component';
import { ShepherdsComponent } from './features/we/shepherds.component/shepherds.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    data: { theme: 'default' },
  },
  {
    path: 'nosotros/Equipo-Pastoral',
    component: TeamPastoralComponent,
    data: { theme: 'default' },
  },
  {
    path: 'nosotros/Pastores',
    component: ShepherdsComponent,
    data: { theme: 'default' },
  },
  {
    path: 'ministerios/kaynosGeneracion',
    component: YouthsComponent,
    data: { theme: 'youth' },
  },
  {
    path: 'eventos',
    component: EventComponent,
    data: { theme: 'default' },
  },
  {
    path: 'contacto',
    component: ContactComponent,
    data: { theme: 'default' },
  },
];
