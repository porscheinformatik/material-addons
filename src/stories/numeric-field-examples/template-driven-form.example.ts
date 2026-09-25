import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NumericFieldDirective } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-template-driven-form-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, NumericFieldDirective],

  template: `
    <form>
      <mat-form-field>
        <mat-label>Amount</mat-label>
        <input matInput madNumericField name="amount" [(ngModel)]="amount" />
      </mat-form-field>
    </form>
    <p>Model value: {{ describeValue(amount) }}</p>
  `,
})
export class TemplateDrivenFormExample {
  amount: number | null | undefined = 1234.56;

  protected describeValue(value: number | null | undefined): string {
    return String(value);
  }
}
