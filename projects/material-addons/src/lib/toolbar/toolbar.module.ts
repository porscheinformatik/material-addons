import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from './toolbar.component';
import { MaterialActionButtonModule } from '../material-action-button/material-action-button.module';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { ButtonModule } from '../button/button.module';
import { MatBadgeModule } from '@angular/material/badge';

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
    ButtonModule,
    MatBadgeModule,
  ],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
