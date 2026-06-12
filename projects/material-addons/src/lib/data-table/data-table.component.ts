import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  TemplateRef,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
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
  DataTableGlobalConfiguration,
  MAD_DATA_TABL_GLOBAL_CONFIGURATION_PROVIDER,
  MAD_DATA_TABLE_GLOBAL_CONFIGURATION,
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
import { DataTableTemplateExpandableCellDefinition } from './data-table-template/data-table-template-expandable-cell-definition.directive';
import { DataTablePersistenceConfiguration } from './configuration/data-table-persistence-configuration';
import { MatTooltip } from '@angular/material/tooltip';
import {
  arrayOrEmpty,
  DEFAULT_PAGE,
  DEFAULT_PERSISTENCE_CONFIG,
  isDeprecatedForceSelectionMode,
  pageOrDefault,
  persistenceConfigOrUndefined,
} from './data-table-input-transforms';

@Component({
  selector: 'mad-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
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
    MatTooltip,
  ],
  providers: [DATA_TABLE_PERSISTENCE_SERVICE_PROVIDER, MAD_DATA_TABL_GLOBAL_CONFIGURATION_PROVIDER],
})
export class DataTableComponent implements AfterViewInit {
  readonly id = input<string>();

  // Translations
  readonly filterLabel = input('common.filter');
  readonly filterPlaceholder = input('');
  readonly filterColumnsLabel = input('Filter');
  readonly filterColumnsPlaceHolder = input('Filter available columns');
  readonly showEmptyTable = input(false);
  readonly noDataText = input('No matching data found');
  readonly columnSettingsModalTitleLabel = input('Column settings');
  readonly selectedLabel = input('Selected columns');
  readonly availableLabel = input('Available columns');
  readonly saveLabel = input('Save');
  readonly deleteLabel = input('Delete');
  readonly cancelLabel = input('Cancel');
  readonly infoTextLabel = input('Drag and drop a column to select or reorder it.');
  readonly tableClass = input<string>();

  readonly translateLabels = input(true);

  readonly useAsync = input(false);

  /**
   * @deprecated
   * Please use the more specific persistenceConfig instead
   */
  readonly stateful = input<boolean | undefined>(undefined);

  readonly persistenceConfig = input<DataTablePersistenceConfiguration | undefined, DataTablePersistenceConfiguration | null | undefined>(
    undefined,
    { transform: persistenceConfigOrUndefined },
  );

  readonly loading = input(false);

  readonly tableData = input<any[] | undefined>();
  readonly idGenerator = input<any>();
  readonly parentIdGenerator = input<any>();

  readonly defaultSort = input<Sort>();
  readonly externalFilter = input<any>();
  readonly paginationEnabled = input(false);
  readonly page = input<PageEvent, PageEvent | null | undefined>(DEFAULT_PAGE, { transform: pageOrDefault });
  readonly pageSizeOptions = input<number[], number[] | null | undefined>([5, 10, 15], { transform: arrayOrEmpty });

  readonly actions = input<DataTableAction[], DataTableAction[] | null | undefined>([], { transform: arrayOrEmpty });
  readonly selectionEmitType = input<DataTableSelectionEmitType>('ID');
  readonly showDeleteFilterAction = input(true);
  readonly disableRowClick = input(false);

  readonly deleteDefinitionAllowed = input(false);
  readonly rowExpandable = input<(data: any) => boolean>(() => true);

  readonly selection = input<string[] | any[] | undefined>();

  /**
   * @deprecated
   * Please use "filterMode" instead
   */
  readonly filterEnabled = input<boolean | undefined>(undefined);

  readonly filterModeInput = input<DataTableFilterMode | undefined>(undefined, { alias: 'filterMode' });
  readonly filterValueInput = input<string | DataTableFilterObject | undefined>(undefined, { alias: 'filterValue' });

  readonly externalPaginator = input<any>();
  readonly defaultPageSize = input<number | undefined>();
  readonly selectionEmitModeInput = input<DataTableSelectionEmitMode | undefined>(undefined, { alias: 'selectionEmitMode' });

