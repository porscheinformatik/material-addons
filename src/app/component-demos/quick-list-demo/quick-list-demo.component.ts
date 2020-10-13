import { Component } from '@angular/core';
import { QuickListComponent } from 'src/app/example-components/quick-list/quick-list.component';
import { Example } from '../../components/example-viewer/example.class';

@Component({
  selector: 'app-quick-list-demo',
  templateUrl: './quick-list-demo.component.html',
  styleUrls: ['./quick-list-demo.component.scss'],
})
export class QuickListDemoComponent {
  quickListComponent = new Example(QuickListComponent, 'quick-list', 'Quick List');
}
