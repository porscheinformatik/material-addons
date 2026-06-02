import { Component } from '@angular/core';
import { Example } from '../../components/example-viewer/example.class';
import { FilePreviewBasicComponent } from '../../example-components/file-preview-basic/file-preview-basic.component';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';
import { TextCodeComponent } from '../../components/text-code/text-code.component';
import { FilePreviewDemoApiSpecComponent } from './file-preview-demo-api-spec/file-preview-demo-api-spec.component';

@Component({
  selector: 'app-file-preview-demo',
  templateUrl: './file-preview-demo.component.html',
  imports: [TextCodeComponent, ExampleViewerComponent, FilePreviewDemoApiSpecComponent],
})
export class FilePreviewDemoComponent {
  filePreviewBasicExample = new Example(FilePreviewBasicComponent, 'file-preview-basic', 'File Preview');
}
