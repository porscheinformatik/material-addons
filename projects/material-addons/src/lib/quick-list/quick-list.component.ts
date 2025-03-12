// Based on https://github.com/porscheinformatik/clarity-addons/blob/master/src/clr-addons/generic-quick-list/generic-quick-list.ts

import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseQuickListComponent, QuickListItem } from './base-quick-list.component';
import { FormBuilder } from '@angular/forms';
import { OutlineButtonComponent } from '../button/outline-button/outline-button.component';
import { MatIconModule } from '@angular/material/icon';
import { IconButtonComponent } from '../button/icon-button/icon-button.component';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'mad-quick-list',
  templateUrl: './quick-list.component.html',
  styleUrls: [],
  imports: [NgFor, NgIf, NgTemplateOutlet, IconButtonComponent, MatIconModule, OutlineButtonComponent],
})
export class QuickListComponent extends BaseQuickListComponent<QuickListItem> {
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public formBuilder: FormBuilder,
  ) {
    super(changeDetectorRef, formBuilder);
  }
}
