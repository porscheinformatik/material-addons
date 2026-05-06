import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CarouselComponent } from './carousel.component';
import { CarouselSlideDirective } from './carousel-slide-directive/carousel-slide.directive';
import { CarouselShortTextDirective } from './carousel-short-text-directive/carousel-short-text.directive';

function createEmblaApiMock() {
  const listeners: { event: string; handler: () => void }[] = [];

  return {
    selectedScrollSnap: jest.fn().mockReturnValue(0),
    scrollSnapList: jest.fn().mockReturnValue([0, 1, 2]),
    canScrollPrev: jest.fn().mockReturnValue(false),
    canScrollNext: jest.fn().mockReturnValue(true),
    scrollNext: jest.fn(),
    scrollPrev: jest.fn(),
    scrollTo: jest.fn(),
    on: jest.fn((event: string, handler: () => void) => {
      listeners.push({ event, handler });
    }),
    _trigger: (event: string) => listeners.filter((l) => l.event === event).forEach((l) => l.handler()),
  };
}

let emblaApiMock = createEmblaApiMock();

jest.mock('embla-carousel', () => {
  return {
    __esModule: true,
    default: jest.fn((_viewport: HTMLElement, _opts?: unknown) => emblaApiMock),
  };
});

@Component({
  template: `
    <mad-carousel [width]="width">
      <div madCarouselSlide>Slide 1</div>
      <div madCarouselSlide>Slide 2</div>
      <div madCarouselSlide>Slide 3</div>
    </mad-carousel>
  `,
  imports: [CarouselComponent, CarouselSlideDirective],
})
class ThreeSlidesHost {
  width = '80%';
}

@Component({
  template: `
    <mad-carousel>
      <div madCarouselSlide madCarouselShortText="A">Slide A</div>
      <div madCarouselSlide madCarouselShortText="B">Slide B</div>
    </mad-carousel>
  `,
  imports: [CarouselComponent, CarouselSlideDirective, CarouselShortTextDirective],
})
class ShortTextHost {}

@Component({
  template: `
    <mad-carousel>
      <div madCarouselSlide>Slide 1</div>
      <div madCarouselSlide madCarouselShortText="only-one">Slide 2</div>
    </mad-carousel>
  `,
  imports: [CarouselComponent, CarouselSlideDirective, CarouselShortTextDirective],
})
class MismatchedShortTextHost {}

