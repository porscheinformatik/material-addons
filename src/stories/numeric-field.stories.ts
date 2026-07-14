import { JsonPipe } from '@angular/common';
import { Component, computed, effect, input, numberAttribute, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NumberFormatService, NumericFieldDirective } from '@porscheinformatik/material-addons';

type UnitPosition = 'right' | 'left';

interface NumericFieldStoryArgs {
  label: string;
  value: number | null | undefined;
  decimalPlaces: number;
  roundDisplayValue: boolean;
  autofillDecimals: boolean;
  unit: string | null;
  unitPosition: UnitPosition;
  textAlign: UnitPosition;
  disabled: boolean;
}

@Component({
  selector: 'app-numeric-field-directive-story',
  imports: [JsonPipe, MatFormFieldModule, MatInputModule, NumericFieldDirective, ReactiveFormsModule],
  template: `
    <div style="display: grid; gap: 1rem; max-width: 420px;">
      <mat-form-field appearance="outline">
        <mat-label>{{ label() }}</mat-label>
        <input
          matInput
          autocomplete="off"
          [formControl]="control"
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
      </div>
    </div>
  `,
})
class NumericFieldDirectiveStoryComponent {
  readonly label = input('Amount');
  readonly value = input<number | null | undefined>(1234.56);
  readonly decimalPlaces = input(2, { transform: numberAttribute });
  readonly roundDisplayValue = input(false);
  readonly autofillDecimals = input(false);
  readonly unit = input<string | null>('EUR');
  readonly unitPosition = input<UnitPosition>('right');
  readonly textAlign = input<UnitPosition>('right');
  readonly disabled = input(false);

  readonly control = new FormControl<number | null | undefined>(1234.56);

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
  selector: 'app-numeric-field-value-binding-story',
  imports: [MatFormFieldModule, MatInputModule, NumericFieldDirective],
  template: `
    <div style="display: grid; gap: 1rem; max-width: 420px;">
      <mat-form-field appearance="outline">
        <mat-label>numericValue binding</mat-label>
        <input
          matInput
          autocomplete="off"
          [numericValue]="numericValue()"
          (numericValueChange)="numericValue.set($event)"
          [decimalPlaces]="2"
          unit="kg"
          unitPosition="right"
          madNumericField
        />
      </mat-form-field>

      <div style="font-size: 0.875rem;"><strong>numericValue:</strong> {{ numericValue() }}</div>
    </div>
  `,
})
class NumericFieldValueBindingStoryComponent {
  readonly numericValue = signal(1234.56);
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
              </td>
              <td style="border: 1px solid #ccc; padding: 0.5rem;">
                <code>{{ row.groupingSeparator }}</code>
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

  readonly rows = computed(() =>
    ['de-DE', 'de-AT', 'en-EN'].map((locale) => {
      const service = new NumberFormatService(locale);

      return {
        locale,
        decimalSeparator: service.decimalSeparator,
        groupingSeparator: service.groupingSeparator,
        formatted: service.format(this.value(), {
          decimalPlaces: this.decimalPlaces(),
          autofillDecimals: this.autofillDecimals(),
        }),
        stripped: service.strip(locale === 'en-EN' ? '1,234,567.89' : '1.234.567,89', {
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
      imports: [NumericFieldDirectiveStoryComponent, NumericFieldValueBindingStoryComponent, NumberFormatServiceStoryComponent],
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
  },
  render: (args) => ({
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
      />
    `,
  }),
};

export default meta;

type Story = StoryObj<NumericFieldStoryArgs>;

export const Playground: Story = {
  args: {},
};

export const AutofillDecimals: Story = {
  args: {
    label: 'Money',
    value: 1234.5,
    autofillDecimals: true,
    unit: 'EUR',
  },
};

export const IntegerValue: Story = {
  args: {
    label: 'Mileage',
    value: 123456,
    decimalPlaces: 0,
    unit: 'km',
  },
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
};

export const RoundedDisplayValue: Story = {
  args: {
    label: 'Power',
    value: 1234.567,
    roundDisplayValue: true,
    unit: 'kW',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const NumericValueBinding: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: '<app-numeric-field-value-binding-story />',
  }),
};

export const NumberFormatServiceFormatting: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: '<app-number-format-service-story />',
  }),
};
