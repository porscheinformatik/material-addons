import { Inject, InjectionToken, Optional, SkipSelf } from '@angular/core';
import { AlertType, AlertSize } from './alert.component';

export interface AlertConfiguration {
  type?: AlertType;
  size?: AlertSize;
}

export const MAD_ALERT_CONFIGURATION = new InjectionToken<AlertConfiguration>('mad-alert-configuration');

export const MAD_ALERT_CONFIGURATION_PROVIDER = {
  provide: MAD_ALERT_CONFIGURATION,
  deps: [[new Optional(), new SkipSelf(), new Inject(MAD_ALERT_CONFIGURATION)]],
  useFactory: (alertConfig?: AlertConfiguration) =>
    alertConfig ?? {
      size: alertConfig?.size ?? 'medium',
      type: alertConfig?.type ?? 'info'
    },
};
