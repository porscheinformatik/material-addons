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
import { ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DataTableAction } from './data-table-action';
import { DataTableRow } from './data-table-row';
import { DataTableColumnDefinition, DataTableColumnDefinitionChange } from './data-table-column-definition';
import { DataTableColumnsModalComponent } from './data-table-columns-modal/data-table-columns-modal.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonModule } from '../button/button.module';
import { of } from 'rxjs';
import { DataTableActionType } from './data-table-action-type';

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

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTableComponent, DataTableColumnsModalComponent],
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
  });

  it('should create DataTableComponent', () => {
    component.tableData = exampleData;
    component.displayedColumns = exampleColumns;
    component.paginationEnabled = true;
    component.filterEnabled = true;

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create data source', () => {
    component.displayedColumns = exampleColumns;
    component.paginationEnabled = true;
    component.filterEnabled = true;
    component.paginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
    component.sort = new MatSort();
    component.tableData = exampleData;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.dataSource).toBeDefined();
    expect(component.dataSource.data.length).toEqual(exampleData.length);
  });

  it('should create component in BATCH mode, because actions contains BATCH action', () => {
    component.actions = actionsMock;
    component._forceMode = '';
    component.ngOnInit();

    expect(component.mode).toEqual(DataTableActionType.BATCH);
    expect(component.isRowClickable).toEqual(true);
    expect(component.defaultAction).toBeUndefined();
  });

  it('should create component in SINGLE mode, because actions contains SINGLE action', () => {
    component.actions = [mockDataTableAction];
    component._forceMode = '';
    component.ngOnInit();

    expect(component.mode).toEqual(DataTableActionType.SINGLE);
    expect(component.isRowClickable).toBeTruthy();
    expect(component.defaultAction).toEqual(mockDataTableAction);
  });

  it('should create component in NONE mode, because actions are empty', () => {
    component._forceMode = '';
    component.ngOnInit();

    expect(component.mode).toEqual(DataTableActionType.NONE);
    expect(component.isRowClickable).toBeFalsy();
    expect(component.defaultAction).toBeUndefined();
  });

  it('should create component with provided force mode (ex SINGLE)', () => {
    component._forceMode = DataTableActionType.SINGLE;
    component.ngOnInit();

    expect(component.mode).toEqual(DataTableActionType.SINGLE);
    expect(component.isRowClickable).toBeTruthy();
    expect(component.defaultAction).toBeUndefined();
  });

  describe('onSortingEvent', () => {
    it('should emit sortEvent when onSortingEvent is called and useAsync is true', () => {
      component.useAsync = true;
      const expectedSort: Sort = { active: 'name', direction: 'desc' };
      jest.spyOn(component.sortEvent, 'emit');
      component.onSortingEvent(expectedSort);

      expect(component.sortEvent.emit).toHaveBeenCalledTimes(1);
      expect(component.sortEvent.emit).toHaveBeenCalledWith(expectedSort);
    });

    it('should sort data internally when onSortingEvent is called and useAsync is false', () => {
      component.useAsync = false;
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
      component.dataSource = new MatTableDataSource(initialData);
      const sortEvent: Sort = { active: 'name', direction: 'asc' };
      component.onSortingEvent(sortEvent);

      expect(component.dataSource.data).toEqual(expectedData);
      expect(component.dataSource.data).not.toEqual(initialData);
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
      component.rowMap = mockRowMap;
      const mockSelected = ['1', '2'];
      component.selectionModel = {
        selected: mockSelected,
      } as SelectionModel<any>;
      const fakeDataTableAction: DataTableAction = mockDataTableAction;
      jest.spyOn(component.actionEvent, 'emit');
      component.onTableAction(fakeDataTableAction);

      expect(component.actionEvent.emit).toHaveBeenCalledTimes(1);
      expect(component.actionEvent.emit).toHaveBeenCalledWith({
        ...fakeDataTableAction,
        selected: [row1.actualData, row2.actualData],
      });
    });

    it('should emit actionEvent when onTableAction is called with a tableAction and idGenerator is a function', () => {
      const mockSelected = [
        { id: '1', name: 'Test1' },
        { id: '2', name: 'Test2' },
      ];
      component.selectionModel = {
        selected: mockSelected,
      } as SelectionModel<any>;
      component.idGenerator = (data: any) => data.id + '_generated';
      const fakeDataTableAction: DataTableAction = mockDataTableAction;
      jest.spyOn(component.actionEvent, 'emit');
      component.onTableAction(fakeDataTableAction);

      expect(component.actionEvent.emit).toHaveBeenCalledTimes(1);
      expect(component.actionEvent.emit).toHaveBeenCalledWith({
        ...fakeDataTableAction,
      });
    });

    const mockRow: { rowId: string; parentId?: string } = {
      rowId: '1',
    };

    it('should not emit actionEvent when "BATCH" mode is selected', () => {
      component.mode = DataTableActionType.BATCH;
      jest.spyOn(component.selectionModel, 'toggle');
      jest.spyOn(component.actionEvent, 'emit');
      component.onRowEvent(new MouseEvent('click'), mockRow, mockDataTableAction);

      expect(component.selectionModel.toggle).toHaveBeenCalledTimes(1);
      expect(component.selectionModel.toggle).toHaveBeenCalledWith(mockRow.rowId);
      expect(component.actionEvent.emit).not.toHaveBeenCalled();
    });

    it('should not emit actionEvent when "NONE" mode is selected', () => {
      component.mode = DataTableActionType.NONE;
      const actionEventSpy = jest.spyOn(component.actionEvent, 'emit');
      component.onRowEvent(new MouseEvent('click'), mockRow, mockDataTableAction);

      expect(actionEventSpy).not.toHaveBeenCalled();
    });

    it('should emit actionEvent with actualData when "SINGLE" mode is selected', () => {
      component.mode = DataTableActionType.SINGLE;
      const mockRowMap = new Map<string, DataTableRow>();
      const row1: DataTableRow = { id: '1', actualData: { id: '1', name: 'Test1' }, displayedData: null };
      const row2: DataTableRow = { id: '2', actualData: { id: '2', name: 'Test2' }, displayedData: null };
      mockRowMap.set('1', row1);
      mockRowMap.set('2', row2);
      component.rowMap = mockRowMap;
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
    component.useAsync = true;
    jest.spyOn(component.pageEvent, 'emit');
    component.onPageEvent(mockPageEvent);

    expect(component.pageEvent.emit).toHaveBeenCalledTimes(1);
    expect(component.pageEvent.emit).toHaveBeenCalledWith(mockPageEvent);
  });

  it('should not emit pageEvent when useAsync is false', () => {
    component.useAsync = false;
    jest.spyOn(component.pageEvent, 'emit');
    component.onPageEvent(mockPageEvent);

    expect(component.pageEvent.emit).not.toHaveBeenCalled();
  });

  it('should emit allColumnsEvent when columnDefinition is not provided', () => {
    jest.spyOn(component.allColumnsEvent, 'emit');
    component.onColumnSettings();

    expect(component.showColumnModal).toBeTruthy();
    expect(component.selectedDefinition).toBeUndefined();
    expect(component.allColumnsEvent.emit).toHaveBeenCalledTimes(1);
  });

  //check checkboxes and check selectionModel

  it('should emit allColumnsEvent when columnDefinition is provided', () => {
    component.columnDefinitions = columnDefinitions;
    jest.spyOn(component.allColumnsEvent, 'emit');
    component.onColumnSettings();

    expect(component.showColumnModal).toBeTruthy();
    expect(component.selectedDefinition).not.toBeNull();
    expect(component.selectedDefinition).toEqual(columnDefinitions[0]);
    expect(component.allColumnsEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('should not emit allColumnsEvent when allColumns is provided', () => {
    component.allColumns = exampleColumns;
    jest.spyOn(component.allColumnsEvent, 'emit');
    component.onColumnSettings();

    expect(component.showColumnModal).toBeTruthy();
    expect(component.selectedDefinition).toBeUndefined();
    expect(component.allColumnsEvent.emit).not.toHaveBeenCalled();
  });

  it('should emit columnDefinitionChangeEvent when dialog closed with result', () => {
    component.columnDefinitions = columnDefinitions;
    component.allColumns = exampleColumns;
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

  it('should emit viewDefinitionChangeEvent when onViewDefinition is called', () => {
    component.columnDefinitions = columnDefinitions;
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
    component.dataSource = new MatTableDataSource(initialData);
    const setFilterValueSpy = jest.spyOn(component, 'setFilterValue');
    component.filterValue = 'Alli';

    expect(setFilterValueSpy).toHaveBeenCalledTimes(1);
    expect(setFilterValueSpy).toHaveBeenCalledWith('Alli');
    expect(component.dataSource.filter).toEqual('alli');
    expect(component.dataSource.filteredData).toEqual(expectedData);
  });

  it('should call setFilterValue when a filterValue is set and dataSource not provided', () => {
    const setFilterValueSpy = jest.spyOn(component, 'setFilterValue');
    component.filterValue = 'Alli';

    expect(setFilterValueSpy).not.toHaveBeenCalled();
  });

  it('should set forceMode without actions, call selectionModel clear and actions should be empty', () => {
    const modes = [DataTableActionType.SINGLE, DataTableActionType.BATCH, DataTableActionType.NONE];
    modes.forEach((mode) => {
      const selectionModelClearSpy = jest.spyOn(component.selectionModel, 'clear');
      component.forceMode = mode;

      expect(component._forceMode).toEqual(mode);
      expect(component.mode).toEqual(mode);
      expect(selectionModelClearSpy).toHaveBeenCalled();
      expect(component.rowActions).toHaveLength(0);
      expect(component.tableActions).toHaveLength(0);
    });
  });

  it('should contain correct table/row actions if set forceMode with actions', () => {
    const modes = [DataTableActionType.SINGLE, DataTableActionType.BATCH, DataTableActionType.NONE];
    component.actions = actionsMock;
    modes.forEach((mode) => {
      const selectionModelClearSpy = jest.spyOn(component.selectionModel, 'clear');
      component.forceMode = mode;

      expect(component._forceMode).toEqual(mode);
      expect(component.mode).toEqual(mode);
      expect(selectionModelClearSpy).toHaveBeenCalled();

      switch (mode) {
        case DataTableActionType.SINGLE:
          expect(component.rowActions).toHaveLength(2);
          expect(component.tableActions).toHaveLength(1);
          break;
        case DataTableActionType.BATCH:
          expect(component.rowActions).toHaveLength(0);
          expect(component.tableActions).toHaveLength(4);
          break;
        case DataTableActionType.NONE:
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
        { rowId: 3, name: 'Moose' },
      ];
      component.dataSource = new MatTableDataSource(initialData);
      component.allSelected = false;
      const clearSpy = jest.spyOn(component.selectionModel, 'clear');
      const selectSpy = jest.spyOn(component.selectionModel, 'select');
      const getAllDataSourceRowsOfCurrentPageSpy = jest.spyOn(component, 'getAllDataSourceRowsOfCurrentPage');
      component.onToggleSelectAll();

      expect(clearSpy).toHaveBeenCalled();
      expect(component.allSelected).toBeTruthy();
      expect(getAllDataSourceRowsOfCurrentPageSpy).toHaveBeenCalledTimes(1);
      expect(getAllDataSourceRowsOfCurrentPageSpy).toHaveReturnedWith(component.dataSource.data);
      expect(selectSpy).toHaveBeenNthCalledWith(1, '1');
      expect(selectSpy).toHaveBeenNthCalledWith(2, '2');
    });

    it('should clear selectionModel, toggle allSelected to false and selection should be empty', () => {
      const initialData: any[] = [
        { rowId: 1, id: 1, name: 'Zebra' },
        { rowId: 2, id: 2, name: 'Alligator' },
        { rowId: 3, name: 'Moose' },
      ];
      component.dataSource = new MatTableDataSource(initialData);
      component.allSelected = true;
      const clearSpy = jest.spyOn(component.selectionModel, 'clear');
      const selectSpy = jest.spyOn(component.selectionModel, 'select');
      const getAllDataSourceRowsOfCurrentPageSpy = jest.spyOn(component, 'getAllDataSourceRowsOfCurrentPage');
      component.onToggleSelectAll();

      expect(clearSpy).toHaveBeenCalled();
      expect(component.allSelected).toBeFalsy();
      expect(getAllDataSourceRowsOfCurrentPageSpy).not.toHaveBeenCalled();
      expect(selectSpy).not.toHaveBeenCalled();
    });
  });

  describe('getSelectedCount method', () => {
    it('should return empty string if actionType is not BATCH', () => {
      const actionType = DataTableActionType.SINGLE;
      const result = component.getSelectedCount(actionType);
      expect(result).toEqual('');
    });

    it('should return empty string if count is less than 2', () => {
      const actionType = DataTableActionType.BATCH;
      component.selectionModel.select('1');
      const result = component.getSelectedCount(actionType);

      expect(result).toEqual('');
    });

    it('should return string with count if actionType is BATCH and count is 2 or more', () => {
      const actionType = DataTableActionType.BATCH;
      component.selectionModel.select('1', '2');
      const expectedOutput = ` (2)`; // output string has a leading space
      const result = component.getSelectedCount(actionType);

      expect(result).toEqual(expectedOutput);
    });

    it('should handle case when selectionModel is null or undefined', () => {
      const actionType = DataTableActionType.BATCH;
      component.selectionModel = null;
      const result = component.getSelectedCount(actionType);

      expect(result).toEqual('');
    });
  });

  describe('isSelected method', () => {
    beforeEach(() => {
      // reset selection before each test
      component.selectionModel.clear();
    });

    it.each([
      { rowId: '1', selectedRowIds: ['1', '2'], expectedIsSelected: true },
      { rowId: '2', selectedRowIds: ['1'], expectedIsSelected: false },
    ])(
      'for rowId $rowId, isSelected should return $expectedIsSelected when these rowIds are selected $selectedRowIds',
      ({ rowId, selectedRowIds, expectedIsSelected }) => {
        component.selectionModel.select(...selectedRowIds);
        const isSelectedSpy = jest.spyOn(component.selectionModel, 'isSelected');
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
        component.selectionModel.clear();
        component.selectionModel.select(...selectedItems);
        const isDisabled = component.isDisabled(actionType);

        expect(isDisabled).toEqual(expected);
      });
    });
  });

  describe('Simple component property bindings', () => {
    it('should set isLoading when loading Input property is set', () => {
      const isLoadingValue = true;
      component.loading = isLoadingValue;

      expect(component.isLoading).toEqual(isLoadingValue);
    });

    it('should set paginatorPageSize when defaultPageSize Input property is set', () => {
      const defaultSizeValue = 10;
      component.defaultPageSize = defaultSizeValue;

      expect(component.paginatorPageSize).toEqual(defaultSizeValue);
    });

    it('should set extPaginator when externalPaginator Input property is set', () => {
      const paginatorValue = { pageIndex: 1, pageSize: 10 };
      component.externalPaginator = paginatorValue;

      expect(component.extPaginator).toEqual(paginatorValue);
    });

    it('should set extPaginator when externalPaginator Input property is set', () => {
      const paginatorValue = { pageIndex: 1, pageSize: 10 };
      component.externalPaginator = paginatorValue;

      expect(component.extPaginator).toEqual(paginatorValue);
    });

    it('displayedColumnDefinition should populate selectedColumnDefinition, columns, and columnIds with additional action column', () => {
      const def: DataTableColumnDefinition = columnDefinitions[0];
      component.displayedColumnDefinition = def;

      expect(component.selectedColumnDefinion).toEqual(def);
      expect(component.columns).toEqual(def.displayedColumns);
      expect(component.columnIds).toEqual([component.ACTION_COLUMN_NAME].concat(def.displayedColumns.map((column) => column.id)));
    });

    it('should set paginatorPageIndex, paginatorPageSize, and paginatorLength when page is set', () => {
      component.page = mockPageEvent;

      expect(component.paginatorPageIndex).toEqual(mockPageEvent.pageIndex);
      expect(component.paginatorPageSize).toEqual(mockPageEvent.pageSize);
      expect(component.paginatorLength).toEqual(mockPageEvent.length);
    });
  });

  describe('isCurrentDefinition', () => {
    it('should return true if the selected definition id matches the provided definition id', () => {
      const definition = columnDefinitions[0];
      component.selectedDefinition = columnDefinitions[0];

      expect(component.isCurrentDefinition(definition)).toBeTruthy();
    });

    it('should return false if the selected definition id does not match the provided definition id', () => {
      const definition = columnDefinitions[0];
      component.selectedDefinition = columnDefinitions[2];

      expect(component.isCurrentDefinition(definition)).toBeFalsy();
    });

    it('should return false if no selected definition is set', () => {
      const definition = columnDefinitions[0];
      component.selectedDefinition = null;

      expect(component.isCurrentDefinition(definition)).toBeFalsy();
    });
  });

  describe('DataTableComponent static methods', () => {
    it('should compare number types correctly', () => {
      const a = { sortKey: 5 };
      const b = { sortKey: 12 };
      const ascSort: Sort = { active: 'sortKey', direction: 'asc' };
      const descSort: Sort = { active: 'sortKey', direction: 'desc' };

      expect(DataTableComponent.compare(a, b, ascSort)).toBeLessThan(0);
      expect(DataTableComponent.compare(a, b, descSort)).toBeGreaterThan(0);
    });

    it('should compare string types correctly', () => {
      const a = { sortKey: 'apple' };
      const b = { sortKey: 'banana' };
      const ascSort: Sort = { active: 'sortKey', direction: 'asc' };
      const descSort: Sort = { active: 'sortKey', direction: 'desc' };

      expect(DataTableComponent.compare(a, b, ascSort)).toBeLessThan(0);
      expect(DataTableComponent.compare(a, b, descSort)).toBeGreaterThan(0);
    });

    it('should compare boolean types correctly', () => {
      const a = { sortKey: false };
      const b = { sortKey: true };
      const c = { sortKey: true };
      const ascSort: Sort = { active: 'sortKey', direction: 'asc' };
      const descSort: Sort = { active: 'sortKey', direction: 'desc' };

      expect(DataTableComponent.compare(a, b, ascSort)).toBeGreaterThan(0);
      expect(DataTableComponent.compare(a, b, descSort)).toBeLessThan(0);
      expect(DataTableComponent.compare(b, c, descSort)).toEqual(0);
    });

    it('should return 0 if value types are not number, string, or boolean', () => {
      const a = { sortKey: {} };
      const b = { sortKey: {} };
      const sort: Sort = { active: 'sortKey', direction: 'asc' };

      expect(DataTableComponent.compare(a, b, sort)).toEqual(0);
    });
  });

  describe('DataTableComponent transformData method', () => {
    it('should return original value if no transformer provided', () => {
      const value = 'Test Value';

      expect(DataTableComponent.transformData(value, null, null)).toEqual(value);
    });

    it('should return original value if transformer is not a function', () => {
      const value = 'Test Value';
      const transformer = 'Not a function';

      expect(DataTableComponent.transformData(value, transformer, null)).toEqual(value);
    });

    it('should correctly transform value with transformer function', () => {
      const value = 'Test Value';
      const transformer = (v: string, p: any) => `${v} Transformed With ${p}`;
      const transformerParams = 'Params';

      const expectedResult = 'Test Value Transformed With Params';
      expect(DataTableComponent.transformData(value, transformer, transformerParams)).toEqual(expectedResult);
    });
  });
});
