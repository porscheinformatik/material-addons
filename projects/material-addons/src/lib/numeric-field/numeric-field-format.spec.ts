import { describe, expect, it } from '@jest/globals';
import { normalizeDecimalPlaces, roundOrTruncateNumber, toDecimalString } from './numeric-field-format';

describe('normalizeDecimalPlaces', () => {
  it.each([0, 2, 100, '0', '100', ' 3 ', '2.0', '1e1'])('accepts integer precision %j', (value) => {
    expect(normalizeDecimalPlaces(value)).toBe(Number(value));
  });

  it.each([null, undefined, '', ' ', NaN, Infinity, -Infinity, -1, 101, 1.5, '1.5', 'bad', true, [], {}])(
    'defaults invalid precision %j',
    (value) => {
      expect(normalizeDecimalPlaces(value)).toBe(2);
    },
  );
});

describe('toDecimalString', () => {
  it.each([
    [0, '0'],
    [-0, '0'],
    [1e-7, '0.0000001'],
    [-1e-7, '-0.0000001'],
    [1e21, `1${'0'.repeat(21)}`],
    [Number.MIN_VALUE, `0.${'0'.repeat(323)}5`],
    [Number.MAX_VALUE, `17976931348623157${'0'.repeat(292)}`],
    [NaN, ''],
    [Infinity, ''],
    [-Infinity, ''],
  ])('expands %s', (value, expected) => {
    expect(toDecimalString(value)).toBe(expected);
  });
});

describe('roundOrTruncateNumber', () => {
  it.each([
    [1.23999, 2, 1.23],
    [-1.23999, 2, -1.23],
    [1.23, 2, 1.23],
    [-1.23, 2, -1.23],
    [1.2299999999999998, 2, 1.22],
    [-1.2299999999999998, 2, -1.22],
    [1.99999, 0, 1],
    [-1.99999, 0, -1],
    [1e-7, 8, 1e-7],
    [1e-100, 100, 1e-100],
    [1e21, 100, 1e21],
    [Number.MAX_VALUE, 100, Number.MAX_VALUE],
    [Number.MIN_VALUE, 100, 0],
    [-0.001, 2, -0],
    [-0, 2, -0],
    [1.23999, NaN, 1.23],
  ])('truncates %s to %s places', (value, precision, expected) => {
    expect(roundOrTruncateNumber(value, precision, false)).toBe(expected);
  });

  it.each([
    [1.005, 2, 1.01],
    [-1.005, 2, -1],
    [1.235, 2, 1.24],
    [-1.235, 2, -1.23],
    [-1.23501, 2, -1.24],
    [9.995, 2, 10],
    [-9.995, 2, -9.99],
    [1.5, 0, 2],
    [-1.5, 0, -1],
    [-0.5, 0, -0],
    [-0.50001, 0, -1],
    [5e-100, 99, 1e-99],
    [-5e-100, 99, -0],
    [Number.MAX_VALUE, 100, Number.MAX_VALUE],
  ])('rounds %s to %s places with ties toward positive infinity', (value, precision, expected) => {
    expect(roundOrTruncateNumber(value, precision, true)).toBe(expected);
  });

  it.each([NaN, Infinity, -Infinity])('passes non-finite %s through for the formatter to reject', (value) => {
    expect(roundOrTruncateNumber(value, 2, false)).toBe(value);
    expect(roundOrTruncateNumber(value, 2, true)).toBe(value);
  });
});
