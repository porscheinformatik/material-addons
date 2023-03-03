import { DataTableColumn } from 'material-addons';

export const CHILD_ROW_COLUMNS: DataTableColumn[] = [
  {
    id: '0001-Title',
    label: 'Title',
    isSortable: false,
    dataPropertyName: 'title',
  },
  {
    id: '0002-Name',
    label: 'Name',
    isSortable: false,
    dataPropertyName: 'name',
  },
  {
    id: '0003-Gender',
    label: 'Gender',
    isSortable: false,
    dataPropertyName: 'gender',
  },
  {
    id: '0004-Age',
    label: 'Age',
    isSortable: false,
    dataPropertyName: 'age',
    isRightAligned: true,
  },
  {
    id: '0005-Salary',
    label: 'Salary',
    isSortable: false,
    dataPropertyName: 'salary',
    isRightAligned: true,
  },
  {
    id: '0006-Email',
    label: 'Email',
    isSortable: false,
    dataPropertyName: 'email',
  },
  {
    id: 'Street',
    label: 'Street',
    isSortable: false,
    dataPropertyName: 'street',
  },
  {
    id: 'City',
    label: 'City',
    isSortable: false,
    dataPropertyName: 'city',
  },
  {
    id: '0007-RegDate',
    label: 'Registration Date',
    isSortable: false,
    dataPropertyName: 'registered',
    isRightAligned: true,
  },
];
