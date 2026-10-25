import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NumericFieldDirective } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-long-label-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NumericFieldDirective],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Total estimated maintenance costs for this vehicle</mat-label>
      <input matInput madNumericField [formControl]="amount" unit="EUR" autocomplete="off" />
    </mat-form-field>
  `,
  styles: `
    :host {
      display: block;
    }
    mat-form-field {
      width: 100%;
      max-width: 320px;
    }
  `,
})
export class LongLabelExample {
  readonly amount = new FormControl<number | null | undefined>(1234.56);
}
