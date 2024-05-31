import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseQuickListComponent, QuickListItem } from '../base-quick-list.component';
import { LinkButtonComponent } from '../../button/flat-button/link-button.component';
import { MatIconModule } from '@angular/material/icon';
import { IconButtonComponent } from '../../button/icon-button/icon-button.component';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'mad-reactive-form-quick-list-compact',
    templateUrl: './reactive-form-quick-list-compact.component.html',
    styleUrls: [],
    standalone: true,
    imports: [
        NgFor,
        NgIf,
        NgTemplateOutlet,
        IconButtonComponent,
        MatIconModule,
        LinkButtonComponent,
    ],
})
export class ReactiveFormQuickListCompactComponent extends BaseQuickListComponent<QuickListItem> {
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public formBuilder: FormBuilder,
  ) {
    super(changeDetectorRef, formBuilder);
  }
}
