import {
  ComponentRef,
  Directive,
  ElementRef,
  inject,
  input,
  inputBinding,
  OnDestroy,
  OnInit,
  outputBinding,
  Renderer2,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { FilterComponent } from './data-table-filter-component/data-table-filter.component';
import { DataTableFilter } from './data-table-filter.directive';
import { DataTableFilterOption } from './data-table-filter-options';

@Directive({
  selector: 'th[mad-filter-header]',
  standalone: true,
  host: {
    '(mouseenter)': 'onMouseenter()',
    '(mouseleave)': 'onMouseleave()',
  },
})
export class DataTableFilterHeader implements OnInit, OnDestroy {
  readonly madFilterHeaderId = input.required<string>({ alias: 'mad-filter-header' });
  readonly madFilterColumnRightAligned = input(false);
  readonly madFilterOptions = input<DataTableFilterOption[], DataTableFilterOption[] | undefined>([], {
    transform: (filterOptions) => filterOptions ?? [],
  });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly madFilter = inject(DataTableFilter, { optional: true });
  private readonly _filterValue = signal<string | null>(null);
  private readonly _isHovered = signal(false);

  private _filterComponent: ComponentRef<FilterComponent>;

  get id(): string {
    return this.madFilterHeaderId();
  }

  get filterValue(): string | null {
    return this._filterValue();
  }

  set filterValue(filterValue: string | null) {
    this._filterValue.set(filterValue);
    this._filterComponent?.changeDetectorRef.detectChanges();
  }

  onMouseenter(): void {
    this._isHovered.set(true);
  }

  onMouseleave(): void {
    this._isHovered.set(false);
  }

  ngOnInit(): void {
    this._filterComponent = this.viewContainerRef.createComponent(FilterComponent, {
      bindings: [
        inputBinding('filterOptions', this.madFilterOptions),
        inputBinding('filterValue', this._filterValue),
        inputBinding('isHovered', this._isHovered),
        outputBinding<string | null>('filterValueChange', (value) => this.onFilterValueChange(value)),
      ],
    });
    this._filterComponent.changeDetectorRef.detectChanges();

    this.insertFilterComponent();

    this.madFilter?.register(this);
  }

  ngOnDestroy(): void {
    this.madFilter?.unregister(this);
  }

  private onFilterValueChange(value: string | null): void {
    this._filterValue.set(value);
    this.madFilter?.changeFilter();
  }

  private insertFilterComponent(): void {
    const componentNativeElement = this._filterComponent.location.nativeElement as HTMLElement;
    const div = this.getWrappedHeader();

    this.renderer.appendChild(div, componentNativeElement);
  }

  private getWrappedHeader(): HTMLElement {
    const headerContent = this.element.nativeElement.firstChild;

    if (headerContent) {
      this.renderer.removeChild(this.element.nativeElement, headerContent);
    }

    const div = this.renderer.createElement('div') as HTMLElement;
    this.renderer.setStyle(div, 'display', 'flex');
    this.renderer.setStyle(div, 'align-items', 'center');
    if (this.madFilterColumnRightAligned()) {
      this.renderer.setStyle(div, 'justify-content', 'flex-end');
      if (headerContent?.firstChild) {
        this.renderer.setStyle(headerContent.firstChild, 'justify-content', 'flex-end');
      }
    }
    if (headerContent) {
      this.renderer.appendChild(div, headerContent);
    }
    this.renderer.appendChild(this.element.nativeElement, div);

    return div;
  }
}
