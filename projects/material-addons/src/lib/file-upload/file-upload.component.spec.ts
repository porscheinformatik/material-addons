import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FileUploadComponent, UploadError } from './file-upload.component';

function createFile(name: string, type = 'text/plain', content = 'test'): File {
  return new File([content], name, { type });
}

function createMockFileList(files: File[]): FileList {
  const fileList: Partial<FileList> = {
    length: files.length,
    item: (index: number) => files[index] ?? null,
  };

  files.forEach((file, index) => {
    Object.defineProperty(fileList, index, {
      value: file,
      enumerable: true,
      configurable: true,
    });
  });

  return fileList as FileList;
}

class MockDataTransfer {
  private readonly _files: File[] = [];

  items = {
    add: (file: File) => {
      this._files.push(file);
    },
  };

  get files(): FileList {
    return createMockFileList(this._files);
  }
}

describe('FileUploadComponent', () => {
  let fixture: ComponentFixture<FileUploadComponent>;
  let component: FileUploadComponent;

  beforeAll(() => {
    Object.defineProperty(globalThis, 'DataTransfer', {
      writable: true,
      configurable: true,
      value: MockDataTransfer,
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show default upload label', () => {
    const content = fixture.debugElement.query(By.css('.upload-file-content'));
    expect(content.nativeElement.textContent).toContain('Upload');
  });

  it('should show custom upload label', () => {
    fixture.componentRef.setInput('text', 'Upload file');
    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('.upload-file-content'));
    expect(content.nativeElement.textContent).toContain('Upload file');
  });

  it('should set accept attribute from accept input', () => {
    fixture.componentRef.setInput('accept', ['pdf', 'PNG']);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input[type="file"]'));
    expect(input.nativeElement.getAttribute('accept')).toBe('.pdf,.png');
  });

  it('should upload a single file and emit fileEmitter', () => {
    const file = createFile('document.pdf', 'application/pdf');
    fixture.componentRef.setInput('accept', ['pdf']);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.fileEmitter, 'emit');

    component.uploadFile([file]);

    expect(emitSpy).toHaveBeenCalledTimes(1);

    const emittedFiles = emitSpy.mock.calls[0][0];
    expect(emittedFiles.length).toBe(1);
    expect(emittedFiles[0].name).toBe('document.pdf');
  });

  it('should replace existing file when multiple is false', () => {
    fixture.componentRef.setInput('multiple', false);
    fixture.componentRef.setInput('accept', ['pdf']);
    fixture.detectChanges();

    component.uploadFile([createFile('first.pdf', 'application/pdf')]);
    component.uploadFile([createFile('second.pdf', 'application/pdf')]);

    expect(component['fileList']().length).toBe(1);
    expect(component['fileList']()[0].name).toBe('second.pdf');
  });

  it('should append files when multiple is true', () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.componentRef.setInput('accept', ['pdf']);
    fixture.detectChanges();

    component.uploadFile([createFile('first.pdf', 'application/pdf')]);
    component.uploadFile([createFile('second.pdf', 'application/pdf')]);

    expect(component['fileList']().length).toBe(2);
    expect(component['fileList']()[0].name).toBe('first.pdf');
    expect(component['fileList']()[1].name).toBe('second.pdf');
  });

  it('should emit ONLY_SINGLE_FILE when multiple is false and more than one file is uploaded', () => {
    const emitSpy = jest.spyOn(component.errorEmitter, 'emit');

    component.uploadFile([createFile('first.pdf', 'application/pdf'), createFile('second.pdf', 'application/pdf')]);

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('ONLY_SINGLE_FILE' satisfies UploadError);
    expect(component['fileList']()).toEqual([]);
  });

  it('should emit FILETYPE_NOT_SUPPORTED for unsupported extension', () => {
    fixture.componentRef.setInput('accept', ['pdf']);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.errorEmitter, 'emit');

    component.uploadFile([createFile('image.png', 'image/png')]);

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('FILETYPE_NOT_SUPPORTED' satisfies UploadError);
    expect(component['fileList']()).toEqual([]);
  });

  it('should allow any file type when accept input is empty', () => {
    const emitSpy = jest.spyOn(component.fileEmitter, 'emit');

    component.uploadFile([createFile('image.png', 'image/png')]);

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(component['fileList']().length).toBe(1);
    expect(component['fileList']()[0].name).toBe('image.png');
  });

  it('should show single file name when multiple is false and one file is uploaded', () => {
    fixture.componentRef.setInput('multiple', false);
    fixture.componentRef.setInput('accept', ['pdf']);
    fixture.detectChanges();

    component.uploadFile([createFile('single.pdf', 'application/pdf')]);
    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('.upload-file-content'));
    expect(content.nativeElement.textContent).toContain('single.pdf');
  });

  it('should render file list when showFileList is true', () => {
    fixture.componentRef.setInput('showFileList', true);
    fixture.componentRef.setInput('multiple', true);
    fixture.componentRef.setInput('accept', ['pdf']);
    fixture.detectChanges();

    component.uploadFile([createFile('first.pdf', 'application/pdf'), createFile('second.pdf', 'application/pdf')]);
    fixture.detectChanges();

    const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
    expect(chips.length).toBe(2);
    expect(chips[0].nativeElement.textContent).toContain('first.pdf');
    expect(chips[1].nativeElement.textContent).toContain('second.pdf');
  });

  it('should remove a file and emit updated file list', () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.componentRef.setInput('accept', ['pdf']);
    fixture.detectChanges();

    const first = createFile('first.pdf', 'application/pdf');
    const second = createFile('second.pdf', 'application/pdf');

    component.uploadFile([first, second]);

    const emitSpy = jest.spyOn(component.fileEmitter, 'emit');

    component.remove(first);

    expect(component['fileList']().length).toBe(1);
    expect(component['fileList']()[0].name).toBe('second.pdf');
    expect(emitSpy).toHaveBeenCalledTimes(1);

    const emittedFiles = emitSpy.mock.calls[0][0];
    expect(emittedFiles.length).toBe(1);
    expect(emittedFiles[0].name).toBe('second.pdf');
  });
});
