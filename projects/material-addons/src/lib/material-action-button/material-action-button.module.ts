import { NgModule } from '@angular/core';
import { MaterialActionButtonComponent } from './material-action-button.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

@NgModule({
  declarations: [MaterialActionButtonComponent],
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatTooltipModule],
  exports: [MaterialActionButtonComponent],
})
export class MaterialActionButtonModule {}
