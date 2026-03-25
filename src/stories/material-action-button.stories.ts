import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideRouter, withHashLocation } from '@angular/router';

import { MaterialActionButtonComponent } from '@porscheinformatik/material-addons';

const meta: Meta<MaterialActionButtonComponent> = {
  title: 'Components/Material Action Button',
  component: MaterialActionButtonComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter([], withHashLocation())],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    actionName: {
      control: 'text',
    },
    id: {
      control: 'text',
    },
    icon: {
      control: 'text',
    },
    routerLink: {
      control: 'text',
    },
    liftHigher: {
      control: 'boolean',
    },
    liftHigher2: {
      control: 'boolean',
    },
  },
  args: {
    actionName: 'Create',
    id: 'material-action-button',
    icon: 'add',
    routerLink: '/create',
    liftHigher: true,
    liftHigher2: false,
  },
};

export default meta;

type Story = StoryObj<MaterialActionButtonComponent>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; min-height: 360px; padding: 24px; background: #fafafa;">
        <p style="margin: 0 0 16px 0;">
          Use controls to test icon, tooltip text, router link and floating position.
        </p>

        <mad-material-action-button
          [actionName]="actionName"
          [id]="id"
          [icon]="icon"
          [routerLink]="routerLink"
          [liftHigher]="liftHigher"
          [liftHigher2]="liftHigher2"
        />
      </div>
    `,
  }),
};

export const Default: Story = {
  args: {
    actionName: 'Add item',
    icon: 'add',
    routerLink: '/create',
    liftHigher: true,
    liftHigher2: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; min-height: 360px; padding: 24px; background: #fafafa;">
        <mad-material-action-button
          [actionName]="actionName"
          [id]="id"
          [icon]="icon"
          [routerLink]="routerLink"
          [liftHigher]="liftHigher"
          [liftHigher2]="liftHigher2"
        />
      </div>
    `,
  }),
};

export const MiniFab: Story = {
  args: {
    actionName: 'More actions',
    icon: 'edit',
    routerLink: '/edit',
    liftHigher: true,
    liftHigher2: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; min-height: 360px; padding: 24px; background: #fafafa;">
        <mad-material-action-button
          [actionName]="actionName"
          [id]="id"
          [icon]="icon"
          [routerLink]="routerLink"
          [liftHigher]="liftHigher"
          [liftHigher2]="liftHigher2"
        />
      </div>
    `,
  }),
};

export const WithoutLiftHigher: Story = {
  args: {
    actionName: 'Create',
    icon: 'add',
    routerLink: '/create',
    liftHigher: false,
    liftHigher2: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; min-height: 360px; padding: 24px; background: #fafafa;">
        <mad-material-action-button
          [actionName]="actionName"
          [id]="id"
          [icon]="icon"
          [routerLink]="routerLink"
          [liftHigher]="liftHigher"
          [liftHigher2]="liftHigher2"
        />
      </div>
    `,
  }),
};

export const LiftedMiniFab: Story = {
  args: {
    actionName: 'Secondary action',
    icon: 'more_horiz',
    routerLink: '/secondary',
    liftHigher: true,
    liftHigher2: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; min-height: 360px; padding: 24px; background: #fafafa;">
        <mad-material-action-button
          [actionName]="actionName"
          [id]="id"
          [icon]="icon"
          [routerLink]="routerLink"
          [liftHigher]="liftHigher"
          [liftHigher2]="liftHigher2"
        />
      </div>
    `,
  }),
};

export const EditAction: Story = {
  args: {
    actionName: 'Edit item',
    icon: 'edit',
    routerLink: '/edit',
    liftHigher: true,
    liftHigher2: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; min-height: 360px; padding: 24px; background: #fafafa;">
        <mad-material-action-button
          [actionName]="actionName"
          [id]="id"
          [icon]="icon"
          [routerLink]="routerLink"
          [liftHigher]="liftHigher"
          [liftHigher2]="liftHigher2"
        />
      </div>
    `,
  }),
};

export const Showcase: Story = {
  parameters: {
    controls: { disable: true },
    docs: { disable: true },
  },
  render: () => ({
    template: `
      <div style="position: relative; min-height: 480px; padding: 24px; background: #fafafa;">
        <p style="margin: 0 0 24px 0; font-weight: 600;">Floating action button variants</p>

        <mad-material-action-button
          actionName="Create"
          id="fab-default"
          icon="add"
          routerLink="/create"
          [liftHigher]="false"
          [liftHigher2]="false"
        />

        <mad-material-action-button
          actionName="Edit"
          id="fab-lifted"
          icon="edit"
          routerLink="/edit"
          [liftHigher]="true"
          [liftHigher2]="false"
        />

        <mad-material-action-button
          actionName="More"
          id="fab-mini"
          icon="more_horiz"
          routerLink="/more"
          [liftHigher]="true"
          [liftHigher2]="true"
        />
      </div>
    `,
  }),
};
