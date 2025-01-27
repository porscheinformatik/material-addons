import { Component } from '@angular/core';
import { UploadError, FileUploadComponent } from '@porscheinformatik/material-addons';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-upload-file',
    templateUrl: './upload-file.component.html',
    styleUrl: './upload-file.component.scss',
    imports: [MatFormFieldModule, MatSelectModule, FormsModule, NgFor, MatOptionModule, MatCheckboxModule, FileUploadComponent]
})
export class UploadFileComponent {
  multiple: boolean = false;
  accept: string[] = ['pdf', 'png'];

  possibleFileEndings = ['pdf', 'doc', 'jpg', 'xls', 'xlsx', 'docx', 'doc', 'gif', 'png'];
  showFileList: boolean = false;
  removable: boolean = false;

  filesEmitted(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) {
      alert(fileList.item(i).name);
    }
  }

  errorReceived(error: UploadError) {
    alert(error);
  }
}
