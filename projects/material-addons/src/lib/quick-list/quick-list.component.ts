// Based on https://github.com/porscheinformatik/clarity-addons/blob/master/src/clr-addons/generic-quick-list/generic-quick-list.ts

import { ChangeDetectorRef, Component } from '@angular/core';
import { QuickListItem } from './base-quick-list.component';
import { FormBuilder } from '@angular/forms';
import { OutlineButtonComponent } from '../button/outline-button/outline-button.component';
import { MatIconModule } from '@angular/material/icon';
import { IconButtonComponent } from '../button/icon-button/icon-button.component';
import { NgTemplateOutlet } from '@angular/common';
import { BaseArrayQuickListComponent } from './base-array-quick-list.component';

@Component({
  selector: 'mad-quick-list',
  templateUrl: './quick-list.component.html',
  imports: [NgTemplateOutlet, IconButtonComponent, MatIconModule, OutlineButtonComponent],
})
export class QuickListComponent<T extends QuickListItem = QuickListItem> extends BaseArrayQuickListComponent<T> {
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public formBuilder: FormBuilder,
  ) {
    super(changeDetectorRef, formBuilder);
  }
}
