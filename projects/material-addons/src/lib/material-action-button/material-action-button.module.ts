import { NgModule } from '@angular/core';
import { MaterialActionButtonComponent } from './material-action-button.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [MaterialActionButtonComponent],
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatTooltipModule],
  exports: [MaterialActionButtonComponent],
})
export class MaterialActionButtonModule {}
