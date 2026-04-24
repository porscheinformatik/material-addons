import { Directive, input } from '@angular/core';

@Directive({
  selector: '[carouselShortText]',
})
export class CarouselShortTextDirective {
  text = input<string>('', { alias: 'carouselShortText' });
}
