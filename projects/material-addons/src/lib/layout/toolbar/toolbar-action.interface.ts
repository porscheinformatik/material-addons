import { Observable } from 'rxjs';
import { ThemePalette } from '@angular/material/core';
import { Params } from '@angular/router';

export interface Action {
  matIcon: string;
  i18nActionKey: string;
  actionName?: string;
  showIf?: Observable<boolean>;
}

export interface MainAction extends Action {
  routerLink?: string;
  action?: () => any;
  liftHigherOnMobile?: boolean;
  tooltip?: string;
}

export interface BackAction extends Action {
  routerLink?: string;
  queryParams?: Params;
  href?: string;
  action?: () => any;
}

export interface ToolbarActionBadge {
  value: any; // hidden automatically if null/undef
  color?: ThemePalette;
}

export interface ToolbarAction extends Action {
  action: () => any;
  importantAction?: boolean; // if true, it will never be hidden in a mat-menu
  badge?: ToolbarActionBadge;
}
