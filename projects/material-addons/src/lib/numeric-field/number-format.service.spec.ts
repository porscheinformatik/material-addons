import { describe, expect, it, jest } from '@jest/globals';
import { NumberFormatService } from './number-format.service';

describe('NumberFormatService', () => {
  const createService = (locale = 'de-DE'): NumberFormatService => new NumberFormatService(locale);
  it('should be created', () => {
    expect(createService()).toBeTruthy();
  });

  describe('locale separators', () => {
    it.each([
      ['de-DE', ',', '.', '1.234.567,89'],
      ['de-AT', ',', '.', '1.234.567,89'],
      ['fr-FR', ',', '.', '1.234.567,89'],
      ['en-EN', '.', ',', '1,234,567.89'],
      ['en-US', '.', ',', '1,234,567.89'],
    ])('should use dot/comma separators for %s', (locale, decimal, grouping, formatted) => {
      const service = createService(locale);

      expect(service.decimalSeparator).toBe(decimal);
      expect(service.groupingSeparator).toBe(grouping);
      expect(service.format(1234567.89)).toBe(formatted);
    });

    it('should preserve the runtime error for a malformed locale', () => {
      expect(() => createService('invalid_locale')).toThrow(RangeError);
    });

    it.each([
      ['1,1', ',', '.'],
      ['1.1', '.', ','],
    ])('should use the runtime fallback for an unsupported locale (%s)', (sample, decimal, grouping) => {
      const localeFormatting = jest.spyOn(Number.prototype, 'toLocaleString').mockReturnValue(sample);
      try {
        const service = createService('zz-ZZ');
        expect(localeFormatting).toHaveBeenCalledWith('zz-ZZ');
        expect(service.decimalSeparator).toBe(decimal);
        expect(service.groupingSeparator).toBe(grouping);
      } finally {
        localeFormatting.mockRestore();
      }
    });

    it('should replace the allowed keys when preparing a new locale', () => {
      const service = createService();
      const previousKeys = service.allowedKeys;
      service.prepareSeparators('en-US');
      expect(service.allowedKeys).not.toBe(previousKeys);
      expect(service.allowedKeys).toEqual([...NumberFormatService.NUMBERS, '-', '.']);
      expect(service.format(1234.5)).toBe('1,234.5');
    });

    it('should retain independent separator setters and mutable allowed keys', () => {
      const service = createService();
      const keys = service.allowedKeys;
      service.decimalSeparator = '.';
      service.groupingSeparator = ',';
      expect(service.allowedKeys).toBe(keys);
      expect(service.allowedKeys).not.toContain('.');
      keys.push('.');
      expect(service.strip('1.25')).toBe('1.25');
      const replacement = ['1', '2'];
      service.allowedKeys = replacement;
      expect(service.allowedKeys).toBe(replacement);
      expect(service.strip('123')).toBe('12');
    });
  });

  describe('format/formatNumber', () => {
    it.each([
      ['', '', ''],
      ['-', '-', '-'],
      [',', ',', '0,'],
      ['-,5', '-,5', '-0,5'],
      ['12,', '12,', '12,'],
      ['0012,30', '0.012,30', '12,30'],
      ['-0', '-0', '-'],
    ])('should preserve intermediate and final formatting of %j', (value, editing, final) => {
      const service = createService();
      expect(service.formatNumber(value, { finalFormatting: false })).toBe(editing);
      expect(service.formatNumber(value)).toBe(final);
    });

    it.each([
      [0, '0'],
      [-1234.567, '-1.234,56'],
      [NaN, ''],
      [Infinity, ''],
      [1e-7, '1'],
      [1e21, '1'],
    ])('should preserve number-to-string formatting of %s', (value, formatted) => {
      expect(createService().format(value)).toBe(formatted);
    });

    it('should apply defaults for null options while preserving false and zero', () => {
      const service = createService();
      expect(service.formatNumber('001,234', { decimalPlaces: null, finalFormatting: null, autofillDecimals: null })).toBe('1,23');
      expect(service.formatNumber('001,234', { decimalPlaces: 0, finalFormatting: false })).toBe('001');
    });

    it('should return formatted number with default separators', () => {
      const service = createService();

      expect(service.format(1234567.89, { decimalPlaces: 2 })).toEqual('1.234.567,89');
    });

    it('should return formatted number with populated separators', () => {
      const service = createService();
      service.decimalSeparator = ',';
      service.groupingSeparator = '.';

      expect(service.format(1234567.89, { decimalPlaces: 2 })).toEqual('1.234.567,89');
    });

    it('should return empty string if the value is not set', () => {
      const service = createService();

      expect(service.format(undefined)).toEqual('');
      expect(service.format(null)).toEqual('');
    });

    it('should return formatted number with populated autofillDecimals', () => {
      const service = createService();

      expect(service.format(1234567.89, { autofillDecimals: true })).toEqual('1.234.567,89');
    });

    it('should return formatted number with populated autofillDecimals and decimalPlaces', () => {
      const service = createService();

      expect(service.format(1234567, { decimalPlaces: 2, autofillDecimals: true })).toEqual('1.234.567,00');
    });

    it('should add a leading zero before decimal values', () => {
      const service = createService();

      expect(service.formatNumber(',5', { decimalPlaces: 2 })).toEqual('0,5');
      expect(service.formatNumber('-,5', { decimalPlaces: 2 })).toEqual('-0,5');
    });
  });

  describe('strip', () => {
    it('should strip string number', () => {
      const service = createService();

      expect(service.strip('1234,8', { decimalPlaces: 2 })).toEqual('1234,8');
      expect(service.strip('1234.8', { decimalPlaces: 2 })).toEqual('12348');
    });

    it('should remove decimal separator when decimalPlaces set to zero', () => {
      const service = createService();

      expect(service.strip('1234,56', { decimalPlaces: 0 })).toEqual('1234');
      expect(service.strip('1234.56', { decimalPlaces: 0 })).toEqual('123456');
    });

    it('should remove subsequent decimal separators', () => {
      const service = createService();

      expect(service.strip('1234,56,78', { decimalPlaces: 2 })).toEqual('1234,56');
    });

    it('should remove leading zero if not the only zero in the string', () => {
      const service = createService();

      expect(service.strip('01234', { decimalPlaces: 4, removeLeadingZeros: true })).toEqual('1234');
    });

    it('should ignore decimal values after maximum decimal places reached', () => {
      const service = createService();

      expect(service.strip('1234,5678', { decimalPlaces: 2 })).toEqual('1234,56');
    });

    it('should stop parsing after invalid character', () => {
      const service = createService();

      expect(service.strip('1234,56a789', { decimalPlaces: 4 })).toEqual('1234,56');
    });

    it('should parse negative value', () => {
      const service = createService();

      expect(service.strip('-1234,56', { decimalPlaces: 2 })).toEqual('-1234,56');
    });

    it('should ignore dot grouping for fr-FR', () => {
      expect(createService('fr-FR').strip('1.234.567,89')).toBe('1234567,89');
    });

    it.each(['\u202F', '\u00A0', ' '])('should stop at unsupported whitespace grouping %j', (separator) => {
      expect(createService('fr-FR').strip(`1${separator}234${separator}567,89`)).toBe('1');
    });
  });
});
