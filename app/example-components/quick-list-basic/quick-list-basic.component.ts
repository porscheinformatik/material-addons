import { Component } from '@angular/core';
import { QuickListItem } from '@porscheinformatik/material-addons/lib/quick-list/quick-list.component';

interface QuickListDemoItem extends QuickListItem {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-quick-list-basic',
  templateUrl: './quick-list-basic.component.html',
  styleUrls: ['./quick-list-basic.component.scss'],
})
export class QuickListBasicComponent {
  items = [{ id: '1' } as QuickListDemoItem];
  textIsEditable = true;

  // eslint-disable-next-line
  onItemAdded(item: QuickListDemoItem): void {
    // updated items will be available in this.items
  }

  // eslint-disable-next-line
  onItemRemoved(item: QuickListDemoItem): void {
    // updated items will be available in this.items
  }
}
