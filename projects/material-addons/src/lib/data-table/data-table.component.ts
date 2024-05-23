import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { DataTableColumn } from './configuration/data-table-column';
import { DataTableAction } from './configuration/data-table-action';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { DataTableColumnsModalComponent } from './data-table-columns-modal/data-table-columns-modal.component';
import {
  DataTableColumnDefinition,
  DataTableColumnDefinitionChange,
  DataTableDialogData,
} from './configuration/data-table-column-definition';
import { DataTableRow } from './configuration/data-table-row';
import { DataTableHeaderType } from './configuration/data-table-header-type';
import { DataTableFilterMode } from './configuration/data-table-filter-mode';
import { DataTableFilterObject } from './data-table-filter/data-table-filter-object';
import { DataTableFilter } from './data-table-filter/data-table-filter.directive';
import { DataTableSelectionEmitType } from './configuration/data-table-selection-emit-type';
import { DataTableSelectionEmitMode } from './configuration/data-table-selection-emit-mode';
import { DataTableSelectionMode } from './configuration/data-table-selection-mode';
import { DataTableSortUtil } from './util/data-table-sort-util';
import { DataTableActionUtil } from './util/data-table-action-util';
import { DataTableDataUtil } from './util/data-table-data-util';
import { DataTableFilterUtil } from './util/data-table-filter-util';
import {
  DATA_TABLE_PERSISTENCE_SERVICE_PROVIDER,
  DataTablePersistenceService,
  MAD_DATA_TABLE_PERSISTENCE_SERVICE,
} from './data-table-persistence.service';
import {
  MAD_DATA_TABLE_GLOBAL_CONFIGURATION,
  DataTableGlobalConfiguration,
  MAD_DATA_TABL_GLOBAL_CONFIGURATION_PROVIDER,
} from './configuration/data-table-global-configuration';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '../button/button.module';
import { DataTableFilterHeader } from './data-table-filter/data-table-filter-header.directive';
import { DataTableTemplateColumnDefinition } from './data-table-template/data-table-template-column-definition.directive';
import { DataTableTemplateCellDefinition } from './data-table-template/data-table-template-cell-definition.directive';
import { DataTableTemplateExpandableCellDefinition } from './data-table-template/data-table-template-expandable-cell-definition.directive';
import { DataTableTemplateExpandableColumnDefinition } from './data-table-template/data-table-template-expandable-column-definition.directive';
import { DataTablePersistenceConfiguration } from './configuration/data-table-persistence-configuration';

@Component({
  selector: 'mad-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    ButtonModule,
    TranslateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatBadgeModule,
    DragDropModule,
    FormsModule,
    DataTableFilterHeader,
    DataTableFilter,
    DataTableTemplateColumnDefinition,
    DataTableTemplateCellDefinition,
    DataTableTemplateExpandableColumnDefinition,
    DataTableTemplateExpandableCellDefinition,
  ],
  providers: [DATA_TABLE_PERSISTENCE_SERVICE_PROVIDER, MAD_DATA_TABL_GLOBAL_CONFIGURATION_PROVIDER],
})
export class DataTableComponent implements AfterViewInit, OnChanges {
  @Input() id: string;

  // Translations
  @Input() filterLabel = 'common.filter';
  @Input() filterPlaceholder = '';
  @Input() filterColumnsLabel = 'Filter';
  @Input() filterColumnsPlaceHolder = 'Filter available columns';
  @Input() showEmptyTable = false;
  @Input() noDataText = 'No matching data found';
  @Input() columnSettingsModalTitleLabel = 'Column settings';
  @Input() selectedLabel = 'Selected columns';
  @Input() availableLabel = 'Available columns';
  @Input() saveLabel = 'Save';
  @Input() deleteLabel = 'Delete';
  @Input() cancelLabel = 'Cancel';
  @Input() infoTextLabel = 'Drag and drop a column to select or reorder it.';
  @Input() tableClass: string;

  @Input() translateLabels = true;

  @Input() set useAsync(useAsync: boolean) {
    this._useAsync = useAsync;
    this.applySortData();
  }

