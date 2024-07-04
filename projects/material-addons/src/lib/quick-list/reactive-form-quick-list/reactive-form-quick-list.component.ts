import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseQuickListComponent, QuickListItem } from '../base-quick-list.component';
import { FormBuilder } from '@angular/forms';
import { OutlineButtonComponent } from '../../button/outline-button/outline-button.component';
import { MatIconModule } from '@angular/material/icon';
import { IconButtonComponent } from '../../button/icon-button/icon-button.component';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'mad-reactive-form-quick-list',
  templateUrl: './reactive-form-quick-list.component.html',
  styleUrls: [],
  standalone: true,
  imports: [NgFor, NgIf, NgTemplateOutlet, IconButtonComponent, MatIconModule, OutlineButtonComponent],
})
export class ReactiveFormQuickListComponent extends BaseQuickListComponent<QuickListItem> {
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public formBuilder: FormBuilder,
  ) {
    super(changeDetectorRef, formBuilder);
  }
}
