import { Component } from '@angular/core';
import { of, timer } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, AsyncPipe } from '@angular/common';
import { CardModule, ReadOnlyFormFieldModule } from '@porscheinformatik/material-addons';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-card-editable',
  templateUrl: './card-editable.component.html',
  styleUrls: ['./card-editable.component.scss'],
  standalone: true,
  imports: [
    MatCheckboxModule,
    CardModule,
    NgIf,
    MatProgressSpinnerModule,
    ReadOnlyFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    AsyncPipe,
  ],
})
export class CardEditableComponent {
  isInEditMode = false;
  firstName = 'Jane';
  lastName = 'Doe';
  address = '1030 Wien Landstraße 111 / 22 / 33';
  deliveryAddress = '5020 Salzburg Leopoldskronstraße 111 / 22 / 33';
  isLoading = false;
  showHelpIcon = false;

  /* Simulate async translation pipe */
  asyncName = of('Last Name').pipe(delay(1000));

  onEditMode(): void {
    this.isInEditMode = true;
  }

  onCancel(): void {
    // reset values
    this.firstName = 'Jane';
    this.lastName = 'Doe';
    this.isInEditMode = false;
  }

  onSave(): void {
    this.isLoading = true;
    // simulate a HTTP call to the backend
    timer(1500)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => (this.isInEditMode = false));
  }

  onAdditionalAction() {
    alert('additional action was clicked!');
  }
}
