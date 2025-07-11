import { Routes } from '@angular/router';
import {
  SysEmailTemplatesOverviewComponent
} from "./sys-email-templates-overview/sys-email-templates-overview.component";
import {SysEmailTemplatesCreateComponent} from "./sys-email-templates-create/sys-email-templates-create.component";

export const SYS_EMAIL_TEMPLATES_ROUTES: Routes = [
  {
    path: '',
    component: SysEmailTemplatesOverviewComponent,
    data: {
      title: 'System email templates',
      breadcrumb: [
        {
          label: 'System email templates',
          url: ''
        }
      ]
    }
  },
  {
    path: 'create',
    component: SysEmailTemplatesCreateComponent,
    data: {
      title: 'System email template',
      breadcrumb: [
        {
          label: 'System email template',
          url: '/system/sys-email-templates'
        },
        {
          label: '{{action}} System email templates',
          url: ''
        }
      ]
    }
  },
  {
    path: 'edit/:id',
    component: SysEmailTemplatesCreateComponent,
    data: {
      title: 'System email template',
      breadcrumb: [
        {
          label: 'System email template',
          url: '/system/sys-email-templates'
        },
        {
          label: '{{action}} System email templates',
          url: ''
        }
      ]
    }
  }
];
