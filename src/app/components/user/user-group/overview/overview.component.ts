import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {
  MatTableDataSource
} from "@angular/material/table";

import {SysUserGroupService} from "../../../../shared/services/sys-user-group.service";
import {SysUserGroup} from "../../../../shared/schema/sys-user-group";
import {NotificationService} from "../../../../shared/services/notification.service";
import {COMMON_MODULES} from "../../../../custom-material/custom-material.module";
import {SearchComponent} from "../../../ui/search/search.component";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    ...COMMON_MODULES,
    SearchComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  userGroups: SysUserGroup[];
  dataSource: MatTableDataSource<SysUserGroup>;
  displayedColumns: string[] = ['name', 'description', 'dateCreated', 'dateUpdated', 'action'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private userGroupService: SysUserGroupService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.userGroupService.getAll().then((grp: SysUserGroup[]) => {
      this.userGroups = grp;
      this.initialiseDataSource();
    });
  }
  private initialiseDataSource(): void {
    this.dataSource = new MatTableDataSource<SysUserGroup>(this.userGroups);
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'name': return item.name;
        case 'description': return item.description;
        case 'dateCreated': return item.dateCreated;
        case 'dateUpdated': return item.dateUpdated;
        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  addGroup() {
    this.router.navigate(['create'], { relativeTo: this.route }).then(() => {});
  }
  actionGroup(action: string, element) {
    if (action === 'delete') {
      this.notificationService.coreConfirm().then((res) => {
        if (res) {
          this.userGroupService.delete(element.id).then(() => {
            this.userGroups = this.userGroups.filter(it => it.id !== element.id);
            this.notificationService.coreSuccess('Success', 'User group deleted successfully');
            this.initialiseDataSource();
          });
        }
      })
    } else if (action === 'edit') {
      this.router.navigate(['edit', element.id], {relativeTo: this.route}).then(() => {
      });
    }
  }
  filterData(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
