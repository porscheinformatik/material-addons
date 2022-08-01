import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'mad-filter-selector',
  templateUrl: './filter-selector.component.html',
  styleUrls: ['./filter-selector.component.css']
})
export class FilterSelectorComponent implements OnInit, OnChanges {

  @Input() label: string;
  @Input() values: string[];
  @Input() filterLabel: string;
  @Input() readonly: boolean;
  @Input() noOptionsText: string;
  @Input() multiple: boolean;
  @Input() required: boolean;
  @Input() showDataProvider: Function;
  @Input() filterOptionsProvider: Function;
  @Input() valueProvider: Function;

  @Output() valuesChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @ViewChild('filter') filter: ElementRef;
  formControl = new FormControl('');
  filterValue: string;

  ngOnInit(): void {
    if (this.values?.length) {
      this.changeFormControlValue();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.values) {
      this.changeFormControlValue();
    }
  }

  private changeFormControlValue() {
    if (this.values?.length) {
      this.formControl.setValue(this.values);
    } else {
      this.formControl.setValue([]);
    }
  }

  dialogOpened(): void {
    this.filter.nativeElement.focus();
  }

  selectionChanged(event: MatSelectChange) {
    this.valuesChange.emit(event.value);
  }
}
