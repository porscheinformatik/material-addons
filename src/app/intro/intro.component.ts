import { Component } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent {
  test = 'import { NgModule } from "@angular/core";\n' +
    'import { ClrAddonsModule } from \'@porscheinformatik/clr-addons\';\n' +
    'import { AppComponent } from "./app.component";\n' +
    '\n' +
    '@NgModule({\n' +
    '    imports: [\n' +
    '        ClrAddonsModule,\n' +
    '        ...\n' +
    '     ],\n' +
    '     declarations: [ AppComponent ],\n' +
    '     bootstrap: [ AppComponent ]\n' +
    '})\n' +
    'export class AppModule { }'

  public currentYear(): number {
    return new Date().getFullYear();
  }
}
