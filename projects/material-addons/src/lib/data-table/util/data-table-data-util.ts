import { DataTableRow } from "../configuration/data-table-row";
import { DataTableColumn } from "../data-table";
import { v4 as uuidV4 } from "uuid";

export class DataTableDataUtil {
  public static updateRowMap(
    rowMap: Map<string, DataTableRow>,
    data: any[] | undefined,
    columns: DataTableColumn[],
    idGenerator: (data: any) => string,
    parentIdGenerator: (data: any) => string
  ): Map<string, DataTableRow> {
    rowMap.clear();

    data?.forEach((it) => {
      const rowId: string = DataTableDataUtil.createRowId(it, idGenerator);
      const dataRow: DataTableRow = DataTableDataUtil.createDataTableRow(it, rowId, parentIdGenerator, columns);
      rowMap.set(rowId, dataRow);
    });

    return rowMap;
  }

  private static createRowId(data: any, idGenerator: (data: any) => string): string {
    let id;
    if (!!idGenerator) {
      id = idGenerator(data);
    }
    return (!!id ? id : uuidV4()).toString();
  }

  private static createDataTableRow(
    data: any,
    rowId: string,
    parentIdGenerator: (data: any) => string,
    columns: DataTableColumn[]
  ) {
    const parentId = parentIdGenerator ? parentIdGenerator(data) : undefined;
    const displayedData = DataTableDataUtil.createDisplayedData(rowId, parentId, data, columns);
    const dataRow: DataTableRow = {
      id: rowId,
      parentId: parentId,
      actualData: data,
      displayedData: displayedData,
    };
    return dataRow;
  }

  private static createDisplayedData(
    rowId: string,
    parentId: string | undefined,
    actualDataElement: any,
    columns: DataTableColumn[]
  ): any {
    const displayedData: { [key: string]: any } = {};
    displayedData["rowId"] = rowId;
    displayedData["parentId"] = parentId;
    // keep non displayed data in row
    for (const key of Object.keys(actualDataElement)) {
      const column = columns.find((it) => it.dataPropertyName === key);
      const actualValue = actualDataElement[key];
      displayedData[key] = DataTableDataUtil.transformData(actualValue, column?.transformer, column?.transformerParams);
    }
    return displayedData;
  }

  static transformData(
    value: any,
    transformer: (data: any, transformerParams: any) => any,
    transformerParams: any
  ): any {
    if (!transformer || !(transformer instanceof Function)) {
      return value;
    }
    return transformer(value, transformerParams);
  }
}
