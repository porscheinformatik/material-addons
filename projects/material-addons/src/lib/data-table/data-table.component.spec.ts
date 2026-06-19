import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { MatMenuModule } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { exampleData } from '../../../../../src/app/example-components/data-table-example-data/data-table-example-data';
import { exampleColumns } from '../../../../../src/app/example-components/data-table-example-data/data-table-example-columns';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DataTableAction } from './configuration/data-table-action';
import { DataTableRow } from './configuration/data-table-row';
import { DataTableColumnDefinition, DataTableColumnDefinitionChange } from './configuration/data-table-column-definition';
import { DataTableColumnsModalComponent } from './data-table-columns-modal/data-table-columns-modal.component';
import { DataTableTemplateExpandableColumnDefinition } from './data-table-template/data-table-template-expandable-column-definition.directive';
import { DataTableTemplateExpandableCellDefinition } from './data-table-template/data-table-template-expandable-cell-definition.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonModule } from '../button/button.module';
import { of } from 'rxjs';
import { DataTableActionType } from './configuration/data-table-action-type';
import { DataTableDataUtil } from './util/data-table-data-util';
import { DataTableSortUtil } from './util/data-table-sort-util';
import { MAD_DATA_TABLE_GLOBAL_CONFIGURATION } from './configuration/data-table-global-configuration';
import { MatDialog } from '@angular/material/dialog';

const mockDataTableAction: DataTableAction = {
  label: 'Test Label',
  action: 'Test Action',
  type: 'SINGLE',
};

const mockPageEvent: PageEvent = {
  length: 100,
  pageIndex: 1,
  pageSize: 10,
} as PageEvent;

const actionsMock: DataTableAction[] = [
  {
    label: 'Edit',
    action: 'EDIT',
    type: 'SINGLE',
  },
  {
    label: 'Delete',
    action: 'DELETE',
    type: 'SINGLE',
  },
  {
    label: 'Create',
    action: 'CREATE',
    type: 'NONE',
  },
  {
    label: 'Batch',
    action: 'BATCH',
    type: 'BATCH',
    hiddenInMode: '',
  },
];

const columnDefinitions: DataTableColumnDefinition[] = [
  {
    id: '12345678-default',
    label: 'Default',
    displayedColumns: exampleColumns,
  },
  {
    id: '87654321-company',
    label: 'Settings 1',
    editable: true,
    displayedColumns: [
      {
        id: '0002-Name',
        label: 'Name',
        isSortable: true,
        orderByName: 'name',
        dataPropertyName: 'name',
      },
      {
        id: '0005-Salary',
        label: 'Salary',
        orderByName: 'salary',
        dataPropertyName: 'salary',
        isRightAligned: true,
        isSortable: true,
      },
      {
        id: '0003-Gender',
        label: 'Gender',
        orderByName: 'gender',
        dataPropertyName: 'gender',
      },
      {
        id: '0001-Title',
        label: 'Title',
        isSortable: true,
        orderByName: 'title',
        dataPropertyName: 'title',
      },
    ],
  },
  {
    id: 'user-123',
    label: 'Other settings',
    editable: true,
    displayedColumns: [
      {
        id: '0006-Email',
        label: 'Email',
        orderByName: 'email',
        dataPropertyName: 'email',
      },
      {
        id: '0002-Name',
        label: 'Name',
        isSortable: true,
        orderByName: 'name',
        dataPropertyName: 'name',
      },
    ],
  },
];

const dateTimeFormat = ['dd.MM.yyyy', 'dd.MM.yyyy hh:mm:ss'];
const numberFormat = {
  decimalSeparator: ',',
  groupingSeparator: '.',
  units: ['€', '$'],
};

