import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrimaryButtonComponent } from './primary-button/primary-button.component';
import { OutlineButtonComponent } from './outline-button/outline-button.component';
import { LinkButtonComponent } from './flat-button/link-button.component';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { DangerButtonComponent } from './danger-button/danger-button.component';

@NgModule({
  declarations: [PrimaryButtonComponent, OutlineButtonComponent, LinkButtonComponent, DangerButtonComponent, IconButtonComponent],
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatTooltipModule],
  exports: [PrimaryButtonComponent, OutlineButtonComponent, LinkButtonComponent, DangerButtonComponent, IconButtonComponent],
})
export class ButtonModule {}
