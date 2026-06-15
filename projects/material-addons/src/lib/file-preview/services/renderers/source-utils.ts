import { FilePreviewBase64Input, FilePreviewItem } from '../../models/file-preview.models';

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'blob:']);
const SAFE_DATA_URL_MIME_PREFIXES = [
  'image/',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-word.document.macroenabled.12',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  'application/vnd.ms-word.template.macroenabled.12',
  'application/vnd.oasis.opendocument.text',
  'application/rtf',
  'text/plain',
  'text/rtf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel.sheet.macroenabled.12',
  'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  'application/vnd.ms-excel.addin.macroenabled.12',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  'application/vnd.ms-excel.template.macroenabled.12',
  'application/vnd.oasis.opendocument.spreadsheet',
  'text/csv',

];

export function isBase64Input(source: FilePreviewItem['source']): source is FilePreviewBase64Input {
  return (
    source !== null &&
    typeof source === 'object' &&
    !(source instanceof Blob) &&
    !(source instanceof ArrayBuffer) &&
    'data' in source &&
    'mimeType' in source &&
    typeof source.data === 'string'
  );
}

export function base64InputToDataUrl(input: FilePreviewBase64Input): string {
  const { data, mimeType } = input;
  return data.startsWith('data:') ? data : `data:${mimeType};base64,${data}`;
}

export function sanitizeSourceUrl(source: string, baseUrl?: string): string | undefined {
  const trimmedSource = source.trim();

  if (!trimmedSource || trimmedSource.startsWith('//')) {
    return undefined;
  }

  if (trimmedSource.startsWith('data:')) {
    return isSafeDataUrl(trimmedSource) ? trimmedSource : undefined;
  }

  if (!hasExplicitScheme(trimmedSource)) {
    return trimmedSource;
  }

  if (/\s/.test(trimmedSource)) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(trimmedSource, baseUrl ?? 'https://local.invalid/');
    return SAFE_PROTOCOLS.has(parsedUrl.protocol) ? trimmedSource : undefined;
  } catch {
    return undefined;
  }
}

function hasExplicitScheme(source: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(source);
}

function isSafeDataUrl(source: string): boolean {
  const match = /^data:([^;,]+)(;[^,]*)?,/i.exec(source);
  if (!match) {
    return false;
  }

  const mimeType = match[1]?.toLowerCase() ?? '';
  return SAFE_DATA_URL_MIME_PREFIXES.some((allowedPrefix) => mimeType.startsWith(allowedPrefix));
}

export async function toArrayBuffer(source: FilePreviewItem['source']): Promise<ArrayBuffer> {
  if (!source) {
    return new ArrayBuffer(0);
  }

  if (isBase64Input(source)) {
    const dataUrl = base64InputToDataUrl(source);
    const response = await fetch(dataUrl);
    return response.arrayBuffer();
  }

  if (typeof source === 'string') {
    const safeSource = sanitizeSourceUrl(source);
    if (!safeSource) {
      throw new Error('Unsafe file preview source URL.');
    }
    const response = await fetch(safeSource);
    return response.arrayBuffer();
  }

  if (source instanceof Blob) {
    if (typeof (source as any).arrayBuffer === 'function') {
      return (source as any).arrayBuffer();
    }

    // Fallback: try FileReader if available (browsers/JSDOM), then Response if available.
    if (typeof FileReader !== 'undefined') {
      return new Promise<ArrayBuffer>((resolve, reject) => {
        try {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as ArrayBuffer) ?? new ArrayBuffer(0));
          reader.onerror = () => reject(new Error('Failed to read Blob as ArrayBuffer'));
          reader.readAsArrayBuffer(source as Blob);
        } catch (e) {
          reject(e);
        }
      });
    }

    if (typeof Response !== 'undefined') {
      try {
        const resp = new Response(source as Blob);
        return resp.arrayBuffer();
      } catch {
        return new ArrayBuffer(0);
      }
    }

    // Last-resort fallback for test environments: return empty ArrayBuffer.
    return new ArrayBuffer(0);
  }

  return source;
}
