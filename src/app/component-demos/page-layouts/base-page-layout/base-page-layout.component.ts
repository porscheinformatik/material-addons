import { Component } from '@angular/core';
import { basePageLayout } from '../layout-example-template';
import { CodeSnippetComponent } from '../../../components/code-snippet/code-snippet.component';
import { RouterLink } from '@angular/router';
import { ButtonModule } from '@porscheinformatik/material-addons';

@Component({
    selector: 'base-page-layout',
    templateUrl: './base-page-layout.component.html',
    imports: [ButtonModule, RouterLink, CodeSnippetComponent]
})
export class BasePageLayoutComponent {
  basePageLayout = basePageLayout;
}
