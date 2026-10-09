import { NgModule } from '@angular/core';

import { FilePreviewComponent } from './preview/file-preview.component';

@NgModule({
  imports: [FilePreviewComponent],
  exports: [FilePreviewComponent],
})
export class MaterialFilePreviewModule {}
