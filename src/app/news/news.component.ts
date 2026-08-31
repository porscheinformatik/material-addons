import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ExampleHeaderComponent } from '../components/example-header/example-header.component';
import { ContentPanelModule } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContentPanelModule, ExampleHeaderComponent, TranslateModule],
})
export class NewsComponent {}
