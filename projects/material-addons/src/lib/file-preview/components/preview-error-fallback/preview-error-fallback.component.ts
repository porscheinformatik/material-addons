import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Lightweight standalone error fallback component.
 * Displays when a file preview cannot be rendered (unsupported format, missing library, etc).
 */
@Component({
  selector: 'mad-preview-error-fallback',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './preview-error-fallback.component.html',
  styleUrls: ['./preview-error-fallback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewErrorFallbackComponent {
  readonly fileType = input.required<string>();
}
