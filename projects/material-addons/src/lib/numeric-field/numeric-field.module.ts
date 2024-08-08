import { ModuleWithProviders, NgModule } from '@angular/core';
import { NumericFieldDirective } from './numeric-field.directive';

@NgModule({
  imports: [NumericFieldDirective],
  exports: [NumericFieldDirective],
})
export class NumericFieldModule {
  static forRoot(): ModuleWithProviders<NumericFieldModule> {
    return {
      ngModule: NumericFieldModule,
    };
  }
}
