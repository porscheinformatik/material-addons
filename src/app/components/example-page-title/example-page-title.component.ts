import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'example-page-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './example-page-title.component.html',
  styleUrl: './example-page-title.component.scss',
})
export class ExamplePageTitleComponent {
  constructor(public titleService: Title) {}
}
