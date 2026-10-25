import { Inject, Injectable, LOCALE_ID, signal } from '@angular/core';
import { normalizeDecimalPlaces, toDecimalString } from './numeric-field-format';

export declare interface FormatOptions {
  decimalPlaces?: number;

  finalFormatting?: boolean;

  autofillDecimals?: boolean;
}

export declare interface StripOptions {
  decimalPlaces?: number;

  removeLeadingZeros?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NumberFormatService {
  static readonly NEGATIVE = '-';
  static readonly NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  static readonly DEFAULT_FINAL_FORMATTING = true;
  static readonly DEFAULT_DECIMAL_PLACES = 2;
  static readonly DEFAULT_AUTOFILL_DECIMALS = false;
  static readonly DEFAULT_REMOVE_LEADING_ZEROS = false;

  private readonly decimalSeparatorSignal = signal<',' | '.'>('.');
  private readonly groupingSeparatorSignal = signal<',' | '.'>(',');
  private readonly allowedKeysSignal = signal<string[]>([]);

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.prepareSeparators(locale);
  }

  get decimalSeparator(): ',' | '.' {
    return this.decimalSeparatorSignal();
  }

  get groupingSeparator(): ',' | '.' {
    return this.groupingSeparatorSignal();
  }

  get allowedKeys(): string[] {
    return this.allowedKeysSignal();
  }

  set decimalSeparator(decimalSeparator: ',' | '.') {
    this.decimalSeparatorSignal.set(decimalSeparator);
  }

  set groupingSeparator(groupingSeparator: ',' | '.') {
    this.groupingSeparatorSignal.set(groupingSeparator);
  }

  set allowedKeys(allowedKeys: string[]) {
    this.allowedKeysSignal.set(allowedKeys);
  }

  static valueIsSet(value: any): boolean {
    return typeof value !== 'undefined' && value !== null && (typeof value !== 'string' || value.length !== 0);
  }

  /**
   * Call this if the locale is changed to update the separators.
   * @param locale the new locale
   */
  public prepareSeparators(locale: string): void {
    const localeDecimalSeparator = (1.1).toLocaleString(locale).charAt(1);
    const decimalSeparator = localeDecimalSeparator === ',' ? ',' : '.';
    const groupingSeparator = localeDecimalSeparator === ',' ? '.' : ',';

    this.decimalSeparatorSignal.set(decimalSeparator);
    this.groupingSeparatorSignal.set(groupingSeparator);
    this.allowedKeysSignal.set([...NumberFormatService.NUMBERS, NumberFormatService.NEGATIVE, decimalSeparator]);
  }

  format(value: number, options?: Partial<FormatOptions>): string {
    return Number.isFinite(value) ? this.formatNumber(toDecimalString(value).replace('.', this.decimalSeparator), options) : '';
  }

  formatNumber(value: string, options?: Partial<FormatOptions>): string {
    const autofillDecimals = this.valueOrDefault(options?.autofillDecimals, NumberFormatService.DEFAULT_AUTOFILL_DECIMALS);
    const decimalPlaces = normalizeDecimalPlaces(options?.decimalPlaces);
    const finalFormatting = this.valueOrDefault(options?.finalFormatting, NumberFormatService.DEFAULT_FINAL_FORMATTING);

    const stripped = this.strip(value, { decimalPlaces, removeLeadingZeros: finalFormatting });
    const grouped = this.addGroupingSeparators(stripped);

    return finalFormatting && decimalPlaces > 0 && grouped ? this.finalizeDecimals(grouped, decimalPlaces, autofillDecimals) : grouped;
  }

  strip(value: string, options?: StripOptions): string {
    const decimalPlaces = normalizeDecimalPlaces(options?.decimalPlaces);
    const removeLeadingZeros = this.valueOrDefault(options?.removeLeadingZeros, NumberFormatService.DEFAULT_REMOVE_LEADING_ZEROS);

    if (/^[+-]?(?:Infinity|NaN)$/.test(value)) {
      return '';
    }

    // Exponent input is atomic: never silently accept the mantissa of an invalid literal.
    if (/^[+\-0-9.,]*[eE]/.test(value)) {
      const exponentIndex = value.search(/[eE]/);
      const sourceMantissa = value.slice(0, exponentIndex);
      const ungrouped =
        this.groupingSeparator === this.decimalSeparator ? sourceMantissa : sourceMantissa.split(this.groupingSeparator).join('');
      const mantissa = ungrouped.replace(this.decimalSeparator, '.');
      const normalized = mantissa + value.slice(exponentIndex);
      if (!/^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)[eE][+-]?[0-9]+$/.test(normalized)) {
        return '';
      }
      const exponentValue = Number(normalized);
      if (!Number.isFinite(exponentValue)) {
        return '';
      }
      value = this.expandScientificText(normalized, decimalPlaces).replace('.', this.decimalSeparator);
    }

