import { NavigationEntry } from './app/components/navigation/navigation-entry';

export class NavigationEntries {
  static readonly NAVIGATION_ENTRIES: NavigationEntry[] = [
    {
      name: 'intro',
      i18n: 'intro.title',
      matIcon: 'contact_support',
      route: '/intro',
      roles: ['TEST', 'TEST2'],
    },
    {
      name: 'internationalization',
      i18n: 'internationalization.title',
      matIcon: 'monetization_on',
      route: '/internationalization',
      roles: ['TEST', 'TEST2'],
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
          roles: ['TEST3'],
        },
        {
          name: 'card',
          i18n: 'components.card',
          matIcon: 'insert_drive_file',
          route: '/card',
          roles: ['TEST3'],
        },
        {
          name: 'numeric-field',
          i18n: 'components.numeric-field',
          matIcon: 'insert_drive_file',
          route: '/numeric-field',
          roles: ['TEST3'],
        },
        {
          name: 'toolbar',
          i18n: 'components.toolbar',
          matIcon: 'insert_drive_file',
          route: '/toolbar',
          roles: ['TEST3'],
        },
        {
          name: 'action-button',
          i18n: 'components.action-button',
          matIcon: 'insert_drive_file',
          route: '/action-button',
          roles: ['TEST3'],
        },
        {
          name: 'quick-list',
          i18n: 'components.quick-list',
          matIcon: 'insert_drive_file',
          route: '/quick-list',
          roles: ['TEST3'],
        },
      ],
    },
    {
      name: 'demos',
      i18n: 'demos.title',
      matIcon: 'ondemand_video',
      roles: ['TEST', 'TEST2'],
      children: [
        {
          name: 'tableDemo',
          i18n: 'demos.tableDemo',
          matIcon: 'play_circle_outline',
          route: '/tableDemo',
          roles: ['TEST3'],
        },
      ],
    },
  ];
}
