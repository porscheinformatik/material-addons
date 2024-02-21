import { FormatOptions, NumberFormatService, StripOptions } from './number-format.service';
import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';

describe('NumberFormatService', () => {
  let service: NumberFormatService;
  const localeIdMock = 'de';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumberFormatService, { provide: LOCALE_ID, useValue: localeIdMock }],
    });
    service = TestBed.inject(NumberFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('format/formatNumber', () => {
    it('should return formatted number with default separators', () => {
      const result = service.format(1234567.89, { decimalPlaces: 2 } as FormatOptions);
      expect(result).toEqual('1.234.567,89');
    });

    it('should return formatted number with populated separators', () => {
      service.decimalSeparator = ',';
      service.groupingSeparator = '.';
      const result = service.format(1234567.89, { decimalPlaces: 2 } as FormatOptions);
      expect(result).toEqual('1.234.567,89');
    });

    it('should return empty string if the value is not set', () => {
      const result = service.format(undefined, {} as FormatOptions);
      expect(result).toEqual('');
    });

    it('should return formatted number with populated autofillDecimals', () => {
      const result = service.format(1234567.89, { autofillDecimals: true } as FormatOptions);
      expect(result).toEqual('1.234.567,89');
    });

    it('should return formatted number with populated autofillDecimals and decimalPlaces', () => {
      const result = service.format(1234567, { decimalPlaces: 2, autofillDecimals: true } as FormatOptions);
      expect(result).toEqual('1.234.567,00');
    });
  });

  describe('strip', () => {
    it('should strip string number', () => {
      const result = service.strip('1234,8', { decimalPlaces: 2 } as StripOptions);
      const resultWithDot = service.strip('1234.8', { decimalPlaces: 2 } as StripOptions);
      expect(result).toEqual('1234,8');
      expect(resultWithDot).toEqual('12348');
    });

    it('should remove decimal separator when decimalPlaces set to zero', () => {
      const result = service.strip('1234,56', { decimalPlaces: 0 } as StripOptions);
      const resultWithDot = service.strip('1234.56', { decimalPlaces: 0 } as StripOptions);
      expect(result).toEqual('1234');
      expect(resultWithDot).toEqual('123456');
    });

    it('should remove subsequent decimal separators', () => {
      const result = service.strip('1234,56,78', { decimalPlaces: 2 } as StripOptions);
      expect(result).toEqual('1234,56');
    });

    it('should remove leading zero if not the only zero in the string', () => {
      const result = service.strip('01234', { decimalPlaces: 4, removeLeadingZeros: true } as StripOptions);
      expect(result).toEqual('1234');
    });

    it('should ignore decimal values after maximum decimal places reached', () => {
      const result = service.strip('1234,5678', { decimalPlaces: 2 } as StripOptions);
      expect(result).toEqual('1234,56');
    });

    it('should stop parsing after invalid character', () => {
      const result = service.strip('1234,56a789', { decimalPlaces: 4 } as StripOptions);
      expect(result).toEqual('1234,56');
    });

    it('should parsing negative value', () => {
      const result = service.strip('-1234,56', { decimalPlaces: 2 } as StripOptions);
      expect(result).toEqual('-1234,56');
    });
  });
});