describe('CarouselComponent', () => {
  beforeEach(() => {
    emblaApiMock = createEmblaApiMock();
  });

  describe('basic rendering', () => {
    let fixture: ComponentFixture<ThreeSlidesHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ThreeSlidesHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ThreeSlidesHost);
      fixture.detectChanges();
    });

    it('should apply the width input to the host container', () => {
      const hostDiv = fixture.debugElement.query(By.css('mad-carousel > div'));
      expect(hostDiv.nativeElement.style.width).toBe('80%');
    });

    it('should render one dot per scroll snap', () => {
      const dotSection = fixture.debugElement.queryAll(By.css('.flex.gap-4.height-8 button'));
      expect(dotSection.length).toBe(3);
    });
  });

  describe('navigation button states', () => {
    let fixture: ComponentFixture<ThreeSlidesHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ThreeSlidesHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ThreeSlidesHost);
      fixture.detectChanges();
    });

    function getNavButtons() {
      const allButtons = fixture.debugElement.queryAll(By.css('button'));
      const prevBtn = allButtons[0].nativeElement as HTMLButtonElement;
      const nextBtn = allButtons[1].nativeElement as HTMLButtonElement;
      return { prevBtn, nextBtn };
    }

    it('should disable the prev button when canScrollPrev is false', () => {
      const { prevBtn } = getNavButtons();
      expect(prevBtn.disabled).toBe(true);
    });

    it('should enable the next button when canScrollNext is true', () => {
      const { nextBtn } = getNavButtons();
      expect(nextBtn.disabled).toBe(false);
    });

    it('should enable prev and disable next when at the last slide', () => {
      emblaApiMock.canScrollPrev.mockReturnValue(true);
      emblaApiMock.canScrollNext.mockReturnValue(false);
      emblaApiMock._trigger('select');
      fixture.detectChanges();

      const { prevBtn, nextBtn } = getNavButtons();
      expect(prevBtn.disabled).toBe(false);
      expect(nextBtn.disabled).toBe(true);
    });
  });

  describe('scroll actions', () => {
    let fixture: ComponentFixture<ThreeSlidesHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ThreeSlidesHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ThreeSlidesHost);
      fixture.detectChanges();
    });

    it('should call embla scrollTo with the correct index when a dot is clicked', () => {
      const dotButtons = fixture.debugElement.queryAll(By.css('.flex.gap-4.height-8 button'));
      dotButtons[2].triggerEventHandler('click', null);
      expect(emblaApiMock.scrollTo).toHaveBeenCalledWith(2);
    });
  });

  describe('selected index', () => {
    let fixture: ComponentFixture<ThreeSlidesHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ThreeSlidesHost],
      }).compileComponents();

      emblaApiMock.selectedScrollSnap.mockReturnValue(1);
      fixture = TestBed.createComponent(ThreeSlidesHost);
      fixture.detectChanges();
    });

    it('should mark the correct dot as selected', () => {
      const dotButtons = fixture.debugElement.queryAll(By.css('.flex.gap-4.height-8 button'));
      expect(dotButtons[1].nativeElement.classList).toContain('scale-120');
      expect(dotButtons[0].nativeElement.classList).not.toContain('scale-120');
    });

    it('should update selectedIndex on select event', () => {
      emblaApiMock.selectedScrollSnap.mockReturnValue(2);
      emblaApiMock._trigger('select');
      fixture.detectChanges();

      const dotButtons = fixture.debugElement.queryAll(By.css('.flex.gap-4.height-8 button'));
      expect(dotButtons[2].nativeElement.classList).toContain('scale-120');
    });
  });

  describe('short text dots', () => {
    it('should render text labels inside dot buttons when carouselShortText is provided', async () => {
      await TestBed.configureTestingModule({
        imports: [ShortTextHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(ShortTextHost);
      fixture.detectChanges();

      const dotButtons = fixture.debugElement.queryAll(By.css('.flex.gap-4.height-8 button'));
      expect(dotButtons[0].nativeElement.textContent.trim()).toBe('A');
      expect(dotButtons[1].nativeElement.textContent.trim()).toBe('B');
    });

    it('should not add px-2 / py-1 classes to dots when no short texts are present', async () => {
      await TestBed.configureTestingModule({
        imports: [ThreeSlidesHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(ThreeSlidesHost);
      fixture.detectChanges();

      const dotButtons = fixture.debugElement.queryAll(By.css('.flex.gap-4.height-8 button'));
      dotButtons.forEach((btn) => {
        expect(btn.nativeElement.classList).not.toContain('px-2');
        expect(btn.nativeElement.classList).not.toContain('py-1');
      });
    });

    it('should add size-4 class to dots when no short texts are present', async () => {
      await TestBed.configureTestingModule({
        imports: [ThreeSlidesHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(ThreeSlidesHost);
      fixture.detectChanges();

      const dotButtons = fixture.debugElement.queryAll(By.css('.flex.gap-4.height-8 button'));
      dotButtons.forEach((btn) => {
        expect(btn.nativeElement.classList).toContain('size-4');
      });
    });
  });

  describe('loop option', () => {
    it('should add loop container class when loop option is true', async () => {
      @Component({
        template: `<mad-carousel [options]="{ loop: true }">
          <div madCarouselSlide>S1</div>
        </mad-carousel>`,
        imports: [CarouselComponent, CarouselSlideDirective],
      })
      class LoopHost {}

      await TestBed.configureTestingModule({
        imports: [LoopHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(LoopHost);
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('[class*="-mr-4"]'));
      expect(container).toBeTruthy();
    });

    it('should not add loop container class when loop is false', async () => {
      await TestBed.configureTestingModule({
        imports: [ThreeSlidesHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(ThreeSlidesHost);
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('[class*="-mr-4"]'));
      expect(container).toBeNull();
    });
  });

  describe('validateShortTexts', () => {
    it('should log an error when short text count does not match slide count', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await TestBed.configureTestingModule({
        imports: [MismatchedShortTextHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(MismatchedShortTextHost);
      fixture.detectChanges();

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Make sure that either none, or all slides provide this value!'));

      consoleSpy.mockRestore();
    });
  });

  describe('CarouselSlideDirective', () => {
    let fixture: ComponentFixture<ThreeSlidesHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ThreeSlidesHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ThreeSlidesHost);
      fixture.detectChanges();
    });

    it('should apply base classes to slide elements', () => {
      const slides = fixture.debugElement.queryAll(By.directive(CarouselSlideDirective));
      expect(slides.length).toBe(3);
      slides.forEach((slide) => {
        expect(slide.nativeElement.classList).toContain('flex');
        expect(slide.nativeElement.classList).toContain('items-center');
      });
    });

    it('should apply border class when useSlideBorder is true (default)', () => {
      const slides = fixture.debugElement.queryAll(By.directive(CarouselSlideDirective));
      slides.forEach((slide) => {
        expect(slide.nativeElement.classList).toContain('border');
      });
    });

    it('should apply the slideHeight as inline style', () => {
      const slide = fixture.debugElement.query(By.directive(CarouselSlideDirective));
      expect(slide.nativeElement.style.height).toBe('12rem');
    });

    it('should apply the slideBorderRadius as inline style', () => {
      const slide = fixture.debugElement.query(By.directive(CarouselSlideDirective));
      expect(slide.nativeElement.style.borderRadius).toBe('5px');
    });
  });

  describe('CarouselSlideDirective – no border', () => {
    it('should not add border class when useSlideBorder is false', async () => {
      @Component({
        template: `<mad-carousel [useSlideBorder]="false">
          <div madCarouselSlide>S1</div>
        </mad-carousel>`,
        imports: [CarouselComponent, CarouselSlideDirective],
      })
      class NoBorderHost {}

      await TestBed.configureTestingModule({
        imports: [NoBorderHost],
      }).compileComponents();

      const f = TestBed.createComponent(NoBorderHost);
      f.detectChanges();
      const slide = f.debugElement.query(By.directive(CarouselSlideDirective));
      expect(slide.nativeElement.classList).not.toContain('border');
    });
  });

  describe('CarouselShortTextDirective', () => {
    it('should expose the text signal with the provided value', () => {
      @Component({
        template: `<span madCarouselShortText="hello"></span>`,
        imports: [CarouselShortTextDirective],
      })
      class DirectiveHost {}

      TestBed.configureTestingModule({ imports: [DirectiveHost] }).compileComponents();
      const f = TestBed.createComponent(DirectiveHost);
      f.detectChanges();
      const dir = f.debugElement.query(By.directive(CarouselShortTextDirective)).injector.get(CarouselShortTextDirective);
      expect(dir.text()).toBe('hello');
    });
  });
});
