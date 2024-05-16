import { Component, OnInit } from '@angular/core';
import { ToolbarService } from './toolbar.service';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarModule } from './toolbar.module';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const DEUTSCH_LANGUAGE = 'de';
const DEUTSCH_TRANSLATIONS = { 'Data download': 'Datendownload', 'Function Callback': 'Funktionsrückruf' };

function mountWrapperComponent(componentProperties = {}) {
  return cy.mount(TestWrapperComponent, {
    declarations: [ToolbarComponent],
    imports: [
      TranslateTestingModule.withTranslations(DEUTSCH_LANGUAGE, DEUTSCH_TRANSLATIONS),
      ToolbarModule,
      RouterTestingModule,
      NoopAnimationsModule,
    ],
    providers: [ToolbarService],
    componentProperties,
  });
}

@Component({
  template: ` <mad-toolbar></mad-toolbar>`,
})
class TestWrapperComponent implements OnInit {
  constructor(private toolbarService: ToolbarService) {}

  showToolbarActionsAsBurger = false;

  ngOnInit(): void {
    this.setTitle();
    this.configureMainAction();
    this.configureToolbarAction();
    this.configureBackAction();
  }

  private setTitle(): void {
    this.toolbarService.toolbarTitle = 'Toolbar Test Title';
    this.toolbarService.setDataTitle('Test sub title');
  }

  private configureMainAction(): void {
    this.toolbarService.addMainAction({
      i18nActionKey: 'RouterLink Action',
      matIcon: 'home',
      routerLink: '/home',
      liftHigherOnMobile: true,
      showIf: of(true),
      tooltip: 'Router test tooltip',
    });

    this.toolbarService.addMainAction({
      i18nActionKey: 'Function Callback',
      matIcon: 'attach_money',
      action: () => {
        this.actionClicked('function callback action');
      },
      liftHigherOnMobile: true,
      showIf: of(true),
    });
  }

  private configureToolbarAction(): void {
    this.toolbarService.setToolbarActionsAlwaysAsMenu(this.showToolbarActionsAsBurger);
    this.toolbarService.setToolbarActionsMenuTitle('Actions');

    this.toolbarService.addToolbarAction({
      matIcon: 'cloud_download',
      showIf: of(true),
      i18nActionKey: 'Data download',
      action: () => {
        console.log('Data download toolbar action');
      },
    });

    this.toolbarService.addToolbarAction({
      i18nActionKey: 'Change filter',
      matIcon: 'filter_alt',
      action: () => {
        console.log('Change Filter Action');
      },
    });
    this.toolbarService.addToolbarAction({
      i18nActionKey: 'Print PDF',
      matIcon: 'print',
      action: () => {
        console.log('Print PDF Action');
      },
    });

    this.toolbarService.addToolbarAction({
      matIcon: 'search',
      showIf: of(true),
      i18nActionKey: 'Search',
      importantAction: true,
      action: () => {
        this.actionClicked('Search Action');
      },
    });
  }

  actionClicked(message: string): void {
    console.log(message);
  }

  private configureBackAction(): void {
    this.toolbarService.addBackAction('/home');
  }
}

