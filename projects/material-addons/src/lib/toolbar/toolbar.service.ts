import { Injectable, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MainAction, ToolbarAction } from './toolbar-action.interface';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService implements OnDestroy {
  backAction: MainAction;
  mainActions: MainAction[] = []; // shown on the left, next to title, as big buttons
  toolbarActions: ToolbarAction[] = []; // shown on the right as icons
  addNewButtonRoute: string;
  liftFabButtonHigher = false;
  dataTitle: string;
  routerSubscription: Subscription;
  private title: string;

  constructor(private router: Router, private translate: TranslateService) {
    this.routerSubscription = this.router.events.subscribe(routingEvent => {
      if (routingEvent instanceof NavigationStart) {
        if (this.router.url !== routingEvent.url) {
          this.clearToolbarActions();
          this.clearMainActions();
          delete this.backAction;
          delete this.dataTitle;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  getToolbarActions(): ToolbarAction[] {
    return this.toolbarActions;
  }

  addToolbarAction(action: ToolbarAction): void {
    this.translate
      .get(action.i18nActionKey)
      .toPromise()
      .then(translated => {
        action.actionName = translated;
        this.toolbarActions.push(action);
      });
  }

  set toolbarTitle(toolbarTitle: string) {
    this.title = toolbarTitle;
  }
  get toolbarTitle(): string {
    return this.title;
  }
  setDataTitle(dataTitle: string): void {
    this.dataTitle = dataTitle;
  }
  getDataTitle(): string {
    return this.dataTitle;
  }

  clearToolbarActions(): void {
    this.toolbarActions = [];
  }

  getMainActions(): MainAction[] {
    return this.mainActions;
  }

  getBackAction(): MainAction {
    return this.backAction;
  }

  addMainAction(mainAction: MainAction): void {
    this.translate
      .get(mainAction.i18nActionKey)
      .toPromise()
      .then(translated => {
        mainAction.actionName = translated;
        this.mainActions.push(mainAction);
      });
  }

  addBackAction(goBackRoute: string): void {
    this.backAction = {
      liftHigherOnMobile: true,
      matIcon: 'keyboard_backspace',
      routerLink: goBackRoute,
      i18nActionKey: '',
    };
  }

  clearMainActions(): void {
    this.mainActions = [];
  }
}
