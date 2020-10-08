import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-card-editable',
  templateUrl: './card-editable.component.html',
  styleUrls: ['./card-editable.component.scss']
})
export class CardEditableComponent {
  isInEditMode = false;
  firstName = 'Jane';
  lastName = 'Doe';
  isLoading = false;
  
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
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(() => this.isInEditMode = false);
  }
}
