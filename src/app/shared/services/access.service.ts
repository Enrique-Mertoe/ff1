import {Injectable} from '@angular/core';
import {DataService} from "./data.service";
import {SysUserGroupPermission} from "../schema/sys-user-group-permission";

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  userPermissions: SysUserGroupPermission[];
  constructor(private dataService: DataService) { }
  canAccess(obj: string) {
    const userObjects = [...new Set((this.userPermissions || [])
      .map(perm => perm.sysObject.name))]
      .reduce((p, n) => p.concat(n), []);
    return (userObjects.includes(obj)) || userObjects.includes('all');
  }
  canExecute(permission: string) {
    const userPermsList = this.userPermissions
      .map(perm => perm.sysPermission.name)
      .reduce((p, n) => p.concat(n), []);
    return (userPermsList.includes(permission)) || userPermsList.includes('ALL');
  }

  initMenu(): void {
    this.userPermissions = this.dataService.get('permissions') as SysUserGroupPermission[] || [];
  }
}
