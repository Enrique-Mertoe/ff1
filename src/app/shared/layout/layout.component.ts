
import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from "@angular/cdk/layout";
import {SpinnerService} from "../services/spinner.service";
import {Subscription, timer} from "rxjs";
import {AuthGuard} from "../guards/auth.guard";
import {NgDynamicBreadcrumbModule} from "ng-dynamic-breadcrumb";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {SideNavbarComponent} from "./side-navbar/side-navbar.component";
import {AuthService} from "../services/auth.service";
import {SysUserAccount} from "../schema/sys-user-account";
import {NgIf} from "@angular/common";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatBadge} from "@angular/material/badge";
import {DefaultShowHideDirective} from "ngx-flexible-layout";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatProgressBar} from "@angular/material/progress-bar";
import {LocalDatePipe} from "../pipes/local-date.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {ToolbarComponent} from "./toolbar/toolbar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    RouterLink,
    MatMenu,
    LocalDatePipe,
    MatMenuTrigger,
    SideNavbarComponent,
    MatProgressBar,
    MatProgressSpinner,
    NgDynamicBreadcrumbModule,
    RouterOutlet,
    MatTooltip,
    MatIconButton,
    MatMenuItem,
    MatButton,
    DefaultShowHideDirective,
    MatBadge,
    MatSidenavContent,
    MatSidenav,
    MatSidenavContainer,
    NgIf,
    ToolbarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  sideNavOpen: boolean;
  private readonly _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  showSpinner: boolean = false;
  userName: string = "";
  isAdmin: boolean = false;
  loggedInUser: SysUserAccount;

  private autoLogoutSubscription: Subscription = new Subscription;

  breadcrumbConfig: object = {
    bgColor: '#eee',
    fontSize: '18px',
    fontColor: '#0275d8',
    lastLinkColor: '#000',
    symbol: ' / ',
  };
  constructor(private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher,
              public spinnerService: SpinnerService,
              private authService: AuthService,
              private authGuard: AuthGuard
  ) {

    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.spinnerService.visibility.subscribe( (res) => {
      this.showSpinner = res;
      this.changeDetectorRef.detectChanges();
    });
    this.loggedInUser = this.authService.getCurrentUser();

    this.isAdmin = this.loggedInUser?.sysUserGroup?.name === 'admin';
    this.userName = this.loggedInUser?.username;

    // Auto log-out subscription
    const timer$ = timer(2000, 100000);
    this.autoLogoutSubscription = timer$.subscribe(() => {
      this.authGuard.canActivate();
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.autoLogoutSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
