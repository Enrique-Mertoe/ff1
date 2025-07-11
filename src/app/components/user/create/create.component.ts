import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgDynamicBreadcrumbService} from "ng-dynamic-breadcrumb";
import {NotificationService} from "../../../shared/services/notification.service";
import {SysUserAccount} from "../../../shared/schema/sys-user-account";
import {SysAccountStatus} from "../../../shared/schema/sys-account-status";
import {CustomFormValidationService} from "../../../shared/services/custom-form-validation.service";
import {SysUserGroupService} from "../../../shared/services/sys-user-group.service";
import {SysUserGroup} from "../../../shared/schema/sys-user-group";
import {SysAccountStatusService} from "../../../shared/services/sys-account-status.service";
import {SysUserAccountService} from "../../../shared/services/sys-user-account.service";
import {SysSalutation} from "../../../shared/schema/sys-salutation";
import {SysSalutationService} from "../../../shared/services/sys-salutation.service";
import {COMMON_MODULES} from "../../../custom-material/custom-material.module";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule,
    ...COMMON_MODULES
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  userForm!: FormGroup;
  userAccountId: string;
  user: SysUserAccount;
  userGroups: SysUserGroup[];
  sysAccountStatuses: SysAccountStatus[];
  salutations: SysSalutation[];
  hidePassword: boolean;
  hideConfirmPassword: boolean;

  constructor(
    private  builder: FormBuilder,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private validationService: CustomFormValidationService,
    private ngDynamicBreadcrumbService: NgDynamicBreadcrumbService,
    private  userGroupService: SysUserGroupService,
    private  userAccountStatusService: SysAccountStatusService,
    private  userService: SysUserAccountService,
    private  salutationService: SysSalutationService,
  ) {
    this.hidePassword = true;
    this.hideConfirmPassword = true;
  }

  ngOnInit(): void {
    this.userForm = this.builder.group({
        id: [null],
        username: [
          null,
          {
            validators: [Validators.required, Validators.minLength(3)],
            asyncValidators:  [this.validationService.usernameExists.bind(this.validationService)],
            updateOn: 'blur'
          }
        ],
        firstName: [null, [Validators.required, Validators.minLength(3)]],
        lastName: [null, [Validators.required, Validators.minLength(3)]],
        phoneNumber: [null, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        section: [null],
        sysUserGroup: [null],
        sysAccountStatus: [null],
        sysSalutation: [null],
        emailAddress: [
          null,
          {
            validators: [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
            asyncValidators: [this.validationService.emailExists.bind(this.validationService)],
            updateOn: 'blur'
          }
        ],
        password: [null, [this.validationService.passwordStrengthValidator()]],
        confirmPassword: [null]
      }
      , {
        validators: this.validationService.checkPasswords('password', 'confirmPassword')
      }
    );
    this.userGroupService.getAll().then( (res) => {
      this.userGroups = res;
    });
    this.userAccountStatusService.getAll().then( (res) => {
      this.sysAccountStatuses = res;
    });

    this.salutationService.getAll().then( (res) => {
      this.salutations = res;
    });

    this.userAccountId = this.route.snapshot.params['id'];
    if(this.userAccountId) {
      this.initialiseData();
    }

    this.ngDynamicBreadcrumbService.updateBreadcrumbLabels({action: this.userAccountId? 'Edit' : 'Create'})
  }
  initialiseData() {
    this.route.params.subscribe( event => {
      this.userAccountId = event['id'];
      if (this.userAccountId) {
        this.userService.getById(this.userAccountId).then( (pg) => {
          this.user = pg;
          this.userForm.patchValue(this.user);
        });
      }
    });
  }
  get form() {
    return this.userForm.controls;
  }
  save() {
    if (this.user) {
      this.userService.update(this.userForm.value).then( (ua) => {
        this.afterSave(ua);
      });
    } else {
      const newUser = Object.assign({}, this.userForm.value);
      delete newUser['confirmPassword'];
      this.userService.create(newUser).then( (pg) => {
        this.afterSave(pg);
      });
    }
  }
  private afterSave(u: SysUserAccount) {
    this.notificationService.success('Success', 'Data saved successfully');
    this.router.navigate(['users', 'edit', u.id]).then(() => {});
  }

  compareFunction(obj1: any, obj2: any) {
    return (JSON.stringify(obj1).toLowerCase() === JSON.stringify(obj2).toLowerCase());
  }
}
