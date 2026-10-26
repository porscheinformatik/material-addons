/** Internal numeric-field precision policy, including static string attributes. */
export function normalizeDecimalPlaces(value: unknown): number {
  if (typeof value !== 'number' && (typeof value !== 'string' || value.trim() === '')) {
    return 2;
  }
  const precision = Number(value);
  return Number.isInteger(precision) && precision >= 0 && precision <= 100 ? precision : 2;
}

/** Expand the finite number's shortest decimal representation; IEEE-754 bounds the allocation. */
export function toDecimalString(value: number): string {
  if (!Number.isFinite(value)) {
    return '';
  }
  const text = value.toString();
  const [mantissa, exponent] = text.split('e');
  if (exponent === undefined) {
    return text;
  }
  const sign = value < 0 ? '-' : '';
  const [integer, fraction = ''] = mantissa.replace('-', '').split('.');
  const digits = integer + fraction;
  const decimalIndex = integer.length + Number(exponent);
  if (decimalIndex <= 0) {
    return `${sign}0.${'0'.repeat(-decimalIndex)}${digits}`;
  }
  if (decimalIndex >= digits.length) {
    return sign + digits + '0'.repeat(decimalIndex - digits.length);
  }
  return `${sign}${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`;
}

/** Operate on decimal digits so scaling cannot overflow or move a decimal boundary. */
export function roundOrTruncateNumber(value: number, decimalPlaces: number, roundDisplayValue: boolean): number {
  if (!Number.isFinite(value) || value === 0) {
    return value;
  }
  const precision = normalizeDecimalPlaces(decimalPlaces);
  const [integer, fraction = ''] = toDecimalString(Math.abs(value)).split('.');
  if (fraction.length <= precision) {
    return value;
  }
  const discarded = fraction.slice(precision);
  let digits = integer + fraction.slice(0, precision);
  // At an exact negative tie Math.round chooses the value closer to zero.
  const increment = discarded[0] > '5' || (discarded[0] === '5' && (value > 0 || /[1-9]/.test(discarded.slice(1))));
  if (roundDisplayValue && increment) {
    digits = (BigInt(digits) + 1n).toString();
  }
  digits = digits.padStart(precision + 1, '0');
  const decimalIndex = digits.length - precision;
  const result = precision > 0 ? `${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}` : digits;
  return Number((value < 0 ? '-' : '') + result);
}
