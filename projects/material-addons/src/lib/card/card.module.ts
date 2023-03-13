import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from './card.component';
import { ButtonModule } from '../button/button.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { ThrottleClickModule } from '../throttle-click/throttle-click.module';

@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule, MatCardModule, MatIconModule, ButtonModule, MatButtonModule, ThrottleClickModule],
  exports: [CardComponent],
})
export class CardModule {}
