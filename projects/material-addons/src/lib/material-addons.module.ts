import { NgModule } from '@angular/core';
import { ToolbarModule } from './toolbar/toolbar.module';
import { ReadOnlyFormFieldModule } from './readonly/readonly-form-field.module';
import { MaterialActionButtonModule } from './material-action-button/material-action-button.module';
import { NumericFieldModule } from './numeric-field/numeric-field.module';
import { CardModule } from './card/card.module';

@NgModule({
  exports: [ReadOnlyFormFieldModule, ToolbarModule, MaterialActionButtonModule, NumericFieldModule, CardModule],
})
export class MaterialAddonsModule {}
