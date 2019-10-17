import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-read-only-demo',
  templateUrl: './read-only-demo.component.html',
  styleUrls: ['./read-only-demo.component.scss']
})
export class ReadOnlyDemoComponent implements OnInit {

  viewSource = false;
  constructor() { }

  ngOnInit() {
  }

}
