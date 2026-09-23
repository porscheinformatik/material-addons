import { Inject, Injectable, LOCALE_ID, signal } from '@angular/core';

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
    return NumberFormatService.valueIsSet(value)
      ? this.formatNumber(value.toString().replace(new RegExp('[.]', 'g'), this.decimalSeparator), options)
      : '';
  }

  formatNumber(value: string, options?: Partial<FormatOptions>): string {
    const autofillDecimals = this.valueOrDefault(options?.autofillDecimals, NumberFormatService.DEFAULT_AUTOFILL_DECIMALS);
    const decimalPlaces = this.valueOrDefault(options?.decimalPlaces, NumberFormatService.DEFAULT_DECIMAL_PLACES);
    const finalFormatting = this.valueOrDefault(options?.finalFormatting, NumberFormatService.DEFAULT_FINAL_FORMATTING);

    const stripped = this.strip(value, { decimalPlaces, removeLeadingZeros: finalFormatting });
    const grouped = this.addGroupingSeparators(stripped);

    return finalFormatting && decimalPlaces > 0 && grouped ? this.finalizeDecimals(grouped, decimalPlaces, autofillDecimals) : grouped;
  }

  strip(value: string, options?: StripOptions): string {
    const decimalPlaces = this.valueOrDefault(options?.decimalPlaces, NumberFormatService.DEFAULT_DECIMAL_PLACES);
    const removeLeadingZeros = this.valueOrDefault(options?.removeLeadingZeros, NumberFormatService.DEFAULT_REMOVE_LEADING_ZEROS);

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
    return result;
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
