import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mad-content-panel-container',
  templateUrl: './content-panel-container.component.html',
  styleUrls: ['./content-panel-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ContentPanelContainerComponent {}
