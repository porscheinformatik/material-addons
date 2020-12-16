import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { QuickListComponent } from './quick-list.component';
import {ButtonModule} from "../button/button.module";

@NgModule({
  declarations: [QuickListComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, ButtonModule],
  exports: [QuickListComponent],
})
export class QuickListModule {}
