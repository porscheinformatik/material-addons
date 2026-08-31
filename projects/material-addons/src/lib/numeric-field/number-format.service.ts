import { Inject, Injectable, LOCALE_ID } from '@angular/core';

export interface FormatOptions {
  decimalPlaces?: number;

  finalFormatting?: boolean;

  autofillDecimals?: boolean;
}

export interface StripOptions {
  decimalPlaces?: number;

  removeLeadingZeros?: boolean;
}

interface LocaleSeparators {
  decimalSeparator: string;
  groupingSeparator: string;
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
  private static readonly DEFAULT_LOCALE_SEPARATORS: LocaleSeparators = {
    decimalSeparator: '.',
    groupingSeparator: ',',
  };

  decimalSeparator: string;
  groupingSeparator: string;

  allowedKeys: string[] = [];

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.prepareSeparators(locale);
  }

  static valueIsSet(value: unknown): boolean {
    return typeof value !== 'undefined' && value !== null && (typeof value !== 'string' || value.length !== 0);
  }

  /**
   * Call this if the locale is changed to update the separators.
   * @param locale the new locale
   */
  prepareSeparators(locale: string): void {
    const separators = this.resolveLocaleSeparators(locale);
    this.decimalSeparator = separators.decimalSeparator;
    this.groupingSeparator = separators.groupingSeparator;

    this.allowedKeys = [...NumberFormatService.NUMBERS, NumberFormatService.NEGATIVE, this.decimalSeparator];
  }

  format(value: number | null | undefined, options?: Partial<FormatOptions>): string {
    return NumberFormatService.valueIsSet(value) ? this.formatNumber(String(value).replace(/[.]/g, this.decimalSeparator), options) : '';
  }

  formatNumber(value: string, options?: Partial<FormatOptions>): string {
    const autofillDecimals = this.valueOrDefault(options?.autofillDecimals, NumberFormatService.DEFAULT_AUTOFILL_DECIMALS);
    const decimalPlaces = this.valueOrDefault(options?.decimalPlaces, NumberFormatService.DEFAULT_DECIMAL_PLACES);
    const finalFormatting = this.valueOrDefault(options?.finalFormatting, NumberFormatService.DEFAULT_FINAL_FORMATTING);

    let result = this.strip(value, { decimalPlaces, removeLeadingZeros: finalFormatting });

    /* add grouping separator */
    const decimalIndex = result.indexOf(this.decimalSeparator);
    const isNegative = result.startsWith(NumberFormatService.NEGATIVE);
    let i = decimalIndex > -1 ? decimalIndex : result.length;
    while (i > (isNegative ? 4 : 3)) {
      i -= 3;
      result = result.substring(0, i) + this.groupingSeparator + result.substring(i, result.length);
    }

    if (finalFormatting) {
      if (decimalPlaces > 0 && !!result) {
        /* autofill decimal places */
        let actualDecimalIndex = result.indexOf(this.decimalSeparator);
        if (autofillDecimals) {
          if (actualDecimalIndex === -1) {
            actualDecimalIndex = result.length;
            result += this.decimalSeparator;
          }

          result = this.addMissingLeadingZero(result, actualDecimalIndex);
          actualDecimalIndex = result.indexOf(this.decimalSeparator);

          const actualDecimalPlaces = result.length - actualDecimalIndex - 1;
          for (let j = 0; j < decimalPlaces - actualDecimalPlaces; j++) {
            result += '0';
          }
        } else {
          result = this.addMissingLeadingZero(result, actualDecimalIndex);
        }
      }
    }
    return result;
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

  private resolveLocaleSeparators(locale: string): LocaleSeparators {
    try {
      if (Intl.NumberFormat.supportedLocalesOf(locale).length === 0) {
        return NumberFormatService.DEFAULT_LOCALE_SEPARATORS;
      }

      const parts = Intl.NumberFormat(locale).formatToParts(1234.5);
      const decimalSeparator = parts.find((part) => part.type === 'decimal')?.value;
      const groupingSeparator = parts.find((part) => part.type === 'group')?.value;

      if (decimalSeparator && groupingSeparator) {
        return {
          decimalSeparator,
          groupingSeparator,
        };
      }
    } catch {
      return NumberFormatService.DEFAULT_LOCALE_SEPARATORS;
    }

    return NumberFormatService.DEFAULT_LOCALE_SEPARATORS;
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
