import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { DataTableFilterOption } from '../data-table-filter-options';

import { MatIconModule } from '@angular/material/icon';
import { DataTableFilterDialogComponent } from './data-table-filter-dialog/data-table-filter-dialog.component';

@Component({
  selector: 'mad-data-table-filter',
  templateUrl: './data-table-filter.component.html',
  styleUrls: ['./data-table-filter.component.scss'],
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, MatIconModule, DataTableFilterDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'stopHeaderSort($event)',
    '(keydown)': 'stopHeaderSort($event)',
  },
})
export class FilterComponent {
  readonly filterOptions = input<DataTableFilterOption[]>([]);
  readonly filterValue = model<string | null>(null);
  readonly isHovered = input(false);

  protected readonly showFilterDialog = signal(false);
  protected readonly isActive = computed(() => !!this.filterValue());
  protected readonly opacity = computed(() => (this.isActive() ? '1' : this.isHovered() || this.showFilterDialog() ? '0.54' : '0'));

  protected toggleFilter(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showFilterDialog.update((showFilterDialog) => !showFilterDialog);
  }

  protected closeFilterDialog(): void {
    this.showFilterDialog.set(false);
  }

  protected stopHeaderSort(event: Event): void {
    event.stopPropagation();
  }

  protected onFilterChanged(filterValue: string | null): void {
    this.filterValue.set(filterValue);
  }
}
