import { Directive, booleanAttribute, input } from '@angular/core';

@Directive()
export abstract class MadBasicButton {
  readonly type = input<string | undefined>();

  readonly disabled = input(false, { transform: booleanAttribute });

  readonly title = input('');
}
