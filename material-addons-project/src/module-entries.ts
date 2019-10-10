import { ModuleEntry } from './app/components/navigation/module-entry';

export class ModuleEntries {

  public static readonly MODULE_ENTRIES: ModuleEntry[] =
    [
      {
        name: 'MATERIAL_ADDONS_DEMO',
        i18n: 'materialAddonsDemo.title',
        matIcon: 'account_balance',
        homeRoute: '/home',
        url: '/',
        descriptionI18n: 'materialAddonsDemo.description',
        category: 'functional'
      },
    ];
}
