import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-filter-selector',
  templateUrl: './filter-selector.component.html',
  styleUrls: ['./filter-selector.component.scss']
})
export class FilterSelectorComponent implements OnInit {
  filterOptionsProvider: Function;
  showDataProvider: Function;
  values: string[] = ['Test0815'];
  options: string[] = ['Test123', 'Test0815', 'Example1'];
  required: boolean = false;

  ngOnInit(): void {
    this.showDataProvider = this.showData.bind(this);
    this.filterOptionsProvider = this.filterData.bind(this);
  }

  private showData(value: string): string {
    return value;
  }

  private filterData(filterValue: string, selectedValues): string[] {
    if (!filterValue || !this.options) {
      return this.options;
    }
    return this.options?.filter(value => value?.toLowerCase().includes(filterValue.toLowerCase()) || selectedValues?.includes(value));
  }
}
