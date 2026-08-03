import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { QuickListItem } from './base-quick-list.component';
import { QuickListCompactComponent } from './quick-list-compact/quick-list-compact.component';
import { QuickListComponent } from './quick-list.component';
import { ReactiveFormQuickListCompactComponent } from './reactive-form-quick-list-compact/reactive-form-quick-list-compact.component';
import { ReactiveFormQuickListComponent } from './reactive-form-quick-list/reactive-form-quick-list.component';

interface TestItem extends QuickListItem {
  name: string;
}

@Component({
  imports: [QuickListComponent, QuickListCompactComponent],
  template: `
    <mad-quick-list
      class="standard-list"
      addLabel="Add standard item"
      [allItems]="standardItems"
      [addPossible]="addPossible"
      [removePossible]="removePossible"
      [readonly]="readonly"
      [maxItems]="2"
      (added)="standardAdded.push($event)"
      (removed)="standardRemoved.push($event)"
    >
      <label>Standard items</label>
      <ng-template let-item>
        <input class="standard-item" [value]="item.name" />
      </ng-template>
    </mad-quick-list>

    <mad-quick-list-compact
      addLabel="Add compact item"
      [allItems]="compactItems"
      [addPossible]="addPossible"
      [removePossible]="removePossible"
      [readonly]="readonly"
      [minItems]="1"
      [maxItems]="2"
      (added)="compactAdded.push($event)"
      (removed)="compactRemoved.push($event)"
    >
      <label>Compact items</label>
      <ng-template let-item>
        <input class="compact-item" [value]="item.name" />
      </ng-template>
    </mad-quick-list-compact>

    <mad-quick-list
      class="factory-list"
      addLabel="Add factory item"
      [allItems]="factoryItems"
      [itemFactory]="itemFactory"
      (added)="factoryAdded.push($event)"
    >
      <ng-template let-item>
        <input class="factory-item" [value]="item.name" />
      </ng-template>
    </mad-quick-list>

    <mad-quick-list-compact
      class="empty-compact-list"
      addLabel="Add first compact item"
      [allItems]="emptyCompactItems"
      [itemFactory]="itemFactory"
      (added)="emptyCompactAdded.push($event)"
    >
      <ng-template let-item>
        <input class="empty-compact-item" [value]="item.name" />
      </ng-template>
    </mad-quick-list-compact>
  `,
})
class ArrayQuickListTestHostComponent {
  readonly standardItems: TestItem[] = [{ id: 'standard-1', name: 'Standard one' }];
  readonly compactItems: TestItem[] = [{ id: 'compact-1', name: 'Compact one' }];
  readonly factoryItems: TestItem[] = [];
  readonly emptyCompactItems: TestItem[] = [];
  readonly factoryCreatedItem: TestItem = { id: 'factory-owned-id', name: 'Factory item' };
  readonly itemFactory = (): TestItem => this.factoryCreatedItem;
  readonly standardAdded: TestItem[] = [];
  readonly standardRemoved: TestItem[] = [];
  readonly compactAdded: TestItem[] = [];
  readonly compactRemoved: TestItem[] = [];
  readonly factoryAdded: TestItem[] = [];
  readonly emptyCompactAdded: TestItem[] = [];
  readonly = false;
  addPossible = true;
  removePossible = true;
}

@Component({
  imports: [ReactiveFormQuickListComponent, ReactiveFormQuickListCompactComponent],
  template: `
    <mad-reactive-form-quick-list
      addLabel="Add reactive item"
      [formArray]="standardFormArray"
      [maxItems]="2"
      (added)="standardAdded.push($event)"
      (removed)="standardRemoved.push($event)"
    >
      <label>Reactive items</label>
      <ng-template let-item>
        <input class="reactive-item" [value]="item.value" />
      </ng-template>
    </mad-reactive-form-quick-list>

    <mad-reactive-form-quick-list-compact
      addLabel="Add compact reactive item"
      [formArray]="compactFormArray"
      [minItems]="1"
      [maxItems]="2"
      (added)="compactAdded.push($event)"
      (removed)="compactRemoved.push($event)"
    >
      <label>Compact reactive items</label>
      <ng-template let-item>
        <input class="compact-reactive-item" [value]="item.value" />
      </ng-template>
    </mad-reactive-form-quick-list-compact>

    <mad-reactive-form-quick-list-compact
      class="empty-compact-reactive-list"
      addLabel="Add first reactive item"
      [formArray]="emptyCompactFormArray"
      (added)="emptyCompactAdded.push($event)"
    >
      <ng-template let-item>
        <input class="empty-compact-reactive-item" [value]="item.value" />
      </ng-template>
    </mad-reactive-form-quick-list-compact>
  `,
})
class ReactiveQuickListTestHostComponent {
  readonly standardFormArray = new FormArray([new FormControl('Reactive one')]);
  readonly compactFormArray = new FormArray([new FormControl('Compact reactive one')]);
  readonly emptyCompactFormArray = new FormArray<FormControl<string | null>>([]);
  readonly standardAdded: unknown[] = [];
  readonly standardRemoved: unknown[] = [];
  readonly compactAdded: unknown[] = [];
  readonly compactRemoved: unknown[] = [];
  readonly emptyCompactAdded: unknown[] = [];
}

