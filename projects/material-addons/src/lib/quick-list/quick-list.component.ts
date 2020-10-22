// Based on https://github.com/porscheinformatik/clarity-addons/blob/master/src/clr-addons/generic-quick-list/generic-quick-list.ts

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

export interface QuickListItem {
  id: string;
}

@Component({
  selector: 'mad-quick-list',
  templateUrl: './quick-list.component.html',
  styleUrls: [],
})
export class QuickListComponent<T extends QuickListItem> implements OnInit, AfterViewInit {
  @Input() allItems = [] as T[];
  @Input() addLabel = 'NOT SET';
  @Input() addPossible = true;
  @Input() blankItem = {} as any;
  @Input() readonly: string;
  @Input() maxItems: number;
  @Input() minItems: number;

  @Output() added = new EventEmitter<T>();
  @Output() removed = new EventEmitter<T>();
  @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;
  @ViewChildren('row') itemRows: QueryList<ElementRef>;

  rowCountFocus: number;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (typeof this.minItems !== 'undefined') {
      for (let n = this.allItems.length; n < this.minItems; n++) {
        this.addItem();
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.setFocusOnAdd(), 1);
  }

  addItem(): void {
    if (this.isAddAllowed()) {
      const newItem = { ...this.blankItem };
      // creates ids in the form of "n5kdz1pljl8"
      newItem.id = Math.random()
        .toString(36)
        .substring(2);
      this.allItems.push(newItem);
      this.added.emit(newItem);

      this.changeDetectorRef.detectChanges();
    }
  }

  removeItem(item: T): void {
    if (this.isDeleteAllowed()) {
      this.allItems.splice(this.allItems.indexOf(item), 1);
      this.removed.emit(item);
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
    return typeof this.maxItems === 'undefined' || this.allItems.length < this.maxItems;
  }

  isDeleteAllowed(): boolean {
    return typeof this.minItems === 'undefined' || this.allItems.length > this.minItems;
  }
}
