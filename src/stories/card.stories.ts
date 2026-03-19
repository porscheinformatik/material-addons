import type { Meta, StoryObj } from '@storybook/angular';
import { CardComponent } from '@porscheinformatik/material-addons';

const meta: Meta<CardComponent> = {
  title: 'Components/Card',
  component: CardComponent,
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    readonly: {
      control: 'boolean',
    },
    editMode: {
      control: 'boolean',
    },
    expandable: {
      control: 'boolean',
    },
    expanded: {
      control: 'boolean',
    },
    cancelDisabled: {
      control: 'boolean',
    },
    cancelText: {
      control: 'text',
    },
    saveDisabled: {
      control: 'boolean',
    },
    saveText: {
      control: 'text',
    },
    editText: {
      control: 'text',
    },
    additionalActionIcon: {
      control: 'text',
    },
    additionalActionText: {
      control: 'text',
    },

    edit: { action: 'edit' },
    cancel: { action: 'cancel' },
    save: { action: 'save' },
    additionalAction: { action: 'additionalAction' },
  },
  args: {
    title: 'Card title',
    readonly: true,
    editMode: false,
    expandable: true,
    expanded: true,
    cancelDisabled: false,
    cancelText: 'Cancel',
    saveDisabled: false,
    saveText: 'Save',
    editText: 'Edit',
    additionalActionIcon: undefined,
    additionalActionText: '',
  },
};

export default meta;

type Story = StoryObj<CardComponent>;

const demoContent = `
  <div style="padding: 0.5rem 0;">
    <p style="margin: 0 0 0.75rem 0;">
      Example card content. Use this story to verify spacing, header actions, collapse behavior,
      and card action buttons.
    </p>

    <p style="margin: 0;">
      You can replace this later with a more realistic form, alert, or feature block.
    </p>
  </div>
`;

