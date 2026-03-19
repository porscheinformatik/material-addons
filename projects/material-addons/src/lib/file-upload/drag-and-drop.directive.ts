import { Directive, HostBinding, HostListener, output } from '@angular/core';

@Directive({
  selector: '[madDragAndDrop]',
})
export class DragAndDropDirective {
  @HostBinding('style.background-color')
  protected backgroundColor = '$background-color';

  @HostBinding('style.opacity')
  protected opacity = '1';

  onFileDropped = output<FileList>();

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.backgroundColor = '$selection-background';
    this.opacity = '0.8';
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.resetStyles();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.resetStyles();

    const files = event.dataTransfer?.files;
    if (files?.length > 0) {
      this.onFileDropped.emit(files);
    }
  }

  private resetStyles(): void {
    this.backgroundColor = '$background-color';
    this.opacity = '1';
  }
}
