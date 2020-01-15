import {Injectable, OnDestroy} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {MainAction, ToolbarAction} from "./toolbar-action.interface";

@Injectable({
  providedIn: 'root'
})
export class ToolbarService implements OnDestroy {
  backAction: MainAction;
  mainActions: MainAction[] = []; // shown on the left, next to title, as big buttons
  toolbarActions: ToolbarAction[] = []; // shown on the right as icons
  addNewButtonRoute: string;
  liftFabButtonHigher = false;
  dataTitle: string;
  routerSubscription: Subscription;
  private _toolbarTitle: string;

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

  set toolbarTitle(toolbarTitle: string) {
    this._toolbarTitle = toolbarTitle;
  }
  get toolbarTitle(): string {
    return this._toolbarTitle;
  }
  setDataTitle(dataTitle: string) {
    this.dataTitle = dataTitle;
  }
  getDataTitle() {
    return this.dataTitle;
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
}
