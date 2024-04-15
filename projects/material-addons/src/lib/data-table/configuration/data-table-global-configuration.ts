import { Inject, InjectionToken, Optional, SkipSelf } from '@angular/core';

// this could also be extended with e.g. labels or other general configuration stuff
export interface DataTableGlobalConfiguration {
  dateTimeFormat: string;
}

export const MAD_DATA_TABLE_GLOBAL_CONFIGURATION = new InjectionToken<DataTableGlobalConfiguration>('mad-data-table-global-configuration');

// If there is a custom DATA_TABLE_CONFIG_PROVIDER available, use that. Otherwise, provide the default one.
export const MAD_DATA_TABL_GLOBAL_CONFIGURATION_PROVIDER = {
  provide: MAD_DATA_TABLE_GLOBAL_CONFIGURATION,
  deps: [[new Optional(), new SkipSelf(), new Inject(MAD_DATA_TABLE_GLOBAL_CONFIGURATION)]],
  useFactory: (dataTableConfig?: DataTableGlobalConfiguration) =>
    dataTableConfig ?? {
      dateTimeFormat: 'dd.MM.yyyy',
    },
};
