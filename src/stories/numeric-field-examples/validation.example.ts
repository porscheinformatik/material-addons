import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NumericFieldDirective } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-validation-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NumericFieldDirective],

  template: `
    <mat-form-field>
      <mat-label>Percentage</mat-label>
      <input matInput madNumericField [formControl]="percentage" [decimalPlaces]="0" unit="%" />
      @if (percentage.hasError('required')) {
        <mat-error>A percentage is required</mat-error>
      } @else if (percentage.hasError('min')) {
        <mat-error>Enter a value greater than or equal to 0</mat-error>
      } @else if (percentage.hasError('max')) {
        <mat-error>Enter a value less than or equal to 100</mat-error>
      }
    </mat-form-field>
    <p>Enter a percentage, then leave the field to update the form.</p>
    <p>Form value: {{ describeValue(percentage.value) }}</p>
    <p>Touched: {{ percentage.touched }}. Valid: {{ percentage.valid }}.</p>
  `,
})
export class ValidationExample {
  readonly percentage = new FormControl<number | null | undefined>(120, {
    validators: [(control) => Validators.required(control), Validators.min(0), Validators.max(100)],
    updateOn: 'blur',
  });

  protected describeValue(value: number | null | undefined): string {
    return String(value);
  }
}
