import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DataTableColumn } from './data-table-column';
import { DataTableAction } from './data-table-action';
import { DataTableActionType } from './data-table-action-type';
import { SelectionModel } from '@angular/cdk/collections';
import { v4 as uuidV4 } from 'uuid';
import { MatDialog } from '@angular/material/dialog';
import { DataTableColumnsModalComponent } from './data-table-columns-modal/data-table-columns-modal.component';
import { DataTableColumnDefinition, DataTableColumnDefinitionChange, DataTableDialogData } from './data-table-column-definition';

@Component({
  selector: 'mad-data-table-dev',
  templateUrl: './data-table-dev.component.html',
  styleUrls: ['./data-table-dev.component.scss'],
})
export class DataTableDevComponent implements OnInit, AfterViewInit {
  // Translations
  @Input() filterLabel = 'Filter';
  @Input() filterPlaceholder = '';
  @Input() filterColumnsLabel = 'Filter';
  @Input() filterColumnsPlaceHolder = 'Filter available columns';
  @Input() noDataText = 'No matching data found';
  @Input() columnSettingsModalTitleLabel = 'Column settings';
  @Input() selectedLabel = 'Selected columns';
  @Input() availableLabel = 'Available columns';
  @Input() saveLabel = 'Save';
  @Input() deleteLabel = 'Delete';
  @Input() cancelLabel = 'Cancel';
  @Input() infoTextLabel = 'Drag and drop a column to select or reorder it.';
  @Input() tableClass: string;

  @Input() pageSizeOptions = [5, 10, 15];
  @Input() externalFilter: any;

  @Input() actions: DataTableAction[] = [];
  @Input() idGenerator: any;
  @Input() deleteDefinitionAllowed = false;

  @Input() useAsync = false;

  @Input() set displayedColumns(cols: DataTableColumn[]) {
    if (!this.displayedColumnDefinition) {
      this.columns = cols ? [...cols] : [];
      this.columnIds = this.columns.map(column => column.id);
      this.columnIds.unshift(this.ACTION_COLUMN_NAME);
    }
  }

  @Input() set displayedColumnDefinition(def: DataTableColumnDefinition) {
    this.selectedColumnDefinion = def;
    this.columns = def.displayedColumns;
    this.columnIds = this.columns.map(column => column.id);
    this.columnIds.unshift(this.ACTION_COLUMN_NAME);
  }

