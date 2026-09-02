import { Component } from '@angular/core';
import { BreadcrumbDemoApiSpecComponent } from './breadcrumb-demo-api-spec/breadcrumb-demo-api-spec.component';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';
import { TextCodeComponent } from '../../components/text-code/text-code.component';
import { Example } from '../../components/example-viewer/example.class';
import { BreadcrumbsComponent } from '../../example-components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-breadcrumb-demo',
  imports: [BreadcrumbDemoApiSpecComponent, ExampleViewerComponent, TextCodeComponent],
  templateUrl: './breadcrumb-demo.component.html',
})
export class BreadcrumbDemoComponent {
  breadcrumbsComponent = new Example(BreadcrumbsComponent, 'breadcrumbs', 'Breadcrumbs');
}
