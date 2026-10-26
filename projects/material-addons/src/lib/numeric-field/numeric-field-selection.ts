export interface TextSelection {
  start: number;
  end: number;
}

export interface SelectionNormalization {
  rawValue: string;
  normalizedValue: string;
  formattedValue: string;
  groupingSeparator: string;
  decimalSeparator: string;
}

export function mapNormalizedSelection(selection: TextSelection, context: SelectionNormalization): TextSelection {
  const { rawValue, normalizedValue, formattedValue, groupingSeparator, decimalSeparator } = context;
  const isExponent = /^[+\-0-9.,]+[eE][+-]?[0-9]+$/.test(rawValue) && normalizedValue !== '';
  const mapPosition = (position: number): number => {
    if (position <= 0) {
      return 0;
    }
    if (position >= rawValue.length) {
      return formattedValue.length;
    }
    if (isExponent) {
      // An exponent is one literal, not independently parseable prefixes. Spread its
      // interior boundaries monotonically across the complete expanded display.
      return Math.ceil((position / rawValue.length) * formattedValue.length);
    }

    let retained = 0;
    for (let index = 0; index < position && retained < normalizedValue.length; index++) {
      if (rawValue.charAt(index) === normalizedValue.charAt(retained)) {
        retained++;
      }
    }

    let formattedPosition = 0;
    let normalizedPosition = 0;
    while (formattedPosition < formattedValue.length && normalizedPosition < retained) {
      if (formattedValue.charAt(formattedPosition) === normalizedValue.charAt(normalizedPosition)) {
        normalizedPosition++;
      }
      formattedPosition++;
    }

    if (
      groupingSeparator !== decimalSeparator &&
      rawValue.charAt(position - 1) === groupingSeparator &&
      formattedValue.charAt(formattedPosition) === groupingSeparator
    ) {
      formattedPosition++;
    }
    return formattedPosition;
  };

  const start = mapPosition(selection.start);
  const end = mapPosition(selection.end);
  return { start: Math.min(start, end), end: Math.max(start, end) };
}
