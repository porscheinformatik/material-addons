import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import {
  DataTableAction,
  DataTableColumn,
  DataTableComponent,
  DataTableFilterMode,
  DataTableFilterObject,
  DataTableSelectionEmitMode,
  DataTableSelectionMode,
} from '@porscheinformatik/material-addons';
import {
  DataTableAsyncExternalStoryHostComponent,
  DataTableColumnDefinitionStoryHostComponent,
  DataTableCustomTemplatesStoryHostComponent,
  DataTableExpandableRowsStoryHostComponent,
  DataTablePersistenceStoryHostComponent,
} from './data-table-advanced-story-hosts';
import {
  dataTableBasicColumns,
  dataTableFilterColumns,
  dataTableSortableColumns,
  dataTableStoryActions,
  dataTableStoryRows,
} from './data-table-story-data';
import { dataTableStoryProviders } from './data-table-story-config';

interface DataTableStoryArgs {
  id?: string;
  tableData?: unknown[];
  displayedColumns?: DataTableColumn[];
  actions?: DataTableAction[];
  loading?: boolean;
  paginationEnabled?: boolean;
  filterMode?: DataTableFilterMode;
  translateLabels?: boolean;
  showEmptyTable?: boolean;
  noDataText?: string;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  selectionEmitMode?: DataTableSelectionEmitMode;
  forceSelectionMode?: DataTableSelectionMode;
  actionEvent?: (event: DataTableAction) => void;
  selectionEvent?: (event: unknown[]) => void;
  sortEvent?: (event: Sort) => void;
  filterEvent?: (event: string | DataTableFilterObject | undefined) => void;
  pageEvent?: (event: PageEvent) => void;
}

const dataTableTemplate = `
  <div style="max-width: 1080px;">
    <mad-data-table
      [id]="id"
      [tableData]="tableData"
      [displayedColumns]="displayedColumns"
      [loading]="loading"
      [paginationEnabled]="paginationEnabled"
      [filterMode]="filterMode"
      [translateLabels]="translateLabels"
      [showEmptyTable]="showEmptyTable"
      [noDataText]="noDataText"
      [defaultPageSize]="defaultPageSize"
      [pageSizeOptions]="pageSizeOptions"
      [actions]="actions"
      [selectionEmitMode]="selectionEmitMode"
      (actionEvent)="actionEvent($event)"
      (selectionEvent)="selectionEvent($event)"
      (sortEvent)="sortEvent($event)"
      (filterEvent)="filterEvent($event)"
      (pageEvent)="pageEvent($event)"
    />
  </div>
`;

const selectionActionsTemplate = `
  <div style="max-width: 1080px;">
    <mad-data-table
      [id]="id"
      [tableData]="tableData"
      [displayedColumns]="displayedColumns"
      [paginationEnabled]="paginationEnabled"
      [translateLabels]="translateLabels"
      [defaultPageSize]="defaultPageSize"
      [pageSizeOptions]="pageSizeOptions"
      [actions]="actions"
      [selectionEmitMode]="selectionEmitMode"
      [forceSelectionMode]="forceSelectionMode"
      (actionEvent)="actionEvent($event)"
      (selectionEvent)="selectionEvent($event)"
    />
  </div>
`;

