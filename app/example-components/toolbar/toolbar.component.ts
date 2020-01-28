import { Component, OnInit } from '@angular/core';
import { ToolbarService } from '@porscheinformatik/material-addons';
import { of } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(private toolbarService: ToolbarService) {}

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
    this.toolbarService.addToolbarAction({
      matIcon: 'cloud_download',
      showIf: of(true),
      i18nActionKey: 'Data download toolbar action',
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
      matIcon: 'add_alarm',
      i18nActionKey: 'Alarm!',
      action: () => {
        alert('Alarm!');
      },
    });
  }

  private configureBackAction(): void {
    this.toolbarService.addBackAction('/home');
  }
}
