import { Routes } from '@angular/router';
import {SysAuditEntriesCreateComponent} from "./sys-audit-entries-create/sys-audit-entries-create.component";
import {SysAuditEntriesOverviewComponent} from "./sys-audit-entries-overview/sys-audit-entries-overview.component";

export const SYSTEM_AUDIT_ENTRIES_ROUTES: Routes = [
  {
    path: '',
    component: SysAuditEntriesOverviewComponent,
    data: {
      title: 'System audit entries',
      breadcrumb: [
        {
          label: 'System audit entries',
          url: ''
        }
      ]
    }
  },
  {
    path: 'create',
    component: SysAuditEntriesCreateComponent,
    data: {
      title: 'System audit entries',
      breadcrumb: [
        {
          label: 'System audit entries',
          url: '/system/sys-audit-entries'
        },
        {
          label: '{{action}} system audit entries',
          url: ''
        }
      ]
    }
  },
];