  /**
   * @deprecated
   * This function mixes up 2 responsibilities:
   *  - determining if actions should be displayed / handled
   *  - determining whether actions are row based (single) or table based (batch)
   * Please use a combination of "selectionEmitMode" and "selectionMode" instead:
   *  - selectionEmitMode determines how selected items are handled (as part of actions, as selections or not at all)
   *  - selectionMode determines if selected items are treated separately (single) or together (batch)
   */
  readonly forceMode = input<string | undefined>();
  readonly forceSelectionMode = input<DataTableSelectionMode | undefined>();

  readonly displayedColumnsInput = input<DataTableColumn[] | undefined>(undefined, { alias: 'displayedColumns' });
  readonly displayedColumnDefinition = input<DataTableColumnDefinition | undefined>();
  readonly columnDefinitions = input<DataTableColumnDefinition[], DataTableColumnDefinition[] | null | undefined>([], {
    transform: arrayOrEmpty,
  });
  readonly allColumns = input<DataTableColumn[] | undefined>();

  readonly actionEvent = output<DataTableAction>();
  readonly selectionEvent = output<any[]>();

  readonly sortEvent = output<Sort>();
  readonly filterEvent = output<string | DataTableFilterObject | undefined>();
  readonly pageEvent = output<PageEvent>();

  readonly allColumnsEvent = output<void>();
  readonly columnDefinitionChangeEvent = output<DataTableColumnDefinitionChange>();
  readonly viewDefinitionChangeEvent = output<DataTableColumnDefinition>();

  readonly paginator = viewChild(MatPaginator);
  readonly matSort = viewChild(MatSort);
  readonly filter = viewChild(DataTableFilter);
  readonly columnDefs = contentChildren(DataTableTemplateColumnDefinition);
  readonly expandableDef = contentChild(DataTableTemplateExpandableCellDefinition);

  dataSource = new MatTableDataSource<any>();
  allSelected = false;

  extPaginator: any;

  readonly ACTION_COLUMN_NAME = '__action__';

  readonly effectivePersistenceConfig = computed<DataTablePersistenceConfiguration>(() => {
    const persistenceConfig = this.persistenceConfig();
    const stateful = this.stateful();

    if (persistenceConfig) {
      return persistenceConfig;
    }

    if (stateful !== undefined) {
      return {
        persistSort: stateful,
        persistFilter: stateful,
        persistPageSize: stateful,
      };
    }

    return DEFAULT_PERSISTENCE_CONFIG;
  });

  readonly filterModeState = computed<DataTableFilterMode>(() => {
    const configuredFilterMode = this.filterModeInput();
    const filterEnabled = this.filterEnabled();
    const baseFilterMode = configuredFilterMode ?? (filterEnabled === undefined ? 'NONE' : filterEnabled ? 'TABLE_BASED' : 'NONE');

    return this.useAsync() && baseFilterMode === 'TABLE_BASED' ? 'NONE' : baseFilterMode;
  });

  readonly deprecatedForceSelectionMode = computed<DataTableSelectionMode | undefined>(() => {
    const forceMode = this.forceMode();
    return isDeprecatedForceSelectionMode(forceMode) ? forceMode : undefined;
  });

  readonly effectiveForceSelectionMode = computed<DataTableSelectionMode | undefined>(
    () => this.forceSelectionMode() ?? this.deprecatedForceSelectionMode(),
  );

  readonly selectionModeState = computed<DataTableSelectionMode>(() => {
    const forcedMode = this.effectiveForceSelectionMode();

    if (forcedMode) {
      return forcedMode;
    }

    return this.actions().find((it) => it.type === 'BATCH') ? 'BATCH' : 'SINGLE';
  });

  readonly selectionEmitModeState = computed<DataTableSelectionEmitMode>(() => {
    const useDeprecatedForceModeEmitMode = !this.forceSelectionMode() && this.deprecatedForceSelectionMode();
    const configuredMode = this.selectionEmitModeInput() ?? (useDeprecatedForceModeEmitMode ? 'ON_ACTION' : 'NONE');

    return configuredMode === 'NONE' && this.actions().length ? 'ON_ACTION' : configuredMode;
  });

