import { Injectable, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { BackAction, MainAction, ToolbarAction } from './toolbar-action.interface';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService implements OnDestroy {
  routerSubscription: Subscription;

  // Backed by signals so that OnPush components (e.g. ToolbarComponent) are notified and
  // re-rendered whenever actions/title are added or changed, even asynchronously (e.g. after
  // translation) or from sibling/route components unrelated to the toolbar's own bindings.
  private readonly backActionSignal = signal<BackAction | undefined>(undefined);
  private readonly mainActionsSignal = signal<MainAction[]>([]); // shown on the left, next to title, as big buttons
  private readonly toolbarActionsSignal = signal<ToolbarAction[]>([]); // shown on the right as icons
  private readonly toolbarActionsAlwaysAsMenuSignal = signal(false); // show the mobile view (burger menu) for toolbar actions
  private readonly dataTitleSignal = signal<string | undefined>(undefined);
  private readonly titleSignal = signal<string | undefined>(undefined);
  private readonly toolbarActionsMenuTitleSignal = signal('More'); // title of the burger menu

  private currentUrl: string;

  constructor(
    private router: Router,
    private translate: TranslateService,
  ) {
    this.routerSubscription = this.router.events.subscribe((routingEvent) => {
      if (routingEvent instanceof NavigationEnd) {
        if (this.currentUrl !== routingEvent.urlAfterRedirects) {
          this.clearToolbarActions();
          this.clearMainActions();
          this.backActionSignal.set(undefined);
          this.dataTitleSignal.set(undefined);
        }
        this.currentUrl = router.url;
      }
    });
  }

  get toolbarTitle(): string {
    return this.titleSignal();
  }

  set toolbarTitle(toolbarTitle: string) {
    this.titleSignal.set(toolbarTitle);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  getToolbarActions(): ToolbarAction[] {
    return this.toolbarActionsSignal();
  }

  addToolbarAction(action: ToolbarAction): void {
    this.translate
      .get(action.i18nActionKey)
      .toPromise()
      .then((translated) => {
        action.actionName = translated;
        this.toolbarActionsSignal.update((actions) => [...actions, action]);
      });
  }

  setDataTitle(dataTitle: string): void {
    this.dataTitleSignal.set(dataTitle);
  }

  setToolbarActionsAlwaysAsMenu(toolbarActionsAlwaysAsMenu: boolean): void {
    this.toolbarActionsAlwaysAsMenuSignal.set(toolbarActionsAlwaysAsMenu);
  }

  getToolbarActionsAlwaysAsMenu(): boolean {
    return this.toolbarActionsAlwaysAsMenuSignal();
  }

  getDataTitle(): string {
    return this.dataTitleSignal();
  }

  clearToolbarActions(): void {
    this.toolbarActionsSignal.set([]);
  }

  getMainActions(): MainAction[] {
    return this.mainActionsSignal();
  }

  getBackAction(): BackAction {
    return this.backActionSignal();
  }

  setToolbarActionsMenuTitle(toolbarActionsMenuTitle: string): void {
    this.toolbarActionsMenuTitleSignal.set(toolbarActionsMenuTitle);
  }

  getToolbarActionsMenuTitle(): string {
    return this.toolbarActionsMenuTitleSignal();
  }

  addMainAction(mainAction: MainAction): void {
    this.translate
      .get(mainAction.i18nActionKey)
      .toPromise()
      .then((translated) => {
        mainAction.actionName = translated;
        this.mainActionsSignal.update((actions) => [...actions, mainAction]);
      });
  }

  /**
   * Per default the goBackRoute is a routerLink. But if a href should be used (for absolute browser routing) then isAbsoluteUrl can be set to true.
   */
  addBackAction(goBackRoute: string, isAbsoluteUrl = false): void {
    const backAction: BackAction = {
      matIcon: 'keyboard_backspace',
      i18nActionKey: '',
    };
    if (!isAbsoluteUrl) {
      backAction.routerLink = goBackRoute;
    } else {
      backAction.href = goBackRoute;
    }
    this.backActionSignal.set(backAction);
  }

  /**
   * Only supports routerLink (no href), but with additional query parameters
   */
  addBackActionRoute(goBackRoute: string, queryParams?: Params): void {
    this.backActionSignal.set({
      matIcon: 'keyboard_backspace',
      i18nActionKey: '',
      routerLink: goBackRoute,
      queryParams: queryParams || {},
    });
  }

  addSimpleBackButton(overrideIfPresent = false): void {
    if (this.getBackAction() && !overrideIfPresent) {
      return;
    }

    this.backActionSignal.set({
      matIcon: 'keyboard_backspace',
      i18nActionKey: '',
      action(): void {
        window.history.back();
      },
    });
  }

  clearMainActions(): void {
    this.mainActionsSignal.set([]);
  }
}
