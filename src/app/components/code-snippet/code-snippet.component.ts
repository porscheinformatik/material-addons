import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-code-snippet',
  templateUrl: './code-snippet.component.html',
  styleUrl: './code-snippet.component.scss'
})
export class CodeSnippetComponent {
  @Input() code: string;

}