  readonly columnsState = computed<DataTableColumn[]>(
    () => this.displayedColumnDefinition()?.displayedColumns ?? this.displayedColumnsInput() ?? [],
  );
  readonly columnIdsState = computed<string[]>(() => [this.ACTION_COLUMN_NAME, ...this.columnsState().map((column) => column.id)]);

  private readonly displayActions = computed(() => DataTableActionUtil.getDisplayActions(this.actions(), this.selectionModeState()));
  readonly rowActionsState = computed<DataTableAction[]>(() => this.displayActions().rowActions);
  readonly tableActionsState = computed<DataTableAction[][]>(() => this.displayActions().groupedTableActions);

  readonly editableColumnDefinitionsState = computed<DataTableColumnDefinition[]>(() =>
    this.columnDefinitions().filter((definition) => definition.editable),
  );
  readonly viewableColumnDefinitionsState = computed<DataTableColumnDefinition[]>(() =>
    this.columnDefinitions().filter((definition) => definition.displayedColumns?.length > 0),
  );

  readonly showAll = computed(() => !this.useAsync() && !this.paginationEnabled());
  readonly pageIndexState = computed(() => (this.showAll() ? 0 : this.pageState().pageIndex));
  readonly pageSizeState = computed(() => (this.showAll() ? this.dataLength() : this.pageState().pageSize));
  readonly pageLengthState = computed(() => (this.showAll() ? this.dataLength() : this.pageState().length));

  get filterMode(): DataTableFilterMode {
    return this.filterModeState();
  }

  get selectionMode(): DataTableSelectionMode {
    return this.selectionModeState();
  }

  get selectionEmitMode(): DataTableSelectionEmitMode {
    return this.selectionEmitModeState();
  }

  get columns(): DataTableColumn[] {
    return this.columnsState();
  }

  get columnIds(): string[] {
    return this.columnIdsState();
  }

  get rowActions(): DataTableAction[] {
    return this.rowActionsState();
  }

  get tableActions(): DataTableAction[][] {
    return this.tableActionsState();
  }

  get editableColumnDefinitions(): DataTableColumnDefinition[] {
    return this.editableColumnDefinitionsState();
  }

  get viewableColumnDefinitions(): DataTableColumnDefinition[] {
    return this.viewableColumnDefinitionsState();
  }

  get pageIndex(): number {
    return this.pageIndexState();
  }

  get pageSize(): number {
    return this.pageSizeState();
  }

  get pageLength(): number {
    return this.pageLengthState();
  }

  expandedElement: DataTableColumn | null;

  private _rowMap = new Map<string, DataTableRow>();
  private _selectionModel = new SelectionModel<string>(true);

  private _sort: MatSort | null = null;
  private _pendingSort: Sort | null = null;

  private readonly pageState = signal<PageEvent>(DEFAULT_PAGE);
  private readonly dataLength = signal(0);
  private readonly _filterValue = signal<string | DataTableFilterObject | undefined>(undefined);
  private readonly selectedColumnDefinition = signal<DataTableColumnDefinition | undefined>(undefined);

  private _showColumnModal = false;
  private previousForceSelectionMode: DataTableSelectionMode | undefined;

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly matDialog = inject(MatDialog);
  private readonly persistenceService = inject<DataTablePersistenceService>(MAD_DATA_TABLE_PERSISTENCE_SERVICE);
  private readonly dataTableGlobalConfig = inject<DataTableGlobalConfiguration>(MAD_DATA_TABLE_GLOBAL_CONFIGURATION);

  constructor() {
    this.registerSignalEffects();
  }

  ngAfterViewInit(): void {
    if (!this.useAsync()) {
      this.dataSource.paginator = this.paginator() ?? null;
      this.dataSource.sort = this._sort ?? null;
    }
    this.applySortData();
    this.initState();
  }

