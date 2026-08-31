import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mad-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ContentHeaderComponent {}
