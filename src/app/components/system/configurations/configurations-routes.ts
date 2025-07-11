import { Routes } from '@angular/router';
import {ConfigurationsOverviewComponent} from "./configurations-overview/configurations-overview.component";
import {ConfigurationsCreateComponent} from "./configurations-create/configurations-create.component";

export const CONFIGURATIONS_ROUTES: Routes = [
  {
    path: '',
    component: ConfigurationsOverviewComponent,
    data: {
      title: 'System configurations',
      breadcrumb: [
        {
          label: 'System configurations',
          url: ''
        }
      ]
    }
  },
  {
    path: 'create',
    component: ConfigurationsCreateComponent,
    data: {
      title: 'System configurations',
      breadcrumb: [
        {
          label: 'System configurations',
          url: '/system/configurations'
        },
        {
          label: '{{action}} system configurations',
          url: ''
        }
      ]
    }
  },
];
