import { MatSort, Sort } from "@angular/material/sort";
import { DateTime } from "luxon";

export class DataTableSortUtil {
  static sortData(format: string): (tableData: any[], matSort: MatSort) => any[] {
    return (tableData: any[], matSort: MatSort) =>
      [...tableData].sort((a, b) => DataTableSortUtil.compare(a, b, matSort, format));
  }

  static sortNothing(): (tableData: any[], matSort: MatSort) => any[] {
    return (tableData: any[], _: MatSort) => tableData;
  }

  static compare(a: Record<string, any>, b: Record<string, any>, sort: Sort, format: string): number {
    const x = a[sort.active];
    const y = b[sort.active];
    const ascending = sort.direction === "asc";

    switch (typeof x) {
      case "number":
        if (typeof y !== "number") {
          return DataTableSortUtil.compareString(String(x), y, ascending);
        }
        return DataTableSortUtil.compareNumber(x, y, ascending);
      case "string": {
        const stringY = String(y);
        const dateX = DateTime.fromFormat(x, format);
        const dateY = DateTime.fromFormat(stringY, format);
        return dateX.isValid && dateY.isValid
          ? DataTableSortUtil.compareDate(dateX, dateY, ascending)
          : DataTableSortUtil.compareString(x, stringY, ascending);
      }
      case "boolean":
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
}
