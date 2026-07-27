import { JsonPipe } from '@angular/common';
import { Component, LOCALE_ID, computed, effect, input, numberAttribute, signal } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { NumberFormatService, NumericFieldDirective } from '@porscheinformatik/material-addons';

type UnitPosition = 'right' | 'left';
type NumericValue = number | null | undefined;

const REQUIRED_VALIDATOR = (control: AbstractControl): ValidationErrors | null => Validators.required(control);

interface NumericFieldStoryArgs {
  label: string;
  value: NumericValue;
  decimalPlaces: number;
  roundDisplayValue: boolean;
  autofillDecimals: boolean;
  unit: string | null;
  unitPosition: UnitPosition;
  textAlign: UnitPosition;
  disabled: boolean;
  readonly: boolean;
}

interface LocaleFormattingRow {
  locale: string;
  decimalSeparator: string;
  decimalSeparatorCodePoint: string;
  groupingSeparator: string;
  groupingSeparatorCodePoint: string;
  sampleInput: string;
  formatted: string;
  stripped: string;
}

const fixedStoryParameters = {
  controls: { disable: true },
};

const formatCodePoint = (value: string): string =>
  [...value].map((character) => `U+${character.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}`).join(' ');

const formatSeparator = (separator: string): string => {
  switch (separator) {
    case ' ':
      return 'space';
    case '\u00A0':
      return 'no-break space';
    case '\u202F':
      return 'narrow no-break space';
    default:
      return separator;
  }
};

const localeDecorators = (locale: string) => [
  applicationConfig({
    providers: [{ provide: LOCALE_ID, useValue: locale }, NumberFormatService],
  }),
];

const renderDirectiveStory = (args: NumericFieldStoryArgs) => ({
  props: args,
  template: `
    <app-numeric-field-directive-story
      [label]="label"
      [value]="value"
      [decimalPlaces]="decimalPlaces"
      [roundDisplayValue]="roundDisplayValue"
      [autofillDecimals]="autofillDecimals"
      [unit]="unit"
      [unitPosition]="unitPosition"
      [textAlign]="textAlign"
      [disabled]="disabled"
      [readonly]="readonly"
    />
  `,
});

@Component({
  selector: 'app-numeric-field-directive-story',
  imports: [JsonPipe, MatFormFieldModule, MatInputModule, NumericFieldDirective, ReactiveFormsModule],
  template: `
    <div style="display: grid; gap: 1rem; max-width: 420px;">
      <mat-form-field appearance="outline">
        <mat-label>{{ label() }}</mat-label>
        <input
          matInput
          type="text"
          autocomplete="off"
          [formControl]="control"
          [readonly]="readonly()"
          [decimalPlaces]="decimalPlaces()"
          [roundDisplayValue]="roundDisplayValue()"
          [autofillDecimals]="autofillDecimals()"
          [unit]="unit()"
          [unitPosition]="unitPosition()"
          [textAlign]="textAlign()"
          madNumericField
        />
      </mat-form-field>

      <div style="display: grid; gap: 0.25rem; font-size: 0.875rem;">
        <div><strong>Form value:</strong> {{ control.value | json }}</div>
        <div><strong>Disabled:</strong> {{ control.disabled }}</div>
        <div><strong>Readonly:</strong> {{ readonly() }}</div>
      </div>
    </div>
  `,
})
class NumericFieldDirectiveStoryComponent {
  readonly label = input('Amount');
  readonly value = input<NumericValue>(1234.56);
  readonly decimalPlaces = input(2, { transform: numberAttribute });
  readonly roundDisplayValue = input(false);
  readonly autofillDecimals = input(false);
  readonly unit = input<string | null>('EUR');
  readonly unitPosition = input<UnitPosition>('right');
  readonly textAlign = input<UnitPosition>('right');
  readonly disabled = input(false);
  readonly readonly = input(false);

  readonly control = new FormControl<NumericValue>(1234.56);

  private readonly valueEffect = effect(() => {
    const value = this.value();

    if (this.control.value !== value) {
      this.control.setValue(value, { emitEvent: false });
    }
  });