const meta: Meta<DataTableStoryArgs> = {
  title: 'Components/Data Table',
  decorators: [
    moduleMetadata({
      imports: [
        DataTableComponent,
        DataTableAsyncExternalStoryHostComponent,
        DataTableColumnDefinitionStoryHostComponent,
        DataTableCustomTemplatesStoryHostComponent,
        DataTableExpandableRowsStoryHostComponent,
        DataTablePersistenceStoryHostComponent,
      ],
    }),
    applicationConfig({
      providers: dataTableStoryProviders,
    }),
  ],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    tableData: { control: 'object' },
    displayedColumns: { control: 'object' },
    actions: { control: 'object' },
    loading: { control: 'boolean' },
    paginationEnabled: { control: 'boolean' },
    filterMode: {
      control: { type: 'select' },
      options: ['NONE', 'TABLE_BASED', 'COLUMN_BASED'] satisfies DataTableFilterMode[],
    },
    translateLabels: { control: 'boolean' },
    showEmptyTable: { control: 'boolean' },
    noDataText: { control: 'text' },
    defaultPageSize: { control: 'number' },
    pageSizeOptions: { control: 'object' },
    selectionEmitMode: {
      control: { type: 'select' },
      options: ['NONE', 'ON_ACTION', 'ON_SELECTION'],
    },
    forceSelectionMode: {
      control: { type: 'select' },
      options: ['SINGLE', 'BATCH'],
    },
    actionEvent: { action: 'actionEvent' },
    selectionEvent: { action: 'selectionEvent' },
    sortEvent: { action: 'sortEvent' },
    filterEvent: { action: 'filterEvent' },
    pageEvent: { action: 'pageEvent' },
  },
  args: {
    id: 'storybook-data-table',
    tableData: dataTableStoryRows,
    displayedColumns: dataTableFilterColumns,
    actions: [],
    loading: false,
    paginationEnabled: true,
    filterMode: 'NONE',
    translateLabels: false,
    showEmptyTable: true,
    noDataText: 'No matching data found',
    defaultPageSize: 5,
    pageSizeOptions: [5, 10, 15],
    selectionEmitMode: 'NONE',
  },
};

export default meta;

type Story = StoryObj<DataTableStoryArgs>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: dataTableTemplate,
  }),
};

export const Basic: Story = {
  args: {
    displayedColumns: dataTableBasicColumns,
    paginationEnabled: false,
    filterMode: 'NONE',
  },
  render: (args) => ({
    props: args,
    template: dataTableTemplate,
  }),
};

export const Sortable: Story = {
  args: {
    displayedColumns: dataTableSortableColumns,
    filterMode: 'NONE',
  },
  render: (args) => ({
    props: args,
    template: dataTableTemplate,
  }),
};

export const TableFilter: Story = {
  args: {
    displayedColumns: dataTableSortableColumns,
    filterMode: 'TABLE_BASED',
  },
  render: (args) => ({
    props: args,
    template: dataTableTemplate,
  }),
};

export const ColumnFilter: Story = {
  args: {
    displayedColumns: dataTableFilterColumns,
    filterMode: 'COLUMN_BASED',
  },
  render: (args) => ({
    props: args,
    template: dataTableTemplate,
  }),
};

export const SelectionAndActions: Story = {
  args: {
    displayedColumns: dataTableSortableColumns,
    actions: dataTableStoryActions,
    selectionEmitMode: 'ON_ACTION',
    forceSelectionMode: 'BATCH',
  },
  render: (args) => ({
    props: args,
    template: selectionActionsTemplate,
  }),
};

export const Loading: Story = {
  args: {
    displayedColumns: dataTableBasicColumns,
    loading: true,
    paginationEnabled: false,
  },
  render: (args) => ({
    props: args,
    template: dataTableTemplate,
  }),
};

export const Empty: Story = {
  args: {
    tableData: [],
    displayedColumns: dataTableBasicColumns,
    noDataText: 'No data for the current selection',
    paginationEnabled: false,
    showEmptyTable: true,
  },
  render: (args) => ({
    props: args,
    template: dataTableTemplate,
  }),
};

const advancedStoryParameters = {
  controls: { disable: true },
};

export const Persistence: Story = {
  parameters: advancedStoryParameters,
  render: () => ({
    template: '<mad-data-table-persistence-story-host />',
  }),
};

export const CustomColumnTemplates: Story = {
  parameters: advancedStoryParameters,
  render: () => ({
    template: '<mad-data-table-custom-templates-story-host />',
  }),
};

export const ExpandableRows: Story = {
  parameters: advancedStoryParameters,
  render: () => ({
    template: '<mad-data-table-expandable-rows-story-host />',
  }),
};

export const AsyncExternalPaginationAndSorting: Story = {
  parameters: advancedStoryParameters,
  render: () => ({
    template: '<mad-data-table-async-external-story-host />',
  }),
};

export const ColumnDefinitionModal: Story = {
  parameters: advancedStoryParameters,
  render: () => ({
    template: '<mad-data-table-column-definition-story-host />',
  }),
};
