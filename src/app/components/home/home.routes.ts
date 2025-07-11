import {Routes} from "@angular/router";
import {HomePageComponent} from "./home-page/home-page.component";
import {ApplicationFormComponent} from "./application-form/application-form.component";
import {CanDeactivateGuard} from "../../shared/guards/can-deactivate.guard";
import {AuthGuard} from "../../shared/guards/auth.guard";
import {CustomMapComponent} from "../ui/custom-map/custom-map.component";

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomePageComponent,
    data: {
      title: 'Home',
      breadcrumb: [
        {
          label: 'Home',
          url: ''
        }
      ]
    }
  },
  {
    path: ':id/apply',
    component: ApplicationFormComponent,
    data: {
      title: 'Home',
      breadcrumb: [
        {
          label: 'Home',
          url: ''
        }
      ]
    },
    canDeactivate: [CanDeactivateGuard],
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'map',
  //   component: CustomMapComponent,
  //   data: {
  //     title: 'Water resources',
  //     breadcrumb: [
  //       {
  //         label: 'Water sources',
  //         url: ''
  //       }
  //     ]
  //   },
  // },
  { path: "**", redirectTo: "home" },
]
