import { DataTableAction, DataTableColumn, DataTableColumnDefinition } from '@porscheinformatik/material-addons';

export interface DataTableStoryRow {
  id: number;
  title: string;
  name: string;
  status: string;
  email: string;
  age: number;
}

export const dataTableStoryRows: DataTableStoryRow[] = [
  {
    id: 1,
    title: 'Ms',
    name: 'Angela Cortes',
    status: 'active',
    email: 'angela.cortes@example.com',
    age: 31,
  },
  {
    id: 2,
    title: 'Mr',
    name: 'Jacob Shaw',
    status: 'pending',
    email: 'jacob.shaw@example.com',
    age: 27,
  },
  {
    id: 3,
    title: 'Dr',
    name: 'Lorena Gomez',
    status: 'inactive',
    email: 'lorena.gomez@example.com',
    age: 42,
  },
  {
    id: 4,
    title: 'Mx',
    name: 'Leo Turner',
    status: 'active',
    email: 'leo.turner@example.com',
    age: 38,
  },
  {
    id: 5,
    title: 'Ms',
    name: 'Eevi Jarvi',
    status: 'pending',
    email: 'eevi.jarvi@example.com',
    age: 24,
  },
  {
    id: 6,
    title: 'Mr',
    name: 'Miguel Lawrence',
    status: 'active',
    email: 'miguel.lawrence@example.com',
    age: 35,
  },
];

export const dataTableBasicColumns: DataTableColumn[] = [
  {
    id: 'title',
    label: 'Title',
    dataPropertyName: 'title',
  },
  {
    id: 'name',
    label: 'Name',
    dataPropertyName: 'name',
  },
  {
    id: 'email',
    label: 'Email',
    dataPropertyName: 'email',
  },
  {
    id: 'age',
    label: 'Age',
    dataPropertyName: 'age',
    isRightAligned: true,
  },
];

export const dataTableSortableColumns: DataTableColumn[] = [
  {
    id: 'title',
    label: 'Title',
    dataPropertyName: 'title',
    orderByName: 'title',
    isSortable: true,
  },
  {
    id: 'name',
    label: 'Name',
    dataPropertyName: 'name',
    orderByName: 'name',
    isSortable: true,
  },
  {
    id: 'status',
    label: 'Status',
    dataPropertyName: 'status',
    orderByName: 'status',
    isSortable: true,
  },
  {
    id: 'age',
    label: 'Age',
    dataPropertyName: 'age',
    orderByName: 'age',
    isRightAligned: true,
    isSortable: true,
  },
];

export const dataTableFilterColumns: DataTableColumn[] = [
  {
    id: 'title',
    label: 'Title',
    dataPropertyName: 'title',
    orderByName: 'title',
    isSortable: true,
    isFilterable: true,
  },
  {
    id: 'name',
    label: 'Name',
    dataPropertyName: 'name',
    orderByName: 'name',
    isSortable: true,
    isFilterable: true,
  },
  {
    id: 'status',
    label: 'Status',
    dataPropertyName: 'status',
    isFilterable: true,
    filterParams: {
      filterOptions: [
        { key: 'active', label: 'Active' },
        { key: 'pending', label: 'Pending' },
        { key: 'inactive', label: 'Inactive' },
      ],
    },
  },
  {
    id: 'age',
    label: 'Age',
    dataPropertyName: 'age',
    orderByName: 'age',
    isRightAligned: true,
    isSortable: true,
    isFilterable: true,
  },
];

export const dataTableStoryActions: DataTableAction[] = [
  {
    label: 'Create',
    action: 'CREATE',
    type: 'NONE',
  },
  {
    label: 'Edit',
    action: 'EDIT',
    type: 'SINGLE',
  },
  {
    label: 'Archive selected',
    action: 'ARCHIVE',
    type: 'BATCH',
  },
];

export const dataTableTemplateColumns: DataTableColumn[] = [
  {
    id: 'title',
    label: 'Title',
    dataPropertyName: 'title',
    orderByName: 'title',
    isSortable: true,
  },
  {
    id: 'name',
    label: 'Name',
    dataPropertyName: 'name',
    orderByName: 'name',
    isSortable: true,
  },
  {
    id: 'status',
    label: 'Status',
    dataPropertyName: 'status',
  },
  {
    id: 'email',
    label: 'Email',
    dataPropertyName: 'email',
  },
  {
    id: 'age',
    label: 'Age',
    dataPropertyName: 'age',
    orderByName: 'age',
    isRightAligned: true,
    isSortable: true,
  },
];

export const dataTableColumnDefinitions: DataTableColumnDefinition[] = [
  {
    id: 'storybook-editable',
    label: 'Editable columns',
    editable: true,
    displayedColumns: [dataTableTemplateColumns[1], dataTableTemplateColumns[2], dataTableTemplateColumns[4]],
  },
  {
    id: 'storybook-contact',
    label: 'Contact columns',
    displayedColumns: [dataTableTemplateColumns[1], dataTableTemplateColumns[3]],
  },
];
