import { Component } from '@angular/core';
import { ModuleEntries } from 'src/module-entries';
import { NavigationEntries } from 'src/navigation-entries';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-example-components-layout',
  templateUrl: './example-components-layout.component.html',
  styleUrls: ['./example-components-layout.component.scss'],
})
export class ExampleComponentsLayoutComponent {
  moduleName = 'MATERIAL_ADDONS_DEMO';

  moduleEntries = ModuleEntries.MODULE_ENTRIES;
  navEntries = NavigationEntries.NAVIGATION_ENTRIES;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
  ) {
    this.translate.setDefaultLang('en');

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setPageTitle();
      }
    });
  }

  private setPageTitle(): void {
    // TODO: find type
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    route.data.subscribe((value) => {
      if (value.i18n) {
        this.translate
          .get(value.i18n)
          .toPromise()
          .then((title) => {
            this.titleService.setTitle(title);
          });
      }
    });
  }
}
