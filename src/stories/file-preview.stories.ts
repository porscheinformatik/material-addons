import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { FilePreviewComponent, FileUploadComponent } from '@porscheinformatik/material-addons';
import { FilePreviewItem, FilePreviewConfig } from '@porscheinformatik/material-addons';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { moduleMetadata } from '@storybook/angular';

interface FilePreviewStoryArgs extends FilePreviewConfig {
  items: FilePreviewItem[];
  labels?: any;
}

const sampleItems: FilePreviewItem[] = [
  {
    id: '1',
    name: 'document.pdf',
    mimeType: 'application/pdf',
    size: 1024 * 100,
  },
  {
    id: '2',
    name: 'spreadsheet.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 1024 * 50,
  },
  {
    id: '3',
    name: 'report.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1024 * 75,
  },
  {
    id: '4',
    name: 'image.png',
    mimeType: 'image/png',
    size: 1024 * 200,
  },
  {
    id: '5',
    name: 'photo.jpg',
    mimeType: 'image/jpeg',
    size: 1024 * 300,
  },
];

// Helper component for upload + preview interaction
@Component({
  selector: 'app-file-preview-upload-demo',
  standalone: true,
  imports: [FilePreviewComponent, FileUploadComponent],
  template: `
    <div style="max-width: 900px;">
      <mad-file-upload
        [multiple]="true"
        [accept]="['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico', 'pdf', 'docx', 'xlsx', 'xls', 'xlsm', 'xlsb', 'ods', 'csv']"
        text="Upload Files"
        id="file-preview-upload"
        (fileEmitter)="onFilesUploaded($event)"
      />
      <div style="margin-top: 20px;">
        <mad-file-preview
          [items]="items()"
          [config]="config"
          (deleteClicked)="onDeleteClicked($event)"
        />
      </div>
    </div>
  `,
})
export class FileUploadWithPreviewComponent {
  items = signal<FilePreviewItem[]>([]);

  config: FilePreviewConfig = {
    thumbnailSize: 'md',
    showDeleteAction: true,
    showDownloadAction: true,
    showPreviewAction: true,
    showActionIcons: true,
    generatePdfThumbnails: true,
    excelPreviewRowLimit: 200,
  };

  onFilesUploaded(fileList: FileList): void {
    const timestamp = Date.now();
    this.items.set(
      Array.from(fileList).map((file, i) => ({
        id: `${timestamp}-${i}`,
        name: file.name,
        mimeType: file.type || undefined,
        source: file,
        size: file.size,
      }))
    );
  }

  onDeleteClicked(item: FilePreviewItem): void {
    this.items.update(fileItems => fileItems.filter(i => i.id !== item.id));
  }
}

const meta: Meta<FilePreviewStoryArgs> = {
  title: 'Components/File Preview',
  component: FilePreviewComponent,
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    thumbnailSize: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    showDeleteAction: { control: 'boolean' },
    showDownloadAction: { control: 'boolean' },
    showPreviewAction: { control: 'boolean' },
    showActionIcons: { control: 'boolean' },
    generatePdfThumbnails: { control: 'boolean' },
    excelPreviewRowLimit: { control: 'number' },
  },
  args: {
    items: sampleItems,
    thumbnailSize: 'md',
    showDeleteAction: true,
    showDownloadAction: true,
    showPreviewAction: true,
    showActionIcons: true,
    generatePdfThumbnails: true,
    excelPreviewRowLimit: 200,
  },
};

export default meta;

type Story = StoryObj<FilePreviewStoryArgs>;

export const Playground: Story = {
  render: (args) => {
    const items = signal<FilePreviewItem[]>(args.items);

    return {
      props: {
        items: items(),
        thumbnailSize: args.thumbnailSize,
        showDeleteAction: args.showDeleteAction,
        showDownloadAction: args.showDownloadAction,
        showPreviewAction: args.showPreviewAction,
        showActionIcons: args.showActionIcons,
        generatePdfThumbnails: args.generatePdfThumbnails,
        excelPreviewRowLimit: args.excelPreviewRowLimit,
        config: {
          thumbnailSize: args.thumbnailSize,
          showDeleteAction: args.showDeleteAction,
          showDownloadAction: args.showDownloadAction,
          showPreviewAction: args.showPreviewAction,
          showActionIcons: args.showActionIcons,
          generatePdfThumbnails: args.generatePdfThumbnails,
          excelPreviewRowLimit: args.excelPreviewRowLimit,
        } as FilePreviewConfig,
        onDeleteClicked: (item: FilePreviewItem) => {
          items.update(fileItems => fileItems.filter(i => i.id !== item.id));
          // eslint-disable-next-line no-console
          console.log('[FilePreview] deleteClicked', item);
        },
      },
      template: `
        <div style="max-width: 900px;">
          <mad-file-preview
            [items]="items"
            [config]="config"
            (deleteClicked)="onDeleteClicked($event)"
          />
        </div>
      `,
      standalone: true,
      imports: [FilePreviewComponent, TranslateModule],
    };
  },
};

export const Default: Story = {
  render: (args) => ({
    props: {
      items: args.items,
      config: {
        thumbnailSize: 'md',
        showDeleteAction: true,
        showDownloadAction: true,
        showPreviewAction: true,
        showActionIcons: true,
        generatePdfThumbnails: true,
        excelPreviewRowLimit: 200,
      } as FilePreviewConfig,
    },
    template: `
      <div style="max-width: 900px;">
        <mad-file-preview [items]="items" [config]="config" />
      </div>
    `,
    standalone: true,
    imports: [FilePreviewComponent, TranslateModule],
  }),
};

