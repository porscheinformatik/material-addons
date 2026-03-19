import { Component, computed, input, output, signal } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '../button/button.module';
import { DragAndDropDirective } from './drag-and-drop.directive';
import { MatChipsModule } from '@angular/material/chips';

export type UploadError = 'ONLY_SINGLE_FILE' | 'FILETYPE_NOT_SUPPORTED';

@Component({
  selector: 'mad-file-upload',
  imports: [MatCardModule, MatIconModule, ButtonModule, TranslateModule, DragAndDropDirective, MatChipsModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  id = input<string>('');
  multiple = input<boolean>(false);
  accept = input<string[]>([]);
  text = input<string>('');
  showFileList = input<boolean>(false);
  removable = input<boolean>(true);

  fileEmitter = output<FileList>();
  errorEmitter = output<UploadError>();

  protected readonly fileList = signal<File[]>([]);
  protected readonly acceptedFileTypes = computed(() => this.accept().map((ext) => `.${ext.toLowerCase()}`));
  protected readonly acceptAttribute = computed(() => this.acceptedFileTypes().join(','));
  protected readonly hasSingleFile = computed(() => !this.multiple() && this.fileList().length === 1);
  protected readonly uploadLabel = computed(() => this.text() || 'Upload');

  uploadFile(files: FileList | File[] | null): void {
    if (!files) {
      return;
    }

    const fileArray = Array.from(files);

    if (!this.validateFileList(fileArray)) {
      return;
    }

    this.addFiles(fileArray);
    this.fileEmitter.emit(this.createFileListFromArray(this.fileList()));
  }

  openFile(file: File): void {
    window.open(window.URL.createObjectURL(file));
  }

  remove(file: File): void {
    this.fileList.update((files) => files.filter((existingFile) => existingFile !== file));
    this.fileEmitter.emit(this.createFileListFromArray(this.fileList()));
  }

  private validateFileList(fileArray: File[]): boolean {
    if (!this.multiple() && fileArray.length > 1) {
      this.emitError('ONLY_SINGLE_FILE');
      return false;
    }

    for (const file of fileArray) {
      if (!this.isAcceptedFileType(file.name)) {
        this.emitError('FILETYPE_NOT_SUPPORTED');
        return false;
      }
    }

    return true;
  }

  private emitError(errorType: UploadError): void {
    this.errorEmitter.emit(errorType);
  }

  private isAcceptedFileType(fileName: string): boolean {
    const acceptedTypes = this.acceptedFileTypes();
    if (!acceptedTypes.length) {
      return true;
    }

    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    if (!fileExtension) {
      return false;
    }

    return acceptedTypes.includes(`.${fileExtension}`);
  }

  private addFiles(fileArray: File[]): void {
    if (!this.multiple()) {
      this.fileList.set(fileArray);
      return;
    }

    this.fileList.update((files) => [...files, ...fileArray]);
  }

  private createFileListFromArray(files: File[]): FileList {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  }
}
