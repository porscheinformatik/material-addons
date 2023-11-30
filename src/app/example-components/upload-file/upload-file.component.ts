import {Component} from '@angular/core';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss'
})
export class UploadFileComponent {

  multiple: boolean = false;
  accept: string[] = ['pdf', 'png'];

  possibleFileEndings = ['pdf', 'doc', 'jpg', 'xls', 'xlsx', 'docx', 'doc', 'gif', 'png'];

  filesEmitted(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) {
      alert(fileList.item(i).name);
    }
  }
}
