import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AlertComponent, AlertSize, AlertType } from '@porscheinformatik/material-addons';

const meta: Meta<AlertComponent> = {
  title: 'Components/Alert',
  component: AlertComponent,
  decorators: [
    moduleMetadata({
      // Keep decorator in case you later add wrappers/providers.
      imports: [],
    }),
  ],
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['success', 'info', 'warning', 'error'] satisfies AlertType[],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'] satisfies AlertSize[],
    },
    message: { control: 'text' },
    actionText: { control: 'text' },
    closeable: { control: 'boolean' },

    // outputs: show them in actions panel (and we also log in render)
    close: { action: 'close' },
    action: { action: 'action' },
  },
  args: {
    type: 'info',
    size: 'medium',
    message: 'This is an alert message.',
    actionText: '',
    closeable: true,
  },
};

export default meta;

type Story = StoryObj<AlertComponent>;

/**
 * Playground for quickly checking your alignment, icon, close button and wrapping.
 */
export const Playground: Story = {
  render: (args) => ({
    props: {
      ...args,
      // eslint-disable-next-line no-console
      close: () => console.log('[Alert] close emitted'),
      // eslint-disable-next-line no-console
      action: () => console.log('[Alert] action emitted'),
    },
  }),
};

/**
 * Type variants
 */
export const Success: Story = {
  args: {
    type: 'success',
    message: 'Success alert message.',
  },
};

export const Info: Story = {
  args: {
    type: 'info',
    message: 'Info alert message.',
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    message: 'Warning alert message.',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    message: 'Error alert message.',
  },
};

/**
 * Size variants (use same type/message so only size changes)
 */
export const Small: Story = {
  args: {
    size: 'small',
    type: 'info',
    message: 'Small alert (check vertical centering).',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    type: 'info',
    message: 'Medium alert (default).',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    type: 'info',
    message: 'Large alert (check icon/message baseline alignment).',
  },
};

/**
 * Action + close button combinations
 */
export const WithAction: Story = {
  args: {
    type: 'info',
    message: 'Alert with action text.',
    actionText: 'Undo',
    closeable: true,
  },
};

export const ActionOnly: Story = {
  args: {
    type: 'warning',
    message: 'Action is shown, close button hidden.',
    actionText: 'Review',
    closeable: false,
  },
};

export const NotCloseable: Story = {
  args: {
    type: 'success',
    message: 'Close button is hidden.',
    closeable: false,
  },
};

/**
 * Wrapping torture test (very useful for alignment issues)
 */
export const LongMessageWrapping: Story = {
  args: {
    type: 'warning',
    size: 'medium',
    closeable: true,
    actionText: 'Details',
    message:
      'Very long message to verify wrapping, spacing between icon and message, and the alignment of ' +
      'action text and close button. Make sure everything stays centered and the close icon does not jump up.',
  },
};
