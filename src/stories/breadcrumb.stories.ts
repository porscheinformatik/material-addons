import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideRouter, withHashLocation } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '@porscheinformatik/material-addons';

const sampleBreadcrumbs: BreadcrumbItem[] = [
  { label: 'Home', route: ['/'] },
  { label: 'Library', route: ['/library'] },
  { label: 'Components' },
];

const meta: Meta<BreadcrumbComponent> = {
  title: 'Components/Breadcrumb',
  component: BreadcrumbComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter([], withHashLocation())],
    }),
  ],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    breadcrumbs: { control: 'object' },
    showCopy: { control: 'boolean' },
    title: { control: 'text' },
    copy: { action: 'copy' },
  },
  args: {
    breadcrumbs: sampleBreadcrumbs,
    showCopy: true,
    title: 'Copy',
  },
};

export default meta;

type Story = StoryObj<BreadcrumbComponent>;

export const Playground: Story = {
  render: (args) => ({
    props: {
      ...args,
      // eslint-disable-next-line no-console
      copy: () => console.log('[Breadcrumb] copy emitted'),
    },
    template: `
      <mad-breadcrumb
        [breadcrumbs]="breadcrumbs"
        [showCopy]="showCopy"
        [title]="title"
        (copy)="copy()"
      />
    `,
  }),
};

export const Showcase: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: `
      <div
        style="
          display: grid;
          gap: 1rem;
          align-items: start;
        "
      >
        <div>
          <div style="margin-bottom: 0.5rem; font-weight: 600;">Default</div>
          <mad-breadcrumb
            [breadcrumbs]="[
              { label: 'Home', route: ['/'] },
              { label: 'Orders', route: ['/orders'] },
              { label: 'Details' }
            ]"
            [showCopy]="true"
            title="Copy"
          />
        </div>

        <div>
          <div style="margin-bottom: 0.5rem; font-weight: 600;">Without copy button</div>
          <mad-breadcrumb
            [breadcrumbs]="[
              { label: 'Home', route: ['/'] },
              { label: 'Settings', route: ['/settings'] },
              { label: 'Profile' }
            ]"
            [showCopy]="false"
          />
        </div>

        <div>
          <div style="margin-bottom: 0.5rem; font-weight: 600;">With external link</div>
          <mad-breadcrumb
            [breadcrumbs]="[
              { label: 'Home', route: ['/'] },
              { label: 'Documentation', href: 'https://storybook.js.org/' },
              { label: 'Breadcrumb' }
            ]"
            [showCopy]="true"
            title="Copy path"
          />
        </div>

        <div>
          <div style="margin-bottom: 0.5rem; font-weight: 600;">Single current item</div>
          <mad-breadcrumb
            [breadcrumbs]="[
              { label: 'Current page' }
            ]"
            [showCopy]="false"
          />
        </div>

        <div>
          <div style="margin-bottom: 0.5rem; font-weight: 600;">Long labels</div>
          <mad-breadcrumb
            [breadcrumbs]="[
              { label: 'Very long home label', route: ['/'] },
              { label: 'Another long intermediate breadcrumb item', route: ['/section'] },
              { label: 'Current page with a longer name' }
            ]"
            [showCopy]="true"
            title="Copy breadcrumb"
          />
        </div>
      </div>
    `,
  }),
};

export const Default: Story = {
  args: {
    breadcrumbs: [{ label: 'Home', route: ['/'] }, { label: 'Applications', route: ['/applications'] }, { label: 'Details' }],
  },
};

export const WithoutCopyButton: Story = {
  args: {
    breadcrumbs: [{ label: 'Home', route: ['/'] }, { label: 'Settings', route: ['/settings'] }, { label: 'Profile' }],
    showCopy: false,
  },
};

export const ExternalLink: Story = {
  args: {
    breadcrumbs: [{ label: 'Home', route: ['/'] }, { label: 'Documentation', href: 'https://storybook.js.org/' }, { label: 'Breadcrumb' }],
  },
};

export const OnlyCurrentItem: Story = {
  args: {
    breadcrumbs: [{ label: 'Current page' }],
    showCopy: false,
  },
};
