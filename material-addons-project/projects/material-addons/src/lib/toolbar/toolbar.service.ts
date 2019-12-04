import {Injectable, OnDestroy} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {MainAction, ToolbarAction} from "./toolbar-action.interface";

@Injectable({
  providedIn: 'root'
})
export class ToolbarService implements OnDestroy {

  // shown on the left, next to title, as big buttons
  mainActions: MainAction[] = [];

  backAction: MainAction;


  // shown on the right as icons
  toolbarActions: ToolbarAction[] = [];

  addNewButtonRoute: string;
  liftFabButtonHigher = false;

  dataTitle: string;

  routerSubscription: Subscription;

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

  public getToolbarActions(): ToolbarAction[] {
    return this.toolbarActions;
  }

  public addToolbarAction(action: ToolbarAction) {
    this.translate.get(action.i18nActionKey).toPromise().then(translated => {
      action.actionName = translated;
      this.toolbarActions.push(action);
    });
  }

  public setDataTitle(dataTitle: string) {
    this.dataTitle = dataTitle;
  }

  public clearToolbarActions() {
    this.toolbarActions = [];
  }

  public getMainActions(): MainAction[] {
    return this.mainActions;
  }

  public getBackAction(): MainAction {
    return this.backAction;
  }

  public addMainAction(mainAction: MainAction) {
    this.translate.get(mainAction.i18nActionKey).toPromise().then(translated => {
      mainAction.actionName = translated;
      this.mainActions.push(mainAction);
    });
  }

  addBackAction(goBackRoute: string) {
    let goBackAction: MainAction = <MainAction>{};
    goBackAction.liftHigherOnMobile = true;
    goBackAction.i18nActionKey = '';
    goBackAction.matIcon = 'keyboard_backspace';
    goBackAction.routerLink = goBackRoute;
    this.backAction = goBackAction;
  }

  public clearMainActions() {
    this.mainActions = [];
  }

  getDataTitle() {
    return this.dataTitle;
  }

}
