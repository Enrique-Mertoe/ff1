import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgDynamicBreadcrumbService} from "ng-dynamic-breadcrumb";
import {SysUserGroupService} from "../../../../shared/services/sys-user-group.service";
import {SysUserGroup} from "../../../../shared/schema/sys-user-group";
import {NotificationService} from "../../../../shared/services/notification.service";
import {COMMON_MODULES} from "../../../../custom-material/custom-material.module";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    ...COMMON_MODULES
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  groupForm!: FormGroup;
  groupId: string;
  group: SysUserGroup;
  constructor(private  builder: FormBuilder, private groupService: SysUserGroupService,
              private notificationService: NotificationService,
              private route: ActivatedRoute,
              private router: Router,
              private ngDynamicBreadcrumbService: NgDynamicBreadcrumbService) { }

  ngOnInit(): void {
    this.groupForm = this.builder.group({
        id: [null],
        name: [null, [Validators.required, Validators.minLength(3)]],
        description: [null]
      }
    );
    this.groupId = this.route.snapshot.params['id'];
    if(this.groupId) {
      this.initialiseData();
    }

    this.ngDynamicBreadcrumbService.updateBreadcrumbLabels({action: this.groupId? 'Edit' : 'Create'})
  }
  initialiseData() {
    this.route.params.subscribe( event => {
      this.groupId = event['id'];
      if (this.groupId) {
        this.groupService.getById(this.groupId).then( (pg) => {
          this.group = pg;
          this.groupForm.patchValue(this.group);
        });
      }
    });
  }
  get form() {
    return this.groupForm.controls;
  }
  save() {
    if (this.group) {
      this.groupService.update(this.groupForm.value).then( (pg) => {
        this.afterSave(pg);
      });
    } else {
      this.groupService.create(this.groupForm.value).then( (pg) => {
        this.afterSave(pg);
      });
    }
  }
  private afterSave(pc: SysUserGroup) {
    this.notificationService.success('Success', 'Data saved successfully');
    this.router.navigate(['users', 'user-roles', 'edit', pc.id]).then(() => {});
  }
}
