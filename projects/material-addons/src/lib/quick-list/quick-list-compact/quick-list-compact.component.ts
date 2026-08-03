import { ChangeDetectorRef, Component } from '@angular/core';
import { QuickListItem } from '../base-quick-list.component';
import { FormBuilder } from '@angular/forms';
import { LinkButtonComponent } from '../../button/flat-button/link-button.component';
import { MatIconModule } from '@angular/material/icon';
import { IconButtonComponent } from '../../button/icon-button/icon-button.component';
import { NgTemplateOutlet } from '@angular/common';
import { BaseArrayQuickListComponent } from '../base-array-quick-list.component';

@Component({
  selector: 'mad-quick-list-compact',
  templateUrl: './quick-list-compact.component.html',
  imports: [NgTemplateOutlet, IconButtonComponent, MatIconModule, LinkButtonComponent],
})
export class QuickListCompactComponent<T extends QuickListItem = QuickListItem> extends BaseArrayQuickListComponent<T> {
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public formBuilder: FormBuilder,
  ) {
    super(changeDetectorRef, formBuilder);
  }
}
