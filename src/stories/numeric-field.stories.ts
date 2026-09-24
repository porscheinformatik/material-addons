import { Component, effect, input, numberAttribute, reflectComponentType } from '@angular/core';
import type { Type } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { NumericFieldDirective } from '@porscheinformatik/material-addons';
import { ReactiveFormsExample } from './numeric-field-examples/reactive-forms.example';
import reactiveFormsSource from './numeric-field-examples/reactive-forms.example.ts?example-source';
import { TemplateDrivenFormExample } from './numeric-field-examples/template-driven-form.example';
import templateDrivenFormSource from './numeric-field-examples/template-driven-form.example.ts?example-source';
import { NumericValueBindingExample } from './numeric-field-examples/numeric-value-binding.example';
import numericValueBindingSource from './numeric-field-examples/numeric-value-binding.example.ts?example-source';
import { DecimalFormattingExample } from './numeric-field-examples/decimal-formatting.example';
import decimalFormattingSource from './numeric-field-examples/decimal-formatting.example.ts?example-source';
import { UnitsAndAlignmentExample } from './numeric-field-examples/units-and-alignment.example';
import unitsAndAlignmentSource from './numeric-field-examples/units-and-alignment.example.ts?example-source';
import { ValidationExample } from './numeric-field-examples/validation.example';
import validationSource from './numeric-field-examples/validation.example.ts?example-source';
import { DisabledAndReadonlyExample } from './numeric-field-examples/disabled-and-readonly.example';
import disabledAndReadonlySource from './numeric-field-examples/disabled-and-readonly.example.ts?example-source';
import { LocalesExample } from './numeric-field-examples/locales.example';
import localesSource from './numeric-field-examples/locales.example.ts?example-source';
import { NumberFormatServiceExample } from './numeric-field-examples/number-format-service.example';
import numberFormatServiceUsageSource from './numeric-field-examples/number-format-service.example.ts?example-source';

type UnitPosition = 'right' | 'left';
type NumericValue = number | null | undefined;

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

const describeNumericValue = (value: NumericValue): string => String(value);

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
  imports: [MatFormFieldModule, MatInputModule, NumericFieldDirective, ReactiveFormsModule],
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
        <div><strong>Form value:</strong> {{ describeValue(control.value) }}</div>
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

  protected readonly describeValue = describeNumericValue;

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

const meta: Meta<NumericFieldStoryArgs> = {
  title: 'Components/Numeric Field',
  decorators: [componentWrapperDecorator((story) => `<div style="max-width: 720px">${story}</div>`)],
  parameters: {
    docs: {
      description: {
        component: `Use madNumericField on a text input for numeric editing with dot/comma separators.

Start with **Reactive Forms** and open **Show code** for a complete, copyable standalone component. Fixed examples display the exact source that runs in the preview, including imports and form setup. They assume an Angular application with Angular Material theming already configured. NumericFieldModule remains available for module-based consumers.

Use **Playground** to explore controls. Empty edits return undefined to forms and can emit NaN through numericValueChange; programmatic clearing can also emit NaN. These examples show the current library behavior.`,
      },
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Accessible field label used by the Playground.' },
    value: { control: 'number', description: 'Programmatic numeric value; the display may use fewer decimal places.' },
    decimalPlaces: { control: 'number', description: 'Maximum fractional digits (default 2).' },
    roundDisplayValue: { control: 'boolean', description: 'Round programmatic values for display; typed input remains precision-limited.' },
    autofillDecimals: { control: 'boolean', description: 'Fill missing decimal places during final formatting, including blur.' },
    unit: { control: 'text', description: 'Display-only unit; it is not included in the numeric value.' },
    unitPosition: {
      control: { type: 'select' },
      options: ['right', 'left'] satisfies UnitPosition[],
    },
    textAlign: {
      control: { type: 'select' },
      options: ['right', 'left'] satisfies UnitPosition[],
    },
    disabled: { control: 'boolean', description: 'Enables/disables the Playground FormControl through the forms API.' },
    readonly: {
      control: 'boolean',
      description: 'Sets native readonly while leaving the FormControl enabled; see Disabled and Readonly for the current limitation.',
    },
  },
};

export default meta;
type Story = StoryObj<NumericFieldStoryArgs>;

// The same component is compiled for the preview and imported as text for Docs.
function copyableExample(component: Type<unknown>, source: string, description: string): Story {
  const metadata = reflectComponentType(component);
  if (!metadata) {
    throw new Error('A numeric-field example must be an Angular component.');
  }
  return {
    decorators: [moduleMetadata({ imports: [component] })],
    render: () => ({ template: `<${metadata.selector} />`, props: {} }),
    parameters: {
      controls: { disable: true },
      docs: {
        description: { story: description },
        source: { code: source, language: 'typescript', type: 'code' },
      },
    },
  };
}

export const Playground: Story = {
  decorators: [moduleMetadata({ imports: [NumericFieldDirectiveStoryComponent] })],
  render: renderDirectiveStory,
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
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        story:
          'Interactive explorer: change the controls to try different options. This story uses an internal wrapper; use [Reactive Forms](?path=/story/components-numeric-field--reactive-forms) and its Show code panel for a complete consumer example.',
      },
    },
  },
};

