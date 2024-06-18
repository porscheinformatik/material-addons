import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { UploadFileComponent } from '../../example-components/upload-file/upload-file.component';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';
import { TextCodeComponent } from '../../components/text-code/text-code.component';

@Component({
  selector: 'app-upload-demo',
  templateUrl: './upload-demo.component.html',
  styleUrl: './upload-demo.component.scss',
  standalone: true,
  imports: [TextCodeComponent, ExampleViewerComponent],
})
export class UploadDemoComponent {
  uploadComponent = new Example(UploadFileComponent, 'upload-file', 'upload');
}
