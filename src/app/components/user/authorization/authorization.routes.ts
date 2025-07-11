import {Routes} from "@angular/router";
import {AuthorizationComponent} from "./authorization.component";

export const AUTHORIZATION_ROUTES: Routes = [
  {
    path: '',
    component: AuthorizationComponent,
    data: {
      title: 'Authorization',
      breadcrumb: [
        {
          label: 'Authorization',
          url: ''
        }
      ]
    }
  }
];
