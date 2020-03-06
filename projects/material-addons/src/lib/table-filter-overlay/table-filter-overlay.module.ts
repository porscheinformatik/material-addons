import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';
import { TableFilterOverlayComponent } from './table-filter-overlay.component';

@NgModule({
  declarations: [TableFilterOverlayComponent],
  imports: [CommonModule, MatIconModule, OverlayModule],
  exports: [TableFilterOverlayComponent],
})
export class TableFilterOverlayModule {}
