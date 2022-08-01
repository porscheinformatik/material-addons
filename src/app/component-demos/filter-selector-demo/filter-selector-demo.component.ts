import {Component} from '@angular/core';
import {Example} from '../../components/example-viewer/example.class';
import {FilterSelectorComponent} from '../../example-components/filter-selector/filter-selector.component';
import {
  FilterSelectorMultipleComponent
} from "../../example-components/filter-selector-multiple/filter-selector-multiple.component";

@Component({
  selector: 'app-filter-select-demo',
  templateUrl: './filter-selector-demo.component.html',
  styleUrls: ['./filter-selector-demo.component.scss']
})
export class FilterSelectorDemoComponent {
  filterSelectorComponent = new Example(FilterSelectorComponent, 'filter-selector', 'Filter Selector');
  filterSelectorMultipleComponent = new Example(FilterSelectorMultipleComponent, 'filter-selector', 'Filter Selector - Multiple');
}
