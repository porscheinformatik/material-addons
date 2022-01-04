import {Component, EventEmitter, Input, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'mad-card',
  templateUrl: './card.component.html',
  animations: [
    trigger('collapseExpandAnimation', [
      transition(':enter', [style({opacity: 0, height: 0, overflow: 'hidden'}), animate('100ms', style({
        opacity: 1,
        height: '*'
      }))]),
      transition(':leave', [style({opacity: 1, height: '*', overflow: 'hidden'}), animate('100ms', style({
        opacity: 0,
        height: 0
      }))]),
    ]),
    trigger('rotateIcon', [
      state('true', style({transform: 'rotate(0)'})),
      state('false', style({transform: 'rotate(180deg)'})),
      transition('true => false', animate('100ms ease-out')),
      transition('false => true', animate('100ms ease-in')),
    ]),
  ],
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() cancelDisabled = false;
  @Input() cancelText = 'NOT SET';
  @Input() readonly = true;
  @Input() editText = 'NOT SET';
  @Input() expandable = true;
  @Input() expanded = true;
  @Input() saveDisabled = false;
  @Input() saveText = 'NOT SET';
  @Input() title: string;
  @Input() editMode = false;
  @Input() additionalActionIcon: string;
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() additionalAction = new EventEmitter();

  onCancel(): void {
    this.cancel.emit(undefined);
  }

  onEdit(): void {
    this.edit.emit(undefined);
    this.expanded = true;
  }

  onSave(): void {
    this.save.emit(undefined);
  }

  toggleCollapse(): void {
    this.expanded = !this.expanded;
  }

  additionalActionClicked() {
    this.additionalAction.emit(undefined);
  }
}