export const Playground: Story = {
  render: (args) => ({
    props: {
      ...args,
      edit: () => console.log('[Card] edit emitted'),
      cancel: () => console.log('[Card] cancel emitted'),
      save: () => console.log('[Card] save emitted'),
      additionalAction: () => console.log('[Card] additionalAction emitted'),
    },
    template: `
      <mad-card
        [title]="title"
        [readonly]="readonly"
        [editMode]="editMode"
        [expandable]="expandable"
        [(expanded)]="expanded"
        [cancelDisabled]="cancelDisabled"
        [cancelText]="cancelText"
        [saveDisabled]="saveDisabled"
        [saveText]="saveText"
        [editText]="editText"
        [additionalActionIcon]="additionalActionIcon"
        [additionalActionText]="additionalActionText"
        (edit)="edit()"
        (cancel)="cancel()"
        (save)="save()"
        (additionalAction)="additionalAction()"
      >
        ${demoContent}
      </mad-card>
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
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1rem;
          align-items: start;
        "
      >
        <mad-card
          [title]="'Readonly card'"
          [readonly]="true"
          [editMode]="false"
          [expandable]="true"
          [expanded]="true"
        >
          <div style="padding: 0.5rem 0;">
            Readonly card content.
          </div>
        </mad-card>

        <mad-card
          [title]="'Edit mode card'"
          [readonly]="false"
          [editMode]="true"
          [expandable]="true"
          [expanded]="true"
          [saveText]="'Save'"
          [cancelText]="'Cancel'"
        >
          <div style="padding: 0.5rem 0;">
            Card in edit mode with action buttons.
          </div>
        </mad-card>

        <mad-card
          [title]="'Collapsed card'"
          [readonly]="true"
          [editMode]="false"
          [expandable]="true"
          [expanded]="false"
        >
          <div style="padding: 0.5rem 0;">
            This content should stay hidden because the card is collapsed.
          </div>
        </mad-card>

        <mad-card
          [title]="'Card with additional action'"
          [readonly]="false"
          [editMode]="false"
          [expandable]="true"
          [expanded]="true"
          [additionalActionIcon]="'download'"
          [additionalActionText]="'Download'"
        >
          <div style="padding: 0.5rem 0;">
            Card with an additional action button in the header.
          </div>
        </mad-card>
      </div>
    `,
  }),
};

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mad-card
        [title]="title"
        [readonly]="readonly"
        [editMode]="editMode"
        [expandable]="expandable"
        [(expanded)]="expanded"
        [cancelDisabled]="cancelDisabled"
        [cancelText]="cancelText"
        [saveDisabled]="saveDisabled"
        [saveText]="saveText"
        [editText]="editText"
      >
        ${demoContent}
      </mad-card>
    `,
  }),
};

export const ReadonlyWithEditButton: Story = {
  args: {
    readonly: false,
    editMode: false,
    title: 'Readonly card with edit action',
  },
  render: (args) => ({
    props: args,
    template: `
      <mad-card
        [title]="title"
        [readonly]="readonly"
        [editMode]="editMode"
        [expandable]="expandable"
        [(expanded)]="expanded"
        [editText]="editText"
      >
        ${demoContent}
      </mad-card>
    `,
  }),
};

export const EditModeWithActions: Story = {
  args: {
    readonly: false,
    editMode: true,
    title: 'Card in edit mode',
    saveText: 'Save',
    cancelText: 'Cancel',
  },
  render: (args) => ({
    props: args,
    template: `
      <mad-card
        [title]="title"
        [readonly]="readonly"
        [editMode]="editMode"
        [expandable]="expandable"
        [(expanded)]="expanded"
        [saveText]="saveText"
        [cancelText]="cancelText"
        [saveDisabled]="saveDisabled"
        [cancelDisabled]="cancelDisabled"
      >
        ${demoContent}
      </mad-card>
    `,
  }),
};

export const Collapsed: Story = {
  args: {
    title: 'Collapsed card',
    expandable: true,
    expanded: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <mad-card
        [title]="title"
        [readonly]="readonly"
        [editMode]="editMode"
        [expandable]="expandable"
        [(expanded)]="expanded"
      >
        ${demoContent}
      </mad-card>
    `,
  }),
};

export const WithAdditionalAction: Story = {
  args: {
    title: 'Card with additional action',
    additionalActionIcon: 'download',
    additionalActionText: 'Download',
    readonly: false,
    editMode: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <mad-card
        [title]="title"
        [readonly]="readonly"
        [editMode]="editMode"
        [expandable]="expandable"
        [(expanded)]="expanded"
        [additionalActionIcon]="additionalActionIcon"
        [additionalActionText]="additionalActionText"
      >
        ${demoContent}
      </mad-card>
    `,
  }),
};

export const WithoutTitle: Story = {
  args: {
    title: undefined,
    expandable: true,
    expanded: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <mad-card
        [title]="title"
        [readonly]="readonly"
        [editMode]="editMode"
        [expandable]="expandable"
        [(expanded)]="expanded"
      >
        ${demoContent}
      </mad-card>
    `,
  }),
};

export const ContentOnly: Story = {
  args: {
    title: undefined,
    expandable: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <mad-card
        [title]="title"
        [readonly]="readonly"
        [editMode]="editMode"
        [expandable]="expandable"
        [(expanded)]="expanded"
      >
        ${demoContent}
      </mad-card>
    `,
  }),
};

export const DisabledActions: Story = {
  args: {
    title: 'Card with disabled actions',
    readonly: false,
    editMode: true,
    saveDisabled: true,
    cancelDisabled: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <mad-card
        [title]="title"
        [readonly]="readonly"
        [editMode]="editMode"
        [expandable]="expandable"
        [(expanded)]="expanded"
        [saveText]="saveText"
        [cancelText]="cancelText"
        [saveDisabled]="saveDisabled"
        [cancelDisabled]="cancelDisabled"
      >
        ${demoContent}
      </mad-card>
    `,
  }),
};
