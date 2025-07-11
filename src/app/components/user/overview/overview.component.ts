import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SysUserAccountService} from "../../../shared/services/sys-user-account.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../../../shared/services/notification.service";
import {SysUserAccount} from "../../../shared/schema/sys-user-account";
import {SearchComponent} from "../../ui/search/search.component";
import {COMMON_MODULES} from "../../../custom-material/custom-material.module";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    ...COMMON_MODULES,
    SearchComponent,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent  implements OnInit, AfterViewInit {
  userAccounts: SysUserAccount[];
  dataSource: MatTableDataSource<SysUserAccount>;
  displayedColumns: string[] = ['name', 'emailAddress', 'userGroup', 'status', 'action'];

  totalRows = 0;
  initPageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  private searchText = '';
  constructor(private userAccountService: SysUserAccountService,
              private route: ActivatedRoute,
              private router: Router, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadData();
  }
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(()=> {
      this.loadData();
    });
  }
  loadData() {
    this.totalRows = 0;
    this.userAccounts = [];
    this.initialiseDataSource();
    this.userAccountService.getAll(this.paginator?.pageIndex?? 0, this.paginator?.pageSize?? this.initPageSize, this.searchText).then((res) => {
      this.userAccounts = res.data as SysUserAccount[];
      this.totalRows = res.count;
      setTimeout(() => {
        this.initialiseDataSource();
      });
    });
  }
  private initialiseDataSource(): void {
    this.dataSource = new MatTableDataSource<SysUserAccount>(this.userAccounts);

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'name': return item.firstName || item.lastName;
        case 'username': return item.username;
        case 'emailAddress': return item.emailAddress;
        case 'userGroup': return item.sysUserGroup?.name;
        case 'status': return item.sysAccountStatus?.name;
        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;
  }

  deleteUser(delete1: string, element: SysUserAccount) {
    this.notificationService.coreConfirm().then( (res) => {
      if(res) {
        this.userAccountService.delete(element).then( () => {
          this.userAccounts = this.userAccounts.filter(it => it.id !== element.id);
          this.notificationService.coreSuccess('Success', 'User account deleted successfully');
          this.initialiseDataSource();
        });
      }
    });
  }

  editUser(edit: string, element) {
    this.router.navigate(['edit', element.id], { relativeTo: this.route }).then(() => {});
  }

  addUser() {
    this.router.navigate(['create'], { relativeTo: this.route }).then(() => {});
  }
  filterData(value: string) {
    this.paginator.pageIndex = 0;
    this.searchText = value?.trim() || "";
    this.loadData();
  }
}
