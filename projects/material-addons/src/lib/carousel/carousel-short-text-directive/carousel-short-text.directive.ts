import { Directive, input } from '@angular/core';

@Directive({
  selector: '[madCarouselShortText]',
})
export class CarouselShortTextDirective {
  text = input<string>('', { alias: 'madCarouselShortText' });
}
