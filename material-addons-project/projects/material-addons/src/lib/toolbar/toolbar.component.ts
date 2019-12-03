import {Component, Input} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ToolbarService} from './toolbar.service';
import {Observable, of} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

type PermissionService = any & { hasPermission: ((_: string[]) =>  Observable<boolean>) };

export interface MainAction {
  matIcon: string;
  i18nActionKey: string;
  routerLink: string;
  roles?: string[];
  liftHigherOnMobile?: boolean;
  actionName?: string;
  displayForImporter?: boolean;
  displayForDealer?: boolean;
}

export interface ToolbarAction {
  matIcon: string;
  i18nActionKey: string;
  action: () => any;
  roles?: string[];
  actionName?: string;
  displayForImporter?: boolean;
  displayForDealer?: boolean;
}

@Component({
  selector: 'mad-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent{
  private _permissionService: PermissionService;
  @Input() set permissionService(permissionService: PermissionService) {
    if ('hasPermission' in permissionService && typeof permissionService['hasPermission'] === 'function') {
      this._permissionService = permissionService;
    } else {
      this._permissionService = null;
    }
  };
  get permissionService(): any {
    return this._permissionService;
  }

  constructor(private breakpointObserver: BreakpointObserver,
              private titleService: Title,
              private toolbarService: ToolbarService) {}

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches)
    );
  getTitle() {
    let dataTitle = this.toolbarService.getDataTitle();
    if(!dataTitle || dataTitle.length <= 0){
      return this.titleService.getTitle();
    }

    return this.titleService.getTitle() + ': ' + dataTitle;
  }


  getToolbarActions(): ToolbarAction[] {
    return this.toolbarService.getToolbarActions();
  }

  getMainActions(): MainAction[] {
    return this.toolbarService.getMainActions();
  }

  hasPermission(mainAction: MainAction | ToolbarAction): Observable<boolean> {
    if (!mainAction || !mainAction.roles) {
      return of(true);
    }
    if (this.permissionService !== null) {
      return this.permissionService.hasPermission(mainAction.roles, undefined, mainAction.displayForImporter, mainAction.displayForDealer);
    }
    return of(true);
  }

  getBackAction(): MainAction {
    return this.toolbarService.getBackAction();
  }

}
