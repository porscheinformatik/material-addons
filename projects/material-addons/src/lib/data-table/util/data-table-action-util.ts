import { DataTableAction, DataTableSelectionMode } from "../data-table";

export class DataTableActionUtil {
  public static getDisplayActions(
    actions: DataTableAction[],
    selectionMode: DataTableSelectionMode
  ): {
    rowActions: DataTableAction[];
    groupedTableActions: DataTableAction[][];
  } {
    const rowActions = [];
    const tableActions = [];
    for (const action of actions) {
      if (selectionMode !== action.hiddenInMode) {
        switch (action.type) {
          case "SINGLE":
            if (selectionMode === "SINGLE") {
              rowActions.push(action);
            } else {
              tableActions.push(action);
            }
            break;
          case "BATCH":
            if (selectionMode !== "SINGLE") {
              tableActions.push(action);
            }
            break;
          default:
            tableActions.push(action);
        }
      }
    }

    return {
      rowActions: rowActions,
      groupedTableActions: DataTableActionUtil.getGroupedTableActions(tableActions),
    };
  }

  private static getGroupedTableActions(tableActions: DataTableAction[]): DataTableAction[][] {
    return Object.values(
      tableActions.reduce((result: { [key: number]: DataTableAction[] }, current) => {
        const index = Object.entries(result).findIndex(([, actions]) =>
          actions.find((it) => !!current.groupId && it.groupId === current.groupId)
        );
        const key = index !== -1 ? index : Object.keys(result).length || 0;
        (result[key] = result[key] || []).push(current);
        return result;
      }, {})
    );
  }
}
