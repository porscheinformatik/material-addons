import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {CardComponent} from './card.component';
import {ButtonModule} from "../button/button.module";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule, MatCardModule, MatIconModule, ButtonModule, MatButtonModule],
  exports: [CardComponent],
})
export class CardModule {
}
