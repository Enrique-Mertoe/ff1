import { Routes } from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {CanAccessGuard} from "./shared/guards/can-access.guard";
import {AuthGuard} from "./shared/guards/auth.guard";
import {CustomMapComponent} from "./components/ui/custom-map/custom-map.component";
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: 'home', loadChildren: () => import('./components/home/home.routes').then(m => m.HOME_ROUTES)},
      // {
      //   path: 'application',
      //   loadChildren: () => import('./components/license-application/license-application.routes').then(m => m.LICENSE_APPLICATION_ROUTES),
      //   canActivate: [AuthGuard]
      // },
      { path: 'auth', loadChildren: () => import('./components/auth/auth.routes').then(m => m.AUTH_ROUTES) },
      {
        path: 'account',
        loadChildren: () => import('./components/account/account.routes').then(m => m.ACCOUNT_ROUTES),
        canActivate: [AuthGuard, CanAccessGuard]
      },
      {
        path: 'users',
        loadChildren: () => import('./components/user/users.routes').then(m => m.USERS_ROUTES),
        canActivate: [AuthGuard, CanAccessGuard]
      },
      { path: 'system',
        loadChildren: () => import('./components/system/system-routes').then(m => m.SYSTEM_ROUTES)
        , canActivate: [AuthGuard, CanAccessGuard]
      },
      { path: 'my-applications', loadChildren: () => import('./components/my-applications/my-applications.routes').then(m => m.MY_APPLICATIONS_ROUTES) },
      { 
        path: 'workflow', 
        loadComponent: () => import('./components/workflow/workflow-dashboard.component').then(m => m.WorkflowDashboardComponent),
        canActivate: [AuthGuard]
      },
      { 
        path: 'licensing-officer', 
        loadComponent: () => import('./components/licensing-officer/licensing-officer-dashboard.component').then(m => m.LicensingOfficerDashboardComponent),
        canActivate: [AuthGuard, CanAccessGuard]
      },
      { 
        path: 'accountant', 
        loadComponent: () => import('./components/accountant/accountant-dashboard.component').then(m => m.AccountantDashboardComponent),
        canActivate: [AuthGuard, CanAccessGuard]
      },
      { 
        path: 'approvals/new-approvals', 
        loadComponent: () => import('./components/new-approvals/new-approvals.component').then(m => m.NewApprovalsComponent),
        canActivate: [AuthGuard]
      },
      { path: 'admin', loadChildren: () => import('./components/admin/admin.routes').then(m => m.ADMIN_ROUTES), canActivate: [AuthGuard, CanAccessGuard] },
      // { path: 'programmes', loadChildren: () => import('./components/programmes/programmes.routes').then(m => m.PROGRAMMES_ROUTES) },
      // { path: 'media-resources', loadChildren: () => import('./components/media-resources/media-resources.routes').then(m => m.MEDIA_RESOURCES_ROUTES) },
      { path: '404', loadComponent: () => import('./components/notfound/notfound-page/notfound-page.component').then(m => m.NotfoundPageComponent) },
      // { path: "**", redirectTo: "home" },
    ]
  },
  {
    path: 'coordinates/map',
    component: CustomMapComponent,
    data: {
      title: 'Water resources',
      breadcrumb: [
        {
          label: 'Water sources',
          url: ''
        }
      ]
    },
  },
];
