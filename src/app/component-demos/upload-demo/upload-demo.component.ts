import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { UploadFileComponent } from '../../example-components/upload-file/upload-file.component';

@Component({
  selector: 'app-upload-demo',
  templateUrl: './upload-demo.component.html',
  styleUrl: './upload-demo.component.scss',
})
export class UploadDemoComponent {
  uploadComponent = new Example(UploadFileComponent, 'upload-file', 'upload');
}
