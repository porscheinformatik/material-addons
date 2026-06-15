import { Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { FileUploadComponent, FilePreviewComponent } from '@porscheinformatik/material-addons';
import { FilePreviewItem, FilePreviewConfig, ThumbnailSize } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-file-preview-basic',
  templateUrl: './file-preview-basic.component.html',
  styleUrl: './file-preview-basic.component.scss',
  imports: [FilePreviewComponent, FileUploadComponent, MatCheckboxModule, MatButtonToggleModule, MatSlideToggleModule, MatCardModule, FormsModule],
})
export class FilePreviewBasicComponent {
  showDeleteAction = true;
  showDownloadAction = true;
  showPreviewAction = true;
  showActionIcons = true;
  generatePdfThumbnails = true;
  excelPreviewRowLimit = 200;
  thumbnailSize: ThumbnailSize = 'md';
  readonly Infinity = Infinity;

  items: FilePreviewItem[] = [];
  config: FilePreviewConfig = this.buildConfig();

  updateConfig(): void {
    this.config = this.buildConfig();
  }

  onActionIconsChange(): void {
    if (!this.showActionIcons) {
      this.showPreviewAction = false;
      this.showDownloadAction = false;
      this.showDeleteAction = false;
    }
    this.updateConfig();
  }

  onFilesUploaded(fileList: FileList): void {
    const timestamp = Date.now();
    this.items = Array.from(fileList).map((file, i) => ({
      id: `${timestamp}-${i}`,
      name: file.name,
      mimeType: file.type || undefined,
      source: file,
      size: file.size,
    }));
  }

  onDeleteClicked(item: FilePreviewItem): void {
    this.items = this.items.filter(i => i.id !== item.id);
  }

  private buildConfig(): FilePreviewConfig {
    return {
      thumbnailSize: this.thumbnailSize,
      showDeleteAction: this.showDeleteAction,
      showDownloadAction: this.showDownloadAction,
      showPreviewAction: this.showPreviewAction,
      showActionIcons: this.showActionIcons,
      generatePdfThumbnails: this.generatePdfThumbnails,
      excelPreviewRowLimit: this.excelPreviewRowLimit,
    };
  }
}
