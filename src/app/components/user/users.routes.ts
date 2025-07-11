import {Routes} from "@angular/router";
import {OverviewComponent} from "./overview/overview.component";
import {CreateComponent} from "./create/create.component";

export const USERS_ROUTES: Routes = [
      {
        path: '', component: OverviewComponent,
        data: {
          title: 'Users',
          breadcrumb: [
            {
              label: 'Users',
              url: ''
            }
          ]
        }
      },
      {
        path: 'create', component: CreateComponent,
        data: {
          title: 'Users',
          breadcrumb: [
            {
              label: 'Users',
              url: '/users'
            },
            {
              label: '{{action}} user',
              url: ''
            }
          ]
        }
      },
      {
        path: 'edit/:id', component: CreateComponent,
        data: {
          title: 'Users',
          breadcrumb: [
            {
              label: 'Users',
              url: '/users'
            },
            {
              label: '{{action}} user',
              url: ''
            }
          ]
        }
      },
      {
        path: 'user-roles',
        loadChildren: () => import('./user-group/user-groups.routes').then(m => m.USER_GROUPS_ROUTES)
      },
      { path: 'authorization', loadChildren: () => import('./authorization/authorization.routes').then(m => m.AUTHORIZATION_ROUTES) }
];
