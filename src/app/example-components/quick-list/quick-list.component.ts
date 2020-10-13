import { Component } from '@angular/core';
import { QuickListItem } from '@porscheinformatik/material-addons/lib/quick-list/quick-list.component';

interface QuickListDemoItem extends QuickListItem {
  firstName: string;
  lastName: string;
};

@Component({
  selector: 'app-quick-list',
  templateUrl: './quick-list.component.html',
  styleUrls: ['./quick-list.component.scss'],
})
export class QuickListComponent {
  items = [<QuickListDemoItem>{ id: 1 }];
  textIsEditable = true;

  onItemAdded(item: QuickListDemoItem): void {
        // updated items will be available in this.items
  }

  onItemRemoved(item: QuickListDemoItem): void {
    // updated items will be available in this.items
  }
}
