import { Component } from '@angular/core';
import { ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarService } from './toolbar.service';

@Component({
  template: `<mad-toolbar></mad-toolbar>`,
  imports: [ToolbarComponent],
})
class HostComponent {}

describe('ToolbarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent, RouterTestingModule, TranslateModule.forRoot()],
      // Mimics the real bootstrapped app: CD runs automatically whenever the zone goes stable,
      // instead of requiring an explicit fixture.detectChanges() call after every state change.
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    });
  });

  it('renders a main action added asynchronously after initial render, without manual detectChanges', fakeAsync(() => {
    const fixture = TestBed.createComponent(HostComponent);
    tick(); // initial render, mimics app bootstrap tick

    const toolbarService = TestBed.inject(ToolbarService);
    const translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    tick();

    toolbarService.addMainAction({
      i18nActionKey: 'Home',
      matIcon: 'home',
      routerLink: '/home',
      showIf: of(true),
    });

    tick(); // flush the translate.get().toPromise() microtask; NO manual fixture.detectChanges() call!

    const compiledHtml = (fixture.nativeElement as HTMLElement).innerHTML;
    expect(compiledHtml).toContain('home');
  }));
});