  /**
   * @deprecated
   * Please use the more specific persistenceConfig instead
   */
  @Input() set stateful(stateful: boolean) {
    this.persistenceConfig = {
      persistSort: stateful,
      persistFilter: stateful,
      persistPageSize: stateful,
    };
  }

  @Input() persistenceConfig: DataTablePersistenceConfiguration = {
    persistSort: false,
    persistFilter: false,
    persistPageSize: false,
  };

  @Input() loading: boolean = false;

  @Input() tableData: any;
  @Input() idGenerator: any;
  @Input() parentIdGenerator: any;

  @Input() defaultSort: Sort;
  @Input() externalFilter: any;
  @Input() paginationEnabled: boolean = false;
  @Input() page: PageEvent = { pageIndex: 0, pageSize: 50, length: 0 };
  @Input() pageSizeOptions = [5, 10, 15];

  @Input() actions: DataTableAction[] = [];
  @Input() selectionEmitType: DataTableSelectionEmitType = 'ID';
  @Input() showDeleteFilterAction: boolean = true;
  @Input() disableRowClick: boolean = false;

  @Input() deleteDefinitionAllowed = false;

  @Input() set selection(selection: string[] | any[]) {
    this._selection = selection;
    this.updateSelectionModel(selection);
  }

  /**
   * @deprecated
   * Please use "filterMode" instead
   */
  @Input() set filterEnabled(isFilterEnabled: boolean) {
    this._filterMode = isFilterEnabled ? 'TABLE_BASED' : 'NONE';
    this.applyFilterPredicate();
  }

  @Input() set filterMode(filterMode: DataTableFilterMode) {
    this._filterMode = filterMode;
    this.applyFilterPredicate();
  }

  @Input() set filterValue(filterValue: string | DataTableFilterObject | undefined) {
    this._filterValue = filterValue;
    this.applyFilterValue(this._filterValue);
  }

  @Input() set externalPaginator(paginator: any) {
    this.extPaginator = paginator;
  }

  @Input() set defaultPageSize(defaultSize: number) {
    this.page = {
      ...this.page,
      pageSize: defaultSize,
    };
  }

  @Input() set selectionEmitMode(selectionEmitMode: DataTableSelectionEmitMode) {
    this._selectionEmitMode = selectionEmitMode;
  }

  /**
   * @deprecated
   * This function mixes up 2 responsibilities:
   *  - determining if actions should be displayed / handled
   *  - determining whether actions are row based (single) or table based (batch)
   * Please use a combination of "selectionEmitMode" and "selectionMode" instead:
   *  - selectionEmitMode determines how selected items are handled (as part of actions, as selections or not at all)
   *  - selectionMode determines if selected items are treated separately (single) or together (batch)
   */
  @Input() set forceMode(selectionMode: string) {
    if (selectionMode === 'SINGLE' || selectionMode === 'BATCH') {
      this._selectionEmitMode = 'ON_ACTION';
      this._forceSelectionMode = <DataTableSelectionMode>selectionMode;
      this._selectionModel.clear();
    }
  }

  @Input() set forceSelectionMode(selectionMode: DataTableSelectionMode) {
    this._forceSelectionMode = selectionMode;
    this._selectionModel.clear();
  }

  @Input() set displayedColumns(cols: DataTableColumn[]) {
    if (!this.displayedColumnDefinition) {
      this.columns = cols ? [...cols] : [];
      this.columnIds = this.columns.map((column) => column.id);
      this.columnIds.unshift(this.ACTION_COLUMN_NAME);
    }
  }

  @Input() set displayedColumnDefinition(def: DataTableColumnDefinition) {
    this.columns = def.displayedColumns;
    this.columnIds = this.columns.map((column) => column.id);
    this.columnIds.unshift(this.ACTION_COLUMN_NAME);
    this._selectedColumnDefinition = def;
  }

  @Input() set columnDefinitions(definitions: DataTableColumnDefinition[]) {
    this.editableColumnDefinitions = [];
    this.viewableColumnDefinitions = [];
    this._allColumnDefinitions = [...definitions];
    for (const definition of definitions) {
      if (definition.editable) {
        this.editableColumnDefinitions.push(definition);
      }
      if (definition.displayedColumns?.length > 0) {
        this.viewableColumnDefinitions.push(definition);
      }
    }
  }

