import { Component } from '@angular/core';
import { AlertDemoApiSpecComponent } from '../alert-demo/alert-demo-api-spec/alert-demo-api-spec.component';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';
import { TextCodeComponent } from '../../components/text-code/text-code.component';
import { Example } from '../../components/example-viewer/example.class';
import { TileDemoApiSpecComponent } from './tile-demo-api-spec/tile-demo-api-spec.component';
import { TilesComponent } from '../../example-components/tiles/tiles.component';

@Component({
  selector: 'app-tile-demo',
  imports: [TileDemoApiSpecComponent, ExampleViewerComponent, TextCodeComponent],
  templateUrl: './tile-demo.component.html',
})
export class TileDemoComponent {
  tilesComponent = new Example(TilesComponent, 'tiles', 'Tiles');
}
