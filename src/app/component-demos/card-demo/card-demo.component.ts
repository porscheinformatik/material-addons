import {Component} from '@angular/core';
import {Example} from '../../components/example-viewer/example.class';
import {CardEditableComponent} from '../../example-components/card-editable/card-editable.component';
import {CardReadonlyComponent} from '../../example-components/card-readonly/card-readonly.component';
import {CardExpandableComponent} from '../../example-components/card-expandable/card-expandable.component';
import {
  CardReactiveFormEditableComponent
} from '../../example-components/card-reactive-form-editable/card-reactive-form-editable.component';

@Component({
  selector: 'app-card-demo',
  templateUrl: './card-demo.component.html',
  styleUrls: ['./card-demo.component.scss'],
})
export class CardDemoComponent {
  cardEditableComponent = new Example(CardEditableComponent, 'card-editable', 'Editable Card Wrapper');
  cardReadonlyComponent = new Example(CardReadonlyComponent, 'card-readonly', 'Readonly Card Wrapper');
  cardExpandableComponent = new Example(CardExpandableComponent, 'card-expandable', 'Expandable Card Wrapper');
  cardReactiveFormEditableComponent = new Example(
    CardReactiveFormEditableComponent,
    'card-reactive-form-editable',
    'Reactive Form Editable Card Wrapper',
  );
}
