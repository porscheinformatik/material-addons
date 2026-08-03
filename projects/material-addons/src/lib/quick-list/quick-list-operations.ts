import { AbstractControl, FormArray } from '@angular/forms';

export function isQuickListAddAllowed(addPossible: boolean, maxItems: number | undefined, itemCount: number | undefined): boolean {
  return addPossible && (!maxItems || (itemCount !== undefined && itemCount < maxItems));
}

export function isQuickListRemoveAllowed(removePossible: boolean, minItems: number | undefined, itemCount: number | undefined): boolean {
  return removePossible && (!minItems || (itemCount !== undefined && itemCount > minItems));
}

export function createLegacyQuickListItem<T>(blankItem: unknown): T {
  return {
    ...(blankItem as object),
    id: Math.random().toString(36).substring(2),
  } as T;
}

export function removeQuickListItemInPlace<T>(allItems: T[], item: T): void {
  allItems.splice(allItems.indexOf(item), 1);
}

export function removeQuickListControl(formArray: FormArray, control: AbstractControl<any>): boolean {
  const index = formArray.controls.indexOf(control);
  if (index < 0) {
    return false;
  }

  formArray.removeAt(index);
  return true;
}
