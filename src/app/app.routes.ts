import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome-component/welcome-component';
import { YouthsComponent } from './features/ministries/youths.component/youths.component';
import { ContactComponent } from './features/contact-component/contact-component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    data: { theme: 'default' },
  },
  {
    path: 'ministerios/kaynosGeneracion',
    component: YouthsComponent,
    data: { theme: 'youth' },
  },
  {
    path: 'contacto',
    component: ContactComponent,
    data: { theme: 'default' },
  },
];
