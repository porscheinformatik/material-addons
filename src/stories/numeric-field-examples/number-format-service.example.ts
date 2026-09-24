import { ChangeDetectionStrategy, Component, inject, LOCALE_ID } from '@angular/core';
import { NumberFormatService } from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-number-format-service-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }, NumberFormatService],
  template: `
    <p>All results below use the locally provided German dot/comma separators.</p>
    <dl>
      <dt>format(1234.5, autofillDecimals: true) — number to display text</dt>
      <dd>{{ formatted }}</dd>
      <dt>formatNumber('001234,567') — localized text to display text</dt>
      <dd>{{ formattedText }}</dd>
      <dt>strip('1.234,56') — remove grouping; the result is still a string</dt>
      <dd>{{ stripped }}</dd>
      <dt>strip('12,3x45') — stop at the first invalid character</dt>
      <dd>{{ stoppedAtInvalidCharacter }}</dd>
    </dl>
  `,
})
export class NumberFormatServiceExample {
  protected readonly numberFormat = inject(NumberFormatService);

  protected readonly formatted = this.numberFormat.format(1234.5, { autofillDecimals: true });
  protected readonly formattedText = this.numberFormat.formatNumber('001234,567');
  protected readonly stripped = this.numberFormat.strip('1.234,56');
  protected readonly stoppedAtInvalidCharacter = this.numberFormat.strip('12,3x45');
}
