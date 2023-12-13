import { Component } from '@angular/core';

@Component({
  selector: 'app-card-readonly',
  templateUrl: './card-readonly.component.html',
  styleUrls: ['./card-readonly.component.scss'],
})
export class CardReadonlyComponent {
  firstName = 'Jane';
  lastName = 'Doe';

  onAdditionalAction() {
    alert('additional action was clicked!');
  }
}
