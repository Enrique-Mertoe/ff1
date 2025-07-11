import {SysUserAccount} from "../schema/sys-user-account";

export class SysUserAccountManager {
    constructor(private user: SysUserAccount) {
    }

    get fullName(): string {
        return `${this.user.firstName} ${this.user.middleName || ''} ${this.user.lastName}`.trim();
    }

    get isAdmin(): boolean {
        return this.user.sysUserGroup?.name?.toLowerCase() === 'admin';
    }

    get isLO(): boolean {
        return this.user.sysUserGroup?.name?.toLowerCase() === 'licensing_officer';
    }

    get isLM(): boolean {
        return this.user.sysUserGroup?.name?.toLowerCase() === 'licensing_manager';
    }

    get isAccountant(): boolean {
        return this.user.sysUserGroup?.name?.toLowerCase() === 'accountant';
    }

    get isDrs(): boolean {
        return this.user.sysUserGroup?.name?.toLowerCase() === 'drs';
    }

    get isCEO(): boolean {
        return this.user.sysUserGroup?.name?.toLowerCase() === 'ceo';
    }

    get isApplicant(): boolean {
        return this.user.sysUserGroup?.name?.toLowerCase() === 'applicant';
    }

    // get canLogin(): boolean {
    //     const now = new Date();
    //     return this.user.canLoginAfter <= now && this.user.sysAccountStatus?.code === 'ACTIVE';
    // }

    get profileInitials(): string {
        return (this.user.firstName[0] + this.user.lastName[0]).toUpperCase();
    }

    hasPhoto(): boolean {
        return !!this.user.profilePhoto;
    }

    get raw(): SysUserAccount {
        return this.user;
    }
}