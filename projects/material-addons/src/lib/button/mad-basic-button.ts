import { DestroyRef, Directive, ElementRef, Renderer2, booleanAttribute, inject, input } from '@angular/core';

@Directive()
export abstract class MadBasicButton {
  readonly type = input<string | undefined>();

  readonly disabled = input(false, { transform: booleanAttribute });

  readonly title = input('');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const removeClickListener = this.renderer.listen(
      this.host.nativeElement,
      'click',
      (event: MouseEvent): void => {
        if (this.disabled()) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { capture: true },
    );

    this.destroyRef.onDestroy(removeClickListener);
  }
}
