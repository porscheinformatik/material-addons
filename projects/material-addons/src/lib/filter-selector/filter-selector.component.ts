import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'mad-filter-selector',
  templateUrl: './filter-selector.component.html',
  styleUrls: ['./filter-selector.component.css']
})
export class FilterSelectorComponent implements OnInit {

  @Input() label: string;
  @Input() values: string[];
  @Input() filterLabel: string;
  @Input() readonly: boolean;
  @Input() noOptionsText: string;
  @Input() multiple: boolean;
  @Input() required: boolean;
  @Input() showDataProvider: Function;
  @Input() filterOptionsProvider: Function;

  @Output() valuesChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @ViewChild('filter') filter: ElementRef;
  formControl = new FormControl('');
  filterValue: string;

  ngOnInit(): void {
    if (this.values?.length) {
      this.formControl.setValue(this.multiple ? this.values : this.values[0]);
    }
  }

  dialogOpened(): void {
    this.filter.nativeElement.focus();
  }
}
