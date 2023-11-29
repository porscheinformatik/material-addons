import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseQuickListComponent, QuickListItem } from '../base-quick-list.component';
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'mad-quick-list-compact',
  templateUrl: './quick-list-compact.component.html',
  styleUrls: [],
})
export class QuickListCompactComponent extends BaseQuickListComponent<QuickListItem> {
  constructor(public changeDetectorRef: ChangeDetectorRef, public formBuilder: FormBuilder) {
    super(changeDetectorRef, formBuilder);
  }
}
