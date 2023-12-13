import { Component } from '@angular/core';
import { UploadError } from 'material-addons';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss',
})
export class UploadFileComponent {
  multiple: boolean = false;
  accept: string[] = ['pdf', 'png'];

  possibleFileEndings = ['pdf', 'doc', 'jpg', 'xls', 'xlsx', 'docx', 'doc', 'gif', 'png'];
  showFileList: boolean = false;

  filesEmitted(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) {
      alert(fileList.item(i).name);
    }
  }

  errorReceived(error: UploadError) {
    alert(error);
  }
}
