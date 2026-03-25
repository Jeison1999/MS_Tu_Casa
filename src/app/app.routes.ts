import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome/welcome-component';
import { YouthsComponent } from './features/ministries/youths.component/youths.component';
import { ContactComponent } from './features/contact/contact-component';
import { EventComponent } from './features/event/event-component';
import { TeamPastoralComponent } from './features/we/team-pastoral.component/team-pastoral-component';
import { ShepherdsComponent } from './features/we/shepherds.component/shepherds.component';
import { LadiesComponent } from './features/ministries/ladies.component/ladies.component';
import { GentlemanComoponent } from './features/ministries/gentleman.comoponent/gentleman.comoponent';

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
    path: 'ministerios/dunamis',
    component: LadiesComponent,
    data: { theme: 'dunamis' },
  },
  {
    path: 'ministerios/escuadronDeFe',
    component: GentlemanComoponent,
    data: { theme: 'escuadron' },
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
