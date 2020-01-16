import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'lib-user-id',
  templateUrl: './user-id.component.html',
  styleUrls: ['./user-id.component.scss'],
})
export class UserIdComponent implements OnInit {
  user: { userId: number; firstName: string; lastName: string };
  constructor(public dialogRef: MatDialogRef<UserIdComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.getUser()
      .toPromise()
      .then(value => {
        this.user = value;
      });
  }

  getUser(): Observable<{ userId: number; firstName: string; lastName: string }> {
    return of({
      userId: 12345,
      firstName: 'John',
      lastName: 'Doe',
    });
  }
}