  @Input() set tableData(data: any[]) {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<any>(data);
    }
    this.createDataMapsAndSetDisplayedDataSourceData(data);
  }

  @Input() set page(page: PageEvent) {
    this.paginatorPageIndex = page.pageIndex;
    this.paginatorPageSize = page.pageSize;
    this.paginatorLength = page.length;
    console.log('page set', page);
  }

  @Input() set columnDefinitions(definitions: DataTableColumnDefinition[]) {
    this.editableColumnDefinitions = [];
    this.viewableColumnDefinitions = [];
    this.allColumnDefinitions = [...definitions];
    for (const definition of definitions) {
      if (definition.editable) {
        this.editableColumnDefinitions.push(definition);
      }
      if (definition.displayedColumns?.length > 0) {
        this.viewableColumnDefinitions.push(definition);
      }
    }
  }

  @Input() set loading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  @Input() set defaultPageSize(defaultSize: number) {
    this.paginatorPageSize = defaultSize;
  }

  @Input() set paginationEnabled(isPaginationEnabled: boolean) {
    this.isPaginationEnabled = isPaginationEnabled;
    this.unsetPageSizeIfNecessary();
  }

  @Input() set allColumns(allColumns: DataTableColumn[]) {
    this.allAvailableColumns = allColumns;
    if (allColumns && this.showColumnModal) {
      this.openColumnModal();
    }
  }

  @Input()
  set filterEnabled(isFilterEnabled: boolean) {
    this.isFilterEnabled = !this.useAsync ? isFilterEnabled : false;
    this.setFilterValue(undefined);
  }

  @Input()
  set forceMode(mode: string) {
    if (mode === this.SINGLE || mode === this.BATCH || mode === this.NONE) {
      this._forceMode = mode;
      this.mode = mode;
      this.setActions();
    }
  }

  @Output() sortEvent = new EventEmitter<Sort>();
  @Output() actionEvent = new EventEmitter<DataTableAction>();
  @Output() pageEvent = new EventEmitter<PageEvent>();
  @Output() allColumnsEvent = new EventEmitter<void>();
  @Output() columnDefinitionChangeEvent = new EventEmitter<DataTableColumnDefinitionChange>();
  @Output() viewDefinitionChangeEvent = new EventEmitter<DataTableColumnDefinition>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  readonly ACTION_COLUMN_NAME = '__action__';
  readonly SINGLE = DataTableActionType.SINGLE;
  readonly BATCH = DataTableActionType.BATCH;
  readonly NONE = DataTableActionType.NONE;

  tableActions: DataTableAction[] = [];
  rowActions: DataTableAction[] = [];
  columns: DataTableColumn[] = [];
  allSelected = false;
  selected: [];
  _forceMode: string;
  displayedDataMap = new Map<string, any>();
  actualDataMap = new Map<string, any>();
  dataSource: MatTableDataSource<any[]>;
  selectionModel = new SelectionModel<string>(true);
  columnIds: string[];
  allColumnDefinitions: DataTableColumnDefinition[] = [];
  editableColumnDefinitions: DataTableColumnDefinition[];
  viewableColumnDefinitions: DataTableColumnDefinition[];
  selectedColumnDefinion: DataTableColumnDefinition;
  allAvailableColumns: DataTableColumn[];
  selectedDefinition: DataTableColumnDefinition;
  defaultAction: DataTableAction;
  isFilterEnabled = false;
  isPaginationEnabled = false;
  mode = this.NONE;
  isRowClickable = false;
  showColumnModal = false;
  isLoading = false;

  paginatorLength = 0;
  paginatorPageIndex = 0;
  paginatorPageSize = 50;

  constructor(private matDialog: MatDialog) {}

  static compare(a: Record<string, any>, b: Record<string, any>, sort: Sort): number {
    const x = a[sort.active];
    const y = b[sort.active];
    const ascending = sort.direction === 'asc';
    switch (typeof x) {
      case 'number':
        return DataTableDevComponent.compareNumber(x, y, ascending);
      case 'string':
        return DataTableDevComponent.compareString(x, y, ascending);
      case 'boolean':
        return DataTableDevComponent.compareBoolean(x, y, ascending);
      default:
        // cannot compare -> return equal
        return 0;
    }
  }

  static compareNumber(x: number, y: number, ascending: boolean): number {
    return ascending ? x - y : y - x;
  }

  static compareString(x: string, y: string, ascending: boolean): number {
    return ascending ? x.localeCompare(y) : y.localeCompare(x);
  }

  static compareBoolean(x: boolean, y: boolean, ascending: boolean): number {
    if (x === y) {
      return 0;
    }
    if (ascending) {
      // true first
      return x ? -1 : 1;
    } else {
      // false first
      return x ? 1 : -1;
    }
  }

  static transformData(value: any, transformer: any, transformerParams: any): any {
    if (!transformer || !(transformer instanceof Function)) {
      return value;
    }
    return transformer(value, transformerParams);
  }

  static generateRowId(): string {
    return uuidV4();
  }

  static isClickOnRowMenuIcon(event: MouseEvent): boolean {
    return (event?.target as HTMLElement)?.classList.contains('mat-icon');
  }

  ngOnInit(): void {
    this.mode = this.getTableMode();
    this.setActions();
    if (this.mode !== this.NONE) {
      this.isRowClickable = true;
      this.defaultAction = this.rowActions[0];
    }
  }

  ngAfterViewInit(): void {
    if (!this.useAsync) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  onColumnSettings(definition?: DataTableColumnDefinition): void {
    this.showColumnModal = true;
    this.selectedDefinition = definition ? definition : this.allColumnDefinitions[0];
    if (this.allAvailableColumns) {
      this.openColumnModal();
    } else {
      // if no complete definitions have been loaded yet send an event so the app can load it
      this.allColumnsEvent.emit();
    }
  }

  onViewDefinition(definition: DataTableColumnDefinition): void {
    this.selectedDefinition = definition;
    this.viewDefinitionChangeEvent.emit(definition);
  }

  isCurrentDefinition(definition: DataTableColumnDefinition): boolean {
    return this.selectedDefinition && this.selectedDefinition.id === definition.id;
  }

  get selectedCount(): number {
    return this.selectionModel?.selected ? this.selectionModel.selected.length : 0;
  }

  get rowCount(): number {
    return this.getAllDataSourceRowsOfCurrentPage() ? this.getAllDataSourceRowsOfCurrentPage().length : 0;
  }

  getAllDataSourceRowsOfCurrentPage(): any[] {
    return this.dataSource?._pageData(this.dataSource.data);
  }

  getSelectedCount(actionType: string): string {
    const count = this.selectedCount;
    if (actionType !== this.BATCH || count < 2) {
      return '';
    }
    return ' (' + count + ')';
  }

  isDisabled(actionType: string): boolean {
    switch (actionType) {
      case this.SINGLE:
        return this.selectedCount !== 1;
      case this.BATCH:
        return this.selectedCount < 1;
      default:
        return false;
    }
  }

  onToggleSelectAll(): void {
    // clear all selection first
    this.selectionModel.clear();
    // toggle all checkbox
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      // select all rows of the current page
      this.getAllDataSourceRowsOfCurrentPage().forEach(row => {
        this.selectionModel.select('' + row.rowId);
      });
    }
  }

  isSelected(rowId: string): boolean {
    return this.selectionModel.isSelected(rowId);
  }

  setFilterValue(value: string): void {
    this.dataSource.filter = value?.trim().toLowerCase();
  }

  onRowCheckbox(event: MouseEvent, row: any): void {
    event.stopPropagation(); // no click event on row
    this.selectionModel.toggle(row.rowId);
  }

  onRowEvent(event: MouseEvent, row: any, action = this.defaultAction): void {
    switch (this.mode) {
      case this.BATCH:
        this.onRowCheckbox(event, row);
        break;
      case this.SINGLE:
        // emit the default action if the row (not the icon!) was clicked
        if (!!action && !DataTableDevComponent.isClickOnRowMenuIcon(event)) {
          const selected = [];
          // if ID-generator is provided, return the ID, else return the ACTUAL data
          selected.push(this.idGenerator ? row.rowId : this.actualDataMap.get(row.rowId));
          this.emitTableAction(action, selected);
        }
        break;
      default:
        // do nothing if mode is NONE (or null)
        return;
    }
  }

  onSortingEvent(sort: Sort): void {
    if (this.useAsync) {
      this.sortEvent.emit(sort);
    } else {
      this.internalSort(sort);
    }
  }

  onPageEvent(event: PageEvent): void {
    if (this.useAsync) {
      this.pageEvent.emit(event);
    }
  }

  onTableAction(tableAction: DataTableAction): void {
    if (!!tableAction) {
      const selection: any[] = [];
      for (const selected of this.selectionModel.selected) {
        selection.push(this.idGenerator ? selected : this.actualDataMap.get(selected));
      }
      tableAction.selected = selection;
      this.actionEvent.emit(tableAction);
    }
  }

  private emitTableAction(action: DataTableAction, selected: any[]): void {
    const emitAction = { ...action };
    if (action.type !== this.NONE) {
      emitAction.selected = [...selected];
    }
    this.actionEvent.emit(emitAction);
  }

  private generateDisplayedDataElement(rowId: string, actualDataElement: any): any {
    const displayedDataElement: { [key: string]: any } = {};
    displayedDataElement.rowId = rowId;
    for (const column of this.columns) {
      const actualValue = actualDataElement[column.dataPropertyName];
      displayedDataElement[column.dataPropertyName] = DataTableDevComponent.transformData(
        actualValue,
        column.transformer,
        column.transformerParams,
      );
    }
    return displayedDataElement;
  }

  private internalSort(sort: Sort) {
    const sortedData = [...this.dataSource.data].sort((a, b) => DataTableDevComponent.compare(a, b, sort));
    this.dataSource.data = [...sortedData];
  }

  private setActions(): void {
    this.rowActions = [];
    this.tableActions = [];
    for (const action of this.actions) {
      if (this.mode !== action.hiddenInMode) {
        switch (action.type) {
          case this.SINGLE:
            if (this.mode === this.SINGLE) {
              this.rowActions.push(action);
            } else {
              this.tableActions.push(action);
            }
            break;
          case this.BATCH:
            if (this.mode !== this.SINGLE) {
              this.tableActions.push(action);
            }
            break;
          default:
            this.tableActions.push(action);
        }
      }
    }
  }

  private createDataMapsAndSetDisplayedDataSourceData(data: any[]): void {
    const displayedDataList = [];
    this.actualDataMap.clear();
    this.displayedDataMap.clear();
    if (data?.length > 0) {
      for (const dataEntry of data) {
        const rowId = this.idGenerator ? this.idGenerator(dataEntry) : DataTableDevComponent.generateRowId();
        this.actualDataMap.set(rowId, dataEntry);
        const displayedDataElement = this.generateDisplayedDataElement(rowId, dataEntry);
        this.displayedDataMap.set(rowId, displayedDataElement);
        displayedDataList.push(displayedDataElement);
      }
    }
    this.dataSource.data = displayedDataList;
    this.unsetPageSizeIfNecessary();
  }

  private openColumnModal(): void {
    const dialogData: DataTableDialogData = {
      allColumns: this.allAvailableColumns,
      definition: this.selectedDefinition,
      deleteDefinitionAllowed: this.deleteDefinitionAllowed,
      filterColumnsLabel: this.filterColumnsLabel,
      filterColumnsPlaceHolder: this.filterColumnsPlaceHolder,
      noDataText: this.noDataText,
      titleLabel: this.columnSettingsModalTitleLabel,
      selectedLabel: this.selectedLabel,
      availableLabel: this.availableLabel,
      saveLabel: this.saveLabel,
      deleteLabel: this.deleteLabel,
      cancelLabel: this.cancelLabel,
      infoTextLabel: this.infoTextLabel,
    };
    const dialog = this.matDialog.open(DataTableColumnsModalComponent, { data: dialogData });
    dialog.afterClosed().subscribe(result => {
      // no event on CANCEL
      if (result) {
        this.columnDefinitionChangeEvent.emit(result);
      }
    });
  }

  private getTableMode(): string {
    if (this._forceMode) {
      return this._forceMode;
    }

    if (!this.actions) {
      return this.NONE;
    }
    const distinctActionTypes = new Set<string>();
    for (const rowAction of this.actions) {
      distinctActionTypes.add(rowAction.type);
    }
    if (distinctActionTypes.has(this.BATCH)) {
      return this.BATCH;
    }
    if (distinctActionTypes.has(this.SINGLE)) {
      return this.SINGLE;
    }
    return this.NONE;
  }

  private unsetPageSizeIfNecessary() {
    if (!this.useAsync && !this.isPaginationEnabled) {
      const dataCount = this.dataSource.data ? this.dataSource.data.length : 0;
      this.paginatorPageSize = dataCount;
      this.paginatorLength = dataCount;
    }
  }
}
