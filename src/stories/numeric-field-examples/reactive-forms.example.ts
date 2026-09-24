import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NumericFieldDirective } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-reactive-forms-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, NumericFieldDirective],
  template: `
    <div class="examples">
      <section>
        <h3>Single FormControl</h3>
        <mat-form-field>
          <mat-label>Standalone amount</mat-label>
          <input matInput madNumericField [formControl]="amount" (numericValueChange)="lastOutput = describeValue($event)" />
        </mat-form-field>
        <p>Form value: {{ describeValue(amount.value) }}</p>
        <p>Last numericValueChange: {{ lastOutput }}</p>
      </section>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <h3>FormGroup and formControlName</h3>
        <mat-form-field>
          <mat-label>Named amount</mat-label>
          <input matInput madNumericField formControlName="amount" unit="EUR" />
        </mat-form-field>
        <p>Form value: {{ describeValue(form.controls.amount.value) }}</p>
        <button mat-stroked-button type="submit">Submit named amount</button>
        <p>Last submitted value: {{ submitted }}</p>
      </form>
    </div>

    <div class="actions">
      <button mat-stroked-button type="button" (click)="reset()">Reset both</button>
      <button mat-stroked-button type="button" (click)="restore()">Restore both</button>
    </div>
    <p>Reset produces null in the forms; clearing by typing produces undefined. The custom output can emit NaN.</p>
  `,
  styles: `
    .examples {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
      gap: 24px;
    }
    mat-form-field {
      width: 100%;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `,
})
export class ReactiveFormsExample {
  readonly amount = new FormControl<number | null | undefined>(1234.56);
  readonly form = new FormGroup({
    amount: new FormControl<number | null | undefined>(1234.56),
  });

  protected lastOutput = 'No output yet';
  protected submitted = 'Not submitted yet';

  protected reset(): void {
    this.amount.reset();
    this.form.reset();
    this.submitted = 'Not submitted yet';
  }

  protected restore(): void {
    this.amount.setValue(1234.56);
    this.form.setValue({ amount: 1234.56 });
  }

  protected submit(): void {
    this.submitted = this.describeValue(this.form.controls.amount.value);
  }

  protected describeValue(value: number | null | undefined): string {
    return String(value);
  }
}
