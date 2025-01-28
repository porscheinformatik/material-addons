import {
  AfterViewInit,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { FilterComponent } from './data-table-filter-component/data-table-filter.component';
import { MatSortHeader } from '@angular/material/sort';
import { DataTableFilter } from './data-table-filter.directive';
import { Subscription } from 'rxjs';
import { DataTableFilterOption } from './data-table-filter-options';

@Directive({
  selector: 'th[mad-filter-header]',
  standalone: true,
})
export class DataTableFilterHeader implements OnInit, AfterViewInit, OnDestroy {
  @Input('mad-filter-header')
  id: string;

  @Input()
  madFilterColumnRightAligned?: boolean;

  @Input()
  set madFilterOptions(filterOptions: DataTableFilterOption[] | undefined) {
    this._filterOptions = filterOptions || [];
  }

  private _filterComponent: ComponentRef<FilterComponent>;
  private _filterValue: string | null;
  private _filterOptions: DataTableFilterOption[];

  private _subscription: Subscription = new Subscription();

  constructor(
    private element: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
    @Optional() private madFilter: DataTableFilter,
    @Optional() private matSortHeader: MatSortHeader,
  ) {}

  ngOnInit() {
    this._filterComponent = this.viewContainerRef.createComponent(FilterComponent);
    this._filterComponent.instance.filterOptions = this._filterOptions;
    this._filterComponent.changeDetectorRef.detectChanges();

    this.insertFilterComponent();
    this.observeFilterComponent();
  }

  ngAfterViewInit(): void {
    if (!!this.madFilter) {
      this.madFilter.register(this);
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this.madFilter.unregister(this);
  }

  observeFilterComponent() {
    this._subscription.add(
      this._filterComponent.instance.filterValueChange.subscribe((value) => {
        this._filterValue = value;
        this.madFilter.changeFilter();
      }),
    );
  }

  get filterValue(): string | null {
    return this._filterValue;
  }

  set filterValue(filterValue: string | null) {
    this._filterComponent.instance.filterValue = filterValue;
    this._filterComponent.changeDetectorRef.detectChanges();
  }

  @HostListener('mouseenter')
  onMouseenter() {
    this._filterComponent.instance.isHovered = true;
  }

  @HostListener('mouseleave')
  onMouseleave() {
    this._filterComponent.instance.isHovered = false;
  }

  private insertFilterComponent() {
    const componentNativeElement = this._filterComponent.location.nativeElement;
    const div = this.getWrappedHeader();

    if (!!this.matSortHeader) {
      const sortHeader = div.firstChild;
      this.renderer.insertBefore(sortHeader, componentNativeElement, sortHeader.firstChild.nextSibling);
    } else {
      this.renderer.appendChild(div, componentNativeElement);
    }
  }

  private getWrappedHeader() {
    const headerContent = this.element.nativeElement.firstChild;

    this.renderer.removeChild(this.element.nativeElement, headerContent);
    const div = this.renderer.createElement('div');
    this.renderer.setStyle(div, 'display', 'flex');
    this.renderer.setStyle(div, 'align-items', 'center');
    if (this.madFilterColumnRightAligned) {
      this.renderer.setStyle(div, 'justify-content', 'flex-end');
      if (!!headerContent.firstChild) {
        this.renderer.setStyle(headerContent.firstChild, 'justify-content', 'flex-end');
      }
    }
    this.renderer.appendChild(div, headerContent);
    this.renderer.appendChild(this.element.nativeElement, div);

    return div;
  }

  private findArrow(element: Element): Element | null {
    return this.isArrowElement(element) ? element : this.findArrowInList(element.children);
  }

  private findArrowInList(nativeElements: HTMLCollection): Element | null {
    for (let nativeElement of Array.from(nativeElements)) {
      const foundElement = this.findArrow(nativeElement);
      if (!!foundElement) {
        return foundElement;
      }
    }

    return null;
  }

  private isArrowElement(nativeElement: Element) {
    return nativeElement.classList.contains('mat-sort-header-arrow');
  }
}
