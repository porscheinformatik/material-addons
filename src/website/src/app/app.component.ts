import { Component } from '@angular/core';
import { ModuleEntries } from 'src/module-entries';
import { NavigationEntries } from 'src/navigation-entries';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  moduleName = 'MATERIAL_ADDONS_DEMO';

  moduleEntries = ModuleEntries.MODULE_ENTRIES;
  navEntries = NavigationEntries.NAVIGATION_ENTRIES;

  constructor(private translate: TranslateService, private router: Router, private titleService: Title, private activatedRoute: ActivatedRoute) {

    translate.setDefaultLang('en');

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setPageTitle(this);
      }
    });
  }

  private setPageTitle(_this) {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    // @ts-ignore
    if (route.data._value['i18n']) {
      // @ts-ignore
      _this.translate.get(route.data._value['i18n']).toPromise().then(value => {
        this.titleService.setTitle(value);
      });
    }
  }
}
