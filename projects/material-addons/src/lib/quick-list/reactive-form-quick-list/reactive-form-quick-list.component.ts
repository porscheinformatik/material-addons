import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseQuickListComponent, QuickListItem } from '../base-quick-list.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'mad-reactive-form-quick-list',
  templateUrl: './reactive-form-quick-list.component.html',
  styleUrls: [],
})
export class ReactiveFormQuickListComponent extends BaseQuickListComponent<QuickListItem> {
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public formBuilder: FormBuilder,
  ) {
    super(changeDetectorRef, formBuilder);
  }
}
