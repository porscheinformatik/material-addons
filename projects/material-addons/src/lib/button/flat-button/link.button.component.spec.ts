import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {LinkButtonComponent} from './link-button.component';

describe('LinkButtonComponent', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(LinkButtonComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have pointer-events auto and opacity 1 if disabled is false', () => {
    const fixture = TestBed.createComponent(LinkButtonComponent);
    const component = fixture.componentInstance;
    expect(component.pointerEvent).toBe('auto');
    expect(component.opacity).toBe('1');
  });

  it('should have pointer-events none and opacity 0.35 if disabled is true', () => {
    const fixture = TestBed.createComponent(LinkButtonComponent);
    const component = fixture.componentInstance;
    component.disabled = true;
    fixture.detectChanges();

    expect(component.pointerEvent).toBe('none');
    expect(component.opacity).toBe('0.35');
  });

  it('should disable the button', () => {
    TestBed.overrideComponent(LinkButtonComponent, {
      set: {
        template: '<mad-link-button [disabled]="true"></mad-link-button>',
      },
    });

    const fixture = TestBed.createComponent(LinkButtonComponent);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('mad-link-button'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const fixture = TestBed.createComponent(LinkButtonComponent);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it('should set the title', () => {
    const fixture = TestBed.createComponent(LinkButtonComponent);
    const component = fixture.componentInstance;
    component.title = 'Test Title';
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.title).toEqual('Test Title');
  });
});
