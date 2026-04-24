import { AfterViewInit, Component, contentChildren, ElementRef, input, InputSignal, signal, viewChild } from '@angular/core';
import EmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import { CarouselShortTextDirective } from './carousel-short-text-directive/carousel-short-text-directive.component';

@Component({
  selector: 'mad-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  imports: [],
})
export class CarouselComponent implements AfterViewInit {
  readonly shortTexts = contentChildren(CarouselShortTextDirective);
  readonly options: InputSignal<EmblaOptionsType | undefined> = input<EmblaOptionsType | undefined>(undefined);
  readonly width = input<string>('50%');
  readonly slideHeight = input<string>('12rem');
  readonly slideBorderRadius = input<string>('5px');
  readonly useSlideBorder = input<boolean>(true);

  protected readonly viewportRef = viewChild<ElementRef<HTMLElement>>('viewport');
  protected readonly containerRef = viewChild<ElementRef<HTMLElement>>('container');

  protected readonly selectedIndex = signal(0);
  protected readonly scrollSnaps = signal<number[]>([]);
  protected readonly prevBtnDisabled = signal(true);
  protected readonly nextBtnDisabled = signal(true);
  private emblaApi?: EmblaCarouselType;

  ngAfterViewInit(): void {
    const container = this.containerRef()?.nativeElement;
    if (container) {
      this.validateShortTexts(container.children.length);
      this.setCSSClasses(container);
    }

    this.emblaApi = EmblaCarousel(this.viewportRef().nativeElement, this.options());

    this.onInit();
    this.onSelect();

    this.emblaApi.on('select', () => this.onSelect());
    this.emblaApi.on('reInit', () => {
      this.onInit();
      this.onSelect();
    });
  }

  private setCSSClasses(container: HTMLElement) {
    if (this.options().loop) {
      container.classList.add('-mr-4');
    }
    Array.from(container.children).forEach((child) => {
      const elem = child as HTMLElement;
      elem.classList.add('embla__slide');
      elem.style.height = this.slideHeight();
      elem.style.borderRadius = this.slideBorderRadius();
      if (this.useSlideBorder()) {
        elem.classList.add('embla__slide__border');
      }
      if (this.options().loop) {
        elem.classList.add('ml-4');
      }
    });
  }

  private validateShortTexts(slideCount: number) {
    const shortTextCount = this.shortTexts().length;
    if (shortTextCount > 0 && shortTextCount !== slideCount) {
      console.error(
        `Found ${slideCount} slides but only ${shortTextCount} slides provide the \`carouselShortText\` directive! Make sure that either none, or all slides provide this value!`,
      );
    }
  }

  protected onInit(): void {
    if (!this.emblaApi) return;
    this.selectedIndex.set(this.emblaApi.selectedScrollSnap());
    this.scrollSnaps.set(this.emblaApi.scrollSnapList());
    this.prevBtnDisabled.set(!this.emblaApi.canScrollPrev());
    this.nextBtnDisabled.set(!this.emblaApi.canScrollNext());
  }

  protected onSelect(): void {
    if (!this.emblaApi) return;

    this.selectedIndex.set(this.emblaApi.selectedScrollSnap());
    this.prevBtnDisabled.set(!this.emblaApi.canScrollPrev());
    this.nextBtnDisabled.set(!this.emblaApi.canScrollNext());
  }

  protected scrollNext(): void {
    this.emblaApi?.scrollNext();
  }

  protected scrollPrev(): void {
    this.emblaApi?.scrollPrev();
  }

  protected scrollTo(index: number): void {
    this.emblaApi?.scrollTo(index);
  }
}
