import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ModuleEntries } from 'src/module-entries';
import { ModuleEntry } from '../components/navigation/module-entry';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  navEntries = ModuleEntries.MODULE_ENTRIES.sort(this.compare);

  constructor(private titleService: Title, private translateService: TranslateService) {}

  ngOnInit(): void {
    const titleService = this.titleService;
    this.translateService
      .get('moduleSwitcher')
      .toPromise()
      .then(value => titleService.setTitle(value));
  }
  compare(a: ModuleEntry, b: ModuleEntry): number {
    if (a.i18n < b.i18n) {
      return -1;
    }
    if (a.i18n > b.i18n) {
      return 1;
    }
    return 0;
  }
}