  @Input() set allColumns(allColumns: DataTableColumn[]) {
    this._allAvailableColumns = allColumns;
    if (allColumns && this._showColumnModal) {
      this.openColumnModal();
    }
  }

  @Output() actionEvent = new EventEmitter<DataTableAction>();
  @Output() selectionEvent = new EventEmitter<any[]>();

  @Output() sortEvent = new EventEmitter<Sort>();
  @Output() filterEvent = new EventEmitter<string | DataTableFilterObject | undefined>();
  @Output() pageEvent = new EventEmitter<PageEvent>();

  @Output() allColumnsEvent = new EventEmitter<void>();
  @Output() columnDefinitionChangeEvent = new EventEmitter<DataTableColumnDefinitionChange>();
  @Output() viewDefinitionChangeEvent = new EventEmitter<DataTableColumnDefinition>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(DataTableFilter) filter: DataTableFilter;
  @ContentChildren(DataTableTemplateColumnDefinition) columnDefs: QueryList<DataTableTemplateColumnDefinition>;
  @ContentChild(DataTableTemplateExpandableCellDefinition)
  expandableDef: DataTableTemplateExpandableCellDefinition | undefined;

  dataSource: MatTableDataSource<any[]>;
  allSelected = false;

  extPaginator: MatPaginator;

  readonly ACTION_COLUMN_NAME = '__action__';
  tableActions: DataTableAction[][] = [];
  rowActions: DataTableAction[] = [];

  columns: DataTableColumn[] = [];
  columnIds: string[];

  expandedElement: DataTableColumn | null;

  editableColumnDefinitions: DataTableColumnDefinition[];
  viewableColumnDefinitions: DataTableColumnDefinition[];

  private _useAsync: boolean = false;

  private _rowMap = new Map<string, DataTableRow>();
  private _selectionModel = new SelectionModel<string>(true);
  private _selection: string[] | any[];

  private _forceSelectionMode: DataTableSelectionMode;
  private _selectionEmitMode: DataTableSelectionEmitMode = 'NONE';
  private _filterMode: DataTableFilterMode = 'NONE';
  private _filterValue: string | DataTableFilterObject | undefined;

