import { MatSort, Sort } from '@angular/material/sort';
import { DateTime } from 'luxon';
import { NumberFormat } from '../configuration/data-table-global-configuration';

export class DataTableSortUtil {
  static sortData(dateTimeFormat?: string[], numberFormat?: NumberFormat): (tableData: any[], matSort: MatSort) => any[] {
    return (tableData: any[], matSort: MatSort) =>
      [...tableData].sort((a, b) => DataTableSortUtil.compare(a, b, matSort, dateTimeFormat, numberFormat));
  }

  static sortNothing(): (tableData: any[], matSort: MatSort) => any[] {
    return (tableData: any[], _: MatSort) => tableData;
  }

  static compare(
    a: Record<string, any>,
    b: Record<string, any>,
    sort: Sort,
    dateTimeFormat?: string[],
    numberFormat?: NumberFormat,
  ): number {
    const x = a[sort.active];
    const y = b[sort.active];
    const ascending = sort.direction === 'asc';

    if (typeof x === 'number' && typeof y === 'number') {
      return DataTableSortUtil.compareNumber(x, y, ascending);
    }
    if (typeof x === 'boolean' && typeof y === 'boolean') {
      return DataTableSortUtil.compareBoolean(x, y, ascending);
    }
    if (typeof x === 'string' || typeof y === 'string') {
      const stringX = String(x ?? '');
      const stringY = String(y ?? '');

      // a string could be a date
      if (!!dateTimeFormat.length) {
        const dates = dateTimeFormat
          .map((it) => ({
            x: DateTime.fromFormat(stringX, it),
            y: DateTime.fromFormat(stringY, it),
          }))
          .find(({ x, y }) => x.isValid && y.isValid);

        if (!!dates) {
          return DataTableSortUtil.compareDate(dates.x, dates.y, ascending);
        }
      }

      // .. but also a formatted number
      if (!!numberFormat) {
        const numberX = DataTableSortUtil.parseNumber(stringX, numberFormat);
        const numberY = DataTableSortUtil.parseNumber(stringY, numberFormat);

        if (typeof numberX === 'number' && typeof numberY === 'number') {
          return DataTableSortUtil.compareNumber(numberX, numberY, ascending);
        }
      }

      return DataTableSortUtil.compareString(stringX, stringY, ascending);
    }

    return 0;
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

  static parseNumber(value: string, numberFormat?: NumberFormat): number | string {
    const sanitized = value
      .replace(numberFormat.groupingSeparator ?? '', '')
      .replace(numberFormat.decimalSeparator ?? '', '.')
      .replace(new RegExp((numberFormat.units ?? []).join('|')), '');

    const numberValue = Number(sanitized);

    if (typeof numberValue === 'number' && !isNaN(numberValue)) {
      return numberValue;
    }

    return value;
  }
}
