import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from '@porscheinformatik/material-addons';
import type { ThemePalette } from '@angular/material/core';

interface ButtonStoryArgs {
  disabled: boolean;
  icon: string;
  label: string;
  outlineColor: ThemePalette;
  title: string;
  type: string;
  clicked: (button: string) => void;
}

const meta: Meta<ButtonStoryArgs> = {
  title: 'Components/Button',
  decorators: [
    moduleMetadata({
      imports: [ButtonModule, MatButtonModule, MatIconModule],
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
    disabled: { control: 'boolean' },
    icon: { control: 'text' },
    label: { control: 'text' },
    outlineColor: {
      control: { type: 'select' },
      options: ['primary', 'accent', 'warn'] satisfies ThemePalette[],
    },
    title: { control: 'text' },
    type: { control: 'text' },
    clicked: { action: 'clicked' },
  },
  args: {
    disabled: false,
    icon: 'create',
    label: 'Button',
    outlineColor: 'primary',
    title: 'Button tooltip',
    type: 'button',
  },
};

export default meta;

type Story = StoryObj<ButtonStoryArgs>;

const storySectionStyle = `
  display: grid;
  gap: 1rem;
  align-items: start;
`;

const buttonRowStyle = `
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

const panelStyle = `
  display: grid;
  gap: 0.75rem;
`;

const noopClicked = (): void => undefined;

export const Playground: Story = {
  render: (args) => ({
    props: {
      clicked: noopClicked,
      ...args,
    },
    template: `
      <div style="${storySectionStyle}">
        <div style="${buttonRowStyle}">
          <mad-primary-button [title]="title" [type]="type" [disabled]="disabled" (click)="clicked('primary')">
            {{ label }}
          </mad-primary-button>

          <mad-outline-button [title]="title" [type]="type" [color]="outlineColor" [disabled]="disabled" (click)="clicked('outline')">
            {{ label }}
          </mad-outline-button>

          <mad-danger-button [title]="title" [type]="type" [disabled]="disabled" (click)="clicked('danger')">
            {{ label }}
          </mad-danger-button>

          <mad-link-button [title]="title" [type]="type" [disabled]="disabled" (click)="clicked('link')">
            {{ label }}
          </mad-link-button>

          <mad-icon-button [title]="title" [type]="type" [disabled]="disabled" (click)="clicked('icon')">
            <mat-icon>{{ icon }}</mat-icon>
          </mad-icon-button>
        </div>
      </div>
    `,
  }),
};

export const WrapperButtons: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: `
      <div style="${storySectionStyle}">
        <div style="${buttonRowStyle}">
          <mad-primary-button title="Save" type="button">Save</mad-primary-button>
          <mad-outline-button title="Cancel" type="button">Cancel</mad-outline-button>
          <mad-danger-button title="Delete" type="button">Delete</mad-danger-button>
          <mad-link-button title="Add item" type="button">Add item</mad-link-button>
          <mad-icon-button title="Edit" type="button">
            <mat-icon>edit</mat-icon>
          </mad-icon-button>
        </div>
      </div>
    `,
  }),
};

export const DisabledStates: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: (args) => ({
    props: {
      clicked: noopClicked,
      ...args,
    },
    template: `
      <div style="${storySectionStyle}">
        <div style="${panelStyle}">
          <div style="font-weight: 600;">Enabled</div>
          <div style="${buttonRowStyle}">
            <mad-primary-button title="Save" type="button" (click)="clicked('enabled-primary')">Save</mad-primary-button>
            <mad-outline-button title="Cancel" type="button" (click)="clicked('enabled-outline')">Cancel</mad-outline-button>
            <mad-danger-button title="Delete" type="button" (click)="clicked('enabled-danger')">Delete</mad-danger-button>
            <mad-link-button title="Add item" type="button" (click)="clicked('enabled-link')">Add item</mad-link-button>
            <mad-icon-button title="Edit" type="button" (click)="clicked('enabled-icon')">
              <mat-icon>edit</mat-icon>
            </mad-icon-button>
          </div>
        </div>

        <div style="${panelStyle}">
          <div style="font-weight: 600;">Disabled</div>
          <div style="${buttonRowStyle}">
            <mad-primary-button title="Save" type="button" [disabled]="true" (click)="clicked('disabled-primary')">Save</mad-primary-button>
            <mad-outline-button title="Cancel" type="button" [disabled]="true" (click)="clicked('disabled-outline')">Cancel</mad-outline-button>
            <mad-danger-button title="Delete" type="button" [disabled]="true" (click)="clicked('disabled-danger')">Delete</mad-danger-button>
            <mad-link-button title="Add item" type="button" [disabled]="true" (click)="clicked('disabled-link')">Add item</mad-link-button>
            <mad-icon-button title="Edit" type="button" [disabled]="true" (click)="clicked('disabled-icon')">
              <mat-icon>edit</mat-icon>
            </mad-icon-button>
          </div>
        </div>
      </div>
    `,
  }),
};

export const ButtonGroup: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: `
      <div style="${storySectionStyle}">
        <mad-button-group>
          <button matButton="outlined" madButton type="button">Group 1</button>
          <button matButton="outlined" madButton type="button">Group 2</button>
          <button matButton="outlined" madButton type="button">Group 3</button>
        </mad-button-group>

        <mad-button-group>
          <button matButton="elevated" madButton type="button">Group 4</button>
          <button matButton="elevated" madButton type="button">Group 5</button>
          <button matButton="elevated" madButton type="button">Group 6</button>
        </mad-button-group>

        <mad-button-group>
          <button matButton="text" madButton type="button">Group 7</button>
          <button matButton="text" madButton type="button" disabled>Group 8</button>
          <button matButton="text" madButton type="button">Group 9</button>
        </mad-button-group>
      </div>
    `,
  }),
};

export const MadButtonDirective: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: `
      <div style="${storySectionStyle}">
        <div style="${buttonRowStyle}">
          <button matButton="outlined" madButton type="button">Primary outlined</button>
          <button matButton="outlined" madButton color="accent" type="button">Accent outlined</button>
          <button matButton="outlined" madButton color="warn" type="button">Warn outlined</button>
          <button matButton="outlined" madButton type="button" disabled>Disabled directive</button>
        </div>
      </div>
    `,
  }),
};
