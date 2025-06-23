import { Directive, ElementRef, OnDestroy, output } from '@angular/core';

@Directive({
  selector: '[madSizeChange]',
})
export class SizeChangeDirective implements OnDestroy {
  readonly madSizeChange = output<ResizeObserverEntry>();

  private readonly changes = new ResizeObserver((resizes) => {
    resizes.forEach((resize) => this.madSizeChange.emit(resize));
  });

  constructor(private elRef: ElementRef<HTMLElement>) {
    this.changes.observe(elRef.nativeElement);
  }

  ngOnDestroy() {
    this.changes.disconnect();
  }
}
