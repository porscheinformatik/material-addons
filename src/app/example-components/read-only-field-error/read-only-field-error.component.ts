import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReadOnlyFormFieldModule } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-read-only-field-error',
  templateUrl: './read-only-field-error.component.html',
  styleUrls: ['./read-only-field-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReadOnlyFormFieldModule],
})
export class ReadOnlyFieldErrorComponent {}
