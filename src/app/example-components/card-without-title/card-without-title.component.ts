import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CardModule, ReadOnlyFormFieldModule } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-card-without-title',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, CardModule, ReadOnlyFormFieldModule],
  templateUrl: './card-without-title.component.html',
})
export class CardWithoutTitleComponent {
  protected firstName: string;
  protected lastName: string;
}
