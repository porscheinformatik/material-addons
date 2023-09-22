import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { QuickListComponent } from './quick-list.component';
import { ButtonModule } from '../button/button.module';
import { BaseQuickListComponent } from './base-quick-list.component';
import { QuickListCompactComponent } from './quick-list-compact/quick-list-compact.component';
import { ReactiveFormQuickListComponent } from './reactive-form-quick-list/reactive-form-quick-list.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ReactiveFormQuickListCompactComponent } from './reactive-form-quick-list-compact/reactive-form-quick-list-compact.component';

@NgModule({
  declarations: [QuickListComponent, BaseQuickListComponent, QuickListCompactComponent, ReactiveFormQuickListComponent, ReactiveFormQuickListCompactComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, ButtonModule, ReactiveFormsModule],
  exports: [QuickListComponent, QuickListCompactComponent, BaseQuickListComponent, ReactiveFormQuickListComponent, ReactiveFormQuickListCompactComponent],
})
export class QuickListModule {}
