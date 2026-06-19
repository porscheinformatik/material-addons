import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { DataTableFilter } from './data-table-filter.directive';
import { DataTableFilterHeader } from './data-table-filter-header.directive';

@Component({
  selector: 'mad-data-table-filter-header-test-host',
  imports: [DataTableFilter, DataTableFilterHeader, MatSortModule, MatTableModule],
  template: `
    <table mat-table [dataSource]="rows" matSort madFilter (matSortChange)="sortEvents.push($event)">
      <ng-container matColumnDef="age">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header="age"
          arrowPosition="before"
          mad-filter-header="age"
          [madFilterColumnRightAligned]="true"
        >
          Age
        </th>
        <td mat-cell *matCellDef="let row">{{ row.age }}</td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef mad-filter-header="status">Status</th>
        <td mat-cell *matCellDef="let row">{{ row.status }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
})
class DataTableFilterHeaderTestHostComponent {
  readonly displayedColumns = ['age', 'status'];
  readonly rows = [{ age: 31, status: 'active' }];
  readonly sortEvents: Sort[] = [];
}

describe('DataTableFilterHeader', () => {
  let fixture: ComponentFixture<DataTableFilterHeaderTestHostComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableFilterHeaderTestHostComponent, NoopAnimationsModule, TranslateModule.forRoot()],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    fixture = TestBed.createComponent(DataTableFilterHeaderTestHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('places the filter component inside the Material sort header container before the sort arrow', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const ageHeader = nativeElement.querySelector('th[aria-sort]') as HTMLElement;
    const sortContainer = ageHeader.querySelector('.mat-sort-header-container');
    const sortContent = sortContainer?.querySelector('.mat-sort-header-content');
    const filterComponent = sortContainer?.querySelector('mad-data-table-filter');
    const sortArrow = sortContainer?.querySelector('.mat-sort-header-arrow');

    expect(sortContainer).not.toBeNull();
    expect(sortContent).not.toBeNull();
    expect(filterComponent).not.toBeNull();
    expect(sortArrow).not.toBeNull();
    expect(Array.from(sortContainer!.children)).toEqual([sortContent, filterComponent, sortArrow]);
  });

  it('keeps filter-only headers outside Material sort header markup', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const statusHeader = nativeElement.querySelector('th.mat-column-status') as HTMLElement;

    expect(statusHeader.querySelector('.mat-sort-header-container')).toBeNull();
    expect(statusHeader.querySelector('mad-data-table-filter')).not.toBeNull();
  });

  it('does not sort when the filter icon is clicked but keeps header sorting active', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const ageHeader = nativeElement.querySelector('th[aria-sort]') as HTMLElement;
    const filterIcon = ageHeader.querySelector('mad-data-table-filter mat-icon') as HTMLElement;
    const sortContent = ageHeader.querySelector('.mat-sort-header-content') as HTMLElement;

    filterIcon.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.sortEvents).toEqual([]);

    sortContent.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.sortEvents).toEqual([{ active: 'age', direction: 'asc' }]);
  });
});
