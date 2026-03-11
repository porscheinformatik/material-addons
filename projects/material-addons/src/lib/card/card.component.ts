import { Component, computed, EventEmitter, input, Input, model, output, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OutlineButtonComponent } from '../button/outline-button/outline-button.component';
import { ThrottleClickDirective } from '../throttle-click/throttle-click.directive';
import { PrimaryButtonComponent } from '../button/primary-button/primary-button.component';
import { MatIconModule } from '@angular/material/icon';
import { IconButtonComponent } from '../button/icon-button/icon-button.component';

import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'mad-card',
  templateUrl: './card.component.html',
  animations: [
    trigger('collapseExpandAnimation', [
      transition(':enter', [
        style({ opacity: 0, height: 0, overflow: 'hidden' }),
        animate(
          '100ms',
          style({
            opacity: 1,
            height: '*',
          }),
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*', overflow: 'hidden' }),
        animate(
          '100ms',
          style({
            opacity: 0,
            height: 0,
          }),
        ),
      ]),
    ]),
    trigger('rotateIcon', [
      state('true', style({ transform: 'rotate(0)' })),
      state('false', style({ transform: 'rotate(180deg)' })),
      transition('true => false', animate('100ms ease-out')),
      transition('false => true', animate('100ms ease-in')),
    ]),
  ],
  styleUrls: ['./card.component.scss'],
  imports: [MatCardModule, IconButtonComponent, MatIconModule, PrimaryButtonComponent, ThrottleClickDirective, OutlineButtonComponent],
})
export class CardComponent {
  cancelDisabled = input(false);
  cancelText = input<string>('NOT SET');

  readonly = input<boolean>(true);
  editText = input<string>('NOT SET');

  expandable = input<boolean>(true);
  expanded = model<boolean>(true);

  saveDisabled = input<boolean>(false);
  saveText = input<string>('NOT SET');

  title = input<string | undefined>(undefined);
  editMode = input<boolean>(false);

  additionalActionIcon = input<string | undefined>(undefined);
  additionalActionText = input<string>('');

  edit = output<void>();
  cancel = output<void>();
  save = output<void>();
  additionalAction = output<void>();

  protected showHeader = computed(() => Boolean(this.title()) || this.expandable());
  protected showCollapseButton = computed(() => this.expandable() && !this.editMode());
  protected showAdditionalActionButton = computed(() => Boolean(this.additionalActionIcon()));
  protected showEditButton = computed(() => !this.readonly() && !this.editMode());
  protected showActions = computed(() => !this.readonly() && this.editMode());

  onEdit(): void {
    this.expanded.set(true);
    this.edit.emit();
  }

  toggleCollapse(): void {
    this.expanded.update((expanded) => !expanded);
  }
}
