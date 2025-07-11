import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {SysUserAccount} from "../../schema/sys-user-account";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {COMMON_MODULES} from "../../../custom-material/custom-material.module";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {NotificationService} from "../../services/notification.service";


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  standalone: true,
  styleUrls: ['./toolbar.component.scss'],
  imports: [
    ...COMMON_MODULES,
    MatButtonModule, MatMenuModule, MatIconModule,
  ],
})
export class ToolbarComponent implements OnInit {
  @Input() isExpanded!: boolean;
  @Output() toggleSidenav = new EventEmitter<void>();

  loggedInUser: SysUserAccount;
  userName: string = "";
  isAdmin: boolean = false;
  constructor(
    public titleService: Title,
    private dataService: DataService,
    private authService: AuthService,
    private notificationService:NotificationService
    ) { }

  hasWorkflowTasks(): boolean {
    return this.loggedInUser?.sysUserGroup?.name?.toLowerCase() !== 'client';
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.dataService.config.systemName);
    this.loggedInUser = this.authService.getCurrentUser();

    this.isAdmin = this.loggedInUser?.sysUserGroup?.name === 'admin';
    this.userName = this.loggedInUser?.username;
  }

  logout() {
    this.authService.logout();
  }

  showAbout() {
    this.notificationService.coreInformation(this.dataService.config.systemName, this.dataService.config.systemDescription).then( ()=>{});
  }
}

