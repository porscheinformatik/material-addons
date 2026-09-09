import { Component, LOCALE_ID } from '@angular/core';
import { ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NumberFormatService } from '../../numeric-field/number-format.service';
import { ReadOnlyFormFieldComponent } from './readonly-form-field.component';

@Component({
  template: `<mad-readonly-form-field [value]="value" [formatNumber]="true" />`,
  imports: [ReadOnlyFormFieldComponent],
})
class HostComponent {
  value = 1234.5;
}

describe('ReadOnlyFormFieldComponent', () => {
  beforeAll(() => {
    // jsdom does not implement ResizeObserver; SizeChangeDirective (used by this component) needs a stub.
    (globalThis as any).ResizeObserver = class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        { provide: LOCALE_ID, useValue: 'en-US' },
        // Mimics the real bootstrapped app: CD runs automatically whenever the zone goes stable,
        // instead of requiring an explicit fixture.detectChanges() call after every state change.
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    });
  });

  it('reflects a runtime locale switch (via NumberFormatService.prepareSeparators) without a manual detectChanges call', fakeAsync(() => {
    const fixture = TestBed.createComponent(HostComponent);
    const numberFormatService = TestBed.inject(NumberFormatService);
    tick();

    const inputEl = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    expect(inputEl.value).toBe('1,234.5'); // en-US: comma grouping, dot decimal

    // simulate the consuming app switching locale at runtime, exactly as the public API documents:
    // "Call this if the locale is changed to update the separators."
    numberFormatService.prepareSeparators('de-DE'); // dot grouping, comma decimal
    tick(); // no manual fixture.detectChanges() call anywhere in this test!

    expect(inputEl.value).toBe('1.234,5');
  }));
});