  private _allColumnDefinitions: DataTableColumnDefinition[] = [];
  private _allAvailableColumns: DataTableColumn[];
  private _selectedColumnDefinition: DataTableColumnDefinition;
  private _showColumnModal = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private matDialog: MatDialog,
    @Inject(MAD_DATA_TABLE_PERSISTENCE_SERVICE) private persistenceService: DataTablePersistenceService,
    @Inject(MAD_DATA_TABLE_GLOBAL_CONFIGURATION) private dataTableGlobalConfig: DataTableGlobalConfiguration,
  ) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngAfterViewInit(): void {
    if (!this._useAsync) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.applySortData();
    this.initState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('tableData' in changes) {
      this.updateDataTableData();
      this.updateSelectionModel(this.getSelection('ID').length ? this.getSelection('ID') : this._selection);
      if (this.showAll) {
        this.updatePaginator();
      }
    }
    if ('idGenerator' in changes || 'displayedColumns' in changes) {
      this.updateDataTableData();
    }

    // performance reasons (same behaviour could be achived in getters)
    if ('forceMode' in changes || 'forceSelectionMode' in changes || 'actions' in changes) {
      const actions = DataTableActionUtil.getDisplayActions(this.actions, this.selectionMode);
      this.rowActions = actions.rowActions;
      this.tableActions = actions.groupedTableActions;
    }
  }

  /** TABLE DISPLAY HANDLING */

  public getDataTableHeaderType(column: DataTableColumn): DataTableHeaderType {
    if (column.isSortable && !column.isFilterable) {
      return 'SORT';
    }
    if (!column.isSortable && column.isFilterable) {
      return 'FILTER';
    }
    if (column.isSortable && column.isFilterable) {
      return 'SORT_AND_FILTER';
    }
    return 'PLAIN';
  }

  public getCustomCellTemplate(columnId: string): TemplateRef<any> | null {
    const columnDef = this.columnDefs.find((it) => it.madColumnDef === columnId);
    return columnDef && columnDef.cellDef ? columnDef.cellDef.getCellTemplate() : null;
  }

  public getCustomExpandableTemplate(): TemplateRef<any> | null {
    return this.expandableDef?.getCellTemplate() || null;
  }

  public get expandableColumnDef() {
    return this.expandableDef?.columnDef.madExpandableColumnDef || '';
  }

  public onExpand(event: MouseEvent, element: DataTableColumn) {
    this.expandedElement = this.expandedElement === element ? null : element;
    event.stopPropagation();
  }

  /** ACTION BUTTON DISPLAY HANDLING */

  public hasVisibleRowActions(displayedData: any): boolean {
    return !this.rowActions.every((action) => this.isHiddenForData(action, [this._rowMap.get(displayedData.rowId)?.actualData]));
  }

  public isHidden(action: DataTableAction): boolean {
    return this.isHiddenForData(action, this.getSelection('DATA'));
  }

  private isHiddenForData(action: DataTableAction, data: any[]) {
    return !!action.isHidden && action.isHidden(data);
  }

  public isDisabled(action: DataTableAction): boolean {
    return this.isDisabledForActionType(action.type) || (!!action.isDisabled && action.isDisabled(this.getSelection('DATA')));
  }

  private isDisabledForActionType(actionType: string): boolean {
    switch (actionType) {
      case 'SINGLE':
        return this.selectedCount !== 1;
      case 'BATCH':
        return this.selectedCount < 1;
      default:
        return false;
    }
  }

  public getSelectedCount(actionType: string): string {
    const count = this.selectedCount;
    if (actionType !== 'BATCH' || count < 2) {
      return '';
    }
    return ` (${count})`;
  }

  private get selectedCount(): number {
    return this._selectionModel?.selected ? this._selectionModel.selected.length : 0;
  }

  /** TABLE DATA CHANGE HANDLING */

  private updateDataTableData(): void {
    // do not make this function immutable - we desparately need the reference of rowMap to stay the same
    DataTableDataUtil.updateRowMap(this._rowMap, this.tableData, this.columns, this.idGenerator, this.parentIdGenerator);
    this.dataSource.data = Array.from(this._rowMap.values()).map((it) => it.displayedData);
  }

  private updateSelectionModel(selection: string[] | any[]) {
    this._selectionModel.clear();
    selection?.forEach((it) => {
      const item = this._rowMap.get(it) || [...this._rowMap.values()].find((row) => row.actualData === it);
      if (!!item) {
        this.onSelectionEvent(item.id);
      }
    });
    this.emitSelection();
  }

  /** ACTION & SELECTION HANDLING */

  public get selectionEmitMode(): DataTableSelectionEmitMode {
    return this._selectionEmitMode === 'NONE' && !!this.actions.length ? 'ON_ACTION' : this._selectionEmitMode;
  }

  public get selectionMode(): DataTableSelectionMode {
    return !!this._forceSelectionMode ? this._forceSelectionMode : this.actions.find((it) => it.type === 'BATCH') ? 'BATCH' : 'SINGLE';
  }

  public get filteredPageData(): any[] {
    // only use filtered data
    return this.dataSource?._pageData(this.dataSource.filteredData);
  }

  public get showActionColumn(): boolean {
    return !(this.selectionEmitMode === 'NONE' || this.hideActionColumn) || !!this.expandableDef;
  }

  public showCheckbox(displayedData: any): boolean {
    return !displayedData.parentId && this.selectionMode === 'BATCH' && !this.hideActionColumn;
  }

  public showRowActionIcon(displayedData: any): boolean {
    return !displayedData.parentId && this.selectionEmitMode === 'ON_ACTION' && this.selectionMode === 'SINGLE' && !this.hideActionColumn;
  }

  public showRadioButton(displayedData: any): boolean {
    return !displayedData.parentId && this.selectionEmitMode === 'ON_SELECTION' && this.selectionMode === 'SINGLE';
  }

  public showExpandableButton(displayedData: any): boolean {
    return !displayedData.parentId && !!this.expandableDef;
  }

  public isSelected(rowId: string): boolean {
    return this._selectionModel.isSelected(rowId);
  }

  public onToggleSelectAll(): void {
    // clear all selection first
    this._selectionModel.clear();
    // toggle all checkbox
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      // select all rows of the current page
      this.filteredPageData.forEach((row) => {
        if (!row.parentId) {
          this._selectionModel.select(row.rowId);
        }
      });
    }
    this.emitSelection();
  }

  public onActionEvent(action: DataTableAction): void {
    const emitAction = { ...action };
    if (!!emitAction && this.selectionEmitMode !== 'NONE') {
      emitAction.selected = this.getSelection(this.selectionEmitType);
      this.actionEvent.emit(emitAction);
    }
  }

  public onSelectionEvent(id: any): void {
    switch (this.selectionMode) {
      case 'BATCH':
        this._selectionModel.toggle(id);
        break;
      case 'SINGLE':
        this._selectionModel.clear();
        this._selectionModel.toggle(id);
        break;
    }
  }

  public onRowEvent(event: MouseEvent, row: any, action = this.defaultAction): void {
    if (this.selectionEmitMode === 'NONE' || row?.parentId) {
      return;
    }

    this.onSelectionEvent(row.rowId);
    this.processSelection(event, action);
  }

  private get defaultAction(): DataTableAction | undefined {
    return this.selectionEmitMode !== 'NONE' ? this.rowActions[0] : undefined;
  }

  private get hideActionColumn(): boolean {
    return this.selectionEmitMode === 'ON_ACTION' && this.actions.every((it) => it.type === 'NONE');
  }

  private processSelection(event: MouseEvent, action?: DataTableAction): void {
    if (
      this.selectionEmitMode === 'ON_ACTION' &&
      this.selectionMode === 'SINGLE' &&
      !!action &&
      !DataTableComponent.isClickOnRowMenuIcon(event)
    ) {
      this.onActionEvent(action);
    }

    this.emitSelection();
  }

  private emitSelection() {
    if (this.selectionEmitMode === 'ON_SELECTION') {
      this.selectionEvent.emit(this.getSelection(this.selectionEmitType));
    }
  }

  private getSelection(selectionEmitType: DataTableSelectionEmitType): any[] {
    const selection: any[] = [];
    this._selectionModel.selected.forEach((it) =>
      // if ID-generator is provided, return the ID, else return the ACTUAL data
      selection.push(this.idGenerator && selectionEmitType === 'ID' ? it : this._rowMap.get(it)?.actualData),
    );

    return selection;
  }

  private static isClickOnRowMenuIcon(event: MouseEvent): boolean {
    return (event?.target as HTMLElement)?.classList.contains('mat-icon');
  }

  /** SORT HANDLING */

  onSortingEvent(sort: Sort): void {
    if (this._useAsync) {
      this.sortEvent.emit(sort);
    }

    if (this.persistenceConfig.persistSort) {
      this.persistenceService.saveSort(this.id, sort);
    }
  }

  private applySortData() {
    this.dataSource.sortData = this._useAsync
      ? DataTableSortUtil.sortNothing()
      : DataTableSortUtil.sortData([...this.dataTableGlobalConfig.dateTimeFormat], this.dataTableGlobalConfig.numberFormat);
  }

  /** FILTER HANDLING */

  public get filterMode() {
    return this._useAsync && this._filterMode === 'TABLE_BASED' ? 'NONE' : this._filterMode;
  }

  public onTableBasedFilterEvent(event: Event): void {
    this.onFilteringEvent((event.target as HTMLTextAreaElement).value);
  }

  public onColumnBasedFilterEvent(filter: DataTableFilterObject | undefined): void {
    this.onFilteringEvent(filter);
  }

  public onDeleteFilter(): void {
    this.onFilteringEvent(undefined);
    this.filter.updateFilterables(undefined);
  }

  private onFilteringEvent(filter: string | DataTableFilterObject | undefined): void {
    if (this._useAsync) {
      this.filterEvent.emit(filter);
    } else {
      this.allSelected = false;
      this._selectionModel.clear();
      this.applyFilterValue(filter);
    }

    if (this.persistenceConfig.persistFilter) {
      this.persistenceService.saveFilter(this.id, filter);
    }
  }

  private applyFilterPredicate(): void {
    this.dataSource.filterPredicate =
      this.filterMode === 'COLUMN_BASED'
        ? DataTableFilterUtil.columnBasedFilterPredicate(this._rowMap)
        : DataTableFilterUtil.tableBasedFilterPredicate();
    this.applyFilterValue(this._filterValue);
  }

  private applyFilterValue(value: string | DataTableFilterObject | undefined): void {
    const isString = typeof this._filterValue === 'string';
    this.dataSource.filter = !!value ? (isString ? value.trim().toLowerCase() : JSON.stringify(value)) : '';
  }

  /** PAGINATION HANDLING */

  onPageEvent(event: PageEvent): void {
    if (this._useAsync) {
      this.pageEvent.emit(event);
    }

    if (this.persistenceConfig.persistPageSize) {
      this.persistenceService.savePageSize(this.id, event.pageSize);
    }
  }

  get pageIndex(): number {
    return this.showAll ? 0 : this.page.pageIndex;
  }

  get pageSize(): number {
    return this.showAll ? this.dataLength : this.page.pageSize;
  }

  get pageLength(): number {
    return this.showAll ? this.dataLength : this.page.length;
  }

  private updatePaginator() {
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
      this.paginator.page.emit(this.page);
    }
  }

  private get dataLength(): number {
    return this.dataSource.data?.length || 0;
  }

  private get showAll(): boolean {
    return !this._useAsync && !this.paginationEnabled;
  }

  /** INIT STATE */

  private initState(): void {
    // only set default sort if there is no other sort persisted
    if (!!this.defaultSort && !this.persistenceService.loadSort(this.id)?.direction) {
      this.setSort(this.defaultSort);
    }

    if (this.persistenceConfig.persistSort) {
      this.initSortState();
    }
    if (this.persistenceConfig.persistFilter) {
      this.initFilterState();
    }
    if (this.persistenceConfig.persistPageSize) {
      this.initPaginatorState();
    }

    this.changeDetectorRef.detectChanges();
  }

  private initSortState(): void {
    const sort = this.persistenceService.loadSort(this.id);
    if (!!sort) {
      this.setSort(sort);
    }
  }

  private setSort(sort: Sort): void {
    this.sort.active = sort.active;
    this.sort.direction = sort.direction;
    this.sort.sortChange.emit(sort);
  }

  private initFilterState(): void {
    const filter = this.persistenceService.loadFilter(this.id);
    this.filter.updateFilterables(filter);
  }

  private initPaginatorState(): void {
    this.page = {
      pageIndex: 0,
      pageSize: this.persistenceService.loadPageSize(this.id) || this.pageSize,
      length: 0,
    };

    this.updatePaginator();
  }

  /** COLUMN HANDLING */

  public onViewDefinition(definition: DataTableColumnDefinition): void {
    this._selectedColumnDefinition = definition;
    this.viewDefinitionChangeEvent.emit(definition);
  }

  public onColumnSettings(definition?: DataTableColumnDefinition): void {
    this._showColumnModal = true;
    this._selectedColumnDefinition = definition ? definition : this._allColumnDefinitions[0];
    if (this._allAvailableColumns) {
      this.openColumnModal();
    } else {
      // if no complete definitions have been loaded yet send an event so the app can load it
      this.allColumnsEvent.emit();
    }
  }

  public isCurrentDefinition(definition: DataTableColumnDefinition): boolean {
    return this._selectedColumnDefinition && this._selectedColumnDefinition.id === definition.id;
  }

  private openColumnModal(): void {
    const dialogData: DataTableDialogData = {
      allColumns: this._allAvailableColumns,
      definition: this._selectedColumnDefinition,
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
    dialog.afterClosed().subscribe((result) => {
      // no event on CANCEL
      if (result) {
        this.columnDefinitionChangeEvent.emit(result);
      }
    });
  }
}
