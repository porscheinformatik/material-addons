import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'lib-user-id',
  templateUrl: './user-id.component.html',
  styleUrls: ['./user-id.component.scss']
})
export class UserIdComponent implements OnInit {

  user: any;


  constructor(
    public dialogRef: MatDialogRef<UserIdComponent>) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.getUser().toPromise().then(value => {
      this.user = value;
    });
  }

  getUser(): Observable<any> {
    return of({
      userId: 12345,
      firstName: 'John',
      lastName: 'Doe'
    });
  }

}
