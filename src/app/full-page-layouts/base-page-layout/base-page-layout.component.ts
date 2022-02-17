import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-base-page-layout',
  templateUrl: './base-page-layout.component.html',
  styleUrls: ['./base-page-layout.component.scss']
})
export class BasePageLayoutComponent {
  constructor(private router: Router, private location: Location) {}

  public goToPreviousPage(): void {
    this.router.navigate([''], { skipLocationChange: true }).then(canRedirect => {
      if (canRedirect) {
        this.location.back();
      }
    });
  }
}
