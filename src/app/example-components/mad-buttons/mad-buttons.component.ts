import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'material-addons';

@Component({
  selector: 'mad-buttons',
  templateUrl: './mad-buttons.component.html',
  styleUrls: ['./mad-buttons.component.scss'],
  standalone: true,
  imports: [ButtonModule, MatIconModule, MatButtonModule],
})
export class MadButtonsComponent {}
