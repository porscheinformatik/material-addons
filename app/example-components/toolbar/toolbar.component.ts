import {Component, OnInit} from '@angular/core';
import {ToolbarService} from '@porscheinformatik/material-addons';
import {of} from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(private toolbarService: ToolbarService) {
  }

  showToolbarActionsAlwaysAsMenu = false;

  ngOnInit(): void {
    this.setTitle();
    this.configureMainAction();
    this.configureToolbarAction();
    this.configureBackAction();
  }

  private setTitle(): void {
    this.toolbarService.toolbarTitle = 'Toolbar Demo Title';
    this.toolbarService.setDataTitle('Sub title');
  }

  triggerShowToolbarActionsAlwaysAsMenu() {
    const _this = this;
    setTimeout(() => {
      _this.toolbarService.setToolbarActionsAlwaysAsMenu(this.showToolbarActionsAlwaysAsMenu);
    }, 100);
  }

  private configureMainAction(): void {
    this.toolbarService.addMainAction({
      i18nActionKey: 'Main Action',
      matIcon: 'home',
      routerLink: '/home',
      liftHigherOnMobile: true,
      showIf: of(true),
    });
  }

  private configureToolbarAction(): void {
    this.toolbarService.setToolbarActionsMenuTitle('Actions');

    this.toolbarService.addToolbarAction({
      matIcon: 'cloud_download',
      showIf: of(true),
      i18nActionKey: 'Data download',
      action: () => {
        alert('Data download toolbar action');
      },
    });

    this.toolbarService.addToolbarAction({
      matIcon: 'face',
      i18nActionKey: 'Another action',
      showIf: of(false),
      action: () => {
        alert('Another Action!');
      },
    });


    this.toolbarService.addToolbarAction({
      matIcon: 'comment',
      i18nActionKey: 'Comment',
      action: () => {
        alert('20 unread comments!');
      },
      badge: {
        value: '5',
        color: 'warn',
      }
    });

    this.toolbarService.addToolbarAction({
      i18nActionKey: 'Change filter',
      matIcon: 'filter_alt',
      action: () => {
        alert('Action');
      }
    });
    this.toolbarService.addToolbarAction({
      i18nActionKey: 'Print PDF',
      matIcon: 'print',
      action: () => {
        alert('Action');
      }
    });

    this.toolbarService.addToolbarAction({
      matIcon: 'download',
      i18nActionKey: 'Excel export',
      action: () => {
        alert('Action');
      }
    });
    this.toolbarService.addToolbarAction({
      matIcon: 'file_upload',
      i18nActionKey: 'Excel Import',
      action: () => {
        alert('Action');
      }
    });
    this.toolbarService.addToolbarAction(({
      i18nActionKey: 'Reindex Data',
      matIcon: 'biotech',
      action: () => {
        alert('Action');
      }
    }));

    this.toolbarService.addToolbarAction({
      matIcon: 'help',
      showIf: of(true),
      i18nActionKey: 'Get some help',
      importantAction: true,
      action: () => {
        alert('Help action');
      },
    });

    this.toolbarService.addToolbarAction({
      matIcon: 'search',
      showIf: of(true),
      i18nActionKey: 'Search',
      importantAction: true,
      action: () => {
        alert('Search Action');
      },
    });

  }

  private configureBackAction(): void {
    this.toolbarService.addBackAction('/home');
  }
}
