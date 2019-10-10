import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ModuleEntries } from 'src/module-entries';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  navEntries = ModuleEntries.MODULE_ENTRIES.sort(this.compare);

  constructor(private titleService: Title, private translateService: TranslateService) {
  }

  ngOnInit() {
    this.translateService.get('moduleSwitcher').toPromise().then(value => {
      this.titleService.setTitle(value);
    });
  }

  compare(a, b) {
    if (a.i18n < b.i18n) {
      return -1;
    }
    if (a.i18n > b.i18n) {
      return 1;
    }
    return 0;
  }
}
