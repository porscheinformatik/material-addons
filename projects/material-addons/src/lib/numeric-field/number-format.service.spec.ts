import { describe, expect, it } from '@jest/globals';
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
      ['en-EN', '.', ',', '1,234,567.89'],
    ])('should use supported separators for %s', (locale, decimalSeparator, groupingSeparator, expectedValue) => {
      const service = createService(locale);

      expect(service.decimalSeparator).toBe(decimalSeparator);
      expect(service.groupingSeparator).toBe(groupingSeparator);
      expect(service.format(1234567.89, { decimalPlaces: 2 })).toBe(expectedValue);
    });

    it('should fall back to English separators for unsupported locales', () => {
      const service = createService('fr-FR');

      expect(service.decimalSeparator).toBe('.');
      expect(service.groupingSeparator).toBe(',');
    });
  });

  describe('format/formatNumber', () => {
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
  });
});
