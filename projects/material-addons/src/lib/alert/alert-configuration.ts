import { InjectionToken } from '@angular/core';
import { AlertType, AlertSize } from './alert.component';

export interface AlertDefaultOptions {
  type?: AlertType;
  size?: AlertSize;
}

export const MAD_ALERT_DEFAULT_CONFIGURATION = new InjectionToken(
  "mad-alert-configuration",
  {
    providedIn: "root",
    factory: MAD_ALERT_DEFAULT_CONFIGURATION_FACTORY,
  },
);

export function MAD_ALERT_DEFAULT_CONFIGURATION_FACTORY(): AlertDefaultOptions {
  return {
   size: "medium",
   type: "info",
  };
}
