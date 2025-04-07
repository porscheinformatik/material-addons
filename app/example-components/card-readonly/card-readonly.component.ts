import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CardModule, ReadOnlyFormFieldModule } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-card-readonly',
  templateUrl: './card-readonly.component.html',
  styleUrls: ['./card-readonly.component.scss'],
  standalone: true,
  imports: [CardModule, ReadOnlyFormFieldModule, MatFormFieldModule, MatInputModule, FormsModule],
})
export class CardReadonlyComponent {
  firstName = 'Jane';
  lastName = 'Doe';

  onAdditionalAction() {
    alert('additional action was clicked!');
  }
}
