import { Component } from '@angular/core';
import {ChangePasswordComponent} from "../change-password/change-password.component";
import {ProfileDetailComponent} from "../profile-detail/profile-detail.component";
import {COMMON_MODULES} from "../../../custom-material/custom-material.module";

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [
    ChangePasswordComponent,
    ProfileDetailComponent,
    ...COMMON_MODULES
  ],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss'
})
export class AccountPageComponent {

}
