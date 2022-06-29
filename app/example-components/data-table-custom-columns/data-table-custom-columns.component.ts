import { Component } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { DataTableColumnHeader } from "@porscheinformatik/material-addons";
import { formatCurrency } from "@angular/common";
import { users } from "../data-table-example-data/data-table-example-data";

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table-custom-columns.component.html",
  styleUrls: ["./data-table-custom-columns.component.scss"]
})
export class DataTableCustomColumnsComponent {
  public static uppercase(value: string, transformerParams: any[]): string {
    return ("" + value).toUpperCase();
  }

  public static translateTitle(value: string, transformerParams: any[]): string {
    switch (value) {
      case "Mr":
        return "Herr";
      default:
        return "Frau";
    }
  }

  public static genderSymbol(value: string): string {
    return (value === "male") ? "♂" : "♀";
  }

  paginationEnabled = true;
  filterEnabled = true;

  displayedColumns: DataTableColumnHeader[] = [
    {
      label: "Title",
      isSortable: true,
      dataPropertyName: "title",
      transformer: DataTableCustomColumnsComponent.translateTitle
    },
    {
      label: "Name",
      isSortable: true,
      dataPropertyName: "name"
    },
    {
      label: "Gender",
      dataPropertyName: "gender",
      transformer: DataTableCustomColumnsComponent.genderSymbol
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
      dataPropertyName: "email",
      transformer: DataTableCustomColumnsComponent.uppercase
    },
    {
      label: "Registration Date",
      dataPropertyName: "registered",
      isRightAligned: true
    }
  ];


  tableData: any[];

  constructor() {
    // generate random test data
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
      }));
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
    const data = this.tableData.sort((a, b) => DataTableCustomColumnsComponent.compare(a, b, sort.active));
    this.tableData = [...(sort.direction === "asc" ? data : data.reverse())];
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
