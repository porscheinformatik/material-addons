import { Observable } from 'rxjs';

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
}
export interface ToolbarAction extends Action {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: () => any;
}
