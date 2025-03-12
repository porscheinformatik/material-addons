import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CardModule, ReadOnlyFormFieldModule } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-card-expandable',
  templateUrl: './card-expandable.component.html',
  styleUrls: ['./card-expandable.component.scss'],
  imports: [CardModule, ReadOnlyFormFieldModule, MatFormFieldModule, MatInputModule, FormsModule, MatChipsModule],
})
export class CardExpandableComponent {
  firstName = 'Jane';
  lastName = 'Doe';
}
