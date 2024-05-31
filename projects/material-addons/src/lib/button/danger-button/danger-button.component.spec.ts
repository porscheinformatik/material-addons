import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DangerButtonComponent } from './danger-button.component';

describe('DangerButtonComponent', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(DangerButtonComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const fixture = TestBed.createComponent(DangerButtonComponent);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it('should set the title', () => {
    const fixture = TestBed.createComponent(DangerButtonComponent);
    const component = fixture.componentInstance;
    component.title = 'Test Title';
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.title).toEqual('Test Title');
  });
});
