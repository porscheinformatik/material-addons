import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TileComponent } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-tiles',
  imports: [TileComponent],
  templateUrl: './tiles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tiles.component.scss'],
})
export class TilesComponent {}
