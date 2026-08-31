import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mad-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MainContainerComponent {}
