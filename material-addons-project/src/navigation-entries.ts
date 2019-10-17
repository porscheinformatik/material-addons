import { NavigationEntry } from './app/components/navigation/navigation-entry';

export class NavigationEntries {

  public static readonly NAVIGATION_ENTRIES: NavigationEntry[] = [

    {
      name: 'intro',
      i18n: 'intro',
      matIcon: 'library_books',
      route: '/intro',
      roles: ['TEST', 'TEST2']
    },
    {
      name: 'demos',
      i18n: 'demos.title',
      matIcon: 'library_books',
      roles: ['TEST', 'TEST2'],
      children: [
        {
          name: 'tableDemo',
          i18n: 'demos.tableDemo',
          matIcon: 'insert_drive_file',
          route: '/tableDemo',
          roles: ['TEST3']
        }
      ]
    },
    {
      name: 'components',
      i18n: 'components.title',
      matIcon: 'library_books',
      roles: ['TEST', 'TEST2'],
      children: [
        {
          name: 'readonly',
          i18n: 'components.readonly',
          matIcon: 'insert_drive_file',
          route: '/readonly',
          roles: ['TEST3']
        }
      ]
    },
  ];

}
