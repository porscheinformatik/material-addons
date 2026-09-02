import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export type TileVariant = 'success' | 'error' | 'info' | 'warning';
export type TileSize = 'sm' | 'md' | 'lg';
export type TileIconPosition = 'start' | 'end';

@Component({
  selector: 'mad-tile',
  imports: [MatIcon],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
})
export class TileComponent {
  readonly label = input.required<string>();
  readonly variant = input<TileVariant>('info');
  readonly size = input<TileSize>('md');

  /** Optional Material icon name */
  readonly icon = input<string | null>(null);

  /** Icon position relative to label */
  readonly iconPosition = input<TileIconPosition>('start');
}
