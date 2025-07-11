import {SysUserAccount} from "../sys-user-account";
import {SysUserGroupPermission} from "../sys-user-group-permission";

export interface AuthenticationResponse {
  token: string;
  userAccount: Partial<SysUserAccount>;
  permissions: SysUserGroupPermission[];
}
