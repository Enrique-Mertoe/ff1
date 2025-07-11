import { Injectable } from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {SysUserAccount} from "../schema/sys-user-account";
import {AuthService} from "./auth.service";
import {DataService, errorMessages} from "./data.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CustomFormValidationService {

  userAccount: SysUserAccount;
  constructor(private authService: AuthService, private dataService: DataService) {
    this.userAccount = this.dataService.get('userAccount');
  }
  checkPasswords(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl): ValidationErrors | null => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return null;
      }
      if (!control.value) {
        control.markAsTouched();
        // control.setErrors({ required: controlName + ' is required' });
        return null;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value && (control.value.toString().length > 0
        || matchingControl.value.toString().length > 0)) {
        matchingControl.setErrors({ mustMatch: errorMessages.mustMatch });
        // return{ mustMatch: errorMessages.mustMatch };
      } else {
        matchingControl.setErrors(null);
        // return null;
      }
      return null;
    };
  }
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;

      if (!value) {
        return null;
      }
      const hasLength = value.length >=6;
      const hasUpperCase = /[A-Z]+/.test(value);

      const hasLowerCase = /[a-z]+/.test(value);

      const hasNumeric = /[0-9]+/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasLength;

      return !passwordValid ? {passwordStrength: errorMessages.passwordStrength} : null;
    };
  }

  usernameExists(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!control.value || ((control.value && this.userAccount) && control.value === this.userAccount.username) || this.userAccount?.sysUserGroup?.name === 'admin' || !this.authService) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }
    return new Promise((resolve) => {
      this.authService
        .getUserByUsername(control.value)
        .then(
          (response) => resolve(!response.exists ? null : {usernameExists: errorMessages.usernameExists}),
          () => resolve ({usernameExists: errorMessages.usernameExists})
        );
    });
  }
  emailExists(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    //for admins validation can be tricky since logged-in user and the current user being edited is different. So jst return. API will validate on submit
    if (!control.value || ((control.value && this.userAccount) && control.value === this.userAccount.emailAddress) || this.userAccount?.sysUserGroup?.name === 'admin' || !this.authService) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }
    return new Promise((resolve) => {
      this.authService
        .getUserByEmailAddress(control.value)
        .then(
          (response) => resolve(!response.exists ? null : {usernameExists: true}),
          (ex) => resolve ({emailExists: ex.error.message})
        );
    });
  }
  phoneNumberExists(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!control.value || ((control.value && this.userAccount) && control.value === this.userAccount?.phoneNumber) || !this.authService) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }
    return new Promise((resolve) => {
      this.authService
        .getUserBymMobileNumber(control.value)
        .then(
          (response) => resolve(!response.exists ? null : {usernameExists: true}),
          () => resolve ({phoneNumberExists: errorMessages.phoneNumberExists})
        );
    });
  }
  verifyPassword(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!control.value) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }
    return new Promise((resolve) => {
      this.authService
        .verifyPassword(this.userAccount.username, control.value)
        .then(
          (response) => resolve(response.token ? null : {invalidPassword: true}),
          () => resolve ({invalidPassword: errorMessages.invalidPassword})
        );
    });
  }
}
