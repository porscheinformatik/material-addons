import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateModule} from "@ngx-translate/core";
import {ButtonModule} from "../button/button.module";
import {DragAndDropDirectiveDirective} from "./drag-and-drop-directive.directive";

@Component({
  selector: 'mad-file-upload',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, ButtonModule, TranslateModule, DragAndDropDirectiveDirective],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {

  @Input() id: string;
  @Input() multiple: boolean;
  @Input() accept: string[];
  @Input() text: string;
  @Output() fileEmitter = new EventEmitter<FileList>();

  uploadError: boolean = false;

  constructor(private snackBar: MatSnackBar) {
  }

  uploadFile(fileList: FileList) {
    if (!this.multiple && fileList.length > 1) {
      this.snackBar.open('Only 1 File can be added', 'OK');
      this.uploadError = false;
      return;
    }
    if (this.accept && this.accept.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        this.getFileEnding(fileList.item(i).name);
      }
    }
    if (!this.uploadError) {
      this.fileEmitter.emit(fileList);
    }
    this.uploadError = false;
  }

  getFileEnding(name: string) {
    const ending = name.substring(name.lastIndexOf('.') + 1);
    if (this.accept.filter(a => a.toLowerCase() === ending.toLowerCase()).length === 0) {
      this.snackBar.open('Error: At least one File has an unsupported file type!', 'OK');
      this.uploadError = true;
    }
  }

  uploadDone() {
    this.fileEmitter.emit((document.getElementById(this.id) as any).files);
  }
}
