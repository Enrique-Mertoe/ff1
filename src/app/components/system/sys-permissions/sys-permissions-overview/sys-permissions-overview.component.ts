import {Component, OnInit} from '@angular/core';
import {CustomTableVars} from "../../../ui/custom-table/custom-table-vars";
import {SysPermission} from "../../../../shared/schema/sys-permission";
import {TableColumn} from "../../../ui/custom-table/TableColumn";
import {SysPermissionService} from "../../../../shared/services/sys-permission.service";
import {CustomTableComponent} from "../../../ui/custom-table/custom-table.component";

@Component({
  selector: 'app-sys-permissions-overview',
  templateUrl: '../../../ui/custom-table/custom-table-page-template.html',
  standalone: true,
  styleUrls: ['./sys-permissions-overview.component.scss'],
  imports: [
    CustomTableComponent
  ]
})
export class SysPermissionsOverviewComponent extends CustomTableVars implements OnInit{
  data: SysPermission[] = [];
  cols: TableColumn[] = [
    {name: 'Name', dataKey:'name', position:'right', isSortable: true},
    {name: 'Description', dataKey:'description', position:'right', isSortable: true}
  ];
  override canAdd = false;
  override canEdit = false;
  override canDelete = false;
  override isFilterable = false;
  constructor(private permsService: SysPermissionService) {
    super();
  }
  ngOnInit(): void {
    this.loadData();
  }

  override loadData() {
    this.permsService.getAll().then((res) => {
      this.data = res;
      this.totalRows = res.length;
    });
  }
  action(obj:{action: string, row: any}) {
  }
}
