import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NumericFieldDirective } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-units-and-alignment-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NumericFieldDirective],
  template: `
    <p>Units are display text; each control still contains only a numeric value.</p>
    <div class="examples">
      <section>
        <h3>Right unit, right alignment</h3>
        <mat-form-field>
          <mat-label>Weight</mat-label>
          <input matInput madNumericField [formControl]="rightUnit" unit="kg" unitPosition="right" textAlign="right" />
        </mat-form-field>
        <p>Form value: {{ describeValue(rightUnit.value) }}</p>
      </section>
      <section>
        <h3>Left unit, left alignment</h3>
        <mat-form-field>
          <mat-label>Price</mat-label>
          <input matInput madNumericField [formControl]="leftUnit" unit="EUR" unitPosition="left" textAlign="left" />
        </mat-form-field>
        <p>Form value: {{ describeValue(leftUnit.value) }}</p>
      </section>
      <section>
        <h3>Right unit, left alignment</h3>
        <mat-form-field>
          <mat-label>Measured value</mat-label>
          <input matInput madNumericField [formControl]="trailingUnit" unit="kg" unitPosition="right" textAlign="left" />
        </mat-form-field>
        <p>Form value: {{ describeValue(trailingUnit.value) }}</p>
        <p>Type and clear the value to explore trailing-unit placement.</p>
      </section>
      <section>
        <h3>No unit</h3>
        <mat-form-field>
          <mat-label>Value without a unit</mat-label>
          <input matInput madNumericField [formControl]="noUnit" />
        </mat-form-field>
        <p>Form value: {{ describeValue(noUnit.value) }}</p>
      </section>
    </div>
  `,
  styles: `
    .examples {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
      gap: 16px 24px;
    }
    mat-form-field {
      width: 100%;
    }
  `,
})
export class UnitsAndAlignmentExample {
  readonly rightUnit = new FormControl<number | null | undefined>(1540);
  readonly leftUnit = new FormControl<number | null | undefined>(99.99);
  readonly trailingUnit = new FormControl<number | null | undefined>(1540);
  readonly noUnit = new FormControl<number | null | undefined>(1234.56);

  protected describeValue(value: number | null | undefined): string {
    return String(value);
  }
}
