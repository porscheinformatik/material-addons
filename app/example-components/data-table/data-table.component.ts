import { Component } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { DataTableAction, DataTableColumnHeader } from "@porscheinformatik/material-addons";
import { users } from "./data-table-example-data";
import { formatCurrency } from "@angular/common";

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.scss"]
})
export class DataTableComponent {
  paginationEnabled = true;
  filterEnabled = true;

  displayedColumns: DataTableColumnHeader[] = [
    {
      label: "Name",
      isSortable: true,
      dataPropertyName: "name"
    },
    {
      label: "Gender",
      dataPropertyName: "gender"
    },
    {
      label: "Age",
      dataPropertyName: "age",
      isRightAligned: true,
      isSortable: true
    },
    {
      label: "Salary",
      dataPropertyName: "salaryString",
      isRightAligned: true,
      isSortable: true
    },
    {
      label: "Email",
      dataPropertyName: "email"
    },
    {
      label: "Registration Date",
      dataPropertyName: "registered",
      isRightAligned: true
    }
  ];

  rowActions: DataTableAction[] = [
    // first action defines the row action
    {
      label: "Edit",
      action: "EDIT"
    },
    {
      label: "Delete",
      action: "DELETE"
    }
  ];

  displayedData: any[];

  constructor() {
    // generate random test data
    let idCounter: number = 0;
    this.displayedData = users.results
      .map(user => ({
        id: idCounter++,
        name: `${user.name.title}. ${user.name.first} ${user.name.last}`,
        gender: user.gender,
        email: user.email,
        age: user.registered.age,
        salary: user.registered.age * 2000,
        salaryString: this.getCurrency(user.registered.age * 2000),
        registered: new Date(user.registered.date).toDateString()
      }));
  }

  handleRowActionEvent(rowAction: DataTableAction): void {
    alert(`action = ${rowAction.action} ... outputRow.id = ${rowAction.outputRow.id}`);
  }

  getCurrency(input: number): string {
    return formatCurrency(input, "en", "€ ");
  }

  handleSortEvent(sort: Sort): void {
    // reset default sorting
    if (sort.direction === "") {
      sort.active = "Name";
      sort.direction = "asc";
    }
    const data = this.displayedData.sort((a, b) => DataTableComponent.compare(a, b, sort.active));
    this.displayedData = [...(sort.direction === "asc" ? data : data.reverse())];
  }

  static compare(a: any, b: any, active: string): number {
    switch (active) {
      case "Age":
        return a.age - b.age;
      case "Salary":
        return a.salary - b.salary;
      default:
        return a.name.localeCompare(b.name);
    }
  }
}
