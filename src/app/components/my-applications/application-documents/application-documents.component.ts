import {Component, OnInit} from '@angular/core';
import {CustomTableVars} from "../../ui/custom-table/custom-table-vars";
import {CustomTableComponent} from "../../ui/custom-table/custom-table.component";
import {TableColumn} from "../../ui/custom-table/TableColumn";
import {CoreApplicationDocument} from "../../../shared/schema/core-application-document";
import {NotificationService} from "../../../shared/services/notification.service";
import {CoreApplicationDocumentService} from "../../../shared/services/core-application-document.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-application-documents',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: '../../ui/custom-table/custom-table-page-template.html',
  styleUrl: './application-documents.component.scss'
})
export class ApplicationDocumentsComponent  extends CustomTableVars implements OnInit{
  data: CoreApplicationDocument[] = [];
  cols: TableColumn[] = [
    {name: 'Document ID', dataKey:'id', position:'right', isSortable: true},
    {name: 'Application', dataKey:'coreLicenseApplication.id', position:'right', isSortable: true},
    {name: 'Document name', dataKey:'name', position:'right', isSortable: true},
    {name: 'Status', dataKey:'applicationStatus.name', position:'right', isSortable: true},
    {name: 'Date created', dataKey:'dateCreated', position:'right', isSortable: true},
    {name: 'Date updated', dataKey:'dateUpdated', position:'right', isSortable: true},
  ];
  override canAdd = true;
  override canEdit = true;
  override canDelete = true;
  constructor(private applicationDocumentService: CoreApplicationDocumentService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService) {
    super();
  }
  ngOnInit(): void {
    this.loadData();
  }

  override loadData() {
    this.applicationDocumentService.getAll(this.pageIndex?? 0, this.pageSize?? this.initPageSize, this.searchText).then((res) => {
      this.data = res.data as CoreApplicationDocument[];
      this.totalRows = res.count;
    });
  }
  action(obj:{action: string, row: any}) {
    const element: CoreApplicationDocument = obj.row as CoreApplicationDocument;
    if (obj.action === 'delete') {
      this.notificationService.coreConfirm().then( (res) => {
        if(res) {
          this.applicationDocumentService.delete(element).then( () => {
            this.data = this.data.filter(it => it.id !== element.id);
            this.notificationService.coreSuccess('Success', 'DB deleted successfully');
          });
        }
      })
    } else if (obj.action === 'edit') {
      this.router.navigate(['edit', element.id], { relativeTo: this.route }).then(() => {});
    } else if (obj.action === 'create') {
      this.router.navigate(['create'], { relativeTo: this.route }).then(() => {});
    }
  }

  override filterData(val: string) {
    this.searchText = val;
    this.loadData();
  }
}
