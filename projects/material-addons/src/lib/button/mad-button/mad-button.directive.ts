import { Directive, ElementRef, Optional, Renderer2, effect, input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatAnchor, MatButton } from '@angular/material/button';

@Directive({
  selector: '[madButton]',
  standalone: true,
})
export class MadButtonDirective {
  static readonly UPPERCASE_CLASS = 'mad-uppercase';
  static readonly OUTLINE_CLASS = 'mad-outline';
  static readonly DEFAULT_COLOR = 'primary';

  readonly color = input<ThemePalette>();
  readonly outline = input(true);
  readonly uppercase = input(true);

  private readonly matComponent: MatAnchor | MatButton;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLButtonElement | HTMLAnchorElement>,
    @Optional() anchor: MatAnchor,
    @Optional() button: MatButton,
  ) {
    this.matComponent = anchor || button;
    if (!this.matComponent) {
      console.error('MadButtonDirective needs to be applied on a MatButton');
    }

    effect(() => {
      this.setUppercase(this.uppercase());
      this.setOutline(this.outline());
      this.setColor(this.color());
    });
  }

  setUppercase(value: boolean): void {
    this.addOrRemoveClass(value, MadButtonDirective.UPPERCASE_CLASS);
  }

  setOutline(value: boolean): void {
    this.addOrRemoveClass(value, MadButtonDirective.OUTLINE_CLASS);
  }

  addOrRemoveClass(condition: boolean, className: string): void {
    if (condition) {
      this.renderer.addClass(this.elementRef.nativeElement, className);
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, className);
    }
  }

  private setColor(color: ThemePalette | undefined): void {
    if (this.matComponent) {
      this.matComponent.color = color || MadButtonDirective.DEFAULT_COLOR;
    }
  }
}
