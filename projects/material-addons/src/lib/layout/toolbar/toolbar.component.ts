import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToolbarService } from './toolbar.service';
import { Observable, of } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Action, BackAction, MainAction, ToolbarAction } from './toolbar-action.interface';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { IconButtonComponent } from '../../button/icon-button/icon-button.component';
import { MaterialActionButtonComponent } from '../../material-action-button/material-action-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrimaryButtonComponent } from '../../button/primary-button/primary-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'mad-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [
    MatToolbarModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    PrimaryButtonComponent,
    MatTooltipModule,
    MaterialActionButtonComponent,
    IconButtonComponent,
    MatBadgeModule,
    MatMenuModule,
    AsyncPipe
],
})
export class ToolbarComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(map((result) => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private titleService: Title,
    private toolbarService: ToolbarService,
  ) {}

  getTitle(): string {
    const dataTitle = this.toolbarService.getDataTitle();
    const toolbarTitle = this.toolbarService.toolbarTitle;
    const title = !toolbarTitle || toolbarTitle.length <= 0 ? this.titleService.getTitle() : toolbarTitle;
    return !dataTitle || dataTitle.length <= 0 ? title : title + ': ' + dataTitle;
  }

  getToolbarActions(): ToolbarAction[] {
    return this.toolbarService.getToolbarActions();
  }

  getMainActions(): MainAction[] {
    return this.toolbarService.getMainActions();
  }

  hasPermission(action: Action): Observable<boolean> {
    if (!action || !action.showIf) {
      return of(true);
    }
    return action.showIf;
  }

  isRouterLink(action: BackAction | MainAction): boolean {
    return action && !!action.routerLink;
  }

  isAbsoluteLink(action: BackAction): boolean {
    return action && !!action.href;
  }

  isAction(action: BackAction | MainAction): boolean {
    return action && !!action.action;
  }

  getBackAction(): BackAction {
    return this.toolbarService.getBackAction();
  }

  getToolbarActionsAlwaysAsMenu(): boolean {
    return this.toolbarService.getToolbarActionsAlwaysAsMenu();
  }

  getToolbarActionsMenuTitle(): string {
    return this.toolbarService.getToolbarActionsMenuTitle();
  }

  showBadgeForMenu(): boolean {
    return (
      this.getToolbarActions()
        .slice(1) // the first icon is not shown in menu
        .filter((value) => value.badge && value.badge.value).length > 0
    );
  }

  hasImportantToolbarActions(): boolean {
    return this.getToolbarActions().filter((value) => !!value.importantAction).length > 0;
  }
}
