import {Component, OnInit} from '@angular/core';
import {CustomTableVars} from "../../../../components/ui/custom-table/custom-table-vars";
import {SysAccountStatus} from "../../../../shared/schema/sys-account-status";
import {TableColumn} from "../../../../components/ui/custom-table/TableColumn";
import {SysAccountStatusService} from "../../../../shared/services/sys-account-status.service";
import {CustomTableComponent} from "../../../ui/custom-table/custom-table.component";

@Component({
  selector: 'app-sys-account-status-overview',
  templateUrl: '../../../ui/custom-table/custom-table-page-template.html',
  styleUrls: ['./sys-account-status-overview.component.scss'],
  standalone: true,
  imports: [
    CustomTableComponent
  ]
})
export class SysAccountStatusOverviewComponent extends CustomTableVars implements OnInit{
  data: SysAccountStatus[] = [];
  cols: TableColumn[] = [
    {name: 'Name', dataKey:'name', position:'right', isSortable: true},
    {name: 'Description', dataKey:'description', position:'right', isSortable: true}
  ];
  override canAdd = false;
  override canEdit = false;
  override canDelete = false;
  override isFilterable = false;
  constructor(private statusesService: SysAccountStatusService) {
    super();
  }
  ngOnInit(): void {
    this.loadData();
  }

  override loadData() {
    this.statusesService.getAll().then((res) => {
      this.data = res;
      this.totalRows = res.length;
    });
  }
  action(obj:{action: string, row: any}) {
  }
}
