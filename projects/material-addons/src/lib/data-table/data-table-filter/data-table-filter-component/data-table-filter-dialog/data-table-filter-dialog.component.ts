import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataTableFilterOption } from '../../data-table-filter-options';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'mad-data-table-filter-dialog',
  templateUrl: 'data-table-filter-dialog.component.html',
  styleUrls: ['./data-table-filter-dialog.component.scss'],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, TranslateModule],
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
