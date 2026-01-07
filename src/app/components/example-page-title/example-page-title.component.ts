import { Component } from '@angular/core';

import { Title } from '@angular/platform-browser';

@Component({
  selector: 'example-page-title',
  imports: [],
  templateUrl: './example-page-title.component.html',
  styleUrl: './example-page-title.component.scss',
})
export class ExamplePageTitleComponent {
  constructor(public titleService: Title) {}
}
