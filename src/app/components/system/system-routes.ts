import {Routes} from "@angular/router";
import {SYS_ACCOUNT_STATUS_ROUTES} from "./sys-account-status/sys-account-status-routes";

export const SYSTEM_ROUTES: Routes = [
  {
    path: 'configurations',
    loadChildren: () => import('./configurations/configurations-routes').then(m => m.CONFIGURATIONS_ROUTES)
  },
  {
    path: 'sys-account-status',
    loadChildren: () => import('./sys-account-status/sys-account-status-routes').then(m => m.SYS_ACCOUNT_STATUS_ROUTES)
  },
  {
    path: 'sys-audit-entries',
    loadChildren: () => import('./sys-audit-entries/sys-audit-entries-routes').then(m => m.SYSTEM_AUDIT_ENTRIES_ROUTES)
  },
  {
    path: 'sys-email-templates',
    loadChildren: () => import('./sys-email-templates/sys-email-templates-routes').then(m => m.SYS_EMAIL_TEMPLATES_ROUTES)
  },
  {
    path: 'sys-objects',
    loadChildren: () => import('./sys-objects/sys-objects-routes').then(m => m.SYS_OBJECTS_ROUTES)
  },
  {
    path: 'sys-permissions',
    loadChildren: () => import('./sys-permissions/sys-permissions-routes').then(m => m.SYS_PERMISSIONS_ROUTES)
  }
  ];
