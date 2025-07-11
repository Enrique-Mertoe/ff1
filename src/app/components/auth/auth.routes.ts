import {Routes} from "@angular/router";
import {HomePageComponent} from "../home/home-page/home-page.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {PasswordResetComponent} from "./password-reset/password-reset.component";
import {PasswordResetRequestComponent} from "./password-reset-request/password-reset-request.component";

export const AUTH_ROUTES: Routes = [
  // {
  //   path: '',
  //   component: LoginComponent,
  //   data: {
  //     title: 'Sign in',
  //     breadcrumb: [
  //       {
  //         label: 'Sign in',
  //         url: ''
  //       }
  //     ]
  //   }
  // },
  {
    path: 'sign-in',
    component: LoginComponent,
    data: {
      title: 'Sign in',
      breadcrumb: [
        {
          label: 'Sign in',
          url: ''
        }
      ]
    }
  },
  {
    path: 'sign-up',
    component: SignupComponent,
    data: {
      title: 'Sign up',
      breadcrumb: [
        {
          label: 'Sign up',
          url: ''
        }
      ]
    }
  },
  {
    path: 'password-reset',
    component: PasswordResetComponent,
    data: {
      title: 'Password reset',
      breadcrumb: [
        {
          label: 'Password reset',
          url: ''
        }
      ]
    }
  },
  {
    path: 'password-reset-request',
    component: PasswordResetRequestComponent,
    data: {
      title: 'Password reset request',
      breadcrumb: [
        {
          label: 'Password reset request',
          url: ''
        }
      ]
    }
  },
  // { path: "**", redirectTo: "" },
]
