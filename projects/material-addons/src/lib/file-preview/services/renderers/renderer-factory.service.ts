import { inject, Injectable } from '@angular/core';

import { FilePreviewKind } from '../../models/file-preview.models';
import { BaseRenderer } from './base-renderer';
import { DocxRenderer } from './docx-renderer';
import { ImageRenderer } from './image-renderer';
import { PdfRenderer } from './pdf-renderer';
import { ExcelRenderer } from './excel-renderer';

/**
 * Factory responsible for selecting the right preview strategy (renderer)
 * based on file kind, MIME type, and extension.
 */
@Injectable({ providedIn: 'root' })
export class RendererFactoryService {
   private readonly strategies: BaseRenderer[] = [inject(PdfRenderer), inject(DocxRenderer), inject(ExcelRenderer), inject(ImageRenderer)];

  private readonly sortedStrategies = [...this.strategies].sort((a, b) => b.priority - a.priority);
  private readonly strategiesByKind = new Map<FilePreviewKind, BaseRenderer>(
    this.sortedStrategies.map((strategy) => [strategy.kind, strategy] as const),
  );

  getByKind(kind: FilePreviewKind): BaseRenderer | undefined {
    return this.strategiesByKind.get(kind);
  }

  getByType(mimeType: string, extension: string): BaseRenderer | undefined {
    return this.sortedStrategies.find((strategy) => strategy.supports(mimeType, extension));
  }
}
