import { ElementRef, HostBinding } from '@angular/core';

export class MadBasicButton {
  button: ElementRef;
  disabled: boolean;

  @HostBinding('style.pointer-events')
  get pointerEvent(): string {
    return this.disabled ? 'none' : 'auto';
  }

  @HostBinding('style.opacity')
  get opacity(): string {
    return this.disabled ? '0.35' : '1';
  }

  disableClick = (e: Event): any => e.stopPropagation();

  ngOnChanges(): void {
    this.disableButton();
  }

  disableButton(): void {
    if (this.disabled) {
      this.button.nativeElement.addEventListener('click', this.disableClick);
    } else {
      this.button.nativeElement.removeEventListener('click', this.disableClick);
    }
  }
}
