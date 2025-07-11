import {Component, OnInit} from '@angular/core';
import {CustomTableVars} from "../../../../components/ui/custom-table/custom-table-vars";
import {SysAuditEntry} from "../../../../shared/schema/sys-audit-entry";
import {TableColumn} from "../../../../components/ui/custom-table/TableColumn";
import {SysAuditEntryService} from "../../../../shared/services/sys-audit-entry.service";
import {CustomTableComponent} from "../../../ui/custom-table/custom-table.component";

@Component({
  selector: 'app-sys-audit-entries-overview',
  templateUrl: '../../../ui/custom-table/custom-table-page-template.html',
  standalone: true,
  styleUrls: ['./sys-audit-entries-overview.component.scss'],
  imports:[
    CustomTableComponent
  ]
})
export class SysAuditEntriesOverviewComponent extends CustomTableVars implements OnInit{
  data: SysAuditEntry[] = [];
  cols: TableColumn[] = [
    {name: 'Name', dataKey:'name', position:'right', isSortable: true},
    {name: 'Description', dataKey:'description', position:'right', isSortable: true}
  ];
  override canAdd = false;
  override canEdit = false;
  override canDelete = false;
  constructor(private objsService: SysAuditEntryService) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  override loadData() {
    this.objsService.getAll(this.pageIndex?? 0, this.pageSize?? this.initPageSize, this.searchText).then((res) => {
      this.data = res.data as SysAuditEntry[];
      this.totalRows = res.count;
    });
  }
  action(obj:{action: string, row: any}) {
  }
  override filterData(value: any) {
    this.searchText = value;
    this.loadData();
  }
}
