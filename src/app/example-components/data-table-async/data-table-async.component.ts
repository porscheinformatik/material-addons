import { Component, OnInit } from '@angular/core';
import { DataTableColumn } from '@porscheinformatik/material-addons';
import { exampleData } from '../data-table-example-data/data-table-example-data';
import { exampleColumns } from '../data-table-example-data/data-table-example-columns';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';

export class FakePage {
  data: any[];
  page: PageEvent;
}

@Component({
  selector: 'app-data-table-async',
  templateUrl: './data-table-async.component.html',
  styleUrls: ['./data-table-async.component.scss'],
})
export class DataTableAsyncComponent implements OnInit {
  loading = false;
  filterEnabled = true;

  displayedColumns: DataTableColumn[] = exampleColumns;
  tableData: any[];

  page: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 100,
  };

  sort: Sort = {
    active: 'name',
    direction: 'asc',
  };

  constructor() {}

  static compare(a: Record<string, any>, b: Record<string, any>, sort: Sort): number {
    const firstData = a[sort.active];
    const secondData = b[sort.active];
    const ascending = sort.direction === 'asc';
    if (typeof firstData === 'number') {
      return ascending ? firstData - secondData : secondData - firstData;
    } else {
      return ascending ? firstData.localeCompare(secondData) : secondData.localeCompare(firstData);
    }
  }

  ngOnInit(): void {
    this.onLoad(this.page, this.sort);
  }

  handleSortEvent(sort: Sort): void {
    this.onLoad(this.page, sort);
  }

  handlePageEvent(page: PageEvent): void {
    this.onLoad(page, this.sort);
  }

  onLoad(requestedPage: PageEvent, sort: Sort) {
    this.loading = true;
    this.callFakeRequest(requestedPage, sort).subscribe(result => {
      this.page = result.page;
      this.tableData = result.data;
      this.loading = false;
      this.sort = sort;
    });
  }

  callFakeRequest(requestedPage: PageEvent, sort: Sort): Observable<FakePage> {
    const start = requestedPage.pageIndex * requestedPage.pageSize;
    const end = start + requestedPage.pageSize;
    const sortedData = this.getSortedData(sort);
    // instant result from sample data
    const fakeResult: FakePage = {
      data: sortedData.slice(start, end),
      page: {
        pageIndex: requestedPage.pageIndex,
        pageSize: requestedPage.pageSize,
        length: requestedPage.length,
      },
    };
    // simulate 1 sec of request loading time
    return of(fakeResult).pipe(delay(1000));
  }

  getSortedData(sort: Sort): any[] {
    return [...exampleData].sort((a, b) => DataTableAsyncComponent.compare(a, b, sort));
  }
}
