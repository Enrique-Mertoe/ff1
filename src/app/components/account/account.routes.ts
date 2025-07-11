import {AccountPageComponent} from "./account-page/account-page.component";
import {LayoutComponent} from "../../shared/layout/layout.component";
import {Routes} from "@angular/router";

export const ACCOUNT_ROUTES: Routes = [
  {
    path: 'profile',
    component: AccountPageComponent,
    data: {
      title: 'My profile',
      breadcrumb: [
        {
          label: 'My profile',
          url: ''
        }
      ]
    }
  },
  { path: '**', redirectTo: 'profile'}
];
