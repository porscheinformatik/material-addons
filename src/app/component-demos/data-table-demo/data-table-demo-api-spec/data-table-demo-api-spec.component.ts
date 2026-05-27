import { Component } from '@angular/core';

import { summaryData } from '../../../example-components/data-table-example-data/data-table-example-data';

interface ApiSpecRow {
  name: string;
  inOut: 'input' | 'output';
  type: string;
  defaultValue?: string;
  syncAsync?: string;
  description?: string;
}

const apiSpecRows = summaryData as ApiSpecRow[];

function normalizeApiName(name: string): string {
  return name.replace(/^\[(.*)]$/, '$1').replace(/^\((.*)\)$/, '$1');
}

@Component({
  selector: 'app-data-table-demo-api-spec',
  imports: [],
  templateUrl: './data-table-demo-api-spec.component.html',
  styleUrl: './data-table-demo-api-spec.component.scss',
})
export class DataTableDemoApiSpecComponent {
  readonly properties = apiSpecRows.filter((row) => row.inOut === 'input').map((row) => ({ ...row, name: normalizeApiName(row.name) }));
  readonly events = apiSpecRows.filter((row) => row.inOut === 'output').map((row) => ({ ...row, name: normalizeApiName(row.name) }));
}