@Component({
  imports: [QuickListComponent],
  template: `<mad-quick-list addLabel="Add item" [allItems]="items"></mad-quick-list>`,
})
class NoTemplateQuickListTestHostComponent {
  readonly items: TestItem[] = [{ id: 'item-1', name: 'Not rendered' }];
}

describe('Quick List rendered behavior', () => {
  function clickButton(fixture: ComponentFixture<unknown>, selector: string): void {
    const button = fixture.nativeElement.querySelector(`${selector} button`) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ArrayQuickListTestHostComponent,
        ReactiveQuickListTestHostComponent,
        NoTemplateQuickListTestHostComponent,
        NoopAnimationsModule,
      ],
    }).compileComponents();
  });

  describe('array-backed variants', () => {
    let fixture: ComponentFixture<ArrayQuickListTestHostComponent>;
    let host: ArrayQuickListTestHostComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(ArrayQuickListTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('renders projected rows and preserves add payload and in-place mutation behavior', () => {
      expect(fixture.nativeElement.querySelector('.standard-item').value).toBe('Standard one');
      const originalItems = host.standardItems;

      clickButton(fixture, 'mad-quick-list.standard-list [data-cy="add-item-button"]');

      expect(host.standardItems).toBe(originalItems);
      expect(host.standardItems).toHaveLength(2);
      expect(host.standardAdded).toEqual([host.standardItems[1]]);
      expect(host.standardItems[1].id).toBeTruthy();
    });

    it('removes array items in place and emits the removed item', () => {
      const removedItem = host.standardItems[0];

      clickButton(fixture, 'mad-quick-list.standard-list [data-cy="delete-item-button"]');

      expect(host.standardItems).toHaveLength(0);
      expect(host.standardRemoved).toEqual([removedItem]);
    });

    it('keeps compact add and minimum-item behavior', () => {
      expect(fixture.nativeElement.querySelectorAll('mad-quick-list-compact .compact-item')).toHaveLength(1);
      expect(fixture.nativeElement.querySelector('mad-quick-list-compact [data-cy="delete-item-button"]')).toBeNull();

      clickButton(fixture, 'mad-quick-list-compact [data-cy="add-item-button"]');

      expect(host.compactItems).toHaveLength(2);
      expect(host.compactAdded).toEqual([host.compactItems[1]]);
      expect(fixture.nativeElement.querySelector('mad-quick-list-compact [data-cy="delete-item-button"]')).not.toBeNull();
    });

    it('keeps the compact empty-state link and adds through the same factory path', () => {
      expect(
        fixture.nativeElement.querySelector('mad-quick-list-compact.empty-compact-list [data-cy="add-first-item-button"]'),
      ).not.toBeNull();

      clickButton(fixture, 'mad-quick-list-compact.empty-compact-list [data-cy="add-first-item-button"]');

      expect(host.emptyCompactItems).toEqual([host.factoryCreatedItem]);
      expect(host.emptyCompactAdded).toEqual([host.factoryCreatedItem]);
      expect(fixture.nativeElement.querySelector('mad-quick-list-compact.empty-compact-list [data-cy="add-first-item-button"]')).toBeNull();
    });

    it('keeps the compact add action only in the last row and after the remove action', () => {
      clickButton(fixture, 'mad-quick-list-compact:not(.empty-compact-list) [data-cy="add-item-button"]');

      const rows = fixture.nativeElement.querySelectorAll(
        'mad-quick-list-compact:not(.empty-compact-list) .quick-list-row',
      ) as NodeListOf<HTMLElement>;
      expect(rows).toHaveLength(2);
      expect(rows[0].querySelector('[data-cy="add-item-button"]')).toBeNull();
      expect(Array.from(rows[1].children).map((child) => child.getAttribute('data-cy'))).toEqual([
        null,
        'delete-item-button',
        'add-item-button',
      ]);
    });

    it('preserves readonly, permission, and maximum-item action states', () => {
      host.addPossible = false;
      host.removePossible = false;
      fixture.detectChanges();

      const addButton = fixture.nativeElement.querySelector(
        'mad-quick-list.standard-list [data-cy="add-item-button"] button',
      ) as HTMLButtonElement;
      expect(addButton.disabled).toBe(true);
      expect(fixture.nativeElement.querySelector('mad-quick-list.standard-list [data-cy="delete-item-button"]')).toBeNull();

      host.readonly = true;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('mad-quick-list.standard-list [data-cy="add-item-button"]')).toBeNull();

      host.readonly = false;
      host.addPossible = true;
      fixture.detectChanges();
      clickButton(fixture, 'mad-quick-list.standard-list [data-cy="add-item-button"]');
      expect(
        (fixture.nativeElement.querySelector('mad-quick-list.standard-list [data-cy="add-item-button"] button') as HTMLButtonElement)
          .disabled,
      ).toBe(true);
    });

    it('uses configured labels as native icon-button titles', () => {
      const removeButton = fixture.nativeElement.querySelector(
        'mad-quick-list.standard-list [data-cy="delete-item-button"] button',
      ) as HTMLButtonElement;
      const compactAddButton = fixture.nativeElement.querySelector(
        'mad-quick-list-compact [data-cy="add-item-button"] button',
      ) as HTMLButtonElement;

      expect(removeButton.title).toBe('Remove item');
      expect(compactAddButton.title).toBe('Add compact item');
    });

    it('focuses the first focusable element in a newly added row', () => {
      clickButton(fixture, 'mad-quick-list.standard-list [data-cy="add-item-button"]');

      const inputs = fixture.nativeElement.querySelectorAll('mad-quick-list .standard-item') as NodeListOf<HTMLInputElement>;
      expect(document.activeElement).toBe(inputs[1]);
    });

    it('does not move focus when another row is removed', () => {
      clickButton(fixture, 'mad-quick-list.standard-list [data-cy="add-item-button"]');
      const inputs = fixture.nativeElement.querySelectorAll('mad-quick-list .standard-item') as NodeListOf<HTMLInputElement>;
      inputs[0].focus();

      const removeButtons = fixture.nativeElement.querySelectorAll(
        'mad-quick-list.standard-list [data-cy="delete-item-button"] button',
      ) as NodeListOf<HTMLButtonElement>;
      removeButtons[1].click();
      fixture.detectChanges();

      expect(document.activeElement).toBe(inputs[0]);
    });

    it('uses an opt-in item factory without cloning the result or rewriting its id', () => {
      clickButton(fixture, 'mad-quick-list.factory-list [data-cy="add-item-button"]');

      expect(host.factoryItems).toEqual([host.factoryCreatedItem]);
      expect(host.factoryItems[0]).toBe(host.factoryCreatedItem);
      expect(host.factoryItems[0].id).toBe('factory-owned-id');
      expect(host.factoryAdded).toEqual([host.factoryCreatedItem]);
    });
  });

  describe('reactive-form variants', () => {
    let fixture: ComponentFixture<ReactiveQuickListTestHostComponent>;
    let host: ReactiveQuickListTestHostComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(ReactiveQuickListTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('renders controls and emits null for add requests without mutating the FormArray', () => {
      expect(fixture.nativeElement.querySelector('.reactive-item').value).toBe('Reactive one');
      const originalControls = host.standardFormArray.controls;

      clickButton(fixture, 'mad-reactive-form-quick-list [data-cy="add-item-button"]');

      expect(host.standardFormArray.controls).toBe(originalControls);
      expect(host.standardFormArray).toHaveLength(1);
      expect(host.standardAdded).toEqual([null]);
    });

    it('removes a control and emits null', () => {
      const control = host.standardFormArray.at(0);

      clickButton(fixture, 'mad-reactive-form-quick-list [data-cy="delete-item-button"]');

      expect(host.standardFormArray).toHaveLength(0);
      expect(host.standardFormArray.controls).not.toContain(control);
      expect(host.standardRemoved).toEqual([null]);
    });

    it('keeps compact add and minimum-control behavior', () => {
      expect(fixture.nativeElement.querySelectorAll('mad-reactive-form-quick-list-compact .compact-reactive-item')).toHaveLength(1);
      expect(fixture.nativeElement.querySelector('mad-reactive-form-quick-list-compact [data-cy="delete-item-button"]')).toBeNull();

      clickButton(fixture, 'mad-reactive-form-quick-list-compact [data-cy="add-item-button"]');

      expect(host.compactFormArray).toHaveLength(1);
      expect(host.compactAdded).toEqual([null]);
    });

    it('keeps the compact reactive empty-state link and null add payload', () => {
      expect(
        fixture.nativeElement.querySelector(
          'mad-reactive-form-quick-list-compact.empty-compact-reactive-list [data-cy="add-first-item-button"]',
        ),
      ).not.toBeNull();

      clickButton(fixture, 'mad-reactive-form-quick-list-compact.empty-compact-reactive-list [data-cy="add-first-item-button"]');

      expect(host.emptyCompactFormArray).toHaveLength(0);
      expect(host.emptyCompactAdded).toEqual([null]);
    });
  });

  it('does not render item rows without a projected template', () => {
    const fixture = TestBed.createComponent(NoTemplateQuickListTestHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.quick-list-row')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-cy="add-item-button"]')).not.toBeNull();
  });
});
