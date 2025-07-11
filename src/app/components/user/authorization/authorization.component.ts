import { Component, OnInit } from '@angular/core';
import {SysUserGroup} from "../../../shared/schema/sys-user-group";
import {SysObject} from "../../../shared/schema/sys-object";
import {SysPermission} from "../../../shared/schema/sys-permission";
import {NotificationService} from "../../../shared/services/notification.service";
import {SysUserGroupService} from "../../../shared/services/sys-user-group.service";
import {SysObjectService} from "../../../shared/services/sys-object.service";
import {SysPermissionService} from "../../../shared/services/sys-permission.service";
import {DataService} from "../../../shared/services/data.service";
import {SysUserGroupPermission} from "../../../shared/schema/sys-user-group-permission";
import {SysUserGroupPermissionService} from "../../../shared/services/sys-user-permission.service";
import {COMMON_MODULES} from "../../../custom-material/custom-material.module";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [
    ...COMMON_MODULES,
    NgxDaterangepickerMd,
  ],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss'
})
export class AuthorizationComponent implements OnInit {
  groups: SysUserGroup[];
  sysObjects: SysObject[];
  permissions: SysPermission[];
  userPermissions: SysUserGroupPermission[];
  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private sysGroupService: SysUserGroupService,
    private sysObjectService: SysObjectService,
    private sysPermissionService: SysPermissionService,
    private sysUserPermissionService: SysUserGroupPermissionService,
  ) { }

  ngOnInit(): void {
    // this.sysObjectService.getAll().then((res) => {
    //   this.sysObjects = (res||[]).filter(it => !it.name.includes('-core'));
    // });
    this.sysObjectService.getAll(0, 100, '').then((res1) => {
      const res = res1.data as SysObject[];
      this.sysObjects = (res || []).filter(it => !it.name.includes('-core'));
    });

    this.sysPermissionService.getAll().then((res) => {
      this.permissions = res;
    });

    this.sysGroupService.getAll().then((res) => {
      this.groups = res;
    });

    this.sysUserPermissionService.getAll().then((res) => {
      this.userPermissions = res;
    });
  }

  deleteGroup(userGroupId: string) {
    this.notificationService.coreConfirm().then((res) => {
      if (res) {
        this.sysGroupService.delete(userGroupId).then(() => {
          this.groups = this.groups.filter(it => it.id !== userGroupId);
          this.notificationService.coreSuccess('Success', 'Group deleted successfully');
        });
      }
    })

  }

  updatePermission(object: SysObject, group: SysUserGroup, perm: SysPermission, checked: boolean) {
    if (checked) {
      const userObjectPerm = {} as SysUserGroupPermission;
      userObjectPerm.sysPermission = perm;
      userObjectPerm.sysUserGroup = group;
      userObjectPerm.sysObject = object;
      this.sysUserPermissionService.create(userObjectPerm).then( (res) => {
        this.userPermissions.push(res);
        this.notificationService.success('Success', 'Permission granted');
      });
    } else {
      const perm2Del = this.userPermissions.find( it => {
        return it.sysObject.id === object.id && it.sysPermission.id === perm.id
          && it.sysUserGroup.id === group.id;
      });
      if (perm2Del) {
        this.sysUserPermissionService.delete(perm2Del.id).then( () => {
          this.userPermissions = this.userPermissions.filter((it) => it.id !== perm2Del.id);
          this.notificationService.success('Success', 'Permission revoked');
        });
      }
    }
  }

  groupHasPermission(group: SysUserGroup, object: SysObject, perm: SysPermission) {
    return Boolean((this.userPermissions || []).find((it) => {
      return it.sysObject.id === object.id && it.sysUserGroup.id === group.id
        && it.sysPermission.id === perm.id;
    }));
  }
}
