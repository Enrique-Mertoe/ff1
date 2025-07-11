export interface AccountCreateRequest {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress?: string;
  phoneNumber?: string;
  verificationCode?: string;
  verificationMethod?: string;
  password: string;
}
