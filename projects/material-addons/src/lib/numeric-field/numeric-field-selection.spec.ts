import { describe, expect, it } from '@jest/globals';
import { mapNormalizedSelection } from './numeric-field-selection';

describe('mapNormalizedSelection', () => {
  it.each([
    ['123.,456', '123.45', '123.45', 4, 4, 4, 4],
    ['1234,456', '1234456', '1,234,456', 4, 4, 5, 5],
    ['123,9456', '1239456', '1,239,456', 5, 5, 5, 5],
    ['12,456', '12456', '12,456', 2, 2, 2, 2],
    ['1,245.67', '1245.67', '1,245.67', 4, 4, 4, 4],
    ['-.456', '-.45', '-.45', 2, 2, 2, 2],
    ['-1234.567', '-1234.56', '-1,234.56', 1, 5, 1, 6],
    ['00012', '12', '12', 3, 5, 0, 2],
    ['.45', '.45', '0.45', 1, 3, 2, 4],
    ['-.45', '-.45', '-0.45', 2, 4, 3, 5],
    ['a12b3', '123', '123', 1, 4, 0, 2],
    ['1e3', '1000', '1,000', 1, 2, 2, 4],
    ['1e3', '1000', '1,000', 0, 3, 0, 5],
    ['1e3', '1000', '1,000', 2, 2, 4, 4],
    ['-1e3', '-1000', '-1,000', 2, 3, 3, 5],
    ['1.2e3', '1200', '1,200', 3, 4, 3, 4],
    ['00012', '12', '12', 0, 5, 0, 2],
    ['.45', '.45', '0.45', 0, 3, 0, 4],
    ['-.45', '-.45', '-0.45', 0, 4, 0, 5],
    ['-1.2e3', '-1200', '-1,200', 0, 6, 0, 6],
    ['abc', '', '', 0, 3, 0, 0],
  ] as const)(
    'maps raw %s through normalized %s to formatted %s',
    (rawValue, normalizedValue, formattedValue, start, end, mappedStart, mappedEnd) => {
      expect(
        mapNormalizedSelection(
          { start, end },
          { rawValue, normalizedValue, formattedValue, groupingSeparator: ',', decimalSeparator: '.' },
        ),
      ).toEqual({ start: mappedStart, end: mappedEnd });
    },
  );

  it('retains a boundary after a localized grouping separator', () => {
    expect(
      mapNormalizedSelection(
        { start: 2, end: 2 },
        { rawValue: '1.234,56', normalizedValue: '1234,56', formattedValue: '1.234,56', groupingSeparator: '.', decimalSeparator: ',' },
      ),
    ).toEqual({ start: 2, end: 2 });
  });

  it('returns ordered endpoints without changing the caller selection', () => {
    const selection = { start: 5, end: 1 };
    expect(
      mapNormalizedSelection(selection, {
        rawValue: '12345',
        normalizedValue: '12345',
        formattedValue: '12,345',
        groupingSeparator: ',',
        decimalSeparator: '.',
      }),
    ).toEqual({ start: 1, end: 6 });
    expect(selection).toEqual({ start: 5, end: 1 });
  });
});
