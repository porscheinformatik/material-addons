import { Component, ElementRef, EventEmitter, HostListener, Output } from "@angular/core";
import { DataTableFilterOption } from "../data-table-filter-options";

@Component({
  /* eslint-disable @angular-eslint/component-selector */
  selector: "mad-data-table-filter",
  templateUrl: "./data-table-filter.component.html",
  styleUrls: ["./data-table-filter.component.scss"],
})
export class FilterComponent {
  @Output() filterValueChange: EventEmitter<string | null> = new EventEmitter();

  isHovered: boolean;
  isActive: boolean;
  showFilterDialog: boolean;

  filterValue: string | null;
  filterOptions: DataTableFilterOption[];

  constructor(private elementRef: ElementRef) {}

  toggleFilter(event: Event) {
    event.preventDefault();
    this.showFilterDialog = !this.showFilterDialog;
  }

  onFilterChanged(filterValue: string | null) {
    this.isActive = !!filterValue;
    this.filterValue = filterValue;
    this.filterValueChange.emit(this.filterValue);
  }

  @HostListener("document:click", ["$event"])
  onClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showFilterDialog = false;
    }
  }

  get opacity() {
    return this.isActive ? "1" : this.isHovered || this.showFilterDialog ? "0.54" : "0";
  }
}
