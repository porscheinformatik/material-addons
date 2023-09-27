// Based on https://github.com/porscheinformatik/clarity-addons/blob/master/src/clr-addons/generic-quick-list/generic-quick-list.ts

import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseQuickListComponent, QuickListItem } from './base-quick-list.component';
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'mad-quick-list',
  templateUrl: './quick-list.component.html',
  styleUrls: [],
})
export class QuickListComponent extends BaseQuickListComponent<QuickListItem> {
  constructor(public changeDetectorRef: ChangeDetectorRef, public formBuilder: FormBuilder) {
    super(changeDetectorRef, formBuilder);
  }
}
