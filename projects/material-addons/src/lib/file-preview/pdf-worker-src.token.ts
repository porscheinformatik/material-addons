import { InjectionToken } from '@angular/core';

/**
 * Injection token for the pdfjs-dist worker script URL.
 *
 * Override this token in your application providers when you want to serve the
 * worker from your own origin (e.g. copied into `assets/`) instead of the CDN:
 *
 * ```ts
 * { provide: PDF_WORKER_SRC, useValue: '/assets/pdf.worker.min.mjs' }
 * ```
 */
export const PDF_WORKER_SRC = new InjectionToken<string>('PDF_WORKER_SRC', {
  // Empty string = auto-derive a versioned CDN URL from the loaded pdfjs-dist module.
  // Set this token to a full URL (e.g. '/assets/pdf.worker.min.mjs') to serve the
  // worker from your own origin instead.
  factory: () => '',
});
