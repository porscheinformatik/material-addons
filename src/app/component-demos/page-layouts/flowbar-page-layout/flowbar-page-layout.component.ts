import { Component } from '@angular/core';
import { flowBarLayout } from '../layout-example-template';
import { CodeSnippetComponent } from '../../../components/code-snippet/code-snippet.component';
import { RouterLink } from '@angular/router';
import { ButtonModule } from '@porscheinformatik/material-addons';

@Component({
    selector: 'flowbar-page-layout',
    templateUrl: './flowbar-page-layout.component.html',
    imports: [ButtonModule, RouterLink, CodeSnippetComponent]
})
export class FlowbarPageLayoutComponent {
  flowBarLayout = flowBarLayout;
}
