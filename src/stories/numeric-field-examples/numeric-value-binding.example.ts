import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NumericFieldDirective } from '@porscheinformatik/material-addons';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-numeric-value-binding-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatInputModule, NumericFieldDirective, MatButtonModule],

  template: `
    <mat-form-field>
      <mat-label>Value binding without Angular forms</mat-label>
      <input matInput madNumericField [numericValue]="numericInput()" (numericValueChange)="value.set($event)" unit="kg" />
    </mat-form-field>
    <div>
      <button mat-stroked-button type="button" (click)="value.set(1234.56)">Set value</button>
      <button mat-stroked-button type="button" (click)="value.set(undefined)">Clear value</button>
    </div>
    <p>Start empty, set a value, then clear it. The output can replace an empty value with NaN.</p>
    <p>Bound value: {{ describeValue(value()) }}</p>
  `,
})
export class NumericValueBindingExample {
  readonly value = signal<number | null | undefined>(undefined);

  // The published input type requires a number in strict templates; NaN renders an empty field.
  protected readonly numericInput = computed(() => this.value() ?? NaN);

  protected describeValue(value: number | null | undefined): string {
    return String(value);
  }
}