  private registerSignalEffects(): void {
    this.registerMatSortEffect();
    this.registerUseAsyncEffect();
    this.registerExternalPaginatorEffect();
    this.registerPageInputEffect();
    this.registerFilterModeEffect();
    this.registerFilterValueEffect();
    this.registerDataInputEffect();
    this.registerSelectionInputEffect();
    this.registerDisplayedColumnDefinitionEffect();
    this.registerForceSelectionModeEffect();
    this.registerAllColumnsEffect();
  }

  private registerMatSortEffect(): void {
    effect(() => {
      const matSort = this.matSort();

      if (!matSort) {
        return;
      }

      this._sort = matSort;
      this.dataSource.sort = matSort;
      untracked(() => this.applyPendingSort());
    });
  }

  private registerUseAsyncEffect(): void {
    effect(() => {
      this.useAsync();
      untracked(() => this.applySortData());
    });
  }

  private registerExternalPaginatorEffect(): void {
    effect(() => {
      this.extPaginator = this.externalPaginator();
    });
  }

  private registerPageInputEffect(): void {
    effect(() => {
      const page = this.page();
      const defaultPageSize = this.defaultPageSize();

      this.pageState.set({
        ...page,
        pageSize: defaultPageSize ?? page.pageSize,
      });
    });
  }

  private registerFilterModeEffect(): void {
    effect(() => {
      this.filterModeState();
      untracked(() => this.applyFilterPredicate());
    });
  }

  private registerFilterValueEffect(): void {
    effect(() => {
      const filterValue = this.filterValueInput();
      this._filterValue.set(filterValue);
      untracked(() => this.applyFilterValue(filterValue));
    });
  }

  private registerDataInputEffect(): void {
    effect(() => {
      const tableData = this.tableData();
      const columns = this.columnsState();
      const idGenerator = this.idGenerator();
      const parentIdGenerator = this.parentIdGenerator();
      const showAll = this.showAll();

      untracked(() => {
        this.updateDataTableData(tableData, columns, idGenerator, parentIdGenerator);
        const selection = this.selection();
        this.updateSelectionModel(this.getSelection('ID').length ? this.getSelection('ID') : selection);
        if (showAll) {
          this.updatePaginator();
        }
      });
    });
  }

  private registerSelectionInputEffect(): void {
    effect(() => {
      const selection = this.selection();
      untracked(() => this.updateSelectionModel(selection));
    });
  }

  private registerDisplayedColumnDefinitionEffect(): void {
    effect(() => {
      const displayedColumnDefinition = this.displayedColumnDefinition();

      if (displayedColumnDefinition) {
        this.selectedColumnDefinition.set(displayedColumnDefinition);
      }
    });
  }

  private registerForceSelectionModeEffect(): void {
    effect(() => {
      const nextMode = this.effectiveForceSelectionMode();

      if (this.previousForceSelectionMode !== nextMode) {
        this.previousForceSelectionMode = nextMode;
        untracked(() => {
          this._selectionModel.clear();
          const selection = this.selection();
          if (selection !== undefined) {
            this.updateSelectionModel(selection);
          }
        });
      }
    });
  }

  private registerAllColumnsEffect(): void {
    effect(() => {
      const allColumns = this.allColumns();

      if (allColumns && this._showColumnModal) {
        untracked(() => this.openColumnModal());
      }
    });
  }

  /** TABLE DISPLAY HANDLING */

