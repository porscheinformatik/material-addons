import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {ButtonModule} from "../button/button.module";
import {DragAndDropDirectiveDirective} from "./drag-and-drop-directive.directive";
import {MatChipsModule} from "@angular/material/chips";

export type UploadError = "ONLY_SINGLE_FILE" | "FILETYPE_NOT_SUPPORTED";

@Component({
  selector: 'mad-file-upload',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, ButtonModule, TranslateModule, DragAndDropDirectiveDirective, MatChipsModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {

  @Input() id: string;
  @Input() multiple: boolean;
  @Input() accept: string[];
  @Input() text: string;
  @Input() showFileList: boolean = false;
  @Output() fileEmitter = new EventEmitter<FileList>();
  @Output() errorEmitter = new EventEmitter<UploadError>();

  fileList: File[] = [];
  private uploadError: boolean = false;

  uploadFile(fileList: FileList): void {
    if (!this.multiple && (fileList.length > 1 || this.fileList.length === 1)) {
      this.errorEmitter.emit("ONLY_SINGLE_FILE");
      this.uploadError = false;
      return;
    }
    if (this.accept && this.accept.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        this.getFileEnding(fileList.item(i).name);
      }
    }
    if (!this.uploadError) {
      for (let i = 0; i < fileList.length; i++) {
        this.fileList.push(fileList.item(i));
      }
      this.fileEmitter.emit(fileList);
    }
    this.uploadError = false;
  }

  getFileEnding(name: string): void {
    const ending = name.substring(name.lastIndexOf('.') + 1);
    if (this.accept.filter(a => a.toLowerCase() === ending.toLowerCase()).length === 0) {
      this.errorEmitter.emit("FILETYPE_NOT_SUPPORTED");
      this.uploadError = true;
    }
  }

  openFile(file: File) {
    window.open(window.URL.createObjectURL(file));
  }
}
