import {ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {BaseQuickListComponent, QuickListItem} from "../base-quick-list.component";

@Component({
  selector: 'mad-reactive-form-quick-list-compact',
  templateUrl: './reactive-form-quick-list-compact.component.html',
  styleUrls: []
})
export class ReactiveFormQuickListCompactComponent extends BaseQuickListComponent<QuickListItem> {
  constructor(public changeDetectorRef: ChangeDetectorRef, public formBuilder: FormBuilder) {
    super(changeDetectorRef, formBuilder);
  }
}
