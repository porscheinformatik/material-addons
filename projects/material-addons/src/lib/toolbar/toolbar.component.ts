import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ToolbarService} from './toolbar.service';
import {Observable, of} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {Action, MainAction, ToolbarAction} from "./toolbar-action.interface";

@Component({
  selector: 'mad-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent{
  constructor(private breakpointObserver: BreakpointObserver,
              private titleService: Title,
              private toolbarService: ToolbarService) {}

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches)
    );
  getTitle() {
    const dataTitle = this.toolbarService.getDataTitle();
    const toolbarTitle = this.toolbarService.toolbarTitle;
    let title = (!toolbarTitle || toolbarTitle.length <= 0) ? this.titleService.getTitle() : toolbarTitle;
    return (!dataTitle || dataTitle.length <= 0) ? title : title + ': ' + dataTitle;
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

  getBackAction(): MainAction {
    return this.toolbarService.getBackAction();
  }

}
