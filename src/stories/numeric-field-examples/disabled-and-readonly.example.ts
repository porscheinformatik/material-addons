import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NumericFieldDirective } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-disabled-and-readonly-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, NumericFieldDirective],
  template: `
    <form [formGroup]="form" class="examples">
      <section>
        <h3>Disabled through Angular forms</h3>
        <mat-form-field>
          <mat-label>Disabled amount</mat-label>
          <input matInput madNumericField formControlName="disabledAmount" unit="EUR" />
        </mat-form-field>
        <p>Disabled: {{ form.controls.disabledAmount.disabled }}</p>
        <p>Control value: {{ describeValue(form.controls.disabledAmount.value) }}</p>
        <button mat-stroked-button type="button" (click)="toggleDisabled()">
          {{ form.controls.disabledAmount.disabled ? 'Enable amount' : 'Disable amount' }}
        </button>
      </section>
      <section>
        <h3>Readonly native input</h3>
        <mat-form-field>
          <mat-label>Readonly amount</mat-label>
          <input matInput madNumericField formControlName="readonlyAmount" readonly unit="EUR" />
        </mat-form-field>
        <p>Control remains enabled: {{ form.controls.readonlyAmount.enabled }}</p>
        <p>Control value: {{ describeValue(form.controls.readonlyAmount.value) }}</p>
      </section>
    </form>
    <p>Disabled controls are excluded from this enabled parent form's value. Readonly controls remain included.</p>
    <p>
      form.value: <code>{{ form.value | json }}</code>
    </p>
    <p>
      form.getRawValue(): <code>{{ form.getRawValue() | json }}</code>
    </p>
    <p>Known directive limitation: Backspace/Delete beside a grouping separator can still change a readonly field.</p>
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
    code {
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }
  `,
})
export class DisabledAndReadonlyExample {
  readonly form = new FormGroup({
    disabledAmount: new FormControl<number | null | undefined>({ value: 1234.56, disabled: true }),
    readonlyAmount: new FormControl<number | null | undefined>(1234.56),
  });

  protected toggleDisabled(): void {
    const control = this.form.controls.disabledAmount;
    if (control.disabled) {
      control.enable();
    } else {
      control.disable();
    }
  }

  protected describeValue(value: number | null | undefined): string {
    return String(value);
  }
}