@Component({
  selector: 'mad-data-table-expandable-test-host',
  imports: [DataTableComponent, DataTableTemplateExpandableColumnDefinition, DataTableTemplateExpandableCellDefinition],
  template: `
    <mad-data-table [displayedColumns]="displayedColumns" [tableData]="tableData" [translateLabels]="false">
      <ng-container madExpandableColumnDef="activity">
        <section *madExpandableCellDef="let element" class="test-expanded-content">{{ element.name }} activity</section>
      </ng-container>
    </mad-data-table>
  `,
})
class DataTableExpandableTestHostComponent {
  readonly displayedColumns = [
    {
      id: 'name',
      label: 'Name',
      dataPropertyName: 'name',
    },
  ];
  readonly tableData = [{ id: '1', name: 'Angela Cortes' }];
}

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  const dialogMock = {
    open: jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue({
        subscribe: jest.fn(),
      }),
    }),
  };

  const mockChangeDetectorRef = {
    detectChanges: jest.fn(),
    markForCheck: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatMenuModule,
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        ButtonModule,
        MatFormFieldModule,
        TranslateModule.forRoot(),
        DragDropModule,
        DataTableComponent,
        DataTableExpandableTestHostComponent,
        DataTableColumnsModalComponent,
      ],
      providers: [
        MatPaginator,
        MatPaginatorIntl,
        MatSort,
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
        { provide: MatDialog, useValue: dialogMock },
        {
          provide: MAD_DATA_TABLE_GLOBAL_CONFIGURATION,
          useValue: {
            dateTimeFormat: dateTimeFormat,
            numberFormat: numberFormat,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
  });

  function setInput<T>(name: string, value: T): void {
    fixture.componentRef.setInput(name, value);
    fixture.detectChanges();
  }

  function setInputs(values: Record<string, unknown>): void {
    Object.entries(values).forEach(([name, value]) => fixture.componentRef.setInput(name, value));
    fixture.detectChanges();
  }

  it('should create DataTableComponent', () => {
    setInputs({
      tableData: exampleData,
      displayedColumns: exampleColumns,
      paginationEnabled: true,
      filterEnabled: true,
    });

    expect(component).toBeTruthy();
  });

  it('should create data source', () => {
    setInputs({
      displayedColumns: exampleColumns,
      paginationEnabled: true,
      filterEnabled: true,
      tableData: exampleData,
    });

    expect(component).toBeTruthy();
    expect(component.dataSource).toBeDefined();
    expect(component.dataSource.data.length).toEqual(exampleData.length);
  });

  it('should replace controlled selection input after a row is selected', () => {
    setInputs({
      displayedColumns: exampleColumns,
      tableData: exampleData,
      idGenerator: (data: any) => data.id,
      selection: [exampleData[1].id.toString()],
    });

    expect(component.isSelected(exampleData[1].id.toString())).toBe(true);

    setInput('selection', [exampleData[2].id.toString()]);

    expect(component.isSelected(exampleData[1].id.toString())).toBe(false);
    expect(component.isSelected(exampleData[2].id.toString())).toBe(true);
  });

  it('should clear controlled selection input after a row is selected', () => {
    setInputs({
      displayedColumns: exampleColumns,
      tableData: exampleData,
      idGenerator: (data: any) => data.id,
      selection: [exampleData[1].id.toString()],
    });

    expect(component.isSelected(exampleData[1].id.toString())).toBe(true);

    setInput('selection', []);

    expect(component.isSelected(exampleData[1].id.toString())).toBe(false);
  });

  it('should keep controlled selection when forceSelectionMode is provided', () => {
    setInputs({
      displayedColumns: exampleColumns,
      tableData: exampleData,
      idGenerator: (data: any) => data.id,
      selection: [exampleData[1].id.toString()],
      forceSelectionMode: 'SINGLE',
    });

    expect(component.isSelected(exampleData[1].id.toString())).toBe(true);
  });

  it('should keep controlled selection when deprecated forceMode is provided', () => {
    setInputs({
      displayedColumns: exampleColumns,
      tableData: exampleData,
      idGenerator: (data: any) => data.id,
      selection: [exampleData[1].id.toString()],
      forceMode: 'SINGLE',
    });

    expect(component.isSelected(exampleData[1].id.toString())).toBe(true);
  });

  it('should let persistenceConfig override deprecated stateful when both inputs are provided', () => {
    setInputs({
      stateful: true,
      persistenceConfig: {
        persistSort: false,
        persistFilter: true,
        persistPageSize: false,
      },
    });

    expect(component.effectivePersistenceConfig()).toEqual({
      persistSort: false,
      persistFilter: true,
      persistPageSize: false,
    });
  });

  it('should let filterMode override deprecated filterEnabled when both inputs are provided', () => {
    setInputs({
      filterEnabled: true,
      filterMode: 'COLUMN_BASED',
    });

    expect(component.filterMode).toEqual('COLUMN_BASED');
  });

  it('should expose legacy instance-readable derived state properties', () => {
    setInputs({
      displayedColumns: exampleColumns,
      tableData: exampleData,
      filterMode: 'COLUMN_BASED',
      paginationEnabled: true,
      page: mockPageEvent,
      actions: actionsMock,
      forceSelectionMode: 'SINGLE',
      columnDefinitions,
    });

    expect(component.filterMode).toEqual('COLUMN_BASED');
    expect(component.pageIndex).toEqual(mockPageEvent.pageIndex);
    expect(component.pageSize).toEqual(mockPageEvent.pageSize);
    expect(component.pageLength).toEqual(mockPageEvent.length);
    expect(component.selectionMode).toEqual('SINGLE');
    expect(component.selectionEmitMode).toEqual('ON_ACTION');
    expect(component.columns).toEqual(exampleColumns);
    expect(component.columnIds).toEqual([component.ACTION_COLUMN_NAME, ...exampleColumns.map((column) => column.id)]);
    expect(component.rowActions).toHaveLength(2);
    expect(component.tableActions).toHaveLength(1);
    expect(component.editableColumnDefinitions).toEqual(columnDefinitions.filter((definition) => definition.editable));
    expect(component.viewableColumnDefinitions).toEqual(columnDefinitions.filter((definition) => definition.displayedColumns?.length > 0));
  });

  it('should render the delete filter badge without Angular Material aria-hidden warnings', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    try {
      setInputs({
        displayedColumns: exampleColumns,
        tableData: exampleData,
        filterMode: 'COLUMN_BASED',
      });

      const deleteFilterButton = fixture.nativeElement.querySelector('.delete-filter-action') as HTMLButtonElement;

      expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('Detected a matBadge on an "aria-hidden"'));
      expect(deleteFilterButton.getAttribute('aria-label')).toEqual('common.filter.delete.tooltip');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('renders Tailwind utility classes for internal static table layout styles', () => {
    setInputs({
      displayedColumns: exampleColumns,
      tableData: exampleData,
      paginationEnabled: true,
      loading: true,
      tableClass: 'datatable-max-height custom-table-class',
    });

    const nativeElement = fixture.nativeElement as HTMLElement;
    const actionBar = nativeElement.querySelector('[data-cy="table-action-bar"]');
    const tableContainer = nativeElement.querySelector('.datatable');
    const spinnerWrapper = nativeElement.querySelector('.mad-datatable-spinner-wrapper');
    const bottomArea = nativeElement.querySelector('[data-cy="table-bottom-area"]');
    const definitionBlock = nativeElement.querySelector('[data-cy="definition-button-block"]');

    expect(actionBar?.classList.contains('flex')).toBe(true);
    expect(actionBar?.classList.contains('justify-between')).toBe(true);
    expect(tableContainer?.classList.contains('overflow-auto')).toBe(true);
    expect(tableContainer?.classList.contains('relative')).toBe(true);
    expect(tableContainer?.classList.contains('datatable-max-height')).toBe(true);
    expect(tableContainer?.classList.contains('custom-table-class')).toBe(true);
    expect(spinnerWrapper?.classList.contains('absolute')).toBe(true);
    expect(spinnerWrapper?.classList.contains('[pointer-events:unset]')).toBe(true);
    expect(bottomArea?.classList.contains('flex')).toBe(true);
    expect(definitionBlock?.classList.contains('flex-1')).toBe(true);
  });

  it('renders sort and column filter controls together for right-aligned sortable filter headers', () => {
    setInputs({
      tableData: exampleData,
      displayedColumns: [
        {
          id: 'age',
          label: 'Age',
          dataPropertyName: 'age',
          isSortable: true,
          isFilterable: true,
          isRightAligned: true,
        },
      ],
      filterMode: 'COLUMN_BASED',
      paginationEnabled: false,
      translateLabels: false,
    });

    const nativeElement = fixture.nativeElement as HTMLElement;
    const ageHeader = nativeElement.querySelector('th.mat-column-age') as HTMLElement;
    const sortContainer = ageHeader.querySelector('.mat-sort-header-container');
    const sortContent = sortContainer?.querySelector('.mat-sort-header-content');
    const filterComponent = sortContainer?.querySelector('mad-data-table-filter');
    const sortArrow = sortContainer?.querySelector('.mat-sort-header-arrow');

    expect(sortContainer).not.toBeNull();
    expect(Array.from(sortContainer!.children)).toEqual([sortContent, filterComponent, sortArrow]);
  });

  it('should toggle the expandable area CSS state class when a row expands', () => {
    const hostFixture = TestBed.createComponent(DataTableExpandableTestHostComponent);

    hostFixture.detectChanges();

    const nativeElement = hostFixture.nativeElement as HTMLElement;
    const expandableArea = nativeElement.querySelector('.mad-data-table-expandable-area') as HTMLElement;
    const expandButton = nativeElement.querySelector('.row-action-cell mad-icon-button button') as HTMLButtonElement;

    expect(expandableArea).toBeTruthy();
    expect(expandableArea.classList.contains('mad-data-table-expandable-area-expanded')).toBe(false);
    expect(expandButton).toBeTruthy();

    expandButton.click();
    hostFixture.detectChanges();

    expect(expandableArea.classList.contains('mad-data-table-expandable-area-expanded')).toBe(true);
  });

  it('should let forceSelectionMode override deprecated forceMode when both inputs are provided', () => {
    setInputs({
      forceMode: 'BATCH',
      forceSelectionMode: 'SINGLE',
    });

    expect(component.selectionMode).toEqual('SINGLE');
  });

  it('should not let deprecated forceMode force ON_ACTION when forceSelectionMode is provided', () => {
    setInputs({
      forceMode: 'BATCH',
      forceSelectionMode: 'SINGLE',
    });

    expect(component.selectionMode).toEqual('SINGLE');
    expect(component.selectionEmitMode).toEqual('NONE');
  });

  it('should create component in BATCH mode, because actions contains BATCH action', () => {
    setInput('actions', actionsMock);

    expect(component.selectionMode).toEqual('BATCH');
    expect(component['defaultAction']).toBeUndefined();
  });

  it('should create component in SINGLE mode, because actions contains SINGLE action', () => {
    setInput('actions', [mockDataTableAction]);

    expect(component.selectionMode).toEqual('SINGLE');
    expect(component['defaultAction']).toEqual(mockDataTableAction);
  });

  it('should create component in NONE mode, because actions are empty', () => {
    expect(component.selectionEmitMode).toEqual('NONE');
    expect(component['defaultAction']).toBeUndefined();
  });

  it('should create component with provided force mode (ex SINGLE)', () => {
    setInput('forceSelectionMode', 'SINGLE');

    expect(component.selectionMode).toEqual('SINGLE');
    expect(component['defaultAction']).toBeUndefined();
  });

  describe('onSortingEvent', () => {
    it('should emit sortEvent when onSortingEvent is called and useAsync is true', () => {
      setInput('useAsync', true);
      const expectedSort: Sort = { active: 'name', direction: 'desc' };
      jest.spyOn(component.sortEvent, 'emit');
      component.onSortingEvent(expectedSort);

      expect(component.sortEvent.emit).toHaveBeenCalledTimes(1);
      expect(component.sortEvent.emit).toHaveBeenCalledWith(expectedSort);
    });

    it('should sort data internally when onSortingEvent is called and useAsync is false', () => {
      const initialData: any[] = [
        { id: 1, name: 'Zebra' },
        { id: 2, name: 'Alligator' },
        { id: 3, name: 'Moose' },
      ];
      const expectedData: any[] = [
        { id: 2, name: 'Alligator' },
        { id: 3, name: 'Moose' },
        { id: 1, name: 'Zebra' },
      ];
      setInput('useAsync', false);
      component['_sort'] = new MatSort();
      component.ngAfterViewInit();

      const actualData = component.dataSource
        .sortData(initialData, { active: 'name', direction: 'asc' } as MatSort)
        .map((it: any) => ({ id: it.id, name: it.name }));
      expect(actualData).toEqual(expectedData);
      expect(actualData).not.toEqual(initialData);
    });

    it('should apply default sort when MatSort becomes available after sort initialization', () => {
      const expectedSort: Sort = { active: 'name', direction: 'asc' };
      const matSort = new MatSort();

      component['_sort'] = null;
      component['setSort'](expectedSort);
      expect(component['_pendingSort']).toEqual(expectedSort);

      component['_sort'] = matSort;
      component['applyPendingSort']();

      expect(component['_pendingSort']).toBeNull();
      expect(matSort.active).toEqual(expectedSort.active);
      expect(matSort.direction).toEqual(expectedSort.direction);
    });

    // add sorting by dates after upgrade
  });

  describe('actionEvent', () => {
    it('should emit actionEvent when onTableAction is called with a tableAction', () => {
      const mockRowMap = new Map<string, DataTableRow>();
      const row1: DataTableRow = { id: '1', actualData: { id: '1', name: 'Test1' }, displayedData: null };
      const row2: DataTableRow = { id: '2', actualData: { id: '2', name: 'Test2' }, displayedData: null };
      mockRowMap.set('1', row1);
      mockRowMap.set('2', row2);
      setInput('selectionEmitMode', 'ON_ACTION');
      component['_rowMap'] = mockRowMap;
      const mockSelected = ['1', '2'];
      component['_selectionModel'] = {
        selected: mockSelected,
      } as SelectionModel<any>;
      const fakeDataTableAction: DataTableAction = mockDataTableAction;
      jest.spyOn(component.actionEvent, 'emit');
      component.onActionEvent(fakeDataTableAction);

      expect(component.actionEvent.emit).toHaveBeenCalledTimes(1);
      expect(component.actionEvent.emit).toHaveBeenCalledWith({
        ...fakeDataTableAction,
        selected: [row1.actualData, row2.actualData],
      });
    });

    // new "idGenerator" is improved - not found by id -> use actual data to compare
    it('should emit actionEvent when onTableAction is called with a tableAction and idGenerator is a function', () => {
      const mockSelected = [
        { id: '1', name: 'Test1' },
        { id: '2', name: 'Test2' },
      ];
      setInput('selectionEmitMode', 'ON_ACTION');
      setInput('idGenerator', (data: any) => data.id + '_generated');
      component['_selectionModel'] = {
        selected: mockSelected,
      } as SelectionModel<any>;
      const fakeDataTableAction: DataTableAction = mockDataTableAction;
      jest.spyOn(component.actionEvent, 'emit');
      component.onActionEvent(fakeDataTableAction);

      expect(component.actionEvent.emit).toHaveBeenCalledTimes(1);
      expect(component.actionEvent.emit).toHaveBeenCalledWith({
        ...fakeDataTableAction,
        selected: mockSelected,
      });
    });

    const mockRow: { rowId: string; parentId?: string } = {
      rowId: '1',
    };

    it('should not emit actionEvent when "BATCH" mode is selected', () => {
      setInput('forceSelectionMode', 'BATCH');
      setInput('selectionEmitMode', 'ON_ACTION');
      jest.spyOn(component['_selectionModel'], 'toggle');
      jest.spyOn(component.actionEvent, 'emit');
      component.onRowEvent(new MouseEvent('click'), mockRow, mockDataTableAction);

      expect(component['_selectionModel'].toggle).toHaveBeenCalledTimes(1);
      expect(component['_selectionModel'].toggle).toHaveBeenCalledWith(mockRow.rowId);
      expect(component.actionEvent.emit).not.toHaveBeenCalled();
    });

    it('should not emit actionEvent when "NONE" mode is selected', () => {
      setInput('selectionEmitMode', 'NONE');
      const actionEventSpy = jest.spyOn(component.actionEvent, 'emit');
      component.onRowEvent(new MouseEvent('click'), mockRow, mockDataTableAction);

      expect(actionEventSpy).not.toHaveBeenCalled();
    });

    it('should emit actionEvent with actualData when "SINGLE" mode is selected', () => {
      setInput('forceSelectionMode', 'SINGLE');
      setInput('selectionEmitMode', 'ON_ACTION');
      const mockRowMap = new Map<string, DataTableRow>();
      const row1: DataTableRow = { id: '1', actualData: { id: '1', name: 'Test1' }, displayedData: null };
      const row2: DataTableRow = { id: '2', actualData: { id: '2', name: 'Test2' }, displayedData: null };
      mockRowMap.set('1', row1);
      mockRowMap.set('2', row2);
      component['_rowMap'] = mockRowMap;
      jest.spyOn(component.actionEvent, 'emit');
      component.onRowEvent(new MouseEvent('click'), mockRow, mockDataTableAction);

      expect(component.actionEvent.emit).toHaveBeenCalledTimes(1);
      expect(component.actionEvent.emit).toHaveBeenCalledWith({
        ...mockDataTableAction,
        selected: [row1.actualData],
      });
    });
  });

  it('should emit pageEvent when useAsync is true', () => {
    setInput('useAsync', true);
    jest.spyOn(component.pageEvent, 'emit');
    component.onPageEvent(mockPageEvent);

    expect(component.pageEvent.emit).toHaveBeenCalledTimes(1);
    expect(component.pageEvent.emit).toHaveBeenCalledWith(mockPageEvent);
  });

  it('should not emit pageEvent when useAsync is false', () => {
    setInput('useAsync', false);
    jest.spyOn(component.pageEvent, 'emit');
    component.onPageEvent(mockPageEvent);

    expect(component.pageEvent.emit).not.toHaveBeenCalled();
  });

  it('should emit allColumnsEvent when columnDefinition is not provided', () => {
    jest.spyOn(component.allColumnsEvent, 'emit');
    component.onColumnSettings();

    expect(component['_showColumnModal']).toBeTruthy();
    expect(component['selectedColumnDefinition']()).toBeUndefined();
    expect(component.allColumnsEvent.emit).toHaveBeenCalledTimes(1);
  });

  //check checkboxes and check selectionModel

  it('should emit allColumnsEvent when columnDefinition is provided', () => {
    setInput('columnDefinitions', columnDefinitions);
    jest.spyOn(component.allColumnsEvent, 'emit');
    component.onColumnSettings();

    expect(component['_showColumnModal']).toBeTruthy();
    expect(component['selectedColumnDefinition']()).not.toBeNull();
    expect(component['selectedColumnDefinition']()).toEqual(columnDefinitions[0]);
    expect(component.allColumnsEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('should not emit allColumnsEvent when allColumns is provided', () => {
    setInput('allColumns', exampleColumns);
    jest.spyOn(component.allColumnsEvent, 'emit');
    component.onColumnSettings();

    expect(component['_showColumnModal']).toBeTruthy();
    expect(component['selectedColumnDefinition']()).toBeUndefined();
    expect(component.allColumnsEvent.emit).not.toHaveBeenCalled();
  });

  it('should emit columnDefinitionChangeEvent when dialog closed with result', () => {
    setInputs({
      columnDefinitions,
      allColumns: exampleColumns,
    });
    const mockCloseModalResult: DataTableColumnDefinitionChange = {
      action: 'SAVE',
      definition: columnDefinitions[0],
    };
    const mockDialogRef = { afterClosed: jest.fn().mockReturnValue(of(mockCloseModalResult)) };
    jest.spyOn((component as any).matDialog, 'open').mockReturnValue(mockDialogRef as any);
    const emitSpy = jest.spyOn(component.columnDefinitionChangeEvent, 'emit');
    component.onColumnSettings(); //calls openColumnModal

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(mockCloseModalResult);
  });

  it('should open the column definition modal with responsive dialog sizing', () => {
    setInputs({
      columnDefinitions,
      allColumns: exampleColumns,
    });
    const mockDialogRef = { afterClosed: jest.fn().mockReturnValue(of(undefined)) };
    const openSpy = jest.spyOn((component as any).matDialog, 'open').mockReturnValue(mockDialogRef as any);

    component.onColumnSettings();

    expect(openSpy).toHaveBeenCalledWith(
      DataTableColumnsModalComponent,
      expect.objectContaining({
        width: '720px',
        maxWidth: 'calc(100vw - 32px)',
      }),
    );
  });

  it('should emit viewDefinitionChangeEvent when onViewDefinition is called', () => {
    setInput('columnDefinitions', columnDefinitions);
    const emitSpy = jest.spyOn(component.viewDefinitionChangeEvent, 'emit');
    component.onViewDefinition(component.viewableColumnDefinitions[0]);

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(component.viewableColumnDefinitions[0]);
  });

  it('should call setFilterValue when a filterValue is set and dataSource provided', () => {
    const initialData: any[] = [
      { id: 1, name: 'Zebra' },
      { id: 2, name: 'Alligator' },
      { id: 3, name: 'Moose' },
    ];
    const expectedData: any[] = [{ id: 2, name: 'Alligator' }];
    setInputs({
      displayedColumns: [
        {
          id: 'name',
          label: 'Name',
          dataPropertyName: 'name',
        },
      ],
      tableData: initialData,
    });
    const setFilterValueSpy = jest.spyOn(component as any, 'applyFilterValue');
    setInput('filterValue', 'Alli');

    expect(setFilterValueSpy).toHaveBeenCalledWith('Alli');
    expect(component.dataSource.filter).toEqual('alli');
    expect(component.dataSource.filteredData.map((data) => ({ id: data.id, name: data.name }))).toEqual(expectedData);
  });

  it('should apply the persisted column filter when filter state is initialized', () => {
    const persistedFilter = { name: 'Alli' };
    component.dataSource = new MatTableDataSource([]);
    const filterMock = {
      updateFilterables: jest.fn(),
    };
    jest.spyOn(component as any, 'filter').mockReturnValue(filterMock);
    jest.spyOn(component['persistenceService'], 'loadFilter').mockReturnValue(persistedFilter);

    component['initFilterState']();

    expect(filterMock.updateFilterables).toHaveBeenCalledWith(persistedFilter);
    expect(component.dataSource.filter).toEqual(JSON.stringify(persistedFilter));
  });

  it('should set forceMode without actions, call selectionModel clear and actions should be empty', () => {
    const modes = ['SINGLE', 'BATCH'];
    modes.forEach((mode) => {
      const selectionModelClearSpy = jest.spyOn(component['_selectionModel'], 'clear');
      setInput('forceMode', mode);

      expect(component.effectiveForceSelectionMode()).toEqual(mode);
      expect(component.selectionMode).toEqual(mode);
      expect(selectionModelClearSpy).toHaveBeenCalled();
      expect(component.rowActions).toHaveLength(0);
      expect(component.tableActions).toHaveLength(0);
    });
  });

  it('should contain correct table/row actions if set forceMode with actions', () => {
    const modes = ['SINGLE', 'BATCH', 'NONE'];
    setInput('actions', actionsMock);
    modes.forEach((mode) => {
      const selectionModelClearSpy = jest.spyOn(component['_selectionModel'], 'clear');
      setInput('forceMode', mode);

      if (mode === 'SINGLE' || mode === 'BATCH') {
        expect(selectionModelClearSpy).toHaveBeenCalled();
      }

      switch (mode) {
        case 'SINGLE':
          expect(component.effectiveForceSelectionMode()).toEqual(mode);
          expect(component.selectionMode).toEqual(mode);
          expect(component.rowActions).toHaveLength(2);
          expect(component.tableActions).toHaveLength(1);
          break;
        case 'BATCH':
          expect(component.effectiveForceSelectionMode()).toEqual(mode);
          expect(component.selectionMode).toEqual(mode);
          expect(component.rowActions).toHaveLength(0);
          expect(component.tableActions).toHaveLength(4);
          break;
        case 'NONE':
          expect(component.rowActions).toHaveLength(0);
          expect(component.tableActions).toHaveLength(4);
          break;
      }
    });
  });

  describe('onToggleSelectAll method', () => {
    it('should clear selectionModel, toggle allSelected and select all rows when allSelected is false', () => {
      const initialData: any[] = [
        { rowId: 1, id: 1, name: 'Zebra' },
        { rowId: 2, id: 2, name: 'Alligator' },
        { rowId: 3, id: 3, name: 'Moose' },
      ];
      component.dataSource = new MatTableDataSource(initialData);
      component.dataSource.sort = new MatSort();
      component.allSelected = false;
      const clearSpy = jest.spyOn(component['_selectionModel'], 'clear');
      const selectSpy = jest.spyOn(component['_selectionModel'], 'select');
      const getAllDataSourceRowsOfCurrentPageSpy = jest.spyOn(component, 'displayedData', 'get');
      component.onToggleSelectAll();

      expect(clearSpy).toHaveBeenCalled();
      expect(component.allSelected).toBeTruthy();
      expect(getAllDataSourceRowsOfCurrentPageSpy).toHaveBeenCalledTimes(1);
      expect(getAllDataSourceRowsOfCurrentPageSpy).toHaveReturnedWith(component.dataSource.data);

      expect(selectSpy).toHaveBeenNthCalledWith(1, 1);
      expect(selectSpy).toHaveBeenNthCalledWith(2, 2);
      expect(selectSpy).toHaveBeenNthCalledWith(3, 3);
    });

    it('should clear selectionModel, toggle allSelected to false and selection should be empty', () => {
      const initialData: any[] = [
        { rowId: 1, id: 1, name: 'Zebra' },
        { rowId: 2, id: 2, name: 'Alligator' },
        { rowId: 3, name: 'Moose' },
      ];
      component.dataSource = new MatTableDataSource(initialData);
      component.dataSource.sort = new MatSort();
      component.allSelected = true;
      const clearSpy = jest.spyOn(component['_selectionModel'], 'clear');
      const selectSpy = jest.spyOn(component['_selectionModel'], 'select');
      const getAllDataSourceRowsOfCurrentPageSpy = jest.spyOn(component, 'displayedData', 'get');
      component.onToggleSelectAll();

      expect(clearSpy).toHaveBeenCalled();
      expect(component.allSelected).toBeFalsy();
      expect(getAllDataSourceRowsOfCurrentPageSpy).not.toHaveBeenCalled();
      expect(selectSpy).not.toHaveBeenCalled();
    });
  });

  describe('getSelectedCount method', () => {
    it('should return empty string if actionType is not BATCH', () => {
      const actionType = 'SINGLE';
      const result = component.getSelectedCount(actionType);
      expect(result).toEqual('');
    });

    it('should return empty string if count is less than 2', () => {
      const actionType = DataTableActionType.BATCH;
      component['_selectionModel'].select('1');
      const result = component.getSelectedCount(actionType);

      expect(result).toEqual('');
    });

    it('should return string with count if actionType is BATCH and count is 2 or more', () => {
      const actionType = DataTableActionType.BATCH;
      component['_selectionModel'].select('1', '2');
      const expectedOutput = ` (2)`; // output string has a leading space
      const result = component.getSelectedCount(actionType);

      expect(result).toEqual(expectedOutput);
    });

    it('should handle case when selectionModel is null or undefined', () => {
      const actionType = DataTableActionType.BATCH;
      component['_selectionModel'] = null;
      const result = component.getSelectedCount(actionType);

      expect(result).toEqual('');
    });
  });

  describe('isSelected method', () => {
    beforeEach(() => {
      // reset selection before each test
      component['_selectionModel'].clear();
    });

    it.each([
      { rowId: '1', selectedRowIds: ['1', '2'], expectedIsSelected: true },
      { rowId: '2', selectedRowIds: ['1'], expectedIsSelected: false },
    ])(
      'for rowId $rowId, isSelected should return $expectedIsSelected when these rowIds are selected $selectedRowIds',
      ({ rowId, selectedRowIds, expectedIsSelected }) => {
        component['_selectionModel'].select(...selectedRowIds);
        const isSelectedSpy = jest.spyOn(component['_selectionModel'], 'isSelected');
        const result = component.isSelected(rowId);

        expect(result).toBe(expectedIsSelected);
        expect(isSelectedSpy).toHaveBeenCalledTimes(1);
        expect(isSelectedSpy).toHaveBeenCalledWith(rowId);
      },
    );
  });

  describe('isDisabled method', () => {
    const tests = [
      {
        description: 'should return true if actionType is SINGLE and selectedCount is not 1',
        actionType: 'SINGLE',
        selectedItems: ['1', '2'],
        expected: true,
      },
      {
        description: 'should return false if actionType is SINGLE and selectedCount is 1',
        actionType: 'SINGLE',
        selectedItems: ['1'],
        expected: false,
      },
      {
        description: 'should return true if actionType is BATCH and selectedCount is 0',
        actionType: 'BATCH',
        selectedItems: [],
        expected: true,
      },
      {
        description: 'should return false if actionType is BATCH and selectedCount is 1 or more',
        actionType: 'BATCH',
        selectedItems: ['1'],
        expected: false,
      },
      {
        description: 'should return false if actionType is not SINGLE or BATCH',
        actionType: 'NONE',
        selectedItems: ['1', '2'],
        expected: false,
      },
    ];

    tests.forEach(({ description, actionType, selectedItems, expected }) => {
      it(description, () => {
        component['_selectionModel'].clear();
        component['_selectionModel'].select(...selectedItems);
        const isDisabled = component.isDisabled({ type: actionType } as DataTableAction);

        expect(isDisabled).toEqual(expected);
      });
    });
  });

  describe('Simple component property bindings', () => {
    it('should set isLoading when loading Input property is set', () => {
      const isLoadingValue = true;
      setInput('loading', isLoadingValue);

      expect(component.loading()).toEqual(isLoadingValue);
    });

    // if no pagination we want to see all items
    it('should set paginatorPageSize when defaultPageSize Input property is set', () => {
      const defaultSizeValue = 10;
      setInputs({
        defaultPageSize: defaultSizeValue,
        paginationEnabled: true,
      });

      expect(component.pageSize).toEqual(defaultSizeValue);
    });

    it('should set extPaginator when externalPaginator Input property is set', () => {
      const paginatorValue = { pageIndex: 1, pageSize: 10 };
      setInput('externalPaginator', paginatorValue);

      expect(component.extPaginator).toEqual(paginatorValue);
    });

    it('should set extPaginator when externalPaginator Input property is set', () => {
      const paginatorValue = { pageIndex: 1, pageSize: 10 };
      setInput('externalPaginator', paginatorValue);

      expect(component.extPaginator).toEqual(paginatorValue);
    });

    it('displayedColumnDefinition should populate selectedColumnDefinition, columns, and columnIds with additional action column', () => {
      const def: DataTableColumnDefinition = columnDefinitions[0];
      setInput('displayedColumnDefinition', def);

      expect(component['selectedColumnDefinition']()).toEqual(def);
      expect(component.columns).toEqual(def.displayedColumns);
      expect(component.columnIds).toEqual([component.ACTION_COLUMN_NAME].concat(def.displayedColumns.map((column) => column.id)));
    });

    it('should set paginatorPageIndex, paginatorPageSize, and paginatorLength when page is set', () => {
      setInputs({
        page: mockPageEvent,
        paginationEnabled: true,
      });

      expect(component.pageIndex).toEqual(mockPageEvent.pageIndex);
      expect(component.pageSize).toEqual(mockPageEvent.pageSize);
      expect(component.pageLength).toEqual(mockPageEvent.length);
    });
  });

  describe('isCurrentDefinition', () => {
    it('should return true if the selected definition id matches the provided definition id', () => {
      const definition = columnDefinitions[0];
      component['selectedColumnDefinition'].set(columnDefinitions[0]);

      expect(component.isCurrentDefinition(definition)).toBeTruthy();
    });

    it('should return false if the selected definition id does not match the provided definition id', () => {
      const definition = columnDefinitions[0];
      component['selectedColumnDefinition'].set(columnDefinitions[2]);

      expect(component.isCurrentDefinition(definition)).toBeFalsy();
    });

    it('should return false if no selected definition is set', () => {
      const definition = columnDefinitions[0];
      component['selectedColumnDefinition'].set(undefined);

      expect(component.isCurrentDefinition(definition)).toBeFalsy();
    });
  });

  describe('DataTableComponent static methods', () => {
    it('should compare number types correctly', () => {
      const a = { sortKey: 5 };
      const b = { sortKey: 12 };
      const ascSort: Sort = { active: 'sortKey', direction: 'asc' };
      const descSort: Sort = { active: 'sortKey', direction: 'desc' };

      expect(DataTableSortUtil.compare(a, b, ascSort, dateTimeFormat, numberFormat)).toBeLessThan(0);
      expect(DataTableSortUtil.compare(a, b, descSort, dateTimeFormat, numberFormat)).toBeGreaterThan(0);
    });

    it('should compare string types correctly', () => {
      const a = { sortKey: 'apple' };
      const b = { sortKey: 'banana' };
      const ascSort: Sort = { active: 'sortKey', direction: 'asc' };
      const descSort: Sort = { active: 'sortKey', direction: 'desc' };

      expect(DataTableSortUtil.compare(a, b, ascSort, dateTimeFormat, numberFormat)).toBeLessThan(0);
      expect(DataTableSortUtil.compare(a, b, descSort, dateTimeFormat, numberFormat)).toBeGreaterThan(0);
    });

    it('should compare boolean types correctly', () => {
      const a = { sortKey: false };
      const b = { sortKey: true };
      const c = { sortKey: true };
      const ascSort: Sort = { active: 'sortKey', direction: 'asc' };
      const descSort: Sort = { active: 'sortKey', direction: 'desc' };

      expect(DataTableSortUtil.compare(a, b, ascSort, dateTimeFormat, numberFormat)).toBeGreaterThan(0);
      expect(DataTableSortUtil.compare(a, b, descSort, dateTimeFormat, numberFormat)).toBeLessThan(0);
      expect(DataTableSortUtil.compare(b, c, descSort, dateTimeFormat, numberFormat)).toEqual(0);
    });

    it('should return 0 if value types are not number, string, or boolean', () => {
      const a = { sortKey: {} };
      const b = { sortKey: {} };
      const sort: Sort = { active: 'sortKey', direction: 'asc' };

      expect(DataTableSortUtil.compare(a, b, sort, dateTimeFormat, numberFormat)).toEqual(0);
    });
  });

  describe('DataTableComponent transformData method', () => {
    it('should return original value if no transformer provided', () => {
      const value = 'Test Value';

      expect(DataTableDataUtil.transformData(value, null, null)).toEqual(value);
    });

    it('should return original value if transformer is not a function', () => {
      const value = 'Test Value';
      const transformer: any = 'Not a function';

      expect(DataTableDataUtil.transformData(value, transformer, null)).toEqual(value);
    });

    it('should correctly transform value with transformer function', () => {
      const value = 'Test Value';
      const transformer = (v: string, p: any) => `${v} Transformed With ${p}`;
      const transformerParams = 'Params';

      const expectedResult = 'Test Value Transformed With Params';
      expect(DataTableDataUtil.transformData(value, transformer, transformerParams)).toEqual(expectedResult);
    });
  });
});