export const SmallThumbnails: Story = {
  args: {
    thumbnailSize: 'sm',
  },
  render: (args) => ({
    props: {
      items: args.items,
      config: {
        thumbnailSize: 'sm',
        showDeleteAction: true,
        showDownloadAction: true,
        showPreviewAction: true,
        showActionIcons: true,
        generatePdfThumbnails: true,
        excelPreviewRowLimit: 200,
      } as FilePreviewConfig,
    },
    template: `
      <div style="max-width: 900px;">
        <mad-file-preview [items]="items" [config]="config" />
      </div>
    `,
    standalone: true,
    imports: [FilePreviewComponent, TranslateModule],
  }),
};

export const LargeThumbnails: Story = {
  args: {
    thumbnailSize: 'lg',
  },
  render: (args) => ({
    props: {
      items: args.items,
      config: {
        thumbnailSize: 'lg',
        showDeleteAction: true,
        showDownloadAction: true,
        showPreviewAction: true,
        showActionIcons: true,
        generatePdfThumbnails: true,
        excelPreviewRowLimit: 200,
      } as FilePreviewConfig,
    },
    template: `
      <div style="max-width: 900px;">
        <mad-file-preview [items]="items" [config]="config" />
      </div>
    `,
    standalone: true,
    imports: [FilePreviewComponent, TranslateModule],
  }),
};

export const PreviewOnly: Story = {
  render: (args) => ({
    props: {
      items: args.items,
      config: {
        thumbnailSize: 'md',
        showDeleteAction: false,
        showDownloadAction: false,
        showPreviewAction: true,
        showActionIcons: true,
        generatePdfThumbnails: true,
        excelPreviewRowLimit: 200,
      } as FilePreviewConfig,
    },
    template: `
      <div style="max-width: 900px;">
        <mad-file-preview [items]="items" [config]="config" />
      </div>
    `,
    standalone: true,
    imports: [FilePreviewComponent, TranslateModule],
  }),
};

export const ActionsDisabled: Story = {
  render: (args) => ({
    props: {
      items: args.items,
      config: {
        thumbnailSize: 'md',
        showDeleteAction: false,
        showDownloadAction: false,
        showPreviewAction: false,
        showActionIcons: false,
        generatePdfThumbnails: true,
        excelPreviewRowLimit: 200,
      } as FilePreviewConfig,
    },
    template: `
      <div style="max-width: 900px;">
        <mad-file-preview [items]="items" [config]="config" />
      </div>
    `,
    standalone: true,
    imports: [FilePreviewComponent, TranslateModule],
  }),
};

export const WithPdfThumbnails: Story = {
  render: (args) => ({
    props: {
      items: args.items,
      config: {
        thumbnailSize: 'md',
        showDeleteAction: true,
        showDownloadAction: true,
        showPreviewAction: true,
        showActionIcons: true,
        generatePdfThumbnails: true,
        excelPreviewRowLimit: 200,
      } as FilePreviewConfig,
    },
    template: `
      <div style="max-width: 900px;">
        <mad-file-preview [items]="items" [config]="config" />
      </div>
    `,
    standalone: true,
    imports: [FilePreviewComponent, TranslateModule],
  }),
};

export const WithUpload: Story = {
  decorators: [
    moduleMetadata({
      imports: [FileUploadWithPreviewComponent, TranslateModule],
    }),
  ],
  render: () => {
    return {
      props: {},
      template: `<app-file-preview-upload-demo></app-file-preview-upload-demo>`,
      standalone: true,
      imports: [FileUploadWithPreviewComponent, TranslateModule],
    };
  },
};

export const ImagesOnly: Story = {
  args: {
    items: sampleItems.filter(item => item.mimeType?.startsWith('image/')),
  },
  render: (args) => ({
    props: {
      items: args.items,
      config: {
        thumbnailSize: 'md',
        showDeleteAction: true,
        showDownloadAction: true,
        showPreviewAction: true,
        showActionIcons: true,
        generatePdfThumbnails: true,
        excelPreviewRowLimit: 200,
      } as FilePreviewConfig,
    },
    template: `
      <div style="max-width: 900px;">
        <mad-file-preview [items]="items" [config]="config" />
      </div>
    `,
    standalone: true,
    imports: [FilePreviewComponent, TranslateModule],
  }),
};

export const DocumentsOnly: Story = {
  args: {
    items: sampleItems.filter(item => !item.mimeType?.startsWith('image/')),
  },
  render: (args) => ({
    props: {
      items: args.items,
      config: {
        thumbnailSize: 'md',
        showDeleteAction: true,
        showDownloadAction: true,
        showPreviewAction: true,
        showActionIcons: true,
        generatePdfThumbnails: true,
        excelPreviewRowLimit: 200,
      } as FilePreviewConfig,
    },
    template: `
      <div style="max-width: 900px;">
        <mad-file-preview [items]="items" [config]="config" />
      </div>
    `,
    standalone: true,
    imports: [FilePreviewComponent, TranslateModule],
  }),
};

export const Empty: Story = {
  args: {
    items: [],
  },
  render: (args) => ({
    props: {
      items: args.items,
      config: {
        thumbnailSize: 'md',
        showDeleteAction: true,
        showDownloadAction: true,
        showPreviewAction: true,
        showActionIcons: true,
        generatePdfThumbnails: true,
        excelPreviewRowLimit: 200,
      } as FilePreviewConfig,
    },
    template: `
      <div style="max-width: 900px;">
        <mad-file-preview [items]="items" [config]="config" />
      </div>
    `,
    standalone: true,
    imports: [FilePreviewComponent, TranslateModule],
  }),
};
