import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from '@porscheinformatik/material-addons';

@Component({
  selector: 'mad-buttons',
  templateUrl: './mad-buttons.component.html',
  styleUrls: ['./mad-buttons.component.scss'],
  imports: [ButtonModule, MatIconModule, MatButtonModule],
})
export class MadButtonsComponent {}
