import { NgModule } from '@angular/core';
import { ToolbarModule } from './layout/toolbar/toolbar.module';
import { ReadOnlyFormFieldModule } from './readonly/readonly-form-field.module';
import { MaterialActionButtonModule } from './material-action-button/material-action-button.module';
import { NumericFieldModule } from './numeric-field/numeric-field.module';
import { CardModule } from './card/card.module';
import { QuickListModule } from './quick-list/quick-list.module';
import { ButtonModule } from './button/button.module';
import { ThrottleClickModule } from './throttle-click/throttle-click.module';
import { SidebarModule } from './layout/sidebar/sidebar.module';

@NgModule({
  exports: [
    ReadOnlyFormFieldModule,
    ButtonModule,
    ToolbarModule,
    MaterialActionButtonModule,
    NumericFieldModule,
    CardModule,
    QuickListModule,
    ThrottleClickModule,
    SidebarModule,
  ],
})
export class MaterialAddonsModule {}
