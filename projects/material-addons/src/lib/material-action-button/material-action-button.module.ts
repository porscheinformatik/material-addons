import { NgModule } from '@angular/core';
import { MaterialActionButtonComponent } from './material-action-button.component';
import { MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MaterialActionButtonComponent],
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatTooltipModule],
  exports: [MaterialActionButtonComponent],
})
export class MaterialActionButtonModule {}