describe('toolbar.component.ts', () => {
  it('should mount ToolbarComponent', () => {
    mountWrapperComponent();
    cy.get('mad-toolbar').should('be.visible');
  });

  it('should have proper initial structure (back button, 2 main actions and 4 toolbar actions)', () => {
    cy.viewport(1500, 800);
    mountWrapperComponent();

    cy.get('mad-toolbar').should('be.visible');
    cy.get('mad-toolbar').get('mat-toolbar').children().as('toolbarItems').should('have.length', 5);
    // check back button
    cy.get('@toolbarItems').eq(0).should('be.visible').and('have.attr', 'href', '/home');
    cy.get('@toolbarItems').eq(0).find('button').find('mat-icon').should('contain.text', 'keyboard_backspace');
    // check title
    cy.get('@toolbarItems')
      .eq(1)
      .should('be.visible')
      .and('have.class', 'toolbar-title')
      .and('contain.text', 'Toolbar Test Title: Test sub title');
    // check main action 1
    cy.get('@toolbarItems').eq(2).find('a').should('be.visible').and('have.attr', 'href', '/home');
    cy.get('@toolbarItems').eq(2).find('mad-primary-button').contains('RouterLink Action').find('mat-icon').should('contain.text', 'home');
    // check main action 2 (translated)
    cy.get('@toolbarItems')
      .eq(3)
      .find('mad-primary-button')
      .should('be.visible')
      .contains('Funktionsrückruf')
      .find('mat-icon')
      .should('contain.text', 'attach_money');
    // check toolbar actions
    cy.get('@toolbarItems').eq(4).should('have.class', 'right-aligned').and('have.class', 'no-print');
    cy.get('@toolbarItems').eq(4).children().as('toolbarActions');
    cy.get('@toolbarActions').should('have.length', 4);
    cy.get('@toolbarActions').eq(0).should('be.visible').find('button').find('mat-icon').should('contains.text', 'cloud_download');
    cy.get('@toolbarActions').eq(1).should('be.visible').find('button').find('mat-icon').should('contains.text', 'filter_alt');
    cy.get('@toolbarActions').eq(2).should('be.visible').find('button').find('mat-icon').should('contains.text', 'print');
    cy.get('@toolbarActions').eq(3).should('be.visible').find('button').find('mat-icon').should('contains.text', 'search');
  });

  it('should show proper content and toolbar actions as a burger, but not 1 important action', () => {
    cy.viewport(1500, 800);
    mountWrapperComponent({
      showToolbarActionsAsBurger: true,
    });

    cy.get('mad-toolbar').should('be.visible');
    cy.get('mad-toolbar').get('mat-toolbar').children().as('toolbarItems').should('have.length', 5);
    cy.get('@toolbarItems').eq(4).should('have.class', 'right-aligned').and('have.class', 'no-print');
    cy.get('@toolbarItems').eq(4).children().as('toolbarActions');
    //check toolbar actions
    cy.get('@toolbarActions').should('have.length', 3); //because 2 icons and mat-menu are inside
    cy.get('@toolbarActions').eq(0).should('be.visible').find('button').find('mat-icon').should('contains.text', 'search');
    cy.get('@toolbarActions').eq(1).should('be.visible').find('button').find('mat-icon').should('contains.text', 'more_vert');
  });

  it('should show mat menu with toolbar actions when click on burger', () => {
    cy.viewport(1500, 800);
    mountWrapperComponent({
      showToolbarActionsAsBurger: true,
    });

    cy.getByCySel('burger-button').click();
    cy.getByCySel('burger-menu-button').should('have.length', 3);
    //check menu buttons contents (1st button translated)
    cy.getByCySel('burger-menu-button')
      .eq(0)
      .should('contain.text', 'Datendownload')
      .find('mat-icon')
      .should('contain.text', 'cloud_download');
    cy.getByCySel('burger-menu-button').eq(1).should('contain.text', 'Change filter').find('mat-icon').should('contain.text', 'filter_alt');
    cy.getByCySel('burger-menu-button').eq(2).should('contain.text', 'Print PDF').find('mat-icon').should('contain.text', 'print');
  });

  it('should show provided tooltip on hover for main action', () => {
    cy.viewport(1500, 800);
    mountWrapperComponent();

    cy.getByCySel('main-action-link-button').find('button').realHover();
    cy.get('body').find('mat-tooltip-component').should('be.visible').and('contain.text', 'Router test tooltip');
  });

  it('should show translated tooltip on hover toolbar action', () => {
    cy.viewport(1500, 800);
    mountWrapperComponent();

    //hover action icon which is translated
    cy.getByCySel('action-icon-button').eq(0).find('button').realHover();
    cy.get('body').find('mat-tooltip-component').should('be.visible').and('contain.text', 'Datendownload');
  });

  it('should call action on main action button', () => {
    cy.viewport(1500, 800);
    mountWrapperComponent().then((response) => {
      cy.spy(response.component, 'actionClicked').as('actionClickedSpy');
    });

    cy.getByCySel('main-action-button').click();
    cy.get('@actionClickedSpy').should('be.calledOnceWith', 'function callback action');
  });

  it('should call action on toolbar action button', () => {
    cy.viewport(1500, 800);
    mountWrapperComponent({
      showToolbarActionsAsBurger: true,
    }).then((response) => {
      cy.spy(response.component, 'actionClicked').as('actionClickedSpy');
    });

    cy.getByCySel('action-icon-button').click();
    cy.get('@actionClickedSpy').should('be.calledOnceWith', 'Search Action');
  });

  describe('small resolution component behavior', () => {
    it('should show proper structure version of tooltip (back button, title, toolbar actions with burger and main actions as mad-material-action-buttons)', () => {
      mountWrapperComponent();

      cy.get('mad-toolbar').should('be.visible');
      cy.get('mad-toolbar').get('mat-toolbar').children().as('toolbarItems').should('have.length', 5);
      // check back button
      cy.get('@toolbarItems').eq(0).should('be.visible').and('have.attr', 'href', '/home');
      cy.get('@toolbarItems').eq(0).find('button').find('mat-icon').should('contain.text', 'keyboard_backspace');
      // check title
      cy.get('@toolbarItems')
        .eq(1)
        .should('be.visible')
        .and('have.class', 'toolbar-title')
        .and('contain.text', 'Toolbar Test Title: Test sub title');
      // check main action 1
      cy.get('@toolbarItems').eq(2).find('a').should('be.visible').and('have.attr', 'href', '/home');
      cy.get('@toolbarItems').eq(2).find('mad-material-action-button').should('be.visible').find('mat-icon').should('contain.text', 'home');
      // check main action 2 (translated)
      cy.get('@toolbarItems')
        .eq(3)
        .find('mad-material-action-button')
        .should('be.visible')
        .find('mat-icon')
        .should('contain.text', 'attach_money');
      // check toolbar actions
      cy.getByCySel('action-icon-button').should('be.visible');
      cy.getByCySel('burger-button').should('be.visible');
    });

    // TODO test fails because isRouterLink returns true for action method
    //  need to fix toolbar.component.html block:
    // <div *ngIf="isHandset$ | async">
    //         <mad-material-action-button
    //           data-cy="material-main-link-button"
    //           *ngIf="isRouterLink(mainAction)"
    //           [actionName]="mainAction.actionName"
    //           [icon]="mainAction.matIcon"
    //           [liftHigher]="mainAction.liftHigherOnMobile"
    //           [liftHigher2]="i > 0"
    //           [routerLink]="mainAction.routerLink"
    //           [id]="mainAction.matIcon"
    //         />
    //         <mad-material-action-button
    //           data-cy="material-main-action-button"
    //           *ngIf="isAction(mainAction)"
    //           [actionName]="mainAction.actionName"
    //           [icon]="mainAction.matIcon"
    //           [liftHigher]="mainAction.liftHigherOnMobile"
    //           [liftHigher2]="i > 0"
    //           (click)="mainAction.action()"
    //           [id]="mainAction.matIcon"
    //         />
    //       </div>
    // TODO and after uncomment this test
    // it('should call action on main action (mad-material-action-button)', () => {
    //   mountWrapperComponent().then((response) => {
    //     cy.spy(response.component, 'actionClicked').as('actionClickedSpy');
    //   });
    //
    //   cy.getByCySel('material-main-action-button').find('button').click();
    //   cy.get('@actionClickedSpy').should('be.calledOnceWith', 'function callback action');
    // });
  });
});
