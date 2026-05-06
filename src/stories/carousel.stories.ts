import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CarouselComponent, CarouselShortTextDirective, CarouselSlideDirective } from '@porscheinformatik/material-addons';

const meta: Meta<CarouselComponent> = {
  title: 'Components/Carousel',
  component: CarouselComponent,
  decorators: [
    moduleMetadata({
      imports: [CarouselSlideDirective, CarouselShortTextDirective],
    }),
  ],
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'text',
      description: 'CSS width of the carousel container (e.g. "50%", "400px", "100%").',
      table: { defaultValue: { summary: '50%' } },
    },
    slideHeight: {
      control: 'text',
      description: 'CSS height applied to every slide (e.g. "12rem", "200px").',
      table: { defaultValue: { summary: '12rem' } },
    },
    slideBorderRadius: {
      control: 'text',
      description: 'Border-radius applied to every slide.',
      table: { defaultValue: { summary: '5px' } },
    },
    useSlideBorder: {
      control: 'boolean',
      description: 'When true each slide renders a thin border.',
      table: { defaultValue: { summary: 'true' } },
    },
    options: {
      control: 'object',
      description: 'EmblaOptionsType object (e.g. { loop: true }).',
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
  args: {
    width: '50%',
    slideHeight: '12rem',
    slideBorderRadius: '5px',
    useSlideBorder: true,
    options: undefined,
  },
};

export default meta;

type Story = StoryObj<CarouselComponent>;

/**
 * Interactive playground – tweak all inputs via the Controls panel.
 */
export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mad-carousel
        [width]="width"
        [slideHeight]="slideHeight"
        [slideBorderRadius]="slideBorderRadius"
        [useSlideBorder]="useSlideBorder"
        [options]="options"
      >
        <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:#f0f4ff;">Slide 1</div>
        <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:#fff4f0;">Slide 2</div>
        <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:#f0fff4;">Slide 3</div>
      </mad-carousel>
    `,
  }),
};

/**
 * Navigation dots display short text labels when the `madCarouselShortText` directive is provided
 * on every slide. The label count **must** match the slide count.
 */
export const WithShortTextDots: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <mad-carousel width="60%" slideHeight="12rem">
        <div madCarouselSlide [madCarouselShortText]="'Jan'" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#f0f4ff;">January</div>
        <div madCarouselSlide [madCarouselShortText]="'Feb'" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#fff4f0;">February</div>
        <div madCarouselSlide [madCarouselShortText]="'Mar'" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#f0fff4;">March</div>
        <div madCarouselSlide [madCarouselShortText]="'Apr'" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#fffff0;">April</div>
      </mad-carousel>
    `,
  }),
};

/**
 * Setting `options.loop = true` makes the carousel wrap around from the last slide back to
 * the first, and both prev/next buttons remain always enabled.
 */
export const LoopMode: Story = {
  args: {
    options: { loop: true },
    width: '55%',
  },
  render: (args) => ({
    props: args,
    template: `
      <mad-carousel [width]="width" [slideHeight]="slideHeight" [options]="options">
        <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:#fde8ff;">Slide A</div>
        <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:#e8f0ff;">Slide B</div>
        <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:#e8ffef;">Slide C</div>
      </mad-carousel>
    `,
  }),
};

/**
 * Override width and slide height to show how the carousel adapts to different container sizes.
 */
export const CustomSize: Story = {
  args: {
    width: '100%',
    slideHeight: '18rem',
    slideBorderRadius: '12px',
  },
  render: (args) => ({
    props: args,
    template: `
      <mad-carousel [width]="width" [slideHeight]="slideHeight" [slideBorderRadius]="slideBorderRadius">
        <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:#fdf0e8;">Wide Slide 1</div>
        <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:#e8fdf0;">Wide Slide 2</div>
        <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:#e8eafd;">Wide Slide 3</div>
      </mad-carousel>
    `,
  }),
};

/**
 * Disabling the slide border gives a cleaner look suitable for image-only carousels.
 */
export const NoBorder: Story = {
  args: {
    useSlideBorder: false,
    width: '55%',
  },
  render: (args) => ({
    props: args,
    template: `
      <mad-carousel [width]="width" [slideHeight]="slideHeight" [useSlideBorder]="useSlideBorder">
        <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;">Slide 1</div>
        <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:linear-gradient(135deg,#f093fb,#f5576c);color:#fff;">Slide 2</div>
        <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;font-size:2rem;background:linear-gradient(135deg,#4facfe,#00f2fe);color:#fff;">Slide 3</div>
      </mad-carousel>
    `,
  }),
};

/**
 * Demonstrates how the carousel behaves with a larger number of slides.
 */
export const ManySlides: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <mad-carousel width="55%" slideHeight="10rem">
        <div madCarouselSlide [madCarouselShortText]="'1'" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#f0f4ff;">Slide 1</div>
        <div madCarouselSlide [madCarouselShortText]="'2'" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#fff4f0;">Slide 2</div>
        <div madCarouselSlide [madCarouselShortText]="'3'" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#f0fff4;">Slide 3</div>
        <div madCarouselSlide [madCarouselShortText]="'4'" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#fffff0;">Slide 4</div>
        <div madCarouselSlide [madCarouselShortText]="'5'" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#fff0f8;">Slide 5</div>
        <div madCarouselSlide [madCarouselShortText]="'6'" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#f0f8ff;">Slide 6</div>
      </mad-carousel>
    `,
  }),
};

/**
 * Side-by-side overview of key variants.
 */
export const Showcase: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:2.5rem;">

        <div>
          <div style="margin-bottom:0.75rem;font-weight:600;">Default (3 slides, dot navigation)</div>
          <mad-carousel width="55%">
            <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;background:#f0f4ff;">Slide 1</div>
            <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;background:#fff4f0;">Slide 2</div>
            <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;background:#f0fff4;">Slide 3</div>
          </mad-carousel>
        </div>

        <div>
          <div style="margin-bottom:0.75rem;font-weight:600;">Short-text dots</div>
          <mad-carousel width="55%">
            <div madCarouselSlide [madCarouselShortText]="'Q1'" style="display:flex;align-items:center;justify-content:center;background:#f0f4ff;">Q1 – January to March</div>
            <div madCarouselSlide [madCarouselShortText]="'Q2'" style="display:flex;align-items:center;justify-content:center;background:#fff4f0;">Q2 – April to June</div>
            <div madCarouselSlide [madCarouselShortText]="'Q3'" style="display:flex;align-items:center;justify-content:center;background:#f0fff4;">Q3 – July to September</div>
            <div madCarouselSlide [madCarouselShortText]="'Q4'" style="display:flex;align-items:center;justify-content:center;background:#fffff0;">Q4 – October to December</div>
          </mad-carousel>
        </div>

        <div>
          <div style="margin-bottom:0.75rem;font-weight:600;">Loop mode</div>
          <mad-carousel width="55%" [options]="{loop:true}">
            <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;background:#fde8ff;">Loop A</div>
            <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;background:#e8f0ff;">Loop B</div>
            <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;background:#e8ffef;">Loop C</div>
          </mad-carousel>
        </div>

        <div>
          <div style="margin-bottom:0.75rem;font-weight:600;">No slide border</div>
          <mad-carousel width="55%" [useSlideBorder]="false">
            <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;">Borderless 1</div>
            <div madCarouselSlide style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f093fb,#f5576c);color:#fff;">Borderless 2</div>
          </mad-carousel>
        </div>

      </div>
    `,
  }),
};
