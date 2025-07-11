import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {TableColumn} from "./TableColumn";
import {DataPropertyGetterPipe} from "./data-property-getter.pipe";
import {COMMON_MODULES} from "../../../custom-material/custom-material.module";
import {SearchComponent} from "../search/search.component";

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
  standalone: true,
  imports: [
    ...COMMON_MODULES,
    SearchComponent,
    DataPropertyGetterPipe
  ],
  providers:[
    DataPropertyGetterPipe
  ]
})
export class CustomTableComponent implements OnInit, AfterViewInit {

  public tableDataSource = new MatTableDataSource([]);
  public displayedColumns: string[];
  @ViewChild(MatPaginator, {static: false}) matPaginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) matSort: MatSort;
  @Input() isPageable = false;
  @Input() canExport = false;
  @Input() canAdd = false;
  @Input() canEdit = false;
  @Input() canDelete = false;
  @Input() canDownload =false;
  @Input() isSortable = false;
  @Input() isFilterable = true;
  @Input() tableColumns: TableColumn[];
  @Input() paginationSizes: number[] = [5, 10, 25, 100, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
  @Input() defaultPageSize: number;

  @Input() totalRows: number;

  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() onExport: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSearch: EventEmitter<any> = new EventEmitter<any>();
  @Output() matPageChange: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  // this property needs to have a setter, to dynamically get changes from parent component
  @Input() set tableData(data: any[]) {
      this.setTableDataSource(data);
  }

  constructor(private pipe:DataPropertyGetterPipe) {}

  ngOnInit(): void {
    let cols: TableColumn[];

    if(this.tableColumns && this.tableColumns.length) {
      cols = this.tableColumns;
    } else {
    cols = Object.keys(this.tableDataSource.data[0]).map( (key)=> {
        return {name: key, dataKey:key, position:'right', isSortable: true};
      });
    }
    this.tableColumns = cols;
      //TableColumn[] {name: 'Name', dataKey:'name', position:'right', isSortable: true}


    const columnNames = (this.tableColumns || []).map((tableColumn: TableColumn) => tableColumn.name);
    if (this.canEdit || this.canDelete) {
      //Add action column to the displayColumns array
      this.displayedColumns = [...columnNames, 'action'];
    } else {
      this.displayedColumns = columnNames;
    }

    if(!this.defaultPageSize) {
      this.defaultPageSize = 10;
    }
    if(!this.totalRows || this.totalRows ==0){
      this.totalRows = this.tableDataSource.data.length;
    }
  }

  // we need this, in order to make pagination work with *ngIf
  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.matPaginator;
    // this.tableDataSource.sort = this.matSort;
    this.matPaginator?.page.subscribe((val)=> {
      this.matPageChange.emit(val);
    });
  }

  setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource<any>(data);
    this.tableDataSource.sortingDataAccessor = (item, property) => {
      for(let it of this.tableColumns) {
        if(it.name == property) {
          return this.pipe.transform(item, it.dataKey) as string;
        }
      }
      return this.pipe.transform(item, property) as string;
    };
    if((!this.totalRows || this.totalRows <=0) && (data && data.length>0)) {
      this.totalRows = data.length;
    }
  }
  sortTable(sortParameters: Sort) {
    // defining name of data property, to sort by, instead of column name
    sortParameters.active = (this.tableColumns || []).find(column => column.name === sortParameters.active).dataKey;
    this.sort.emit(sortParameters);
  }

  action(action: string, row: any) {
    this.rowAction.emit({action, row});
  }

  filterData(value: any) {
    this.onSearch.emit(value?.trim() || "");
  }
}
