import { Routes } from '@angular/router';
import {SysPermissionsOverviewComponent} from "./sys-permissions-overview/sys-permissions-overview.component";
import {SysPermissionsCreateComponent} from "./sys-permissions-create/sys-permissions-create.component";

export const SYS_PERMISSIONS_ROUTES: Routes = [
  {
    path: '',
    component: SysPermissionsOverviewComponent,
    data: {
      title: 'System permissions',
      breadcrumb: [
        {
          label: 'System permissions',
          url: ''
        }
      ]
    }
  },
  {
    path: 'create',
    component: SysPermissionsCreateComponent,
    data: {
      title: 'System permissions',
      breadcrumb: [
        {
          label: 'System permissions',
          url: '/system/sys-permissions'
        },
        {
          label: '{{action}} system permissions',
          url: ''
        }
      ]
    }
  },
];
