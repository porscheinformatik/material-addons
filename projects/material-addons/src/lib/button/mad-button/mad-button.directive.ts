import { Directive, ElementRef, Input, OnChanges, OnInit, Optional, Renderer2, SimpleChanges } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatAnchor, MatButton } from '@angular/material/button';

@Directive({
  selector: '[madButton]',
})
export class MadButtonDirective implements OnInit, OnChanges {
  static readonly UPPERCASE_CLASS = 'mad-uppercase';
  static readonly OUTLINE_CLASS = 'mad-outline';
  static readonly DEFAULT_COLOR = 'primary';

  private matComponent: MatAnchor | MatButton;

  @Input() outline = true;
  @Input() uppercase = true;
  @Input() color: ThemePalette;

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

  ngOnInit() {
    this.setUppercase();
    this.setOutline();

    this.matComponent.color = this.color || MadButtonDirective.DEFAULT_COLOR;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['outline']) {
      this.setUppercase();
    }
    if (changes['uppercase']) {
      this.setOutline();
    }
  }

  setUppercase() {
    this.addOrRemoveClass(this.uppercase, MadButtonDirective.UPPERCASE_CLASS);
  }

  setOutline() {
    this.addOrRemoveClass(this.outline, MadButtonDirective.OUTLINE_CLASS);
  }

  addOrRemoveClass(condition: boolean, className: string) {
    if (condition) {
      this.renderer.addClass(this.elementRef.nativeElement, className);
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, className);
    }
  }
}
