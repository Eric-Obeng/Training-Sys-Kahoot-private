import { Routes } from '@angular/router';
import { authRoutes } from './core/routes/auth.routes';

import { trainerRoutes } from './core/routes/trainer.routes';
import { traineeRoutes } from './core/routes/trainee.routes';
import { adminRoutes } from './core/routes/admin.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./views/landing-page/landing-page.component').then(
        (l) => l.LandingPageComponent
      ),
  },
  ...authRoutes,
  {
    path: 'home',
    loadComponent: () =>
      import('./views/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    children: [
      {
        path: 'admin',
        children: adminRoutes,
      },
      {
        path: 'trainer',
        loadComponent: () =>
          import('./views/trainer/trainer.component').then(
            (m) => m.TrainerComponent
          ),
        children: trainerRoutes,
      },
      {
        path:'trainee',
        loadComponent:() => import('./views/trainee/home/home.component')
        .then(m => m.HomeComponent),
        children: traineeRoutes
      },
    ],
  },
];
