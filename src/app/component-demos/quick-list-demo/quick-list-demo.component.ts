import { Component } from '@angular/core';
import { QuickListBasicComponent } from '../../example-components/quick-list-basic/quick-list-basic.component';
import { Example } from '../../components/example-viewer/example.class';
import { QuickListExtendedComponent } from '../../example-components/quick-list-extended/quick-list-extended.component';
import { QuickListCompactBasicComponent } from '../../example-components/quick-list-compact-basic/quick-list-compact-basic.component';
import { QuickListReactiveFormBasicComponent } from '../../example-components/quick-list-reactive-form-basic/quick-list-reactive-form-basic.component';
import { QuickListReactiveFormCompactComponent } from '../../example-components/quick-list-reactive-form-compact/quick-list-reactive-form-compact.component';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';
import { TextCodeComponent } from '../../components/text-code/text-code.component';

@Component({
  selector: 'app-quick-list-demo',
  templateUrl: './quick-list-demo.component.html',
  styleUrls: ['./quick-list-demo.component.scss'],
  imports: [TextCodeComponent, ExampleViewerComponent],
})
export class QuickListDemoComponent {
  basicQuickListComponent = new Example(QuickListBasicComponent, 'quick-list-basic', 'Quick List Basic');
  extendedQuickListComponent = new Example(QuickListExtendedComponent, 'quick-list-extended', 'Quick List Extended');
  compactQuickListComponent = new Example(QuickListCompactBasicComponent, 'quick-list-compact-basic', 'Quick List Compact');
  basicReactiveFromQuickListListComponent = new Example(
    QuickListReactiveFormBasicComponent,
    'quick-list-reactive-form-basic',
    'Quick List Reactive Form Basic',
  );
  compactReactiveFromQuickListListComponent = new Example(
    QuickListReactiveFormCompactComponent,
    'quick-list-reactive-form-compact',
    'Quick List Reactive Form Compact',
  );
}
