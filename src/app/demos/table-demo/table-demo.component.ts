import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import {merge, Observable, of, Subscription} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ToolbarService} from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-table-demo',
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.scss'],
})
export class TableDemoComponent implements OnInit, OnDestroy {
  static ALL_COLS = ['name', 'visible', 'visibleFrom', 'visibleUntil', 'specialCode', 'secondCode'];
  static MOBILE_COLS = ['name'];

  displayedColumns = TableDemoComponent.ALL_COLS;
  breakpointSubscription: Subscription;

  // any because data and criteria can be anything --> just for purpose of the example
  criteria: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  searchPressed = new EventEmitter<boolean>();

  data: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  isLoadingResults = true;
  resultsTotalLength = 0;
  pageSize = 20;
  sortActive = 'name';
  sortDir: SortDirection = 'asc';

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));

  constructor(private toolbarService: ToolbarService, private breakpointObserver: BreakpointObserver) {
    this.criteria.visibleOnly = true;
  }

  ngOnInit(): void {
    this.pageSize = 20;

    this.toolbarService.addMainAction({
      i18nActionKey: 'tableDemo.new',
      matIcon: 'add',
      routerLink: '/tableDemo/new',
      liftHigherOnMobile: true,
      showIf: of(true),
    });

    this.toolbarService.addToolbarAction({
      matIcon: 'cloud_download',
      i18nActionKey: 'Download data',
      action: () => {
        alert('Exceeeeeel ');
      },
    });

    this.toolbarService.addToolbarAction({
      matIcon: 'face',
      i18nActionKey: 'Another action',
      action: () => {
        alert('Wow! ');
      },
    });

    this.toolbarService.addToolbarAction({
      matIcon: 'add_alarm',
      i18nActionKey: 'Even more!',
      action: () => {
        alert('Wow! ');
      },
    });

    this.breakpointSubscription = this.breakpointObserver.observe(Breakpoints.Handset).subscribe(value => {
      if (value.matches) {
        this.displayedColumns = TableDemoComponent.MOBILE_COLS;
        this.pageSize = 10;
      } else {
        this.displayedColumns = TableDemoComponent.ALL_COLS;
      }
    });

    this.subscribeToPromotions();
  }

  ngOnDestroy(): void {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  doSearch(): void {
    this.searchPressed.emit(true);
  }

  clearSearch(): void {
    delete this.criteria.name;
    delete this.criteria.bonusCode;
    delete this.criteria.variaCode;
    this.criteria.visibleOnly = true;
    this.sort.direction = 'asc';
    this.sort.active = 'name';
    this.sortActive = this.sort.active;
    this.sortDir = this.sort.direction;

    this.doSearch();
  }

  onPaginatorChange(event: PageEvent): void {
    this.criteria.pageSize = event.pageSize;
    this.criteria.page = event.pageIndex;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateContent(size: number): Observable<{ totalElements: number; content: any }> {
    const cont = [];

    for (let i = 0; i < size; i++) {
      cont.push({
        id: i,
        name: 'Demo content ' + i,
        visible: true,
        visibleFrom: '2019-01-01',
        visibleUntil: '2999-12-31',
        specialCode: 'SPE' + i,
        secondCode: 'SEC' + i,
      });
    }

    return of({
      totalElements: cont.length,
      content: cont,
    });
  }

  private subscribeToPromotions(): void {
    // If the user changes the sort order or search criteria, reset back to the first page.
    this.sort.direction = this.sortDir; // 'asc';
    this.sort.active = this.sortActive; // 'name';

    merge(this.sort.sortChange, this.searchPressed).subscribe(() => {
      this.paginator.pageIndex = 0;
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.sort = this.sort.active;
      this.criteria.sortDirection = this.sort.direction;
    });

    merge(this.sort.sortChange, this.paginator.page, this.searchPressed)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          this.criteria.page = this.paginator.pageIndex;
          this.criteria.pageSize = this.paginator.pageSize ? this.paginator.pageSize : this.pageSize;

          this.criteria.sort = this.sort.active;
          this.criteria.sortDirection = this.sort.direction;
          return this.generateContent(this.criteria.pageSize);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsTotalLength = data.totalElements;
          return data.content;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        }),
      )
      .subscribe(data => (this.data = data));
  }
}
