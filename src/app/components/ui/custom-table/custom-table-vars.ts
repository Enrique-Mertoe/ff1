import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";

export class CustomTableVars {
  totalRows!: number;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
  initPageSize = this.pageSizeOptions[1];
  pageIndex: number;
  pageSize: number;
  searchText = '';

  canAdd= true;
  canEdit: boolean = true;
  canDelete: boolean = true;
  canDownload: boolean = false;
  isFilterable: boolean = true;
  isPageable: boolean = true;

  loadData() {
  }

  filterData(value: any) {
    this.pageIndex = 0;
    this.searchText = value?.trim() || "";
    this.loadData();
  }
  sortData(value: Sort | any) {}
  pageChanged($event: PageEvent | any) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.loadData();
  }
}

