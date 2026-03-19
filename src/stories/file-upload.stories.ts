import type { Meta, StoryObj } from '@storybook/angular';
import { FileUploadComponent } from '@porscheinformatik/material-addons';

const meta: Meta<FileUploadComponent> = {
  title: 'Components/File Upload',
  component: FileUploadComponent,
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    multiple: { control: 'boolean' },
    accept: { control: 'object' },
    text: { control: 'text' },
    showFileList: { control: 'boolean' },
    removable: { control: 'boolean' },

    fileEmitter: { action: 'fileEmitter' },
    errorEmitter: { action: 'errorEmitter' },
  },
  args: {
    id: 'storybook-file-upload',
    multiple: false,
    accept: ['pdf', 'png'],
    text: 'Upload file',
    showFileList: true,
    removable: true,
  },
};

export default meta;

type Story = StoryObj<FileUploadComponent>;

export const Playground: Story = {
  render: (args) => ({
    props: {
      ...args,
      // eslint-disable-next-line no-console
      fileEmitter: (files: FileList) => console.log('[FileUpload] fileEmitter', files),
      // eslint-disable-next-line no-console
      errorEmitter: (error: string) => console.log('[FileUpload] errorEmitter', error),
    },
    template: `
      <div style="max-width: 420px;">
        <mad-file-upload
          [id]="id"
          [multiple]="multiple"
          [accept]="accept"
          [text]="text"
          [showFileList]="showFileList"
          [removable]="removable"
          (fileEmitter)="fileEmitter($event)"
          (errorEmitter)="errorEmitter($event)"
        />
      </div>
    `,
  }),
};

export const Default: Story = {
  args: {
    text: 'Upload',
    multiple: false,
    showFileList: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 420px;">
        <mad-file-upload
          [id]="id"
          [multiple]="multiple"
          [accept]="accept"
          [text]="text"
          [showFileList]="showFileList"
          [removable]="removable"
        />
      </div>
    `,
  }),
};

export const MultipleFiles: Story = {
  args: {
    text: 'Upload files',
    multiple: true,
    showFileList: true,
    accept: ['pdf', 'png', 'jpg'],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 420px;">
        <mad-file-upload
          [id]="id"
          [multiple]="multiple"
          [accept]="accept"
          [text]="text"
          [showFileList]="showFileList"
          [removable]="removable"
        />
      </div>
    `,
  }),
};

export const SingleFileWithList: Story = {
  args: {
    text: 'Upload document',
    multiple: false,
    showFileList: true,
    accept: ['pdf'],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 420px;">
        <mad-file-upload
          [id]="id"
          [multiple]="multiple"
          [accept]="accept"
          [text]="text"
          [showFileList]="showFileList"
          [removable]="removable"
        />
      </div>
    `,
  }),
};

export const NotRemovable: Story = {
  args: {
    text: 'Upload files',
    multiple: true,
    showFileList: true,
    removable: false,
    accept: ['pdf', 'png'],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 420px;">
        <mad-file-upload
          [id]="id"
          [multiple]="multiple"
          [accept]="accept"
          [text]="text"
          [showFileList]="showFileList"
          [removable]="removable"
        />
      </div>
    `,
  }),
};

export const ImagesOnly: Story = {
  args: {
    text: 'Upload image',
    multiple: false,
    showFileList: true,
    accept: ['png', 'jpg', 'jpeg', 'webp'],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 420px;">
        <mad-file-upload
          [id]="id"
          [multiple]="multiple"
          [accept]="accept"
          [text]="text"
          [showFileList]="showFileList"
          [removable]="removable"
        />
      </div>
    `,
  }),
};

export const DocumentsOnly: Story = {
  args: {
    text: 'Upload document',
    multiple: true,
    showFileList: true,
    accept: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 420px;">
        <mad-file-upload
          [id]="id"
          [multiple]="multiple"
          [accept]="accept"
          [text]="text"
          [showFileList]="showFileList"
          [removable]="removable"
        />
      </div>
    `,
  }),
};
