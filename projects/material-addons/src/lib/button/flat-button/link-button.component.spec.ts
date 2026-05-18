import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LinkButtonComponent } from './link-button.component';

describe('LinkButtonComponent', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(LinkButtonComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should use native disabled state when disabled is true', () => {
    const fixture = TestBed.createComponent(LinkButtonComponent);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
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
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.title).toEqual('Test Title');
  });
});
