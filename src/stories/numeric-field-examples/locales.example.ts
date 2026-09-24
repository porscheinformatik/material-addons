import { ChangeDetectionStrategy, Component, LOCALE_ID } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NumberFormatService, NumericFieldDirective } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-english-locale-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NumericFieldDirective],
  styles: `
    :host {
      display: block;
    }
    mat-form-field {
      width: 100%;
    }
  `,
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }, NumberFormatService],
  template: `
    <mat-form-field>
      <mat-label>English amount</mat-label>
      <input matInput madNumericField [formControl]="amount" unit="EUR" />
    </mat-form-field>
    <p>Form value: {{ describeValue(amount.value) }}</p>
  `,
})
export class EnglishLocaleExample {
  readonly amount = new FormControl<number | null | undefined>(1234.56);

  protected describeValue(value: number | null | undefined): string {
    return String(value);
  }
}

@Component({
  selector: 'app-german-locale-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NumericFieldDirective],
  styles: `
    :host {
      display: block;
    }
    mat-form-field {
      width: 100%;
    }
  `,
  providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }, NumberFormatService],
  template: `
    <mat-form-field>
      <mat-label>German amount</mat-label>
      <input matInput madNumericField [formControl]="amount" unit="EUR" />
    </mat-form-field>
    <p>Form value: {{ describeValue(amount.value) }}</p>
  `,
})
export class GermanLocaleExample {
  readonly amount = new FormControl<number | null | undefined>(1234.56);

  protected describeValue(value: number | null | undefined): string {
    return String(value);
  }
}

@Component({
  selector: 'app-french-locale-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NumericFieldDirective],
  styles: `
    :host {
      display: block;
    }
    mat-form-field {
      width: 100%;
    }
  `,
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }, NumberFormatService],
  template: `
    <mat-form-field>
      <mat-label>French amount</mat-label>
      <input matInput madNumericField [formControl]="amount" unit="EUR" />
    </mat-form-field>
    <p>Form value: {{ describeValue(amount.value) }}</p>
  `,
})
export class FrenchLocaleExample {
  readonly amount = new FormControl<number | null | undefined>(1234.56);

  protected describeValue(value: number | null | undefined): string {
    return String(value);
  }
}

@Component({
  selector: 'app-locales-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EnglishLocaleExample, GermanLocaleExample, FrenchLocaleExample],
  template: `
    <p>Each field provides its own LOCALE_ID and NumberFormatService. Edit one field without changing the others.</p>
    <div class="examples">
      <section>
        <h3>English (en-US)</h3>
        <p>Grouping comma, decimal dot.</p>
        <app-english-locale-example />
      </section>
      <section>
        <h3>German (de-DE)</h3>
        <p>Grouping dot, decimal comma.</p>
        <app-german-locale-example />
      </section>
      <section>
        <h3>French (fr-FR)</h3>
        <p>Grouping dot, decimal comma.</p>
        <app-french-locale-example />
      </section>
    </div>
    <p>French retains dot grouping for compatibility; whitespace grouping is not accepted. de-AT also uses dot grouping.</p>
    <p>Use a decimal dot for English and a comma for German/French. en-EN uses the same separators as en-US.</p>
  `,
  styles: `
    .examples {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
      gap: 24px;
    }
  `,
})
export class LocalesExample {}
