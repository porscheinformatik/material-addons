import { DataTableColumn } from 'material-addons';

const columns: DataTableColumn[] = [
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

export { columns };
