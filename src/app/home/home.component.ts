import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private titleService: Title,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    firstValueFrom(this.translateService.get('appTitle')).then((value) => this.titleService.setTitle(value));
  }

  toDocumentation(): void {
    this.router.navigateByUrl('/documentation');
  }
}
