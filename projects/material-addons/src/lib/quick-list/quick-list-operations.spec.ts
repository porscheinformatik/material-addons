import { FormArray, FormControl } from '@angular/forms';
import {
  createLegacyQuickListItem,
  isQuickListAddAllowed,
  isQuickListRemoveAllowed,
  removeQuickListControl,
  removeQuickListItemInPlace,
} from './quick-list-operations';

describe('Quick List operations', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('preserves the established add limit semantics, including falsy limits', () => {
    expect(isQuickListAddAllowed(true, undefined, 1)).toBe(true);
    expect(isQuickListAddAllowed(true, 0, 1)).toBe(true);
    expect(isQuickListAddAllowed(true, 2, 1)).toBe(true);
    expect(isQuickListAddAllowed(true, 2, 2)).toBe(false);
    expect(isQuickListAddAllowed(false, 2, 1)).toBe(false);
  });

  it('preserves the established remove limit semantics, including falsy limits', () => {
    expect(isQuickListRemoveAllowed(true, undefined, 1)).toBe(true);
    expect(isQuickListRemoveAllowed(true, 0, 1)).toBe(true);
    expect(isQuickListRemoveAllowed(true, 1, 1)).toBe(false);
    expect(isQuickListRemoveAllowed(true, 1, 2)).toBe(true);
    expect(isQuickListRemoveAllowed(false, 1, 2)).toBe(false);
  });

  it('shallow-clones blankItem and assigns an id in the established format', () => {
    const nestedValue = { retainedByReference: true };
    const blankItem = { id: 'replace-me', name: 'New item', nestedValue };
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const newItem = createLegacyQuickListItem<typeof blankItem>(blankItem);

    expect(newItem).not.toBe(blankItem);
    expect(newItem).toEqual({
      id: 'i',
      name: 'New item',
      nestedValue,
    });
    expect(newItem.nestedValue).toBe(nestedValue);
  });

  it('mutates the existing array and removes the matching item', () => {
    const first = { id: 'first' };
    const second = { id: 'second' };
    const items = [first, second];

    removeQuickListItemInPlace(items, first);

    expect(items).toEqual([second]);
  });

  it('preserves the legacy indexOf/splice behavior when the item is missing', () => {
    const first = { id: 'first' };
    const second = { id: 'second' };
    const items = [first, second];

    removeQuickListItemInPlace(items, { id: 'missing' });

    expect(items).toEqual([first]);
  });

  it('uses the FormArray API and preserves value/status emissions for reactive removal', () => {
    const first = new FormControl('first');
    const second = new FormControl('second');
    const formArray = new FormArray([first, second]);
    const values: unknown[] = [];
    const statuses: string[] = [];
    formArray.valueChanges.subscribe((value) => values.push(value));
    formArray.statusChanges.subscribe((status) => statuses.push(status));

    const removed = removeQuickListControl(formArray, first);

    expect(removed).toBe(true);
    expect(formArray.controls).toEqual([second]);
    expect(formArray.value).toEqual(['second']);
    expect(formArray.getRawValue()).toEqual(['second']);
    expect(first.parent).toBe(formArray);
    expect(values).toEqual([['second']]);
    expect(statuses).toEqual(['VALID']);
  });

  it('does not update the FormArray when the requested control is missing', () => {
    const formArray = new FormArray([new FormControl('first')]);
    const values: unknown[] = [];
    formArray.valueChanges.subscribe((value) => values.push(value));

    const removed = removeQuickListControl(formArray, new FormControl('missing'));

    expect(removed).toBe(false);
    expect(formArray.value).toEqual(['first']);
    expect(values).toEqual([]);
  });
});
