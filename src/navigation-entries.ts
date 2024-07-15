import { NavigationEntry } from './app/components/navigation/navigation-entry';

export class NavigationEntries {
  static readonly NAVIGATION_ENTRIES: NavigationEntry[] = [
    {
      name: 'intro',
      i18n: 'intro.title',
      matIcon: 'info',
      route: '/documentation/intro',
      roles: ['TEST', 'TEST2'],
    },
    {
      name: 'internationalization',
      i18n: 'internationalization.title',
      matIcon: 'language',
      route: '/documentation/internationalization',
      roles: ['TEST', 'TEST2'],
    },
    {
      name: 'layout',
      i18n: 'layouts.title',
      matIcon: 'dashboard',
      roles: ['TEST', 'TEST2'],
      showChildren: true,
      children: [
        {
          name: 'base layout',
          i18n: 'layouts.demos.base-page-layout',
          matIcon: 'insert_drive_file',
          route: '/documentation/base-page-layout',
          roles: ['TEST3'],
        },
        {
          name: 'flowbar layout',
          i18n: 'layouts.demos.flowbar-page-layout',
          matIcon: 'insert_drive_file',
          route: '/documentation/flowbar-page-layout',
          roles: ['TEST3'],
        },
        {
          name: 'sidebar layout',
          i18n: 'layouts.demos.sidebar-page-layout',
          matIcon: 'insert_drive_file',
          route: '/documentation/sidebar-page-layout',
          roles: ['TEST3'],
        },
      ],
    },
    {
      name: 'components',
      i18n: 'components.title',
      matIcon: 'flip_to_front',
      roles: ['TEST', 'TEST2'],
      showChildren: true,
      children: [
        {
          name: 'alert',
          i18n: 'components.demos.alert',
          matIcon: 'smart_button',
          route: '/documentation/alert',
          roles: ['TEST3'],
        },
        {
          name: 'buttons',
          i18n: 'components.demos.buttons',
          matIcon: 'smart_button',
          route: '/documentation/mad-buttons',
          roles: ['TEST3'],
        },
        {
          name: 'readonly',
          i18n: 'components.readonly',
          matIcon: 'insert_drive_file',
          route: '/documentation/readonly',
          roles: ['TEST3'],
        },
        {
          name: 'card',
          i18n: 'components.card',
          matIcon: 'insert_drive_file',
          route: '/documentation/card',
          roles: ['TEST3'],
        },
        {
          name: 'numeric-field',
          i18n: 'components.numeric-field',
          matIcon: 'insert_drive_file',
          route: '/documentation/numeric-field',
          roles: ['TEST3'],
        },
        {
          name: 'toolbar',
          i18n: 'components.toolbar',
          matIcon: 'insert_drive_file',
          route: '/documentation/toolbar',
          roles: ['TEST3'],
        },
        {
          name: 'action-button',
          i18n: 'components.action-button',
          matIcon: 'insert_drive_file',
          route: '/documentation/action-button',
          roles: ['TEST3'],
        },
        {
          name: 'quick-list',
          i18n: 'components.quick-list',
          matIcon: 'insert_drive_file',
          route: '/documentation/quick-list',
          roles: ['TEST3'],
        },
        {
          name: 'table',
          i18n: 'components.table',
          matIcon: 'insert_drive_file',
          route: '/documentation/table',
          roles: ['TEST3'],
        },
        {
          name: 'data-table',
          i18n: 'components.data-table',
          matIcon: 'insert_drive_file',
          route: '/documentation/data-table',
          roles: ['TEST3'],
        },
        {
          name: 'stepper',
          i18n: 'components.stepper',
          matIcon: 'insert_drive_file',
          route: '/documentation/stepper',
          roles: ['TEST3'],
        },
        {
          name: 'upload',
          i18n: 'components.upload',
          matIcon: 'insert_drive_file',
          route: '/documentation/upload',
          roles: ['TEST3'],
        },
      ],
    },
    {
      name: 'directives',
      i18n: 'directives.title',
      matIcon: 'extension',
      roles: ['TEST', 'TEST2'],
      showChildren: true,
      children: [
        {
          name: 'throttle click',
          i18n: 'directives.demos.throttle-click',
          matIcon: 'insert_drive_file',
          route: '/documentation/throttle-click',
          roles: ['TEST3'],
        },
      ],
    },
  ];
}
