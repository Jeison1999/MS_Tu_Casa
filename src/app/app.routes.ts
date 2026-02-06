import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome-component/welcome-component';
import { YouthsComponent } from './features/ministries/youths.component/youths.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    data: { theme: 'default' },
  },
  {
    path: 'ministries/youths.component',
    component: YouthsComponent,
    data: { theme: 'youth' },
  },
];
