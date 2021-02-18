import {Observable} from 'rxjs';
import {ThemePalette} from "@angular/material/core";
import {MatBadgePosition} from "@angular/material/badge/badge";

export interface Action {
  matIcon: string;
  i18nActionKey: string;
  actionName?: string;
  showIf?: Observable<boolean>;
}

export interface MainAction extends Action {
  routerLink: string;
  liftHigherOnMobile?: boolean;
}

export interface BackAction extends Action {
  routerLink?: string;
  href?: string;
  action?: () => any;
}

export interface ToolbarActionBadge {
  value: any; // hidden automatically if null/undef
  position?: MatBadgePosition;
  color?: ThemePalette;
}

export interface ToolbarAction extends Action {
  action: () => any;
  badge?: ToolbarActionBadge;
}
