import type { Meta, StoryObj } from '@storybook/angular';
import { TileComponent, TileIconPosition, TileSize, TileVariant } from '@porscheinformatik/material-addons';

const meta: Meta<TileComponent> = {
  title: 'Components/Tile',
  component: TileComponent,
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    variant: {
      control: { type: 'select' },
      options: ['success', 'error', 'info', 'warning'] satisfies TileVariant[],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'] satisfies TileSize[],
    },
    icon: {
      control: 'text',
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['start', 'end'] satisfies TileIconPosition[],
    },
  },
  args: {
    label: 'Tile label',
    variant: 'info',
    size: 'md',
    icon: '',
    iconPosition: 'start',
  },
};

export default meta;

type Story = StoryObj<TileComponent>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mad-tile
        [label]="label"
        [variant]="variant"
        [size]="size"
        [icon]="icon"
        [iconPosition]="iconPosition"
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
      <div style="display: grid; gap: 1.5rem;">
        <div>
          <div style="margin-bottom: 0.75rem; font-weight: 600;">Variants</div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <mad-tile label="Success" variant="success" size="md" />
            <mad-tile label="Error" variant="error" size="md" />
            <mad-tile label="Info" variant="info" size="md" />
            <mad-tile label="Warning" variant="warning" size="md" />
          </div>
        </div>

        <div>
          <div style="margin-bottom: 0.75rem; font-weight: 600;">Sizes</div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
            <mad-tile label="Small" variant="info" size="sm" />
            <mad-tile label="Medium" variant="info" size="md" />
            <mad-tile label="Large" variant="info" size="lg" />
          </div>
        </div>

        <div>
          <div style="margin-bottom: 0.75rem; font-weight: 600;">With icon</div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <mad-tile label="Done" variant="success" size="md" icon="check_circle" iconPosition="start" />
            <mad-tile label="Alert" variant="warning" size="md" icon="warning" iconPosition="start" />
            <mad-tile label="Info" variant="info" size="md" icon="info" iconPosition="end" />
            <mad-tile label="Error" variant="error" size="md" icon="error" iconPosition="end" />
          </div>
        </div>
      </div>
    `,
  }),
};

export const Default: Story = {
  args: {
    label: 'Info tile',
    variant: 'info',
    size: 'md',
  },
};

export const Success: Story = {
  args: {
    label: 'Success',
    variant: 'success',
    size: 'md',
  },
};

export const Error: Story = {
  args: {
    label: 'Error',
    variant: 'error',
    size: 'md',
  },
};

export const Warning: Story = {
  args: {
    label: 'Warning',
    variant: 'warning',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    label: 'Small tile',
    variant: 'info',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium tile',
    variant: 'info',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    label: 'Large tile',
    variant: 'info',
    size: 'lg',
  },
};

export const WithStartIcon: Story = {
  args: {
    label: 'Completed',
    variant: 'success',
    size: 'md',
    icon: 'check_circle',
    iconPosition: 'start',
  },
};

export const WithEndIcon: Story = {
  args: {
    label: 'Details',
    variant: 'info',
    size: 'md',
    icon: 'info',
    iconPosition: 'end',
  },
};

export const LongLabel: Story = {
  args: {
    label: 'Very long tile label for layout inspection',
    variant: 'warning',
    size: 'md',
    icon: 'warning',
    iconPosition: 'start',
  },
};
