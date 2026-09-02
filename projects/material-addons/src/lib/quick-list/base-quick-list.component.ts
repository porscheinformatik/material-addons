import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder } from '@angular/forms';

export interface QuickListItem {
  id: string;
}

@Component({
  selector: 'mad-base-quick-list',
  template: '',
  styleUrls: [],
  standalone: true,
})
export class BaseQuickListComponent<T> implements OnInit, AfterViewInit {
  @Input() allItems = [] as T[];
  @Input() addLabel = 'NOT SET';
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
    setTimeout(() => this.setFocusOnAdd(), 1);
  }

  addItem(): void {
    const newItem = this.interalAddItem();
    if (!!newItem) {
      this.added.emit(newItem);
    }
  }

  addReactiveItem() {
    if (this.isAddReactiveAllowed()) {
      this.added.emit(null);
    }
  }

  removeItem(item: T): void {
    if (this.isDeleteAllowed()) {
      this.allItems.splice(this.allItems.indexOf(item), 1);
      this.removed.emit(item);
    }
  }

  removeReactiveItem(item: AbstractControl<any>) {
    if (this.isDeleteReactiveAllowed()) {
      const index = this.formArray.controls.indexOf(item);
      if (index >= 0) {
        this.formArray.controls.splice(index, 1);
        this.formArray.updateValueAndValidity();
        this.removed.emit(null);
      }
    }
  }

  setFocusOnAdd(): void {
    this.rowCountFocus = this.itemRows.length;
    this.itemRows.changes.subscribe((els: QueryList<ElementRef>) => {
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
    return this.addPossible && (!this.maxItems || this.allItems?.length < this.maxItems);
  }

  isAddReactiveAllowed(): boolean {
    return this.addPossible && (!this.maxItems || this.formArray?.controls.length < this.maxItems);
  }

  isDeleteAllowed(): boolean {
    return this.removePossible && (!this.minItems || this.allItems?.length > this.minItems);
  }

  isDeleteReactiveAllowed(): boolean {
    return this.removePossible && (!this.minItems || this.formArray?.controls.length > this.minItems);
  }

  private interalAddItem(): T {
    if (this.isAddAllowed()) {
      const newItem = { ...this.blankItem };
      // creates ids in the form of "n5kdz1pljl8"
      newItem.id = Math.random().toString(36).substring(2);
      this.allItems.push(newItem);
      this.changeDetectorRef.detectChanges();
      return newItem;
    }
    return null;
  }
}