  getDataTableHeaderType(column: DataTableColumn): DataTableHeaderType {
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

  getCustomCellTemplate(columnId: string): TemplateRef<any> | null {
    const columnDef = this.columnDefs().find((it) => it.madColumnDef() === columnId);
    return columnDef && columnDef.cellDef ? columnDef.cellDef.getCellTemplate() : null;
  }

  getCustomExpandableTemplate(): TemplateRef<any> | null {
    return this.expandableDef()?.getCellTemplate() || null;
  }

  get expandableColumnDef() {
    return this.expandableDef()?.columnDef.madExpandableColumnDef() || '';
  }

  onExpand(event: MouseEvent, element: DataTableColumn) {
    if (this.rowExpandable()(element)) {
      this.expandedElement = this.expandedElement === element ? null : element;
    }
    event.stopPropagation();
  }

  /** ACTION BUTTON DISPLAY HANDLING */

  hasVisibleRowActions(displayedData: any): boolean {
    return !this.rowActionsState().every((action) => this.isHiddenForData(action, [this._rowMap.get(displayedData.rowId)?.actualData]));
  }

  isHidden(action: DataTableAction): boolean {
    return this.isHiddenForData(action, this.getSelection('DATA'));
  }

  private isHiddenForData(action: DataTableAction, data: any[]) {
    return !!action.isHidden && action.isHidden(data);
  }

  isDisabled(action: DataTableAction): boolean {
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

  getSelectedCount(actionType: string): string {
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

  private updateDataTableData(
    tableData = this.tableData(),
    columns = this.columnsState(),
    idGenerator = this.idGenerator(),
    parentIdGenerator = this.parentIdGenerator(),
  ): void {
    // do not make this function immutable - we desparately need the reference of rowMap to stay the same
    DataTableDataUtil.updateRowMap(this._rowMap, tableData, columns, idGenerator, parentIdGenerator);
    this.dataSource.data = Array.from(this._rowMap.values()).map((it) => it.displayedData);
    this.dataLength.set(this.dataSource.data?.length || 0);
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

  // get filtered & sorted data of the current page
  get displayedData(): any[] {
    return this.dataSource?._pageData(this.dataSource?.sortData(this.dataSource.filteredData, this.dataSource.sort));
  }

  get showActionColumn(): boolean {
    return !(this.selectionEmitModeState() === 'NONE' || this.hideActionColumn) || !!this.expandableDef();
  }

  showCheckbox(displayedData: any): boolean {
    return !displayedData.parentId && this.selectionModeState() === 'BATCH' && !this.hideActionColumn;
  }

  showRowActionIcon(displayedData: any): boolean {
    return (
      !displayedData.parentId &&
      this.selectionEmitModeState() === 'ON_ACTION' &&
      this.selectionModeState() === 'SINGLE' &&
      !this.hideActionColumn
    );
  }

  showRadioButton(displayedData: any): boolean {
    return !displayedData.parentId && this.selectionEmitModeState() === 'ON_SELECTION' && this.selectionModeState() === 'SINGLE';
  }

  showExpandableButton(displayedData: any): boolean {
    return !displayedData.parentId && !!this.expandableDef() && this.rowExpandable()(displayedData);
  }

  isSelected(rowId: string): boolean {
    return this._selectionModel.isSelected(rowId);
  }

  onToggleSelectAll(): void {
    // clear all selection first
    this._selectionModel.clear();
    // toggle all checkbox
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      // select all rows of the current page
      this.displayedData.forEach((row) => {
        if (!row.parentId) {
          this._selectionModel.select(row.rowId);
        }
      });
    }
    this.emitSelection();
  }

  onActionEvent(action: DataTableAction): void {
    const emitAction = { ...action };
    if (!!emitAction && this.selectionEmitModeState() !== 'NONE') {
      emitAction.selected = this.getSelection(this.selectionEmitType());
      this.actionEvent.emit(emitAction);
    }
  }

  onSelectionEvent(id: any): void {
    switch (this.selectionModeState()) {
      case 'BATCH':
        this._selectionModel.toggle(id);
        break;
      case 'SINGLE':
        this._selectionModel.clear();
        this._selectionModel.toggle(id);
        break;
    }
  }

  onRowEvent(event: MouseEvent, row: any, action = this.defaultAction): void {
    if (this.selectionEmitModeState() === 'NONE' || row?.parentId) {
      return;
    }

    this.onSelectionEvent(row.rowId);
    this.processSelection(event, action);
  }

  private get defaultAction(): DataTableAction | undefined {
    return this.selectionEmitModeState() !== 'NONE' ? this.rowActionsState()[0] : undefined;
  }

  private get hideActionColumn(): boolean {
    return this.selectionEmitModeState() === 'ON_ACTION' && this.actions().every((it) => it.type === 'NONE');
  }

  private processSelection(event: MouseEvent, action?: DataTableAction): void {
    if (
      this.selectionEmitModeState() === 'ON_ACTION' &&
      this.selectionModeState() === 'SINGLE' &&
      !!action &&
      !DataTableComponent.isClickOnRowMenuIcon(event)
    ) {
      this.onActionEvent(action);
    }

    this.emitSelection();
  }

  private emitSelection() {
    if (this.selectionEmitModeState() === 'ON_SELECTION') {
      this.selectionEvent.emit(this.getSelection(this.selectionEmitType()));
    }
  }

  private getSelection(selectionEmitType: DataTableSelectionEmitType): any[] {
    const selection: any[] = [];
    this._selectionModel.selected.forEach((it) =>
      // if ID-generator is provided, return the ID, else return the ACTUAL data
      selection.push(this.idGenerator() && selectionEmitType === 'ID' ? it : this._rowMap.get(it)?.actualData),
    );

    return selection;
  }

  private static isClickOnRowMenuIcon(event: MouseEvent): boolean {
    return (event?.target as HTMLElement)?.classList.contains('mat-icon');
  }

  /** SORT HANDLING */

  onSortingEvent(sort: Sort): void {
    if (this.useAsync()) {
      this.sortEvent.emit(sort);
    }

    if (this.effectivePersistenceConfig().persistSort) {
      this.persistenceService.saveSort(this.id(), sort);
    }
  }

  private applySortData() {
    this.dataSource.sortData = this.useAsync()
      ? DataTableSortUtil.sortNothing()
      : DataTableSortUtil.sortData([...this.dataTableGlobalConfig.dateTimeFormat], this.dataTableGlobalConfig.numberFormat);
  }

  /** FILTER HANDLING */

  onTableBasedFilterEvent(event: Event): void {
    this.onFilteringEvent((event.target as HTMLTextAreaElement).value);
  }

  onColumnBasedFilterEvent(filter: DataTableFilterObject | undefined): void {
    this.onFilteringEvent(filter);
  }

  onDeleteFilter(): void {
    this.onFilteringEvent(undefined);
    this.filter()?.updateFilterables(undefined);
  }

  private onFilteringEvent(filter: string | DataTableFilterObject | undefined): void {
    if (this.useAsync()) {
      this.filterEvent.emit(filter);
    } else {
      this.allSelected = false;
      this._selectionModel.clear();
      this.applyFilterValue(filter);
    }

    if (this.effectivePersistenceConfig().persistFilter) {
      this.persistenceService.saveFilter(this.id(), filter);
    }
  }

  private applyFilterPredicate(): void {
    this.dataSource.filterPredicate =
      this.filterModeState() === 'COLUMN_BASED'
        ? DataTableFilterUtil.columnBasedFilterPredicate(this._rowMap)
        : DataTableFilterUtil.tableBasedFilterPredicate();
    this.applyFilterValue(this._filterValue());
  }

  private applyFilterValue(value: string | DataTableFilterObject | undefined): void {
    const isString = typeof value === 'string';
    this.dataSource.filter = !!value ? (isString ? value.trim().toLowerCase() : JSON.stringify(value)) : '';
  }

  /** PAGINATION HANDLING */

  onPageEvent(event: PageEvent): void {
    if (this.useAsync()) {
      this.pageEvent.emit(event);
    }

    if (this.effectivePersistenceConfig().persistPageSize) {
      this.persistenceService.savePageSize(this.id(), event.pageSize);
    }
  }

  private updatePaginator() {
    const paginator = this.paginator();

    if (paginator) {
      paginator.pageSize = this.pageSizeState();
      paginator.page.emit(this.pageState());
    }
  }

  /** INIT STATE */

  private initState(): void {
    const defaultSort = this.defaultSort();
    const persistenceConfig = this.effectivePersistenceConfig();

    // only set default sort if there is no other sort persisted
    if (!!defaultSort && !this.persistenceService.loadSort(this.id())?.direction) {
      this.setSort(defaultSort);
    }

    if (persistenceConfig.persistSort) {
      this.initSortState();
    }
    if (persistenceConfig.persistFilter) {
      this.initFilterState();
    }
    if (!!this._filterValue() && typeof this._filterValue() !== 'string') {
      this.filter()?.updateFilterables(this._filterValue() as DataTableFilterObject);
    }
    if (persistenceConfig.persistPageSize) {
      this.initPaginatorState();
    }

    this.changeDetectorRef.detectChanges();
  }

  private initSortState(): void {
    const sort = this.persistenceService.loadSort(this.id());
    if (!!sort) {
      this.setSort(sort);
    }
  }

  private setSort(sort: Sort): void {
    if (!this._sort) {
      this._pendingSort = sort;
      return;
    }

    this._pendingSort = null;
    this._sort.active = sort.active;
    this._sort.direction = sort.direction;
    this._sort.sortChange.emit(sort);
  }

  private applyPendingSort(): void {
    const pendingSort = this._pendingSort;

    if (pendingSort) {
      this.setSort(pendingSort);
    }
  }

  private initFilterState(): void {
    const filter = this.persistenceService.loadFilter(this.id());
    this.filter()?.updateFilterables(filter);
    this._filterValue.set(filter);
    this.applyFilterValue(filter);
  }

  private initPaginatorState(): void {
    this.pageState.set({
      pageIndex: 0,
      pageSize: this.persistenceService.loadPageSize(this.id()) || this.pageSizeState(),
      length: 0,
    });

    this.updatePaginator();
  }

  /** COLUMN HANDLING */

  onViewDefinition(definition: DataTableColumnDefinition): void {
    this.selectedColumnDefinition.set(definition);
    this.viewDefinitionChangeEvent.emit(definition);
  }

  onColumnSettings(definition?: DataTableColumnDefinition): void {
    this._showColumnModal = true;
    this.selectedColumnDefinition.set(definition ? definition : this.columnDefinitions()[0]);
    if (this.allColumns()) {
      this.openColumnModal();
    } else {
      // if no complete definitions have been loaded yet send an event so the app can load it
      this.allColumnsEvent.emit();
    }
  }

  isCurrentDefinition(definition: DataTableColumnDefinition): boolean {
    return this.selectedColumnDefinition()?.id === definition.id;
  }

  private openColumnModal(): void {
    const dialogData: DataTableDialogData = {
      allColumns: this.allColumns() ?? [],
      definition: this.selectedColumnDefinition(),
      deleteDefinitionAllowed: this.deleteDefinitionAllowed(),
      filterColumnsLabel: this.filterColumnsLabel(),
      filterColumnsPlaceHolder: this.filterColumnsPlaceHolder(),
      noDataText: this.noDataText(),
      titleLabel: this.columnSettingsModalTitleLabel(),
      selectedLabel: this.selectedLabel(),
      availableLabel: this.availableLabel(),
      saveLabel: this.saveLabel(),
      deleteLabel: this.deleteLabel(),
      cancelLabel: this.cancelLabel(),
      infoTextLabel: this.infoTextLabel(),
    };
    const dialog = this.matDialog.open(DataTableColumnsModalComponent, {
      data: dialogData,
      width: '720px',
      maxWidth: 'calc(100vw - 32px)',
    });
    dialog.afterClosed().subscribe((result) => {
      // no event on CANCEL
      if (result) {
        this.columnDefinitionChangeEvent.emit(result);
      }
    });
  }

  getFilterBadgeContent(): string {
    if (this.filterModeState() === 'COLUMN_BASED') {
      const count = this.filter()?.getActiveFilterCount();
      return count > 0 ? count.toString() : undefined;
    }
    return undefined;
  }

  disableDeleteFilterButton(): boolean {
    return this.filter()?.getActiveFilterCount() === 0;
  }
}
