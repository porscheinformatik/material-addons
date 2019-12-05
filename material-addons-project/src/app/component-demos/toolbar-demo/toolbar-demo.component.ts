import { Component } from '@angular/core';
import {Example} from "../../components/example-viewer/example.class";
import {ToolbarComponent} from "../../example-components/toolbar/toolbar.component";
import {MainAction, ToolbarAction} from "@porscheinformatik/material-addons";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-toolbar-demo',
  templateUrl: './toolbar-demo.component.html',
  styleUrls: ['./toolbar-demo.component.scss']
})
export class ToolbarDemoComponent {
  toolbarComponent = new Example(ToolbarComponent, 'toolbar', 'Toolbar component');
  mainAction: MainAction = {
    showIf: of(true),
    actionName: 'mainAction',
    i18nActionKey: 'mainAction.name',
    matIcon: 'add',
    liftHigherOnMobile: false,
    routerLink: '/home'
  };
  descMainAction = {
    showIf: {description: "Flag to controls the display behavior of the action, if not specified, the action will always show", optional: true},
    actionName: {description: "specifies an action name", optional: true},
    i18nActionKey: {description: "specifies an action name, which can be used with i18n"},
    matIcon: {description: "sets the material icon"},
    liftHigherOnMobile: {description: "lifts the action button, which appears in the right lower corner on mobile instead of the main action in the toolbar, higher", optional: true},
    routerLink: {description: "dpecifies the route to which should be navigated on click the main action"}
  };
  toolbarAction: ToolbarAction = {
    showIf: of(true),
    actionName: "toolbarAction",
    i18nActionKey: 'toolbarAction.name',
    matIcon: 'add',
    action: () => alert("Hi")
  };
  descToolbarAction = {
    showIf: this.descMainAction.showIf,
    actionName: this.descMainAction.actionName,
    i18nActionKey: this.descMainAction.i18nActionKey,
    matIcon: this.descMainAction.matIcon,
    action: {description: "defines which function should be triggered on click"}
  };
  constructor() { }
}
