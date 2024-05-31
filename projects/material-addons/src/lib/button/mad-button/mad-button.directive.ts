import { Directive, ElementRef, Input, OnInit, Optional, Renderer2 } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatAnchor, MatButton } from '@angular/material/button';

@Directive({
  selector: '[madButton]',
  standalone: true,
})
export class MadButtonDirective implements OnInit {
  static readonly UPPERCASE_CLASS = 'mad-uppercase';
  static readonly OUTLINE_CLASS = 'mad-outline';
  static readonly DEFAULT_COLOR = 'primary';

  @Input() color: ThemePalette;
  private readonly matComponent: MatAnchor | MatButton;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLButtonElement | HTMLAnchorElement>,
    @Optional() anchor: MatAnchor,
    @Optional() button: MatButton,
  ) {
    this.matComponent = anchor || button;
    if (!this.matComponent) {
      console.error('MadButtonGroupComponent needs to be applied on a MatButton');
    }
  }

  @Input() set outline(value: boolean) {
    this.setOutline(value);
  }

  @Input() set uppercase(value: boolean) {
    this.setUppercase(value);
  }

  ngOnInit() {
    this.setUppercase(true);
    this.setOutline(true);

    this.matComponent.color = this.color || MadButtonDirective.DEFAULT_COLOR;
  }

  setUppercase(value: boolean) {
    this.addOrRemoveClass(value, MadButtonDirective.UPPERCASE_CLASS);
  }

  setOutline(value: boolean) {
    this.addOrRemoveClass(value, MadButtonDirective.OUTLINE_CLASS);
  }

  addOrRemoveClass(condition: boolean, className: string) {
    if (condition) {
      this.renderer.addClass(this.elementRef.nativeElement, className);
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, className);
    }
  }
}
