import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { CardEditableComponent } from 'src/app/example-components/card-editable/card-editable.component';
import { CardReadonlyComponent } from 'src/app/example-components/card-readonly/card-readonly.component';

@Component({
  selector: 'app-card-demo',
  templateUrl: './card-demo.component.html',
  styleUrls: ['./card-demo.component.scss'],
})
export class CardDemoComponent {
  cardEditableComponent = new Example(
    CardEditableComponent,
    'card-editable',
    'Editable Card wrapper',
  );
  cardReadonlyComponent = new Example(
    CardReadonlyComponent,
    'card-readonly',
    'Readonly Card wrapper',
  );
}
