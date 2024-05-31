import { Component } from '@angular/core';
import { DataTableAction } from '@porscheinformatik/material-addons';
import { exampleData } from '../data-table-example-data/data-table-example-data';
import { exampleColumns } from '../data-table-example-data/data-table-example-columns';
import { DataTableComponent } from 'material-addons';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table-batch-mode.component.html',
  styleUrls: ['./data-table-batch-mode.component.scss'],
  standalone: true,
  imports: [DataTableComponent],
})
export class DataTableBatchModeComponent {
  tableData = exampleData;
  displayedColumns = exampleColumns;
  batchMode = true;
  forceMode = 'BATCH';

  actions: DataTableAction[] = [
    // first action defines the row action
    {
      label: 'Create',
      action: 'CREATE',
      type: 'NONE',
    },
    {
      label: 'Edit',
      action: 'EDIT',
      type: 'SINGLE',
    },
    {
      label: 'Delete',
      action: 'DELETE',
      type: 'SINGLE',
      hiddenInMode: 'BATCH',
    },
    {
      label: 'Delete selected',
      action: 'DELETE',
      type: 'BATCH',
    },
    {
      label: 'Export selected',
      action: 'EXPORT',
      type: 'BATCH',
    },
    {
      label: 'Export all',
      action: 'EXPORT_ALL',
      type: 'NONE',
    },
    {
      label: 'Batch selection',
      action: 'BATCH',
      type: 'NONE',
    },
  ];

  handleActionEvent(rowAction: DataTableAction): void {
    if (rowAction.action === 'BATCH') {
      this.toggleForceMode();
    } else {
      const selected = JSON.stringify(rowAction.selected);
      alert(`action = ${rowAction.action} ... selected = ${selected}`);
    }
  }

  toggleForceMode() {
    this.batchMode = !this.batchMode;
    this.forceMode = this.batchMode ? 'BATCH' : 'SINGLE';
  }
}
