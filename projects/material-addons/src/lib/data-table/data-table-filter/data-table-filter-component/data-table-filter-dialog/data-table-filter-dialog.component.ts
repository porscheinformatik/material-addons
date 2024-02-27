import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { DataTableFilterOption } from "../../data-table-filter-options";

@Component({
  /* eslint-disable @angular-eslint/component-selector */
  selector: "mad-data-table-filter-dialog",
  templateUrl: "data-table-filter-dialog.component.html",
  styleUrls: ["./data-table-filter-dialog.component.scss"],
})
export class DataTableFilterDialogComponent implements OnDestroy {
  @Input()
  filterOptions: DataTableFilterOption[];

  @Input()
  set filterValue(value: string | null) {
    this.control.setValue(value);
  }

  @Output()
  filterChanged: EventEmitter<string | null> = new EventEmitter();

  control = new FormControl<string | null>(null);

  private _subscription: Subscription = new Subscription();

  constructor() {
    this._subscription.add(this.control.valueChanges.subscribe((value) => this.filterChanged.emit(value)));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
