import { Component } from '@angular/core';
import { ModuleEntries } from 'src/module-entries';
import { NavigationEntries } from 'src/navigation-entries';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  moduleName = 'MATERIAL_ADDONS_DEMO';

  moduleEntries = ModuleEntries.MODULE_ENTRIES;
  navEntries = NavigationEntries.NAVIGATION_ENTRIES;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
  ) {
    translate.setDefaultLang('en');

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setPageTitle(this);
      }
    });
  }

  private setPageTitle(_this): void {
    // TODO: find type
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    if (route.data._value.i18n) {
      _this.translate
        .get(route.data._value.i18n)
        .toPromise()
        .then(value => {
          this.titleService.setTitle(value);
        });
    }
  }
}
