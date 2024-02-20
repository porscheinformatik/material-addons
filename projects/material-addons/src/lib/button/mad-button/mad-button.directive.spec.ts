import { MadButtonDirective } from './mad-button.directive';
import { ElementRef, Renderer2 } from '@angular/core';
import { MatButton } from '@angular/material/button';

describe('MadButtonDirective', () => {
  let directive: MadButtonDirective;
  let el: ElementRef;
  let button: MatButton;
  let renderer2: Renderer2;

  beforeEach(() => {
    el = {
      nativeElement: document.createElement('button'),
    };
    button = { color: '' } as MatButton;
    renderer2 = {
      addClass: jest.fn(),
      removeClass: jest.fn(),
    } as unknown as Renderer2;

    directive = new MadButtonDirective(renderer2, el, null, button);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should set color during initialization', () => {
    directive.color = 'accent';
    directive.ngOnInit();
    expect(button.color).toBe('accent');
  });

  it('should default color to primary if not provided', () => {
    directive.ngOnInit();
    expect(button.color).toBe('primary');
  });

  it('should add and remove outline class based on input', () => {
    directive.outline = true;
    expect(renderer2.addClass).toHaveBeenCalledWith(el.nativeElement, 'mad-outline');
    directive.outline = false;
    expect(renderer2.removeClass).toHaveBeenCalledWith(el.nativeElement, 'mad-outline');
  });

  it('should add and remove uppercase class based on input', () => {
    directive.uppercase = true;
    expect(renderer2.addClass).toHaveBeenCalledWith(el.nativeElement, 'mad-uppercase');
    directive.uppercase = false;
    expect(renderer2.removeClass).toHaveBeenCalledWith(el.nativeElement, 'mad-uppercase');
  });
});
