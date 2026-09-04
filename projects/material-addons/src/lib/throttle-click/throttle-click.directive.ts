import { DestroyRef, Directive, EventEmitter, HostListener, Input, OnInit, Output, inject, numberAttribute } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, throttleTime } from 'rxjs';

@Directive({
  selector: '[madThrottleClick]',
  standalone: true,
})
export class ThrottleClickDirective implements OnInit {
  /** Duration in milliseconds during which clicks after the leading click are ignored. */
  @Input({ transform: numberAttribute }) throttleTime = 300;

  /** Emits the leading click from each throttle window. */
  @Output() throttleClick = new EventEmitter<MouseEvent>();

  private readonly clicks = new Subject<MouseEvent>();
  private readonly destroyRef = inject(DestroyRef);

  @HostListener('click', ['$event'])
  clickEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }

  ngOnInit(): void {
    this.clicks
      .pipe(throttleTime(this.throttleTime), takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => this.throttleClick.emit(event));
  }
}
