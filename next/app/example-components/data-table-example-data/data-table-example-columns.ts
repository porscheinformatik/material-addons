import { DataTableColumn } from '@porscheinformatik/material-addons';

const exampleColumns: DataTableColumn[] = [
  {
    id: '0001-Title',
    label: 'Title',
    isSortable: true,
    orderByName: 'title',
    dataPropertyName: 'title',
  },
  {
    id: '0002-Name',
    label: 'Name',
    isSortable: true,
    orderByName: 'name',
    dataPropertyName: 'name',
  },
  {
    id: '0003-Gender',
    label: 'Gender',
    orderByName: 'gender',
    dataPropertyName: 'gender',
  },
  {
    id: '0004-Age',
    label: 'Age',
    orderByName: 'age',
    dataPropertyName: 'age',
    isRightAligned: true,
    isSortable: true,
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
    id: '0006-Email',
    label: 'Email',
    orderByName: 'email',
    dataPropertyName: 'email',
  },
  {
    id: '0007-RegDate',
    label: 'Registration Date',
    orderByName: 'registered',
    dataPropertyName: 'registered',
    isRightAligned: true,
  },
];

const summaryColumns: DataTableColumn[] = [
  {
    id: 'name',
    label: 'Name',
    isSortable: true,
    orderByName: 'name',
    dataPropertyName: 'name',
  },
  {
    id: 'inOut',
    label: 'Input / output',
    isSortable: true,
    orderByName: 'inOut',
    dataPropertyName: 'inOut',
  },
  {
    id: 'type',
    label: 'Type',
    isSortable: true,
    orderByName: 'type',
    dataPropertyName: 'type',
  },
  {
    id: 'syncAsync',
    label: 'Sync / async',
    isSortable: true,
    orderByName: 'syncAsync',
    dataPropertyName: 'syncAsync',
  },
  {
    id: 'defaultValue',
    label: 'Default value',
    isSortable: true,
    orderByName: 'defaultValue',
    dataPropertyName: 'defaultValue',
  },
  {
    id: 'description',
    label: 'Description',
    isSortable: true,
    orderByName: 'description',
    dataPropertyName: 'description',
  },
];

const filterColumns: DataTableColumn[] = [
  {
    id: '0001-Title',
    label: 'Title',
    isSortable: true,
    orderByName: 'title',
    dataPropertyName: 'title',
    isFilterable: true,
  },
  {
    id: '0002-Name',
    label: 'Name',
    isSortable: true,
    orderByName: 'name',
    dataPropertyName: 'name',
    isFilterable: true,
  },
  {
    id: '0003-Gender',
    label: 'Gender',
    orderByName: 'gender',
    dataPropertyName: 'gender',
    isFilterable: true,
    filterParams: {
      filterOptions: [
        {
          key: 'female',
          label: 'female',
        },
        {
          key: 'male',
          label: 'male',
        },
      ],
    },
  },
  {
    id: '0004-Age',
    label: 'Age',
    orderByName: 'age',
    dataPropertyName: 'age',
    isRightAligned: true,
    isSortable: true,
    isFilterable: true,
  },
  {
    id: '0005-Salary',
    label: 'Salary',
    orderByName: 'salary',
    dataPropertyName: 'salary',
    isRightAligned: true,
    isSortable: true,
    isFilterable: true,
  },
  {
    id: '0006-Email',
    label: 'Email',
    orderByName: 'email',
    dataPropertyName: 'email',
    isFilterable: true,
  },
  {
    id: '0007-RegDate',
    label: 'Registration Date',
    orderByName: 'registered',
    dataPropertyName: 'registered',
    isRightAligned: true,
    isFilterable: true,
  },
];

const idColumns: DataTableColumn[] = [
  {
    id: 'title',
    label: 'Title',
    isSortable: true,
    orderByName: 'title',
    dataPropertyName: 'title',
  },
  {
    id: 'name',
    label: 'Name',
    isSortable: true,
    orderByName: 'name',
    dataPropertyName: 'name',
  },
  {
    id: 'gender',
    label: 'Gender',
    orderByName: 'gender',
    dataPropertyName: 'gender',
  },
  {
    id: 'age',
    label: 'Age',
    orderByName: 'age',
    dataPropertyName: 'age',
    isRightAligned: true,
    isSortable: true,
  },
  {
    id: 'salary',
    label: 'Salary',
    orderByName: 'salary',
    dataPropertyName: 'salary',
    isRightAligned: true,
    isSortable: true,
  },
  {
    id: 'email',
    label: 'Email',
    orderByName: 'email',
    dataPropertyName: 'email',
  },
  {
    id: 'registered',
    label: 'Registration Date',
    orderByName: 'registered',
    dataPropertyName: 'registered',
    isRightAligned: true,
  },
];

export { exampleColumns, filterColumns, idColumns, summaryColumns };
