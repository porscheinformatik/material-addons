import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  InjectionToken,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NumberFormatService } from '../../numeric-field/number-format.service';
import { MatIconModule } from '@angular/material/icon';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgClass, NgStyle } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SizeChangeDirective } from '../../size-change/size-change.directive';

export interface FormFieldDefaultOptions {
  textAlign?: 'left' | 'right';
  unitPosition?: 'left' | 'right';
  textOverflow?: 'ellipsis' | 'clip' | '';

  multiline?: boolean;
  multilineAutosize?: boolean;
  rows?: number;
  shrinkIfEmpty?: boolean;

  autofillDecimals?: boolean;
  decimalPlaces?: number;
  formatNumber?: boolean;
  roundDisplayValue?: boolean;
}

export const MAD_READONLY_FORM_FIELD_DEFAULT_CONFIGURATION = new InjectionToken<FormFieldDefaultOptions>(
  'mad-readonly-form-field-configuration',
);

const DEFAULT_TEXT_ALIGN = 'left';
const DEFAULT_UNIT_POSITION = 'left';
const DEFAULT_TEXT_OVERFLOW = 'ellipsis';

const DEFAULT_MULTILINE = false;
const DEFAULT_MULTILINE_AUTOSIZE = false;
const DEFAULT_ROWS = 2;
const DEFAULT_SHRINK_IF_EMPTY = false;

const DEFAULT_AUTOFILL_DECIMALS = false;
const DEFAULT_DECIMAL_PLACES = 2;
const DEFAULT_FORMAT_NUMBER = false;
const DEFAULT_ROUND_DISPLAY_VALUE = false;

const THIN_SPACE = ' ';

/**
 * Read-only mat-form-field representation of provided value
 *
 * @author Stefan Laesser
 */

@Component({
  selector: 'mad-readonly-form-field',
  templateUrl: './readonly-form-field.component.html',
  styleUrls: ['./readonly-form-field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgStyle,
    NgClass,
    MatTooltipModule,
    TextFieldModule,
    MatIconModule,
    SizeChangeDirective,
  ],
})
export class ReadOnlyFormFieldComponent {
  private readonly defaultConfig = inject(MAD_READONLY_FORM_FIELD_DEFAULT_CONFIGURATION, { optional: true });
  private readonly numberFormatService = inject(NumberFormatService);

  readonly inputEl = viewChild<ElementRef<HTMLInputElement> | undefined>('inputEl');

  readonly label = input.required<string>();

  readonly value = input<any>();
  readonly useProjectedContent = input(false);
  readonly textAlign = input<'right' | 'left'>(this.defaultConfig?.textAlign ?? DEFAULT_TEXT_ALIGN);
  readonly textOverflow = input<'ellipsis' | 'clip' | ''>(this.defaultConfig?.textOverflow ?? DEFAULT_TEXT_OVERFLOW);
  readonly errorMessage = input<string | null>(null);
  readonly id = input<string>();

  readonly unit = input<string | null>(null);
  readonly unitPosition = input<'right' | 'left'>(this.defaultConfig?.unitPosition ?? DEFAULT_UNIT_POSITION);

  readonly formatNumber = input(this.defaultConfig?.formatNumber ?? DEFAULT_FORMAT_NUMBER);
  readonly decimalPlaces = input(this.defaultConfig?.decimalPlaces ?? DEFAULT_DECIMAL_PLACES);
  readonly roundDisplayValue = input(this.defaultConfig?.roundDisplayValue ?? DEFAULT_ROUND_DISPLAY_VALUE);
  readonly autofillDecimals = input(this.defaultConfig?.autofillDecimals ?? DEFAULT_AUTOFILL_DECIMALS);

  readonly multiline = input(this.defaultConfig?.multiline ?? DEFAULT_MULTILINE);
  /**
   * if cdkTextareaAutosize is active for textareas
   */
  readonly multilineAutoSize = input(this.defaultConfig?.multilineAutosize ?? DEFAULT_MULTILINE_AUTOSIZE);
  /*
   * If shrinkIfEmpty is set to "false", nothing changes
   * If set to "true" and multiline is also "true", the textarea will
   * shrink to one row, if value is empty/null/undefined.
   * Otherwise, the defined rows-value will be used
   */
  readonly shrinkIfEmpty = input(this.defaultConfig?.shrinkIfEmpty ?? DEFAULT_SHRINK_IF_EMPTY);
  readonly rows = input<number>(this.defaultConfig?.rows ?? DEFAULT_ROWS);

  /**
   * suffix iocon
   */
  readonly suffix = input<string>();
  /**
   * prefix iocon
   */
  readonly prefix = input<string>();

  readonly suffixClickedEmitter = output();
  readonly prefixClickedEmitter = output();

  protected readonly errorMatcher = computed(() => ({
    isErrorState: () => !!this.errorMessage(),
  }));

  private readonly displayValue = computed(() => {
    const value = this.value();
    if (!NumberFormatService.valueIsSet(value)) return '-';
    else if (this.formatNumber() && typeof value === 'number')
      return this.numberFormatService.format(value, {
        decimalPlaces: this.decimalPlaces(),
        finalFormatting: true,
        autofillDecimals: this.autofillDecimals(),
      });
    else return value;
  });

  protected readonly displayValueWithUnit = computed(() => {
    // If the unit should be positioned to the right, and the text is left-aligned it needs to "follow" the text, hence we add it to it.
    const isUnitTrailing = this.unit() && this.unitPosition() === 'right' && this.textAlign() === 'left';
    if (this.multiline() || !isUnitTrailing) return this.displayValue();
    // The THIN_SPACE (U+2009) simulates the padding used previously the most.
    return `${this.displayValue()}${THIN_SPACE}${this.unit()}`;
  });

  protected readonly actualAmountOfRows = computed(() => {
    if (!NumberFormatService.valueIsSet(this.value()) && this.shrinkIfEmpty()) return 1;
    else return this.rows();
  });

  protected readonly sizeChanges = signal<ResizeObserverEntry | undefined>(undefined, {
    equal: (a, b) => a?.contentRect.width === b?.contentRect.width,
  });

  protected toolTipForInputEnabled = computed(() => {
    const input = this.inputEl()?.nativeElement;
    // This is needed to re-compute this signal when the size is updated
    const sizeChanges = this.sizeChanges();
    if (sizeChanges && input && this.textOverflow() === 'ellipsis') {
      return input.offsetWidth < input.scrollWidth;
    }
    return false;
  });

  protected toolTipText = computed(() => {
    if (!this.unit()) {
      return this.value();
    }
    return this.unitPosition() === 'left' ? `${this.unit()} ${this.value()}` : `${this.value()} ${this.unit()}`;
  });

  suffixClicked() {
    this.suffixClickedEmitter.emit();
  }

  prefixClicked() {
    this.prefixClickedEmitter.emit();
  }
}
