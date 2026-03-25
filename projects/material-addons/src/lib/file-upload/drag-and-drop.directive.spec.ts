import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DragAndDropDirective } from './drag-and-drop.directive';

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

@Component({
  template: `<div madDragAndDrop (onFileDropped)="onFileDropped($event)"></div>`,
  imports: [DragAndDropDirective],
})
class TestHostComponent {
  onFileDropped = jest.fn();
}

describe('DragAndDropDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let directive: DragAndDropDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    directive = fixture.debugElement.query(By.directive(DragAndDropDirective)).injector.get(DragAndDropDirective);
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should set active styles on drag over', () => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    } as unknown as DragEvent;

    directive.onDragOver(event);
    fixture.detectChanges();

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(directive['backgroundColor']).toBe('$selection-background');
    expect(directive['opacity']).toBe('0.8');
  });

  it('should reset styles on drag leave', () => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    } as unknown as DragEvent;

    directive.onDragOver(event);
    directive.onDragLeave(event);
    fixture.detectChanges();

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(directive['backgroundColor']).toBe('$background-color');
    expect(directive['opacity']).toBe('1');
  });

  it('should emit dropped files on drop', () => {
    const files = createMockFileList([createFile('test.pdf', 'application/pdf')]);

    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: { files },
    } as unknown as DragEvent;

    directive.onDrop(event);
    fixture.detectChanges();

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(hostComponent.onFileDropped).toHaveBeenCalledTimes(1);

    const emittedFiles = hostComponent.onFileDropped.mock.calls[0][0] as FileList;
    expect(emittedFiles.length).toBe(1);
    expect(emittedFiles[0].name).toBe('test.pdf');
    expect(directive['backgroundColor']).toBe('$background-color');
    expect(directive['opacity']).toBe('1');
  });

  it('should not emit when dropped files list is empty', () => {
    const files = createMockFileList([]);

    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: { files },
    } as unknown as DragEvent;

    directive.onDrop(event);
    fixture.detectChanges();

    expect(hostComponent.onFileDropped).not.toHaveBeenCalled();
  });

  it('should not emit when dataTransfer is missing', () => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: undefined,
    } as unknown as DragEvent;

    directive.onDrop(event);
    fixture.detectChanges();

    expect(hostComponent.onFileDropped).not.toHaveBeenCalled();
  });
});
