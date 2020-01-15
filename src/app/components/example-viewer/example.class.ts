export class Example {
  private _HTMLFile;
  private _SCSSFile;
  private _TSFile;
  generatedURL;

  constructor(public component,
              public url,
              public title) {
    const transformedText = this.component.name.replace(/([A-Z]+)/g, "-$1").toLowerCase();
    this.generatedURL = transformedText.substring(1, transformedText.indexOf('-component'));
  }

  get HTMLFile() { return this._HTMLFile };
  set HTMLFile(file) {
    this._HTMLFile = file;
  }

  get SCSSFile() { return this._SCSSFile };
  set SCSSFile(file) {
    this._SCSSFile = file !== '' ? file : '/** No SCSS for this example */';
  }

  get TSFile() { return this._TSFile };
  set TSFile(file) {
    this._TSFile = file;
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
