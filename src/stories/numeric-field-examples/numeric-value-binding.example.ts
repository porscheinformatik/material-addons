import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
      <input matInput madNumericField [numericValue]="value()" (numericValueChange)="value.set($event)" unit="kg" />
    </mat-form-field>
    <div>
      <button mat-stroked-button type="button" (click)="value.set(1234.56)">Set value</button>
      <button mat-stroked-button type="button" (click)="value.set(undefined)">Clear value</button>
    </div>
    <p>Start empty, set a value, then clear it. Programmatic clearing keeps undefined; user clearing emits NaN.</p>
    <p>Bound value: {{ describeValue(value()) }}</p>
  `,
})
export class NumericValueBindingExample {
  readonly value = signal<number | null | undefined>(undefined);

  protected describeValue(value: number | null | undefined): string {
    return String(value);
  }
}
