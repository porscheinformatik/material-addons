import { MadButtonDirective } from './mad-button.directive';
import { Component, isSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: ` <button matButton="outlined" madButton [uppercase]="uppercase" [outline]="outline" [color]="color">Grouped</button> `,
  imports: [MatButtonModule, MadButtonDirective],
})
class MadButtonHostComponent {
  uppercase = true;
  outline = true;
  color: 'primary' | 'accent' | 'warn' = 'primary';
}

describe('MadButtonDirective', () => {
  let fixture: ComponentFixture<MadButtonHostComponent>;

  function createFixture(): ComponentFixture<MadButtonHostComponent> {
    const componentFixture = TestBed.createComponent(MadButtonHostComponent);
    componentFixture.detectChanges();
    return componentFixture;
  }

  function button(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
  }

  function expectClass(className: string): void {
    expect(button().classList.contains(className)).toBe(true);
  }

  function expectNoClass(className: string): void {
    expect(button().classList.contains(className)).toBe(false);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MadButtonHostComponent],
    }).compileComponents();
  });

  it('should create an instance', () => {
    fixture = createFixture();

    const directive = fixture.debugElement.query(By.directive(MadButtonDirective)).injector.get(MadButtonDirective);
    expect(directive).toBeTruthy();
  });

  it('declares configurable inputs as signal inputs', () => {
    fixture = createFixture();

    const directive = fixture.debugElement.query(By.directive(MadButtonDirective)).injector.get(MadButtonDirective);
    expect(isSignal(directive.color)).toBe(true);
    expect(isSignal(directive.outline)).toBe(true);
    expect(isSignal(directive.uppercase)).toBe(true);
  });

  it('keeps default uppercase and outline classes on Angular Material 21 buttons', () => {
    fixture = createFixture();

    expectClass('mat-mdc-outlined-button');
    expectClass('mad-uppercase');
    expectClass('mad-outline');
    expectClass('mat-primary');
  });

  it('allows uppercase and outline to be disabled initially', () => {
    fixture = TestBed.createComponent(MadButtonHostComponent);
    fixture.componentInstance.uppercase = false;
    fixture.componentInstance.outline = false;
    fixture.detectChanges();

    expectNoClass('mad-uppercase');
    expectNoClass('mad-outline');
  });

  it('updates classes and color when signal inputs change', () => {
    fixture = createFixture();

    fixture.componentInstance.uppercase = false;
    fixture.componentInstance.outline = false;
    fixture.componentInstance.color = 'warn';
    fixture.detectChanges();

    expectNoClass('mad-uppercase');
    expectNoClass('mad-outline');
    expectClass('mat-warn');
    expectNoClass('mat-primary');
  });
});
