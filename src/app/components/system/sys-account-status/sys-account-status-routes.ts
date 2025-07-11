import { Routes } from '@angular/router';
import {SysAccountStatusOverviewComponent} from "./sys-account-status-overview/sys-account-status-overview.component";
import {SysAccountStatusCreateComponent} from "./sys-account-status-create/sys-account-status-create.component";

export const SYS_ACCOUNT_STATUS_ROUTES: Routes = [
  {
    path: '',
    component: SysAccountStatusOverviewComponent,
    data: {
      title: 'System account status',
      breadcrumb: [
        {
          label: 'System account status',
          url: ''
        }
      ]
    }
  },
  {
    path: 'create',
    component: SysAccountStatusCreateComponent,
    data: {
      title: 'System account status',
      breadcrumb: [
        {
          label: 'System account status',
          url: '/system/sys-account-status'
        },
        {
          label: '{{action}} system account status',
          url: ''
        }
      ]
    }
  },
];
