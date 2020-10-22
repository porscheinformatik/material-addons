export class Example {
  private exampleHTMLFile: string;
  private exampleSCSSFile: string;
  private exampleTSFile: string;

  constructor(public component: any, public url: string, public title: string) {}

  get HTMLFile(): string {
    return this.exampleHTMLFile;
  }
  set HTMLFile(file) {
    this.exampleHTMLFile = file;
  }

  get SCSSFile(): string {
    return this.exampleSCSSFile;
  }
  set SCSSFile(file) {
    this.exampleSCSSFile = file !== '' ? file : '/** No SCSS for this example */';
  }

  get TSFile(): string {
    return this.exampleTSFile;
  }
  set TSFile(file) {
    this.exampleTSFile = file;
  }

  setFile(doc: string, ending: string): void {
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
  getFile(ending: string): string {
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
