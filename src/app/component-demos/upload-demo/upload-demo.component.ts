import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { UploadFileComponent } from '../../example-components/upload-file/upload-file.component';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';
import { TextCodeComponent } from '../../components/text-code/text-code.component';
import { UploadDemoApiSpecComponent } from './upload-demo-api-spec/upload-demo-api-spec.component';

@Component({
  selector: 'app-upload-demo',
  templateUrl: './upload-demo.component.html',
  styleUrl: './upload-demo.component.scss',
  imports: [TextCodeComponent, ExampleViewerComponent, UploadDemoApiSpecComponent],
})
export class UploadDemoComponent {
  uploadComponent = new Example(UploadFileComponent, 'upload-file', 'upload');
}
