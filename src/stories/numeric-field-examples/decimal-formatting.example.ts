import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NumericFieldDirective } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-decimal-formatting-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NumericFieldDirective],
  template: `
    <p>Compare fixed formatting options. Initial display formatting leaves the original FormControl values intact.</p>
    <div class="examples">
      <section>
        <h3>Default truncation</h3>
        <mat-form-field>
          <mat-label>Truncated amount</mat-label>
          <input matInput madNumericField [formControl]="truncated" />
        </mat-form-field>
        <p>Form value: {{ describeValue(truncated.value) }}</p>
        <p>The default display keeps two decimal places.</p>
      </section>
      <section>
        <h3>Rounded display</h3>
        <mat-form-field>
          <mat-label>Rounded amount</mat-label>
          <input matInput madNumericField [formControl]="rounded" [roundDisplayValue]="true" />
        </mat-form-field>
        <p>Form value: {{ describeValue(rounded.value) }}</p>
        <p>Programmatic values are rounded; typed and pasted digits remain precision-limited.</p>
      </section>
      <section>
        <h3>Whole numbers</h3>
        <mat-form-field>
          <mat-label>Integer amount</mat-label>
          <input matInput madNumericField [formControl]="integer" [decimalPlaces]="0" />
        </mat-form-field>
        <p>Form value: {{ describeValue(integer.value) }}</p>
        <p>Zero decimal places prevents a decimal separator.</p>
      </section>
      <section>
        <h3>Four decimal places</h3>
        <mat-form-field>
          <mat-label>Precise amount</mat-label>
          <input matInput madNumericField [formControl]="precise" [decimalPlaces]="4" />
        </mat-form-field>
        <p>Form value: {{ describeValue(precise.value) }}</p>
        <p>Useful for measurements needing more precision.</p>
      </section>
      <section>
        <h3>Decimal padding</h3>
        <mat-form-field>
          <mat-label>Padded amount</mat-label>
          <input matInput madNumericField [formControl]="padded" [autofillDecimals]="true" />
        </mat-form-field>
        <p>Form value: {{ describeValue(padded.value) }}</p>
        <p>Type 12, then leave the field to fill the missing decimal zeros.</p>
      </section>
      <section>
        <h3>Negative values</h3>
        <mat-form-field>
          <mat-label>Negative balance</mat-label>
          <input matInput madNumericField [formControl]="negative" />
        </mat-form-field>
        <p>Form value: {{ describeValue(negative.value) }}</p>
        <p>A minus sign is allowed at the beginning of the value.</p>
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
export class DecimalFormattingExample {
  readonly truncated = new FormControl<number | null | undefined>(1234.567);
  readonly rounded = new FormControl<number | null | undefined>(1234.567);
  readonly integer = new FormControl<number | null | undefined>(123456);
  readonly precise = new FormControl<number | null | undefined>(12.3456);
  readonly padded = new FormControl<number | null | undefined>(1234.5);
  readonly negative = new FormControl<number | null | undefined>(-1234.56);

  protected describeValue(value: number | null | undefined): string {
    return String(value);
  }
}
