import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[madThrottleClick]',
})
export class ThrottleClickDirective implements OnInit, OnDestroy {
  @Input() throttleTime = 300;
  @Output() throttleClick = new EventEmitter();
  private clicks = new Subject();
  private subscription: Subscription;
  constructor() {}

  ngOnInit() {
    this.subscription = this.clicks.pipe(throttleTime(this.throttleTime)).subscribe(e => this.throttleClick.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
