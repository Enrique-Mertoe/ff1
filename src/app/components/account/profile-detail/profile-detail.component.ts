import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SysUserAccount} from "../../../shared/schema/sys-user-account";
import {DataService} from "../../../shared/services/data.service";
import {AuthService} from "../../../shared/services/auth.service";
import {NotificationService} from "../../../shared/services/notification.service";
import {SysUserAccountService} from "../../../shared/services/sys-user-account.service";
import {CustomFormValidationService} from "../../../shared/services/custom-form-validation.service";
import {CanComponentDeactivate} from "../../../shared/guards/can-deactivate.guard";
import {Observable} from "rxjs";
import { UrlTree } from '@angular/router';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [],
  templateUrl: './profile-detail.component.html',
  styleUrl: './profile-detail.component.scss'
})
export class ProfileDetailComponent implements OnInit, CanComponentDeactivate {

  userAccountForm!: FormGroup;
  userAccount: SysUserAccount;
  dataSaved: boolean;
  constructor(private  builder: FormBuilder,
              private dataService: DataService,
              private authService: AuthService,
              private userAccountService: SysUserAccountService,
              private notificationService: NotificationService,
              private validationService: CustomFormValidationService) { }

  ngOnInit(): void {
    this.userAccount = this.dataService.get('userAccount');

    this.userAccountForm = this.builder.group({
        userAccountId: [null, Validators.required],
        username: [
          null,
          {
            validators: [Validators.required, Validators.minLength(3)],
            asyncValidators:  [this.validationService.usernameExists.bind(this)],
            updateOn: 'blur'
          }
        ],
        firstName: [null, [Validators.required, Validators.minLength(3)]],
        lastName: [null, [Validators.required, Validators.minLength(3)]],
        emailAddress: [
          null,
          {
            validators: [Validators.required, Validators.email],
            asyncValidators: [this.validationService.emailExists.bind(this)],
            updateOn: 'blur'
          }
        ],
        middleName: [null],
        nickName: [null],
        phoneNumber: [Validators.required],
        gender: [null, [Validators.required, Validators.pattern(/[MmFf]/)]],
        profilePhoto: [null],
        sysSalutation: [null, Validators.required],
        coreDepartment: [null, Validators.required],
      }
    );
    this.userAccountForm.patchValue(this.userAccount);
  }
  get form() {
    return this.userAccountForm.controls;
  }
  async updateUserAccount() {
    Object.keys(this.form).forEach(key => {
      this.form[key].markAsTouched();
    });
    // stop here if form is invalid
    if (this.userAccountForm.invalid) {
      return;
    }
    const account = {} as SysUserAccount;
    Object.keys(this.userAccountForm.value).filter(key => key in account).forEach(key => {
      account[key] = this.userAccountForm.value[key];
    });
    Object.keys(account).forEach( key => {
      if (!account[key]) {
        delete account[key];
      }
    });

    await this.userAccountService.update(account).then( result => {
      this.dataSaved = true;
      this.dataService.set('userAccount', result);
      this.notificationService.success('Success', 'Account updated successfully');
    }, () => {
      // error
    });
  }

  canDeactivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.userAccountForm.dirty || this.dataSaved) {
      return true;
    }
    if (
      this.userAccountForm.dirty
    ) {
      return this.notificationService.coreConfirm('Confirm', 'Are you sure you want to leave without saving the data? \n All unsaved changes will be lost')
        .then( async result => {
            return !!result;
          }
        );
    } else {
      return true;
    }
  }
}
