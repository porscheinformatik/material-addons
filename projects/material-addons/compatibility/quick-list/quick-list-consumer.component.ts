import { Component } from '@angular/core';
import {
  QuickListCompactComponent,
  QuickListComponent,
  QuickListItem,
  QuickListItemFactory,
  QuickListModule,
} from '@porscheinformatik/material-addons';

interface ContactItem extends QuickListItem {
  firstName: string;
  lastName: string;
}

@Component({
  imports: [QuickListComponent, QuickListCompactComponent],
  template: `
    <mad-quick-list
      addLabel="Add contact"
      [allItems]="contacts"
      [itemFactory]="createContact"
      (added)="onContactAdded($event)"
      (removed)="onContactRemoved($event)"
    >
      <ng-template let-contact> {{ contact.firstName }} {{ contact.lastName }} </ng-template>
    </mad-quick-list>

    <mad-quick-list-compact
      addLabel="Add compact contact"
      [allItems]="compactContacts"
      [itemFactory]="createContact"
      (added)="onCompactContactAdded($event)"
      (removed)="onCompactContactRemoved($event)"
    >
      <ng-template let-contact> {{ contact.firstName }} {{ contact.lastName }} </ng-template>
    </mad-quick-list-compact>
  `,
})
export class GenericQuickListConsumerComponent {
  readonly contacts: ContactItem[] = [{ id: 'contact-1', firstName: 'Ada', lastName: 'Lovelace' }];
  readonly compactContacts: ContactItem[] = [{ id: 'contact-2', firstName: 'Grace', lastName: 'Hopper' }];
  private nextId = 3;

  readonly createContact: QuickListItemFactory<ContactItem> = () => ({
    id: `contact-${this.nextId++}`,
    firstName: '',
    lastName: '',
  });

  onContactAdded(item: ContactItem): void {
    item.firstName = 'New';
  }

  onContactRemoved(item: ContactItem): void {
    item.lastName = 'Removed';
  }

  onCompactContactAdded(item: ContactItem): void {
    item.firstName = 'New compact';
  }

  onCompactContactRemoved(item: ContactItem): void {
    item.lastName = 'Removed compact';
  }
}

@Component({
  imports: [QuickListModule],
  template: `
    <mad-quick-list
      addLabel="Add item"
      [allItems]="items"
      [blankItem]="blankItem"
      (added)="onItemAdded($event)"
      (removed)="onItemRemoved($event)"
    >
      <ng-template let-item>{{ item.id }}</ng-template>
    </mad-quick-list>
  `,
})
export class LegacyQuickListConsumerComponent {
  readonly items: QuickListItem[] = [{ id: 'legacy-1' }];
  readonly blankItem: QuickListItem = { id: '' };

  onItemAdded(item: QuickListItem): void {
    item.id = item.id;
  }

  onItemRemoved(item: QuickListItem): void {
    item.id = item.id;
  }
}

export class LegacyQuickListSubclass extends QuickListComponent {}
