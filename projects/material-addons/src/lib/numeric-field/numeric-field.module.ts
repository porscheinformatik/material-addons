import { NgModule, ModuleWithProviders } from '@angular/core';
import { NumericFieldDirective } from './numeric-field.directive';
import { NumberFormatService } from './number-format.service';

@NgModule({
  providers: [NumberFormatService],
  declarations: [NumericFieldDirective],
  exports: [NumericFieldDirective],
})
export class NumericFieldModule {
  static forRoot(): ModuleWithProviders<NumericFieldModule> {
    return {
      ngModule: NumericFieldModule,
      providers: [NumberFormatService],
    };
  }
}
