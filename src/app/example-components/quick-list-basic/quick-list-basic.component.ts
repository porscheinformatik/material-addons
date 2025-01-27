import { Component } from '@angular/core';
import { QuickListItem } from '@porscheinformatik/material-addons/lib/quick-list/base-quick-list.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { QuickListModule, ReadOnlyFormFieldModule, ButtonModule } from '@porscheinformatik/material-addons';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface QuickListDemoItem extends QuickListItem {
  firstName: string;
  lastName: string;
}

@Component({
    selector: 'app-quick-list-basic',
    templateUrl: './quick-list-basic.component.html',
    styleUrls: ['./quick-list-basic.component.scss'],
    imports: [MatCheckboxModule, FormsModule, QuickListModule, ReadOnlyFormFieldModule, MatFormFieldModule, MatInputModule, ButtonModule]
})
export class QuickListBasicComponent {
  items = [{ id: '1', firstName: null, lastName: null } as QuickListDemoItem];
  textIsEditable = true;
  addPossible = true;
  removePossible = true;

  // eslint-disable-next-line
  onItemAdded(item: QuickListDemoItem): void {
    // updated items will be available in this.items
  }

  // eslint-disable-next-line
  onItemRemoved(item: QuickListDemoItem): void {
    // updated items will be available in this.items
  }
}
