import {Routes} from "@angular/router";
import {OverviewComponent} from "./overview/overview.component";
import {CreateComponent} from "./create/create.component";

export const USER_GROUPS_ROUTES: Routes = [
  {
    path: '', component: OverviewComponent,
    data: {
      title: 'User roles',
      breadcrumb: [
        {
          label: 'User roles',
          url: ''
        }
      ]
    }
  },
  {
    path: 'create', component: CreateComponent,
    data: {
      title: 'User roles',
      breadcrumb: [
        {
          label: 'User roles',
          url: '/users/user-roles'
        },
        {
          label: '{{action}} user role',
          url: ''
        }
      ]
    }
  },
  {
    path: 'edit/:id', component: CreateComponent,
    data: {
      title: 'User roles',
      breadcrumb: [
        {
          label: 'User roles',
          url: '/users/user-roles'
        },
        {
          label: '{{action}} user role',
          url: ''
        }
      ]
    }
  }
];
