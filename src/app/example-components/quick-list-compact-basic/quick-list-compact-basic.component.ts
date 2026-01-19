import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { QuickListItem, QuickListModule, ReadOnlyFormFieldModule } from '@porscheinformatik/material-addons';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface QuickListDemoItem extends QuickListItem {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-quick-list-compact',
  templateUrl: './quick-list-compact-basic.component.html',
  styleUrls: ['./quick-list-compact-basic.component.scss'],
  imports: [MatCheckboxModule, FormsModule, QuickListModule, ReadOnlyFormFieldModule, MatFormFieldModule, MatInputModule],
})
export class QuickListCompactBasicComponent {
  items = [{ id: '1', firstName: '', lastName: '' } as QuickListDemoItem];
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
