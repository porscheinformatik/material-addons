import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ToolbarService} from './toolbar.service';
import {Observable, of} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

export interface MainAction {
  matIcon: string;
  i18nActionKey: string;
  routerLink: string;
  roles?: string[];
  liftHigherOnMobile?: boolean;
  actionName?: string;
}

export interface ToolbarAction {
  matIcon: string;
  i18nActionKey: string;
  action: () => any;
  roles?: string[];
  actionName?: string;
}

@Component({
  selector: 'mad-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private titleService: Title, private toolbarService: ToolbarService) {
  }

  ngOnInit() {
  }

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

  hasPermission(mainAction: MainAction | ToolbarAction) {
    if (!mainAction || !mainAction.roles) {
      return of(true);
    }
    return of(true);
  }

  getBackAction(): MainAction {
    return this.toolbarService.getBackAction();
  }

}
