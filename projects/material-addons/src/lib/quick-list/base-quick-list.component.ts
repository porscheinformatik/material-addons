import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  createLegacyQuickListItem,
  isQuickListAddAllowed,
  isQuickListRemoveAllowed,
  removeQuickListControl,
  removeQuickListItemInPlace,
} from './quick-list-operations';

export interface QuickListItem {
  id: string;
}

@Component({
  selector: 'mad-base-quick-list',
  template: '',
  standalone: true,
})
export class BaseQuickListComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  @Input() allItems = [] as T[];
  @Input() addLabel = 'NOT SET';
  @Input() removeLabel = 'Remove item';
  @Input() addPossible = true;
  @Input() removePossible = true;
  @Input() blankItem = {} as any;
  @Input() readonly: boolean;
  @Input() maxItems: number;
  @Input() minItems: number;
  @Input() formArray: FormArray;

  @Output() added = new EventEmitter<T>();
  @Output() removed = new EventEmitter<T>();
  @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;
  @ViewChildren('row') itemRows: QueryList<ElementRef>;

  rowCountFocus: number;
  addEventFunction: Function;
  private itemRowsChangesSubscription?: Subscription;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.addEventFunction = this.addItem.bind(this);
    if (this.minItems) {
      for (let n = this.allItems.length; n < this.minItems; n++) {
        this.interalAddItem();
      }
    }
  }

  ngAfterViewInit(): void {
    this.setFocusOnAdd();
  }

  ngOnDestroy(): void {
    this.itemRowsChangesSubscription?.unsubscribe();
  }

  addItem(): void {
    const newItem = this.interalAddItem();
    if (!!newItem) {
      this.added.emit(newItem);
    }
  }

  addReactiveItem(): void {
    if (this.isAddReactiveAllowed()) {
      this.added.emit(null);
    }
  }

  removeItem(item: T): void {
    if (this.isDeleteAllowed()) {
      removeQuickListItemInPlace(this.allItems, item);
      this.removed.emit(item);
    }
  }

  removeReactiveItem(item: AbstractControl<any>): void {
    if (this.isDeleteReactiveAllowed()) {
      if (removeQuickListControl(this.formArray, item)) {
        this.removed.emit(null);
      }
    }
  }

  setFocusOnAdd(): void {
    this.itemRowsChangesSubscription?.unsubscribe();
    this.rowCountFocus = this.itemRows.length;
    this.itemRowsChangesSubscription = this.itemRows.changes.subscribe((els: QueryList<ElementRef>) => {
      if (els.length > this.rowCountFocus && !!els.last) {
        const firstFocusable = els.last.nativeElement.querySelector("button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])");
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
      this.rowCountFocus = els.length;
    });
  }

  isAddAllowed(): boolean {
    return isQuickListAddAllowed(this.addPossible, this.maxItems, this.allItems?.length);
  }

  isAddReactiveAllowed(): boolean {
    return isQuickListAddAllowed(this.addPossible, this.maxItems, this.formArray?.controls.length);
  }

  isDeleteAllowed(): boolean {
    return isQuickListRemoveAllowed(this.removePossible, this.minItems, this.allItems?.length);
  }

  isDeleteReactiveAllowed(): boolean {
    return isQuickListRemoveAllowed(this.removePossible, this.minItems, this.formArray?.controls.length);
  }

  private interalAddItem(): T | null {
    if (this.isAddAllowed()) {
      const newItem = createLegacyQuickListItem<T>(this.blankItem);
      this.allItems.push(newItem);
      this.changeDetectorRef.detectChanges();
      return newItem;
    }
    return null;
  }
}
