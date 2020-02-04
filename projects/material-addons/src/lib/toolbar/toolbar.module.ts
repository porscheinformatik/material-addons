import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { ToolbarComponent } from './toolbar.component';
import { MaterialActionButtonModule } from '../material-action-button/material-action-button.module';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MaterialActionButtonModule,
    MatTooltipModule,
  ],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
