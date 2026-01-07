import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[madDragAndDrop]',
  standalone: true,
})
export class DragAndDropDirectiveDirective {
  @Output()
  onFileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') background = '$background-color';
  @HostBinding('style.opacity') opacity = '1';

  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '$selection-background';
    this.opacity = '0.8';
  }

  //Dragleave listener
  @HostListener('dragleave', ['$event']) onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '$background-color';
    this.opacity = '1';
  }

  //Drop listener
  @HostListener('drop', ['$event'])
  public ondrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '$background-color';
    this.opacity = '1';
    let files = event.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }
}