  private readonly disabledEffect = effect(() => {
    if (this.disabled()) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
  });
}

@Component({
  selector: 'app-numeric-field-reset-story',
  imports: [JsonPipe, MatButtonModule, MatFormFieldModule, MatInputModule, NumericFieldDirective, ReactiveFormsModule],
  template: `
    <div style="display: grid; gap: 1rem; max-width: 420px;">
      <mat-form-field appearance="outline">
        <mat-label>Resettable amount</mat-label>
        <input matInput type="text" autocomplete="off" [formControl]="control" unit="EUR" madNumericField />
      </mat-form-field>

      <div style="display: flex; gap: 0.5rem;">
        <button mat-stroked-button type="button" (click)="reset()">Reset</button>
        <button mat-stroked-button type="button" (click)="restore()">Restore value</button>
      </div>

      <div style="font-size: 0.875rem;"><strong>Form value:</strong> {{ control.value | json }}</div>
    </div>
  `,
})
class NumericFieldResetStoryComponent {
  readonly control = new FormControl<NumericValue>(1234.56);

  reset(): void {
    this.control.reset();
  }

  restore(): void {
    this.control.setValue(1234.56);
  }
}

@Component({
  selector: 'app-numeric-field-validation-story',
  imports: [JsonPipe, MatFormFieldModule, MatInputModule, NumericFieldDirective, ReactiveFormsModule],
  template: `
    <div style="display: grid; gap: 1rem; max-width: 420px;">
      <mat-form-field appearance="outline">
        <mat-label>Percentage</mat-label>
        <input matInput type="text" autocomplete="off" [formControl]="control" [decimalPlaces]="0" unit="%" madNumericField />
        @if (control.invalid) {
          <mat-error>{{ errorMessage() }}</mat-error>
        }
      </mat-form-field>

      <div style="font-size: 0.875rem;"><strong>Form value:</strong> {{ control.value | json }}</div>
    </div>
  `,
})
class NumericFieldValidationStoryComponent {
  readonly control = new FormControl<NumericValue>(120, {
    validators: [REQUIRED_VALIDATOR, Validators.min(0), Validators.max(100)],
    updateOn: 'blur',
  });

  constructor() {
    this.control.markAsTouched();
  }

  errorMessage(): string {
    if (this.control.hasError('required')) {
      return 'A percentage is required';
    }

    if (this.control.hasError('min')) {
      return 'Enter a value greater than or equal to 0';
    }

    if (this.control.hasError('max')) {
      return 'Enter a value less than or equal to 100';
    }

    return '';
  }
}

@Component({
  selector: 'app-numeric-field-value-binding-story',
  imports: [JsonPipe, MatButtonModule, MatFormFieldModule, MatInputModule, NumericFieldDirective],
  template: `
    <div style="display: grid; gap: 1rem; max-width: 420px;">
      <mat-form-field appearance="outline">
        <mat-label>numericValue binding</mat-label>
        <input
          matInput
          type="text"
          autocomplete="off"
          [numericValue]="numericValue()"
          (numericValueChange)="numericValue.set($event)"
          [decimalPlaces]="2"
          unit="kg"
          unitPosition="right"
          madNumericField
        />
      </mat-form-field>

      <div style="display: flex; gap: 0.5rem;">
        <button mat-stroked-button type="button" (click)="setValue()">Set value</button>
        <button mat-stroked-button type="button" (click)="clearValue()">Clear value</button>
      </div>

      <div style="font-size: 0.875rem;"><strong>numericValue:</strong> {{ numericValue() | json }}</div>
    </div>
  `,
})
class NumericFieldValueBindingStoryComponent {
  readonly initialValue = input<NumericValue>(1234.56);
  readonly numericValue = signal<NumericValue>(1234.56);

  private readonly initialValueEffect = effect(() => {
    this.numericValue.set(this.initialValue());
  });

  setValue(): void {
    this.numericValue.set(1234.56);
  }

  clearValue(): void {
    this.numericValue.set(undefined);
  }
}

