import { Component } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { DataTableAction, DataTableColumnHeader } from "@porscheinformatik/material-addons";
import { users } from "../data-table-example-data/data-table-example-data";

@Component({
  selector: "app-data-table-async",
  templateUrl: "./data-table-async.component.html",
  styleUrls: ["./data-table-async.component.scss"]
})
export class DataTableAsyncComponent {
  loading = false;
  filterEnabled = true;

  displayedColumns: DataTableColumnHeader[] = [
    {
      label: "Title",
      isSortable: true,
      dataPropertyName: "title"
    },
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
      dataPropertyName: "salary",
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

  tableData: any[];

  constructor() {
    // generated random test data has not 'salary' field so we use the absolute value of the longitude for demonstration purposes
    let idCounter: number = 0;
    this.tableData = users.results
      .map(user => ({
        id: idCounter++,
        title: user.name.title,
        name: user.name.first + " " + user.name.last,
        gender: user.gender,
        email: user.email,
        age: user.registered.age,
        salary: Math.abs(+user.location.coordinates.latitude),
        registered: user.registered.date
      }))
      .slice(0, 10);
  }

  handleActionEvent(rowAction: DataTableAction): void {
    const action = rowAction.action;
    console.log(rowAction.selected);
    alert(`action = ${action} ... selected = ${rowAction.selected}`);
  }

  handleSortEvent(sort: Sort): void {
    const sortString = JSON.stringify(sort);
    alert(sortString);
  }

  handlePagingEvent(event: any): void {
    const eventString = JSON.stringify(event);
    alert(eventString);
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
