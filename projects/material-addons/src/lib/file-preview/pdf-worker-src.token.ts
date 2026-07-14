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
  // Loads the worker from public assets (copied during build from node_modules/pdfjs-dist/build)
  factory: () => '/assets/pdf.worker.min.mjs',
});
