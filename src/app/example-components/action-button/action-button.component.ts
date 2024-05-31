import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialActionButtonModule } from 'material-addons';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
  standalone: true,
  imports: [MaterialActionButtonModule, RouterLink],
})
export class ActionButtonComponent {}
