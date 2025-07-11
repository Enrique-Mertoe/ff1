import {Component, OnInit} from '@angular/core';
import {CoreLicense} from "../../../shared/schema/core-license";
import {TableColumn} from "../../ui/custom-table/TableColumn";
import {CustomTableVars} from "../../ui/custom-table/custom-table-vars";
import {CustomTableComponent} from "../../ui/custom-table/custom-table.component";
import {CoreLicenseService} from "../../../shared/services/core-license.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../../../shared/services/notification.service";

@Component({
  selector: 'app-my-licenses',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: '../../ui/custom-table/custom-table-page-template.html',
  styleUrl: './my-licenses.component.scss'
})
export class MyLicensesComponent extends CustomTableVars implements OnInit {
  data: CoreLicense[] = [];
  cols: TableColumn[] = [
    {name: 'License Number', dataKey:'id', position:'right', isSortable: true},
    {name: 'Owner', dataKey:'coreLicenseApplication.coreCustomer.name', position:'right', isSortable: true},
    {name: 'Date issued', dataKey:'dateIssued', position:'right', isSortable: true},
    {name: 'Date expired', dataKey:'expirationDate', position:'right', isSortable: true},
  ];
  override canAdd = true;
  override canEdit = true;
  override canDelete = true;
  override canDownload = true;

  constructor(private applicationService: CoreLicenseService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService) {
    super();
  }
  ngOnInit(): void {
  }
  action(obj:{action: string, row: any}) {
    const element: CoreLicense = obj.row as CoreLicense;
    if (obj.action === 'delete') {
      this.notificationService.coreConfirm().then( (res) => {
        if(res) {
          this.applicationService.delete(element).then( () => {
            this.data = this.data.filter(it => it.id !== element.id);
            this.notificationService.coreSuccess('Success', 'License deleted successfully');
          });
        }
      })
    } else if (obj.action === 'edit') {
      this.router.navigate(['edit', element.id], { relativeTo: this.route }).then(() => {});
    } else if (obj.action === 'create') {
      this.router.navigateByUrl("/home").then(() => {});
    }
  }
  override filterData(value: any) {
    this.searchText = value;
    this.loadData();
  }
}
