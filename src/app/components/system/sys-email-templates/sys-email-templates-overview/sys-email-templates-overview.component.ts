import {Component, OnInit} from '@angular/core';
import {CustomTableVars} from "../../../ui/custom-table/custom-table-vars";
import {TableColumn} from "../../../ui/custom-table/TableColumn";
import {SysEmailTemplateService} from "../../../../shared/services/sys-email-template.service";
import {ActiveStatusPipe} from "../../../../shared/pipes/active-status.pipe";
import {COMMON_MODULES} from "../../../../custom-material/custom-material.module";
import {CustomTableComponent} from "../../../ui/custom-table/custom-table.component";
import {DataPropertyGetterPipe} from "../../../ui/custom-table/data-property-getter.pipe";

@Component({
  selector: 'app-sys-email-templates-overview',
  templateUrl: '../../../ui/custom-table/custom-table-page-template.html',
  standalone: true,
  styleUrls: ['./sys-email-templates-overview.component.scss'],
  imports: [
    ...COMMON_MODULES,
    CustomTableComponent,
  ],
  providers:[
    DataPropertyGetterPipe,
    ActiveStatusPipe
  ]
})
export class SysEmailTemplatesOverviewComponent extends CustomTableVars implements OnInit{
  data: any[] = [];
  cols: TableColumn[] = [
    {name: 'Name', dataKey:'name', position:'right', isSortable: true},
    {name: 'Status', dataKey:'status', position:'right', isSortable: true}
  ];
  override canAdd = false;
  override canEdit = false;
  override canDelete = false;
  override isFilterable = false;
  constructor(private templateService: SysEmailTemplateService, private activeStatus: ActiveStatusPipe) {
    super();
  }
  ngOnInit(): void {
    this.loadData();
  }

  override loadData() {
    this.templateService.getAll().then((res) => {
      this.data = (res as any).map(it => {
        it.status = this.activeStatus.transform(it.status);
        return it;
      });
      this.totalRows = res.length;
    });
  }
  action(obj:{action: string, row: any}) {
  }
  override filterData(value: any) {
  }
}
