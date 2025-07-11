import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../../shared/services/data.service";
import {AuthService} from "../../../shared/services/auth.service";
import {SysUserAccountService} from "../../../shared/services/sys-user-account.service";
import {NotificationService} from "../../../shared/services/notification.service";
import {CustomFormValidationService} from "../../../shared/services/custom-form-validation.service";
import {SysUserAccount} from "../../../shared/schema/sys-user-account";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {COMMON_MODULES} from "../../../custom-material/custom-material.module";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ...COMMON_MODULES
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  userAccount: SysUserAccount;
  disableSubmit!: boolean;
  hideCurrentPassword: boolean;
  hideNewPassword: boolean;
  constructor(private  builder: FormBuilder,
              private dataService: DataService,
              private authService: AuthService,
              private userAccountService: SysUserAccountService,
              private notificationService: NotificationService,
              private validationService: CustomFormValidationService,
              private spinnerService: SpinnerService) {
    this.hideCurrentPassword = true;
    this.hideNewPassword = true;
  }

  ngOnInit(): void {
    this.userAccount = this.dataService.get('userAccount');
    // password form
    this.passwordForm = this.builder.group({
        password: [
          null,
          {
            validators: [Validators.required],
            asyncValidators: [this.validationService.verifyPassword.bind(this)],
            updateOn: 'blur'
          }
        ],
        newPassword: [null, [Validators.required, this.validationService.passwordStrengthValidator()]],
        confirmPassword: [null, Validators.required],
      }, {
        validators: this.validationService.checkPasswords('newPassword', 'confirmPassword')
      }
    );
    this.spinnerService.visibility.subscribe((value) => {
      this.disableSubmit = value;
    });
  }
  get form() {
    return this.passwordForm.controls;
  }
  async changePassword() {
    Object.keys(this.form).forEach(key => {
      this.form[key].markAsTouched();
    });
    // stop here if form is invalid
    if (this.passwordForm.invalid) {
      return;
    }
    await this.userAccountService.update({id: this.userAccount.id,
      password: this.form['newPassword'].value}).then( () => {
      this.notificationService.success('Success', 'Password changed successfully');
    }, () => {
      //error
    });
  }
}
