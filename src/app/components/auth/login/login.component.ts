import {Component, OnInit} from '@angular/core';
import {ErrorComponent} from "../../ui/error/error.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {SysConfig} from "../../../shared/schema/sys-config";
import {NotificationService} from "../../../shared/services/notification.service";
import {AuthService} from "../../../shared/services/auth.service";
import {DataService} from "../../../shared/services/data.service";
import {MenuService} from "../../../shared/services/menu.service";
import {AuthenticationResponse} from "../../../shared/schema/response-schema/authentication-response";
import {COMMON_MODULES} from "../../../custom-material/custom-material.module";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ErrorComponent,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    COMMON_MODULES
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  errorMessage = 'Provide valid username and password or Click signup to create an account.';
  loginForm!: FormGroup;
  loading!: boolean;
  config: SysConfig;
  currentDate: Date = new Date();
  hidePassword: boolean = true;
  constructor(private router: Router,
              private notificationService: NotificationService,
              private authenticationService: AuthService,
              private dataService: DataService,
              private menuService: MenuService
  ) {
  }

  ngOnInit() {
    if (this.authenticationService.isLogged()) {
      this.router.navigateByUrl('/home').then( ()=> {});
    }
    this.config = this.dataService.config;
    this.createForm();
  }

  private createForm() {
    const savedUsername = localStorage.getItem('savedUsername');

    this.loginForm = new FormGroup({
      username: new FormControl(savedUsername, [Validators.required]),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(savedUsername !== null)
    });
  }

  login() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    const rememberMe = this.loginForm.get('rememberMe')?.value;

    this.loading = true;
    this.authenticationService
      .login(username, password, rememberMe)
      .then(
        (res: AuthenticationResponse) => {
          this.dataService.set('token', res.token);
          this.dataService.set('userAccount', res.userAccount);
          this.dataService.set('permissions', res.permissions);
          // this.notificationService.success( 'Success', 'Login successfully');
          if (rememberMe) {
            this.dataService.set('savedUsername',  res.userAccount.username);
          } else {
            this.dataService.remove('savedUsername');
          }
          this.menuService.generate();
          console.log(this.menuService.menus)
          const link = this.menuService.menus[0].children? this.menuService.menus[0].children[0].link: this.menuService.menus[0].link;
          this.router.navigateByUrl(link).then( () =>{
            location.reload();
          })
        },
        (error) => {
          this.notificationService.coreError("Oops!",error.error.message);
          this.loading = false;
        }
      );
  }

  resetPassword() {
    this.router.navigate(['/auth/password-reset-request']).then( () =>{});
  }

}
