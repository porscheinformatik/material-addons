import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-read-only-field-wrapper',
  templateUrl: './read-only-field-wrapper.component.html',
  styleUrls: ['./read-only-field-wrapper.component.scss']
})
export class ReadOnlyFieldWrapperComponent implements OnInit {
  demoIdData = 'John Doe';
  textIsEditable = false;
  constructor() { }

  ngOnInit() {
  }

}
