import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from './card.component';
import { ButtonModule } from '../button/button.module';
import { MatButtonModule } from '@angular/material/button';
import { ThrottleClickModule } from '../throttle-click/throttle-click.module';

@NgModule({
  imports: [CommonModule, MatCardModule, MatIconModule, ButtonModule, MatButtonModule, ThrottleClickModule, CardComponent],
  exports: [CardComponent],
})
export class CardModule {}