export const ReactiveForms: Story = {
  ...copyableExample(
    ReactiveFormsExample,
    reactiveFormsSource,
    'Start here: compare a typed FormControl with formControlName in a FormGroup. Edit either field, submit the named amount, then reset and restore both. Reset produces null; user clearing produces undefined and the custom output can emit NaN.',
  ),
};

export const TemplateDrivenForm: Story = {
  name: 'Template-Driven Forms',
  ...copyableExample(
    TemplateDrivenFormExample,
    templateDrivenFormSource,
    'Use FormsModule and ngModel for template-driven forms. Inside a form, supply a name. Type and clear the value to see the numeric model update.',
  ),
};

export const NumericValueBinding: Story = {
  ...copyableExample(
    NumericValueBindingExample,
    numericValueBindingSource,
    'Use numericValue and numericValueChange without Angular forms. Start with undefined, then set and clear the value. The current binding-only path formats on relevant keyup/blur events; input alone can leave the bound value stale. Empty edits and programmatic clearing can emit NaN.',
  ),
};

export const DecimalFormatting: Story = {
  ...copyableExample(
    DecimalFormattingExample,
    decimalFormattingSource,
    'Compare default truncation, rounding, whole numbers, four decimal places, decimal padding, and negative values. Programmatic display formatting keeps the original FormControl value; typed and pasted input is precision-limited. Type 12 in the padded field and leave it to fill the missing zeros.',
  ),
};

export const UnitsAndAlignment: Story = {
  ...copyableExample(
    UnitsAndAlignmentExample,
    unitsAndAlignmentSource,
    'Compare left/right units and text alignment, plus an input without a unit. Each field has its own control. Units are presentation text and do not become part of the numeric value.',
  ),
};

export const Validation: Story = {
  ...copyableExample(
    ValidationExample,
    validationSource,
    'Required, minimum, and maximum validators belong to the FormControl. Enter 50, 120, or an empty value, then leave the field. updateOn: blur delays the form update and error display until blur.',
  ),
};

export const DisabledAndReadonly: Story = {
  ...copyableExample(
    DisabledAndReadonlyExample,
    disabledAndReadonlySource,
    'Compare a disabled FormControl with a native readonly input. Enable and disable the first control to see its inclusion in form.value; getRawValue() includes both. The readonly control stays enabled. The preview notes the existing grouping-separator deletion limitation.',
  ),
};

export const Locales: Story = {
  ...copyableExample(
    LocalesExample,
    localesSource,
    'Compare English, German, and French fields with independent LOCALE_ID and NumberFormatService providers. French retains dot grouping. Show code includes all three locale components and the comparison component in one file; copy the entire file or one locale component with the shared imports.',
  ),
};

export const NumberFormatServiceUsage: Story = {
  name: 'Number Format Service',
  ...copyableExample(
    NumberFormatServiceExample,
    numberFormatServiceUsageSource,
    'Inject NumberFormatService to format outside an input. format accepts a number; formatNumber accepts localized text; strip removes grouping and returns text. The German example also shows parsing stopping at the first unsupported character.',
  ),
};
