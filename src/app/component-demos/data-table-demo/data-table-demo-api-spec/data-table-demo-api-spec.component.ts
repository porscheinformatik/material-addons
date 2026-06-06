import { Component } from '@angular/core';

interface ApiSpecRow {
  name: string;
  inOut: 'input' | 'output';
  type: string;
  defaultValue?: string;
  syncAsync?: string;
  description?: string;
}

interface CssCustomPropertyRow {
  property: string;
  description: string;
}

const apiSpecRows: ApiSpecRow[] = [
  {
    name: 'id',
    inOut: 'input',
    type: 'string',
    defaultValue: 'undefined',
    description: 'Unique table identifier used by persistence and generated table element IDs.',
  },
  {
    name: 'filterLabel',
    inOut: 'input',
    type: 'string',
    defaultValue: "'common.filter'",
    description: 'Translation key or literal label for the table filter field.',
  },
  {
    name: 'filterPlaceholder',
    inOut: 'input',
    type: 'string',
    defaultValue: "''",
    description: 'Placeholder text for the table filter field.',
  },
  {
    name: 'filterColumnsLabel',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Filter'",
    description: 'Label for the column settings modal filter field.',
  },
  {
    name: 'filterColumnsPlaceHolder',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Filter available columns'",
    description: 'Placeholder text for the column settings modal filter field.',
  },
  {
    name: 'showEmptyTable',
    inOut: 'input',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Keeps the table structure visible when there are no rows.',
  },
  {
    name: 'noDataText',
    inOut: 'input',
    type: 'string',
    defaultValue: "'No matching data found'",
    description: 'Text displayed when no rows are available.',
  },
  {
    name: 'columnSettingsModalTitleLabel',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Column settings'",
    description: 'Title text for the column settings modal.',
  },
  {
    name: 'selectedLabel',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Selected columns'",
    description: 'Heading for selected columns in the column settings modal.',
  },
  {
    name: 'availableLabel',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Available columns'",
    description: 'Heading for available columns in the column settings modal.',
  },
  {
    name: 'saveLabel',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Save'",
    description: 'Save button label in the column settings modal.',
  },
  {
    name: 'deleteLabel',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Delete'",
    description: 'Delete button label in the column settings modal.',
  },
  {
    name: 'cancelLabel',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Cancel'",
    description: 'Cancel button label in the column settings modal.',
  },
  {
    name: 'infoTextLabel',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Drag and drop a column to select or reorder it.'",
    description: 'Instruction text in the column settings modal.',
  },
  {
    name: 'tableClass',
    inOut: 'input',
    type: 'string',
    defaultValue: 'undefined',
    description: 'Additional CSS class applied to the Material table element.',
  },
  {
    name: 'translateLabels',
    inOut: 'input',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Translates labels with ngx-translate when enabled.',
  },
  {
    name: 'useAsync',
    inOut: 'input',
    type: 'boolean',
    defaultValue: 'false',
    syncAsync: 'async',
    description: 'Enables externally controlled pagination, sorting, and filtering.',
  },
  {
    name: 'stateful',
    inOut: 'input',
    type: 'boolean | undefined',
    defaultValue: 'undefined',
    description: 'Deprecated: use persistenceConfig instead.',
  },
  {
    name: 'persistenceConfig',
    inOut: 'input',
    type: 'DataTablePersistenceConfiguration | null | undefined',
    defaultValue: 'undefined',
    description: 'Controls persisted sort, filter, and page-size state. Null is normalized to undefined.',
  },
  {
    name: 'loading',
    inOut: 'input',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Shows the table loading indicator.',
  },
  {
    name: 'tableData',
    inOut: 'input',
    type: 'any[] | undefined',
    defaultValue: 'undefined',
    description: 'Rows displayed by the table.',
  },
  {
    name: 'idGenerator',
    inOut: 'input',
    type: 'any',
    defaultValue: 'undefined',
    description: 'Function used to derive a stable row ID.',
  },
  {
    name: 'parentIdGenerator',
    inOut: 'input',
    type: 'any',
    defaultValue: 'undefined',
    description: 'Function used to derive parent row IDs for child-row data.',
  },
  {
    name: 'defaultSort',
    inOut: 'input',
    type: 'Sort | undefined',
    defaultValue: 'undefined',
    description: 'Initial sort state.',
  },
  {
    name: 'externalFilter',
    inOut: 'input',
    type: 'any',
    defaultValue: 'undefined',
    description: 'External filter value applied to the table data source.',
  },
  {
    name: 'paginationEnabled',
    inOut: 'input',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Displays pagination controls when enabled.',
  },
  {
    name: 'page',
    inOut: 'input',
    type: 'PageEvent | null | undefined',
    defaultValue: '{ pageIndex: 0, pageSize: 50, length: 0 }',
    syncAsync: 'async',
    description: 'Current externally controlled page state. Null or undefined uses the default page state.',
  },
  {
    name: 'pageSizeOptions',
    inOut: 'input',
    type: 'number[] | null | undefined',
    defaultValue: '[5, 10, 15]',
    description: 'Selectable page sizes for the paginator. Null or undefined normalizes to an empty list.',
  },
  {
    name: 'actions',
    inOut: 'input',
    type: 'DataTableAction[] | null | undefined',
    defaultValue: '[]',
    description: 'Row and table actions displayed by the table. Null or undefined normalizes to an empty list.',
  },
  {
    name: 'selectionEmitType',
    inOut: 'input',
    type: 'DataTableSelectionEmitType',
    defaultValue: "'ID'",
    description: 'Controls whether selection emits row IDs or row data.',
  },
  {
    name: 'showDeleteFilterAction',
    inOut: 'input',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Shows the action for clearing an active table filter.',
  },
  {
    name: 'disableRowClick',
    inOut: 'input',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Disables row click handling.',
  },
  {
    name: 'deleteDefinitionAllowed',
    inOut: 'input',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Allows editable column definitions to be deleted in the column settings modal.',
  },
  {
    name: 'rowExpandable',
    inOut: 'input',
    type: '(data: any) => boolean',
    defaultValue: '() => true',
    description: 'Predicate that controls whether a row can expand.',
  },
  {
    name: 'selection',
    inOut: 'input',
    type: 'string[] | any[] | undefined',
    defaultValue: 'undefined',
    description: 'Externally controlled selected row IDs or row data.',
  },
  {
    name: 'filterEnabled',
    inOut: 'input',
    type: 'boolean | undefined',
    defaultValue: 'undefined',
    description: 'Deprecated: use filterMode instead.',
  },
  {
    name: 'filterMode',
    inOut: 'input',
    type: 'DataTableFilterMode | undefined',
    defaultValue: "'NONE'",
    description: 'Controls table-based, column-based, or disabled filtering. TABLE_BASED is treated as NONE in async mode.',
  },
  {
    name: 'filterValue',
    inOut: 'input',
    type: 'string | DataTableFilterObject | undefined',
    defaultValue: 'undefined',
    description: 'Externally controlled table or column filter value.',
  },
  {
    name: 'externalPaginator',
    inOut: 'input',
    type: 'any',
    defaultValue: 'undefined',
    description: 'External paginator instance used instead of the internal paginator.',
  },
  {
    name: 'defaultPageSize',
    inOut: 'input',
    type: 'number | undefined',
    defaultValue: 'undefined',
    description: 'Initial page size used by the paginator.',
  },
  {
    name: 'selectionEmitMode',
    inOut: 'input',
    type: 'DataTableSelectionEmitMode | undefined',
    defaultValue: "'NONE'",
    description:
      'Controls whether selection is emitted on actions, on selection changes, or not emitted. Defaults to ON_ACTION when actions are configured.',
  },
  {
    name: 'forceMode',
    inOut: 'input',
    type: 'string | undefined',
    defaultValue: 'undefined',
    description: 'Deprecated: use selectionEmitMode and forceSelectionMode instead.',
  },
  {
    name: 'forceSelectionMode',
    inOut: 'input',
    type: 'DataTableSelectionMode | undefined',
    defaultValue: 'undefined',
    description: 'Forces single or batch selection mode.',
  },
  {
    name: 'displayedColumns',
    inOut: 'input',
    type: 'DataTableColumn[] | undefined',
    defaultValue: 'undefined',
    description: 'Columns displayed by the table when displayedColumnDefinition is not used.',
  },
  {
    name: 'displayedColumnDefinition',
    inOut: 'input',
    type: 'DataTableColumnDefinition | undefined',
    defaultValue: 'undefined',
    description: 'Active column definition used to determine displayed columns.',
  },
  {
    name: 'columnDefinitions',
    inOut: 'input',
    type: 'DataTableColumnDefinition[] | null | undefined',
    defaultValue: '[]',
    description: 'Available column definitions for the table. Null or undefined normalizes to an empty list.',
  },
  {
    name: 'allColumns',
    inOut: 'input',
    type: 'DataTableColumn[] | undefined',
    defaultValue: 'undefined',
    description: 'All columns available for the column settings modal.',
  },
  {
    name: 'actionEvent',
    inOut: 'output',
    type: 'DataTableAction',
    description: 'Emits when a row or table action is triggered.',
  },
  {
    name: 'selectionEvent',
    inOut: 'output',
    type: 'any[]',
    description: 'Emits selected row IDs or row data according to selectionEmitType.',
  },
  {
    name: 'sortEvent',
    inOut: 'output',
    type: 'Sort',
    syncAsync: 'async',
    description: 'Emits sort changes when asynchronous mode is enabled.',
  },
  {
    name: 'filterEvent',
    inOut: 'output',
    type: 'string | DataTableFilterObject | undefined',
    syncAsync: 'async',
    description: 'Emits filter changes when asynchronous mode is enabled.',
  },
  {
    name: 'pageEvent',
    inOut: 'output',
    type: 'PageEvent',
    syncAsync: 'async',
    description: 'Emits page changes when asynchronous mode is enabled.',
  },
  {
    name: 'allColumnsEvent',
    inOut: 'output',
    type: 'void',
    description: 'Emits when the column settings modal needs all columns to be loaded.',
  },
  {
    name: 'columnDefinitionChangeEvent',
    inOut: 'output',
    type: 'DataTableColumnDefinitionChange',
    description: 'Emits when a column definition is saved or deleted.',
  },
  {
    name: 'viewDefinitionChangeEvent',
    inOut: 'output',
    type: 'DataTableColumnDefinition',
    description: 'Emits when the active column definition changes.',
  },
];

@Component({
  selector: 'app-data-table-demo-api-spec',
  imports: [],
  templateUrl: './data-table-demo-api-spec.component.html',
  styleUrl: './data-table-demo-api-spec.component.scss',
})
export class DataTableDemoApiSpecComponent {
  readonly properties = apiSpecRows.filter((row) => row.inOut === 'input');
  readonly events = apiSpecRows.filter((row) => row.inOut === 'output');
  readonly cssCustomProperties: CssCustomPropertyRow[] = [
    {
      property: '--datatable-background',
      description: 'Table, sticky header, and loading overlay background color',
    },
    {
      property: '--datatable-hover',
      description: 'Active column definition background color',
    },
  ];
}
