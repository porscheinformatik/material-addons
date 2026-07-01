import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Component, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { DangerButtonComponent } from './danger-button/danger-button.component';
import { LinkButtonComponent } from './flat-button/link-button.component';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { OutlineButtonComponent } from './outline-button/outline-button.component';
import { PrimaryButtonComponent } from './primary-button/primary-button.component';

const buttonThemePath = join(process.cwd(), 'projects/material-addons/src/themes/common/components/_button.scss');
const colorOverridesPath = join(process.cwd(), 'projects/material-addons/src/themes/common/components/_color-overrides.scss');

@Component({
  template: `
    <mad-primary-button title="Primary title" type="submit" [disabled]="disabled" (click)="onClick()">Primary</mad-primary-button>
    <mad-danger-button title="Danger title" [disabled]="disabled" (click)="onClick()">Danger</mad-danger-button>
    <mad-outline-button title="Outline title" [color]="outlineColor" [disabled]="disabled" (click)="onClick()">Outline</mad-outline-button>
    <mad-link-button title="Link title" [disabled]="disabled" (click)="onClick()">Link</mad-link-button>
    <mad-icon-button title="Icon title" [disabled]="disabled" (click)="onClick()"><mat-icon>edit</mat-icon></mad-icon-button>
  `,
  imports: [PrimaryButtonComponent, DangerButtonComponent, OutlineButtonComponent, LinkButtonComponent, IconButtonComponent, MatIconModule],
})
class ButtonHostComponent {
  disabled = false;
  outlineColor: 'primary' | 'accent' | 'warn' = 'primary';
  clicks = 0;

  onClick(): void {
    this.clicks++;
  }
}

describe('Button wrapper components', () => {
  let fixture: ComponentFixture<ButtonHostComponent>;
  let host: ButtonHostComponent;

  const wrapperSelectors = ['mad-primary-button', 'mad-danger-button', 'mad-outline-button', 'mad-link-button', 'mad-icon-button'] as const;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function buttonInside(selector: string): HTMLButtonElement {
    return fixture.debugElement.query(By.css(`${selector} button`)).nativeElement as HTMLButtonElement;
  }

  function wrapperElement(selector: string): HTMLElement {
    return fixture.debugElement.query(By.css(selector)).nativeElement as HTMLElement;
  }

  function expectClass(element: HTMLElement, className: string): void {
    expect(element.classList.contains(className)).toBe(true);
  }

  function expectNoClass(element: HTMLElement, className: string): void {
    expect(element.classList.contains(className)).toBe(false);
  }

  it('renders Angular Material 21 button appearances without legacy attributes', () => {
    const primary = buttonInside('mad-primary-button');
    const danger = buttonInside('mad-danger-button');
    const outline = buttonInside('mad-outline-button');
    const link = buttonInside('mad-link-button');
    const icon = buttonInside('mad-icon-button');

    expectClass(primary, 'mat-mdc-unelevated-button');
    expect(primary.hasAttribute('mat-flat-button')).toBe(false);
    expectClass(danger, 'mat-mdc-unelevated-button');
    expectClass(danger, 'mad-danger');
    expectClass(outline, 'mat-mdc-outlined-button');
    expectClass(outline, 'mad-outline');
    expect(outline.hasAttribute('mat-stroked-button')).toBe(false);
    expectClass(link, 'mat-mdc-button');
    expect(link.hasAttribute('mat-button')).toBe(false);
    expectClass(icon, 'mat-mdc-icon-button');
    expect(icon.hasAttribute('mat-icon-button')).toBe(false);
  });

  it('declares wrapper inputs as signal inputs internally', () => {
    const primary = fixture.debugElement.query(By.directive(PrimaryButtonComponent)).componentInstance as PrimaryButtonComponent;
    const outline = fixture.debugElement.query(By.directive(OutlineButtonComponent)).componentInstance as OutlineButtonComponent;

    expect(isSignal(primary.type)).toBe(true);
    expect(isSignal(primary.title)).toBe(true);
    expect(isSignal(primary.disabled)).toBe(true);
    expect(isSignal(outline.color)).toBe(true);
  });

  it('passes type and title to the inner button', () => {
    const primary = buttonInside('mad-primary-button');
    expect(primary.type).toBe('submit');
    expect(primary.title).toBe('Primary title');
  });

  it('uses native disabled state on the inner button', () => {
    host.disabled = true;
    fixture.detectChanges();

    expect(buttonInside('mad-primary-button').disabled).toBe(true);
    expect(buttonInside('mad-danger-button').disabled).toBe(true);
    expect(buttonInside('mad-outline-button').disabled).toBe(true);
    expect(buttonInside('mad-link-button').disabled).toBe(true);
    expect(buttonInside('mad-icon-button').disabled).toBe(true);
  });

  it('does not emit click events from disabled native buttons', () => {
    host.disabled = true;
    fixture.detectChanges();

    buttonInside('mad-primary-button').click();

    expect(host.clicks).toBe(0);
  });

  it('allows click events received by enabled wrapper hosts', () => {
    wrapperSelectors.forEach((selector) => wrapperElement(selector).click());

    expect(host.clicks).toBe(wrapperSelectors.length);
  });

  it('blocks click events received by disabled wrapper hosts', () => {
    host.disabled = true;
    fixture.detectChanges();

    wrapperSelectors.forEach((selector) => wrapperElement(selector).click());

    expect(host.clicks).toBe(0);
  });

  it('applies outline color hook classes explicitly', () => {
    host.outlineColor = 'warn';
    fixture.detectChanges();
    expectClass(buttonInside('mad-outline-button'), 'mad-warn');
    expectNoClass(buttonInside('mad-outline-button'), 'mad-primary');

    host.outlineColor = 'accent';
    fixture.detectChanges();
    expectClass(buttonInside('mad-outline-button'), 'mad-accent');
    expectNoClass(buttonInside('mad-outline-button'), 'mad-warn');
  });
});

describe('button theme disabled styling', () => {
  it('keeps branded color identity for disabled button variants in theme overrides', () => {
    const buttonTheme = readFileSync(buttonThemePath, 'utf8');

    expect(buttonTheme).toContain('.mat-mdc-unelevated-button.mat-unthemed:disabled:not(.mad-danger)');
    expect(buttonTheme).toContain('.mat-mdc-unelevated-button.mat-primary:disabled');
    expect(buttonTheme).toContain('.mat-mdc-unelevated-button.mad-danger:disabled');
    expect(buttonTheme).toContain('.mat-mdc-outlined-button.mad-primary:disabled');
    expect(buttonTheme).toContain('.mat-mdc-button.mad-primary:disabled');
    expect(buttonTheme).toContain('.mat-mdc-icon-button.mat-primary:disabled');
    expect(buttonTheme).toContain('--mad-button-disabled-opacity');
  });

  it('keeps outline visual overrides scoped to mad button hooks', () => {
    const buttonTheme = readFileSync(buttonThemePath, 'utf8');
    const colorOverrides = readFileSync(colorOverridesPath, 'utf8');

    expect(buttonTheme).toContain('.mad-outline.mat-mdc-outlined-button:not(:disabled)');
    expect(colorOverrides).not.toMatch(/\.mat-mdc-outlined-button\s*{\s*border-color:\s*var\(--main-primary\)\s*!important;\s*}/);
  });
});
