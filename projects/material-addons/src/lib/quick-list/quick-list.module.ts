import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { QuickListComponent } from './quick-list.component';
import { ButtonModule } from '../button/button.module';
import { BaseQuickListComponent } from './base-quick-list.component';
import { QuickListCompactComponent } from './quick-list-compact/quick-list-compact.component';

@NgModule({
  declarations: [QuickListComponent, BaseQuickListComponent, QuickListCompactComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, ButtonModule],
  exports: [QuickListComponent, QuickListCompactComponent, BaseQuickListComponent],
})
export class QuickListModule {}
