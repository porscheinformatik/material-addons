export class Example {
  private exampleHTMLFile;
  private exampleSCSSFile;
  private exampleTSFile;

  // TODO: find types
  constructor(public component: any, public url: string, public title: string) {}

  get HTMLFile() {
    return this.exampleHTMLFile;
  }
  set HTMLFile(file) {
    this.exampleHTMLFile = file;
  }

  get SCSSFile() {
    return this.exampleSCSSFile;
  }
  set SCSSFile(file) {
    this.exampleSCSSFile = file !== '' ? file : '/** No SCSS for this example */';
  }

  get TSFile() {
    return this.exampleTSFile;
  }
  set TSFile(file) {
    this.exampleTSFile = file;
  }

  setFile(doc, ending) {
    switch (ending) {
      case 'ts':
        this.TSFile = doc;
        break;
      case 'scss':
        this.SCSSFile = doc;
        break;
      default:
        this.HTMLFile = doc;
        break;
    }
  }
  getFile(ending) {
    switch (ending) {
      case 'ts':
        return this.TSFile;
      case 'scss':
        return this.SCSSFile;
      default:
        return this.HTMLFile;
    }
  }
}
