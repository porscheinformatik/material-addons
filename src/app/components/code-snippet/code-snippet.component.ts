import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';

@Component({
  selector: 'app-code-snippet',
  templateUrl: './code-snippet.component.html',
  styleUrl: './code-snippet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Highlight],
})
export class CodeSnippetComponent {
  @Input() code: string;
}
