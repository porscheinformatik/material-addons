import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableFilterOption } from '../../data-table-filter-options';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'mad-data-table-filter-dialog',
  templateUrl: 'data-table-filter-dialog.component.html',
  styleUrls: ['./data-table-filter-dialog.component.scss'],
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableFilterDialogComponent {
  readonly filterOptions = input<DataTableFilterOption[]>([]);
  readonly filterValue = input<string | null>(null);
  readonly filterChanged = output<string | null>();

  protected readonly control = new FormControl<string | null>(null);

  constructor() {
    effect(() => {
      this.control.setValue(this.filterValue());
    });
    this.control.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => this.filterChanged.emit(value));
  }
}
