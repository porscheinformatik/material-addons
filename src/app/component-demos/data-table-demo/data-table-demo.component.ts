import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { DataTableBasicComponent } from '../../example-components/data-table-basic/data-table-basic.component';
import { DataTableCustomColumnsComponent } from '../../example-components/data-table-custom-columns/data-table-custom-columns.component';
import { DataTableBatchModeComponent } from '../../example-components/data-table-batch-mode/data-table-batch-mode.component';
import { DataTableAsyncComponent } from '../../example-components/data-table-async/data-table-async.component';
import { DataTableSingleComponent } from '../../example-components/data-table-single/data-table-single.component';
import { DataTableIdGeneratorComponent } from '../../example-components/data-table-id-generator/data-table-id-generator.component';
import { DataTableColumnConfigurationComponent } from '../../example-components/data-table-column-configuration/data-table-column-configuration.component';
import { DataTableSummaryComponent } from '../../example-components/data-table-summary/data-table-summary.component';
import { DataTableParentHeightComponent } from '../../example-components/data-table-parent-height/data-table-parent-height.component';

@Component({
  selector: 'app-data-table-demo',
  templateUrl: './data-table-demo.component.html',
  styleUrls: ['./data-table-demo.component.scss'],
})
export class DataTableDemoComponent {
  basicDataTable = new Example(DataTableBasicComponent, 'data-table-basic', 'Standard table with no actions');
  transformerDataTable = new Example(DataTableCustomColumnsComponent, 'data-table-custom-columns', 'Table with transformed data');
  singleModeTable = new Example(DataTableSingleComponent, 'data-table-single', 'Single mode');
  batchModeTable = new Example(DataTableBatchModeComponent, 'data-table-batch-mode', 'Batch mode');
  asyncDataTable = new Example(DataTableAsyncComponent, 'data-table-async', 'Asynchronous (paged) loading');
  idGeneratorDataTable = new Example(DataTableIdGeneratorComponent, 'data-table-id-generator', 'Return IDs instead of rows');
  columnConfigurationDataTable = new Example(
    DataTableColumnConfigurationComponent,
    'data-table-column-configuration',
    'Custom column configuration',
  );
  parentHeightDataTable = new Example(DataTableParentHeightComponent, 'data-table-parent-height', 'Use full height of the tables parent');
  summaryDataTable = new Example(DataTableSummaryComponent, 'data-table-summary', 'Summary of all input and output variables');
  pageUrl = location.origin + location.pathname;
}
