import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '../button/button.module';
import { DragAndDropDirectiveDirective } from './drag-and-drop-directive.directive';
import { MatChipsModule } from '@angular/material/chips';

export type UploadError = 'ONLY_SINGLE_FILE' | 'FILETYPE_NOT_SUPPORTED';

@Component({
  selector: 'mad-file-upload',
  imports: [MatCardModule, MatIconModule, ButtonModule, TranslateModule, DragAndDropDirectiveDirective, MatChipsModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent implements OnInit {
  @Input() id: string;
  @Input() multiple: boolean;
  @Input() accept: string[];
  @Input() text: string;
  @Input() showFileList: boolean = false;
  @Input() removable: boolean = true;
  @Output() fileEmitter = new EventEmitter<FileList>();
  @Output() errorEmitter = new EventEmitter<UploadError>();

  fileList: File[] = [];
  acceptedFileTypes: string[] = [];

  ngOnInit(): void {
    this.setAcceptedFileTypes();
  }

  private setAcceptedFileTypes(): void {
    if (this.accept?.length) {
      this.acceptedFileTypes = this.accept.map((ext) => `.${ext.toLowerCase()}`);
    }
  }

  uploadFile(files: FileList): void {
    const fileArray = Array.from(files);

    if (!this.validateFileList(fileArray)) {
      return;
    }

    this.addFiles(fileArray);
    this.fileEmitter.emit(this.createFileListFromArray(this.fileList));
  }

  private validateFileList(fileArray: File[]): boolean {
    if (!this.multiple && fileArray.length > 1) {
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
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    return this.acceptedFileTypes.includes(`.${fileExtension}`);
  }

  private addFiles(fileArray: File[]): void {
    if (!this.multiple) {
      this.fileList = [];
    }
    this.fileList.push(...fileArray);
  }

  openFile(file: File): void {
    window.open(window.URL.createObjectURL(file));
  }

  remove(file: File): void {
    this.fileList = this.fileList.filter((f) => f !== file);
    this.fileEmitter.emit(this.createFileListFromArray(this.fileList));
  }

  private createFileListFromArray(files: File[]): FileList {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  }

  hasSingleFile(): boolean {
    return !this.multiple && this.fileList.length === 1;
  }
}
