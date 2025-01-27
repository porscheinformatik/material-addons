import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-example-page-two',
    templateUrl: './example-page-two.component.html',
    styleUrls: ['./example-page-two.component.scss'],
    imports: [NgFor]
})
export class ExamplePageTwoComponent {}
