import { Routes } from '@angular/router';
import {SysObjectsOverviewComponent} from "./sys-objects-overview/sys-objects-overview.component";
import {SysObjectsCreateComponent} from "./sys-objects-create/sys-objects-create.component";

export const SYS_OBJECTS_ROUTES: Routes = [
  {
    path: '',
    component: SysObjectsOverviewComponent,
    data: {
      title: 'System objects',
      breadcrumb: [
        {
          label: 'System objects',
          url: ''
        }
      ]
    }
  },
  {
    path: 'create',
    component: SysObjectsCreateComponent,
    data: {
      title: 'System objects',
      breadcrumb: [
        {
          label: 'System objects',
          url: '/system/sys-objects'
        },
        {
          label: '{{action}} system objects',
          url: ''
        }
      ]
    }
  },
];
