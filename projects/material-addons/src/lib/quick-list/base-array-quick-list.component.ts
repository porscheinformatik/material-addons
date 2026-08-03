import { Component, Input, OnInit } from '@angular/core';
import { BaseQuickListComponent, QuickListItem } from './base-quick-list.component';
import { QuickListItemFactory } from './quick-list.types';

@Component({
  template: '',
  standalone: true,
})
export abstract class BaseArrayQuickListComponent<T extends QuickListItem> extends BaseQuickListComponent<T> implements OnInit {
  @Input() itemFactory?: QuickListItemFactory<T>;

  override ngOnInit(): void {
    if (!this.itemFactory) {
      super.ngOnInit();
      return;
    }

    this.addEventFunction = this.addItem.bind(this);
    if (this.minItems) {
      for (let index = this.allItems.length; index < this.minItems; index++) {
        this.addFactoryItem();
      }
    }
  }

  override addItem(): void {
    if (!this.itemFactory) {
      super.addItem();
      return;
    }

    const newItem = this.addFactoryItem();
    if (newItem) {
      this.added.emit(newItem);
    }
  }

  private addFactoryItem(): T | null {
    if (!this.isAddAllowed() || !this.itemFactory) {
      return null;
    }

    const newItem = this.itemFactory();
    this.allItems.push(newItem);
    this.changeDetectorRef.detectChanges();
    return newItem;
  }
}
