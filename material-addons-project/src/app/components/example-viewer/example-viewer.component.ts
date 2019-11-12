import {Component, Input, OnInit } from '@angular/core';
import {ComponentPortal} from "@angular/cdk/portal";
import {HttpClient} from "@angular/common/http";
import {Example} from "./example.class";


@Component({
  selector: 'example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.scss']
})
export class ExampleViewerComponent {
  /** String key of the currently displayed example. */
  private exampleBaseURL = 'app/example-components';
  _example: Example;
  selectedPortal : ComponentPortal<any>;
  showSource = false;
  tabNames = ['html', 'ts', 'scss'];

  @Input()
  get example() { return this._example; }
  set example(example) {
    this._example = example;
    this.selectedPortal = new ComponentPortal(this._example.component);
    for (const tabName of this.tabNames) {
      this.fetchDocument(`${this.exampleBaseURL}/${this._example.url}/${this._example.url}.component.${tabName}`, tabName);
    }
  }
  constructor(private _http: HttpClient) { }

  toggleSourceView() {
    this.showSource = !this.showSource;
  }
  /** Fetch a document by URL. */
  private fetchDocument(url: string, ending: string) {
    this._http.get(url, {responseType: 'text'}).subscribe(
      document => this._example.setFile(document, ending),
      error => console.log(error)
    );
  }
  copySource() {
    console.log('TODO: need to be implemented!')
  }
}
