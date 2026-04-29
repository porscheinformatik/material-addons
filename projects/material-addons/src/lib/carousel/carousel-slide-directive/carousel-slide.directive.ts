import { Directive, HostBinding, inject } from '@angular/core';
import { CarouselComponent } from '../carousel.component';

@Directive({
  selector: '[madCarouselSlide]',
})
export class CarouselSlideDirective {
  private readonly carousel = inject(CarouselComponent);

  @HostBinding('class')
  get hostClasses(): string {
    const loop = !!this.carousel.options()?.loop;
    const base = 'flex min-w-0 min-h-fit flex-[0_0_100%] items-center justify-center';
    const border = this.carousel.useSlideBorder() ? ' border border-gray-400' : '';
    const loopMargin = loop ? ' ml-4' : '';
    return base + border + loopMargin;
  }

  @HostBinding('style.height')
  get hostHeight(): string {
    return this.carousel.slideHeight();
  }

  @HostBinding('style.border-radius')
  get hostBorderRadius(): string {
    return this.carousel.slideBorderRadius();
  }
}
