import { DataTableFilterObject } from '../data-table-filter/data-table-filter-object';

export class DataTableFilterUtil {
  public static columnBasedFilterPredicate(rowMap: any): (row: any, filterString: any) => boolean {
    return (row: any, filterString: string): boolean => {
      const actualData = rowMap.get(row.rowId)?.actualData;
      const displayedData = row;
      const filters: DataTableFilterObject = JSON.parse(filterString);
      return Object.entries(filters).every(
        ([key, value]) => !value || this.contains(actualData, key, value) || this.contains(displayedData, key, value),
      );
    };
  }

  public static tableBasedFilterPredicate(): (data: any, filter: any) => boolean {
    return (data: any, filter: any) => {
      const transform = (str: string) =>
        str
          .trim()
          .toLowerCase()
          .replace(/^"(.*)"$/, '$1');
      const dataStr = transform(JSON.stringify(data));
      return dataStr.indexOf(transform(filter)) != -1;
    };
  }

  private static contains(data: any, key: string, searchTerm: string): boolean {
    return (String((data as any)[key]) ?? '').toLowerCase().includes(searchTerm.toLowerCase());
  }
}
