import { Component, OnInit} from '@angular/core';
import {SysObject} from "../../../../shared/schema/sys-object";
import {SysObjectService} from "../../../../shared/services/sys-object.service";
import {CustomTableVars} from "../../../ui/custom-table/custom-table-vars";
import {TableColumn} from "../../../ui/custom-table/TableColumn";
import {CustomTableComponent} from "../../../ui/custom-table/custom-table.component";

@Component({
  selector: 'app-sys-objects-overview',
  templateUrl: '../../../ui/custom-table/custom-table-page-template.html',
  standalone: true,
  styleUrls: ['./sys-objects-overview.component.scss'],
  imports: [
    CustomTableComponent
  ]
})
export class SysObjectsOverviewComponent extends CustomTableVars implements OnInit {
  data: SysObject[] = [];
  cols: TableColumn[] = [
    {name: 'Name', dataKey:'name', position:'right', isSortable: true},
    {name: 'Description', dataKey:'description', position:'right', isSortable: true}
  ];
  override canAdd = false;
  override canEdit = false;
  override canDelete = false;
  constructor(private objsService: SysObjectService) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  override loadData() {
    this.objsService.getAll(this.pageIndex?? 0, this.pageSize?? this.initPageSize, this.searchText).then((res) => {
      this.data = res.data as SysObject[];
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
