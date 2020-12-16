import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrimaryButtonComponent } from './primary-button/primary-button.component';
import { SecondaryButtonComponent } from './secondary-button/secondary-button.component';
import { DefaultButtonComponent } from './default-button/default-button.component';
import { IconButtonComponent } from './icon-button/icon-button.component';

@NgModule({
  declarations: [PrimaryButtonComponent, SecondaryButtonComponent, DefaultButtonComponent, IconButtonComponent],
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatTooltipModule],
  exports: [PrimaryButtonComponent, SecondaryButtonComponent, DefaultButtonComponent, IconButtonComponent],
})
export class ButtonModule {}
