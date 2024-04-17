import { MatSort, Sort } from '@angular/material/sort';
import { DateTime } from 'luxon';
import { NumberFormat } from '../configuration/data-table-global-configuration';

export class DataTableSortUtil {
  static sortData(dateTimeFormat: string, numberFormat: NumberFormat): (tableData: any[], matSort: MatSort) => any[] {
    return (tableData: any[], matSort: MatSort) =>
      [...tableData].sort((a, b) => DataTableSortUtil.compare(a, b, matSort, dateTimeFormat, numberFormat));
  }

  static sortNothing(): (tableData: any[], matSort: MatSort) => any[] {
    return (tableData: any[], _: MatSort) => tableData;
  }

  static compare(a: Record<string, any>, b: Record<string, any>, sort: Sort, dateTimeFormat: string, numberFormat: NumberFormat): number {
    const x = a[sort.active];
    const y = b[sort.active];
    const ascending = sort.direction === 'asc';

    switch (typeof x) {
      case 'number':
        if (typeof y !== 'number') {
          return DataTableSortUtil.compareString(String(x), y, ascending);
        }
        return DataTableSortUtil.compareNumber(x, y, ascending);
      case 'string': {
        const stringY = String(y);

        // a string could be a date
        const dateX = DateTime.fromFormat(x, dateTimeFormat);
        const dateY = DateTime.fromFormat(stringY, dateTimeFormat);

        // .. but also a formatted number
        const numberX = DataTableSortUtil.parseNumber(x, numberFormat);
        const numberY = DataTableSortUtil.parseNumber(y, numberFormat);

        if (dateX.isValid && dateY.isValid) {
          return DataTableSortUtil.compareDate(dateX, dateY, ascending);
        }

        if (typeof numberX === 'number' && typeof numberY === 'number') {
          return DataTableSortUtil.compareNumber(numberX, numberY, ascending);
        }

        return DataTableSortUtil.compareString(x, stringY, ascending);
      }
      case 'boolean':
        return DataTableSortUtil.compareBoolean(x, y, ascending);
      default:
        // cannot compare -> return equal
        return 0;
    }
  }

  static compareNumber(x: number, y: number, ascending: boolean): number {
    return ascending ? x - y : y - x;
  }

  static compareDate(x: DateTime, y: DateTime, ascending: boolean): number {
    return DataTableSortUtil.compareNumber(+x, +y, ascending);
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

  static parseNumber(value: string, numberFormat: NumberFormat): number | string {
    const sanitized = value
      .replace(numberFormat.groupingSeparator, '')
      .replace(numberFormat.decimalSeparator, '.')
      .replace(new RegExp(numberFormat.units.join('|')), '');

    const numberValue = Number(sanitized);

    if (typeof numberValue === 'number' && !isNaN(numberValue)) {
      return numberValue;
    }

    return value;
  }
}
