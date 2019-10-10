import {Component, Input, OnInit} from '@angular/core';
import { ModuleEntry } from 'src/app/components/navigation/module-entry';

@Component({
  selector: 'link-card',
  templateUrl: './link-card.component.html',
  styleUrls: ['./link-card.component.scss']
})
export class LinkCardComponent implements OnInit {

  @Input()
  entry: ModuleEntry;

  @Input()
  external = false;

  constructor() {
  }

  ngOnInit() {
  }

}