    let result = '';
    let indexDecimalSep = -1;
    let j = -1;
    let ignoredChars = 0;
    for (const char of value) {
      j++;
      if (this.allowedKeys.includes(char)) {
        if (char === this.decimalSeparator) {
          if (decimalPlaces === 0) {
            /* dismiss content after a decimal separator, when no places allowed */
            break;
          } else if (indexDecimalSep > -1) {
            /* ignore subsequent decimal separators */
            continue;
          }
          indexDecimalSep = j;
        }
        if (char === '0' && removeLeadingZeros) {
          /* remove leading zero only if it's not the only zero in the 'value' string */
          if ((result.length === 0 && j + 1 !== value.length) || result === NumberFormatService.NEGATIVE) {
            ignoredChars++;
            continue;
          }
        }
        if (char === NumberFormatService.NEGATIVE && j > 0) {
          /* dismiss content after a negative sign not on first position */
          break;
        }
        if (indexDecimalSep > -1 && result.length + ignoredChars > indexDecimalSep + decimalPlaces) {
          /* dismiss content after maximum decimal places reached */
          break;
        }
        result += char;
      } else if (char === this.groupingSeparator) {
        if (indexDecimalSep === -1) {
          ignoredChars++;
        }
      } else {
        /* dismiss content after a invalid character */
        break;
      }
    }
    // Keep a numeric zero when leading-zero removal and zero-place truncation consume its digits.
    if (ignoredChars > 0 && /^-?0/.test(value) && (result === '' || result === NumberFormatService.NEGATIVE)) {
      result += '0';
    }
    const numericValue = Number.parseFloat(result.replace(this.decimalSeparator, '.'));
    return numericValue === Infinity || numericValue === -Infinity ? '' : result;
  }

  private expandScientificText(value: string, decimalPlaces: number): string {
    const [mantissa, exponent] = value.toLowerCase().split('e');
    const sign = mantissa.startsWith('-') ? '-' : '';
    const [integer, fraction = ''] = mantissa.replace(/^[+-]/, '').split('.');
    const sourceDigits = integer + fraction;
    const digits = sourceDigits.replace(/^0+/, '');
    if (!digits) {
      return sign + '0';
    }

    // Keep source digits: Number(value) is only an overflow guard, never the source of rounded digits.
    const decimalIndex = integer.length + Number(exponent) - (sourceDigits.length - digits.length);
    if (decimalIndex <= 0) {
      const zeros = Math.min(-decimalIndex, decimalPlaces);
      const subunitDecimals = '0'.repeat(zeros) + digits.slice(0, decimalPlaces - zeros);
      return sign + '0' + (subunitDecimals ? '.' + subunitDecimals : '');
    }
    // A finite nonzero IEEE-754 value has at most 309 integer digits. Bound all padding explicitly.
    if (decimalIndex > 309) {
      return '';
    }
    const whole = digits.slice(0, decimalIndex).padEnd(decimalIndex, '0');
    const decimals = digits.slice(decimalIndex, decimalIndex + decimalPlaces);
    return sign + whole + (decimals ? '.' + decimals : '');
  }

  private addGroupingSeparators(value: string): string {
    let result = value;
    const decimalIndex = result.indexOf(this.decimalSeparator);
    const isNegative = result.startsWith(NumberFormatService.NEGATIVE);
    let index = decimalIndex > -1 ? decimalIndex : result.length;

    while (index > (isNegative ? 4 : 3)) {
      index -= 3;
      result = result.substring(0, index) + this.groupingSeparator + result.substring(index, result.length);
    }

    return result;
  }

  private finalizeDecimals(value: string, decimalPlaces: number, autofillDecimals: boolean): string {
    let result = value;
    let decimalIndex = result.indexOf(this.decimalSeparator);

    if (!autofillDecimals) {
      return this.addMissingLeadingZero(result, decimalIndex);
    }

    if (decimalIndex === -1) {
      decimalIndex = result.length;
      result += this.decimalSeparator;
    }

    result = this.addMissingLeadingZero(result, decimalIndex);
    decimalIndex = result.indexOf(this.decimalSeparator);

    const actualDecimalPlaces = result.length - decimalIndex - 1;
    for (let index = 0; index < decimalPlaces - actualDecimalPlaces; index++) {
      result += '0';
    }

    return result;
  }

  private addMissingLeadingZero(result: string, actualDecimalIndex: number): string {
    const isNegative = result.startsWith(NumberFormatService.NEGATIVE);
    /* autoadd a zero before decimal separator, when it's missing */
    if (actualDecimalIndex === 0) {
      result = '0' + result;
    }
    /* autoadd a zero before decimal separator, when it's missing, for negative values */
    if (actualDecimalIndex === 1 && isNegative) {
      result = result[0] + '0' + result.substring(1, result.length);
    }
    return result;
  }

  private valueOrDefault<T>(value: T | null | undefined, defaultValue: T): T {
    return NumberFormatService.valueIsSet(value) ? value : defaultValue;
  }
}
