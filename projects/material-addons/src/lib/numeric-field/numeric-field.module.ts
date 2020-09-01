import {NgModule} from '@angular/core';
import { NumericFieldDirective } from './numeric-field.directive';

@NgModule({
  declarations: [NumericFieldDirective],
  exports: [NumericFieldDirective]
})
export class NumericFieldModule {
}
