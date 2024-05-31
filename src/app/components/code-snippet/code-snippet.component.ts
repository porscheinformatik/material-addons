import { Component, Input } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';

@Component({
  selector: 'app-code-snippet',
  templateUrl: './code-snippet.component.html',
  styleUrl: './code-snippet.component.scss',
  standalone: true,
  imports: [Highlight],
})
export class CodeSnippetComponent {
  @Input() code: string;
}
