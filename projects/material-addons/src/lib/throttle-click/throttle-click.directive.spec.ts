import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThrottleClickDirective } from './throttle-click.directive';

@Component({
  template: `
    <div (click)="onParentClick()">
      <button type="button" madThrottleClick [throttleTime]="throttleTime" (throttleClick)="onThrottleClick($event)">
        Throttled action
      </button>
    </div>
  `,
  imports: [ThrottleClickDirective],
})
class TestHostComponent {
  throttleTime = 300;
  readonly throttledEvents: MouseEvent[] = [];
  parentClickCount = 0;

  onThrottleClick(event: MouseEvent): void {
    this.throttledEvents.push(event);
  }

  onParentClick(): void {
    this.parentClickCount += 1;
  }
}

@Component({
  template: `<button type="button" madThrottleClick throttleTime="1000">Throttled action</button>`,
  imports: [ThrottleClickDirective],
})
class StaticThrottleTimeHostComponent {}

describe('ThrottleClickDirective', () => {
  let fixture: ComponentFixture<TestHostComponent> | undefined;

  function createHost(throttleTime = 300): {
    button: HTMLButtonElement;
    directive: ThrottleClickDirective;
    host: TestHostComponent;
  } {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.throttleTime = throttleTime;
    fixture.detectChanges();

    const buttonDebugElement = fixture.debugElement.query(By.css('button'));

    return {
      button: buttonDebugElement.nativeElement as HTMLButtonElement,
      directive: buttonDebugElement.injector.get(ThrottleClickDirective),
      host: fixture.componentInstance,
    };
  }

  function dispatchClick(button: HTMLButtonElement): MouseEvent {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    button.dispatchEvent(event);
    return event;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, StaticThrottleTimeHostComponent],
    }).compileComponents();
  });

  afterEach(() => {
    fixture?.destroy();
    fixture = undefined;
  });

  it('should create', () => {
    const { directive } = createHost();

    expect(directive).toBeTruthy();
  });

  it('emits immediately and ignores clicks until the default window ends', fakeAsync(() => {
    const { button, directive, host } = createHost();

    expect(directive.throttleTime).toBe(300);

    dispatchClick(button);
    dispatchClick(button);

    expect(host.throttledEvents).toHaveLength(1);

    tick(299);
    dispatchClick(button);
    expect(host.throttledEvents).toHaveLength(1);

    tick(1);
    dispatchClick(button);
    expect(host.throttledEvents).toHaveLength(2);

    tick(300);
  }));

  it('uses a custom throttle window', fakeAsync(() => {
    const { button, host } = createHost(1000);

    dispatchClick(button);
    tick(999);
    dispatchClick(button);
    expect(host.throttledEvents).toHaveLength(1);

    tick(1);
    dispatchClick(button);
    expect(host.throttledEvents).toHaveLength(2);

    tick(1000);
  }));

  it('does not emit a trailing click when the window ends', fakeAsync(() => {
    const { button, host } = createHost();

    dispatchClick(button);
    dispatchClick(button);
    tick(300);

    expect(host.throttledEvents).toHaveLength(1);
  }));

  it('emits the original event and prevents its default action and propagation', fakeAsync(() => {
    const { button, host } = createHost();

    const event = dispatchClick(button);

    expect(host.throttledEvents).toEqual([event]);
    expect(event.defaultPrevented).toBe(true);
    expect(host.parentClickCount).toBe(0);

    tick(300);
  }));

  it('prevents the default action and propagation for throttled clicks', fakeAsync(() => {
    const { button, host } = createHost();

    dispatchClick(button);
    const throttledEvent = dispatchClick(button);

    expect(host.throttledEvents).toHaveLength(1);
    expect(throttledEvent.defaultPrevented).toBe(true);
    expect(host.parentClickCount).toBe(0);

    tick(300);
  }));

  it('stops emitting after the directive is destroyed', () => {
    const { button, directive } = createHost();
    const emitSpy = jest.spyOn(directive.throttleClick, 'emit');

    dispatchClick(button);
    expect(emitSpy).toHaveBeenCalledTimes(1);

    fixture?.destroy();
    directive.clickEvent(new MouseEvent('click', { cancelable: true }));

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('coerces a static throttleTime attribute to a number', () => {
    const staticFixture = TestBed.createComponent(StaticThrottleTimeHostComponent);
    staticFixture.detectChanges();

    const directive = staticFixture.debugElement.query(By.directive(ThrottleClickDirective)).injector.get(ThrottleClickDirective);

    expect(directive.throttleTime).toBe(1000);

    staticFixture.destroy();
  });
});
