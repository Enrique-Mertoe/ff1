import {Component, OnInit} from '@angular/core';
import {SysConfig} from "../../../../shared/schema/sys-config";
import {CustomTableVars} from "../../../../components/ui/custom-table/custom-table-vars";
import {TableColumn} from "../../../../components/ui/custom-table/TableColumn";
import {ConfigService} from "../../../../shared/services/config.service";
import {CustomTableComponent} from "../../../ui/custom-table/custom-table.component";

@Component({
  selector: 'app-configurations-overview',
  templateUrl: '../../../ui/custom-table/custom-table-page-template.html',
  styleUrls: ['./configurations-overview.component.scss'],
  standalone: true,
  imports: [
    CustomTableComponent
  ]
})
export class ConfigurationsOverviewComponent extends CustomTableVars implements OnInit{
  data: SysConfig[] = [];
  cols: TableColumn[] = [
    {name: 'Name', dataKey:'systemName', position:'right', isSortable: true},
    {name: 'URL', dataKey:'systemUrl', position:'right', isSortable: true},
    {name: 'System E-mail', dataKey:'systemEmailAddress', position:'right', isSortable: true},
    {name: 'Contact E-mail', dataKey:'contactEmailAddress', position:'right', isSortable: true},
  ];
  override canAdd = false;
  override canEdit = false;
  override canDelete = false;
  override isFilterable = false;
  constructor(private configService: ConfigService) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  override loadData() {
    this.configService.getAllConfigurations().then((res) => {
      this.data = [res];
      this.totalRows = this.data.length;
    });
  }
  action(obj:{action: string, row: any}) {
  }
  override filterData(value: any) {
    this.searchText = value;
    this.loadData();
  }
}
