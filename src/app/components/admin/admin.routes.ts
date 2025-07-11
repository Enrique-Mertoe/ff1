import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'all-applications',
    pathMatch: 'full'
  },
  {
    path: 'all-applications',
    loadComponent: () => import('./all-applications/all-applications.component').then(m => m.AllApplicationsComponent),
    data: {
      title: 'All Applications',
      breadcrumb: [
        {
          label: 'Admin',
          url: '/admin'
        },
        {
          label: 'All Applications',
          url: ''
        }
      ]
    }
  }
];