@Component({
  selector: 'app-number-format-service-story',
  template: `
    <div style="display: grid; gap: 1rem;">
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="border: 1px solid #ccc; padding: 0.5rem; text-align: left;">Locale</th>
            <th style="border: 1px solid #ccc; padding: 0.5rem; text-align: left;">Decimal</th>
            <th style="border: 1px solid #ccc; padding: 0.5rem; text-align: left;">Grouping</th>
            <th style="border: 1px solid #ccc; padding: 0.5rem; text-align: left;">Sample input</th>
            <th style="border: 1px solid #ccc; padding: 0.5rem; text-align: left;">Formatted</th>
            <th style="border: 1px solid #ccc; padding: 0.5rem; text-align: left;">Stripped input</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.locale) {
            <tr>
              <td style="border: 1px solid #ccc; padding: 0.5rem;">
                <code>{{ row.locale }}</code>
              </td>
              <td style="border: 1px solid #ccc; padding: 0.5rem;">
                <code>{{ row.decimalSeparator }}</code>
                <div style="font-size: 0.75rem;">{{ row.decimalSeparatorCodePoint }}</div>
              </td>
              <td style="border: 1px solid #ccc; padding: 0.5rem;">
                <code>{{ row.groupingSeparator }}</code>
                <div style="font-size: 0.75rem;">{{ row.groupingSeparatorCodePoint }}</div>
              </td>
              <td style="border: 1px solid #ccc; padding: 0.5rem;">
                <code>{{ row.sampleInput }}</code>
              </td>
              <td style="border: 1px solid #ccc; padding: 0.5rem;">
                <code>{{ row.formatted }}</code>
              </td>
              <td style="border: 1px solid #ccc; padding: 0.5rem;">
                <code>{{ row.stripped }}</code>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
class NumberFormatServiceStoryComponent {
  readonly value = input(1234567.89, { transform: numberAttribute });
  readonly decimalPlaces = input(2, { transform: numberAttribute });
  readonly autofillDecimals = input(false);

  readonly rows = computed<LocaleFormattingRow[]>(() =>
    ['en-US', 'en-EN', 'de-DE', 'de-AT', 'fr-FR'].map((locale) => {
      const service = new NumberFormatService(locale);
      const sampleInput = `1${service.groupingSeparator}234${service.groupingSeparator}567${service.decimalSeparator}89`;

      return {
        locale,
        decimalSeparator: formatSeparator(service.decimalSeparator),
        decimalSeparatorCodePoint: formatCodePoint(service.decimalSeparator),
        groupingSeparator: formatSeparator(service.groupingSeparator),
        groupingSeparatorCodePoint: formatCodePoint(service.groupingSeparator),
        sampleInput,
        formatted: service.format(this.value(), {
          decimalPlaces: this.decimalPlaces(),
          autofillDecimals: this.autofillDecimals(),
        }),
        stripped: service.strip(sampleInput, {
          decimalPlaces: this.decimalPlaces(),
        }),
      };
    }),
  );
}

const meta: Meta<NumericFieldStoryArgs> = {
  title: 'Components/Numeric Field',
  decorators: [
    moduleMetadata({
      imports: [
        NumericFieldDirectiveStoryComponent,
        NumericFieldResetStoryComponent,
        NumericFieldValidationStoryComponent,
        NumericFieldValueBindingStoryComponent,
        NumberFormatServiceStoryComponent,
      ],
    }),
  ],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'number' },
    decimalPlaces: { control: 'number' },
    roundDisplayValue: { control: 'boolean' },
    autofillDecimals: { control: 'boolean' },
    unit: { control: 'text' },
    unitPosition: {
      control: { type: 'select' },
      options: ['right', 'left'] satisfies UnitPosition[],
    },
    textAlign: {
      control: { type: 'select' },
      options: ['right', 'left'] satisfies UnitPosition[],
    },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
  args: {
    label: 'Amount',
    value: 1234.56,
    decimalPlaces: 2,
    roundDisplayValue: false,
    autofillDecimals: false,
    unit: 'EUR',
    unitPosition: 'right',
    textAlign: 'right',
    disabled: false,
    readonly: false,
  },
  render: renderDirectiveStory,
};

export default meta;

type Story = StoryObj<NumericFieldStoryArgs>;

export const Playground: Story = {
  args: {},
};

export const ReactiveFormInitialValue: Story = {
  args: {
    label: 'Initial amount',
    value: 1234.56,
    unit: 'EUR',
  },
  parameters: fixedStoryParameters,
};

export const ReactiveFormDisabled: Story = {
  args: {
    label: 'Disabled amount',
    value: 1234.56,
    disabled: true,
    unit: 'EUR',
  },
  parameters: fixedStoryParameters,
};

export const ReactiveFormReset: Story = {
  parameters: fixedStoryParameters,
  render: () => ({
    template: '<app-numeric-field-reset-story />',
  }),
};

export const Validation: Story = {
  parameters: fixedStoryParameters,
  render: () => ({
    template: '<app-numeric-field-validation-story />',
  }),
};

export const ReadonlyNativeInput: Story = {
  args: {
    label: 'Readonly amount',
    value: 1234.56,
    readonly: true,
    unit: 'EUR',
  },
  parameters: fixedStoryParameters,
};

export const AutofillDecimals: Story = {
  args: {
    label: 'Money',
    value: 1234.5,
    autofillDecimals: true,
    unit: 'EUR',
  },
  parameters: fixedStoryParameters,
};

export const IntegerValue: Story = {
  args: {
    label: 'Mileage',
    value: 123456,
    decimalPlaces: 0,
    unit: 'km',
  },
  parameters: fixedStoryParameters,
};

export const PrecisionValue: Story = {
  args: {
    label: 'Length',
    value: 12.3456,
    decimalPlaces: 4,
    unit: 'mm',
  },
  parameters: fixedStoryParameters,
};

export const RoundedDisplayValue: Story = {
  args: {
    label: 'Power',
    value: 1234.567,
    roundDisplayValue: true,
    unit: 'kW',
  },
  parameters: fixedStoryParameters,
};

export const NegativeValue: Story = {
  args: {
    label: 'Balance',
    value: -1234.56,
    unit: 'EUR',
  },
  parameters: fixedStoryParameters,
};

export const RightUnit: Story = {
  args: {
    label: 'Weight',
    value: 1540,
    unit: 'kg',
    unitPosition: 'right',
  },
  parameters: fixedStoryParameters,
};

export const LeftUnit: Story = {
  args: {
    label: 'Price',
    value: 99.99,
    unit: 'EUR',
    unitPosition: 'left',
    textAlign: 'left',
    autofillDecimals: true,
  },
  parameters: fixedStoryParameters,
};

export const LeftAlignedRightUnit: Story = {
  args: {
    label: 'Measured value',
    value: 1540,
    unit: 'kg',
    unitPosition: 'right',
    textAlign: 'left',
  },
  parameters: fixedStoryParameters,
};

export const NoUnit: Story = {
  args: {
    label: 'Plain value',
    value: 1234.56,
    unit: null,
  },
  parameters: fixedStoryParameters,
};

export const EnglishLocale: Story = {
  args: {
    label: 'English locale',
    value: 1234.56,
    unit: 'EUR',
  },
  decorators: localeDecorators('en-US'),
  parameters: fixedStoryParameters,
};

export const GermanLocale: Story = {
  args: {
    label: 'German locale',
    value: 1234.56,
    unit: 'EUR',
  },
  decorators: localeDecorators('de-DE'),
  parameters: fixedStoryParameters,
};

export const FrenchLocale: Story = {
  args: {
    label: 'French locale',
    value: 1234.56,
    unit: 'EUR',
  },
  decorators: localeDecorators('fr-FR'),
  parameters: fixedStoryParameters,
};

export const LocaleFormattingTable: Story = {
  parameters: fixedStoryParameters,
  render: () => ({
    template: '<app-number-format-service-story />',
  }),
};

export const NumericValueBinding: Story = {
  parameters: fixedStoryParameters,
  render: () => ({
    template: '<app-numeric-field-value-binding-story />',
  }),
};

export const NumericValueCleared: Story = {
  parameters: fixedStoryParameters,
  render: () => ({
    template: '<app-numeric-field-value-binding-story [initialValue]="undefined" />',
  }),
};
