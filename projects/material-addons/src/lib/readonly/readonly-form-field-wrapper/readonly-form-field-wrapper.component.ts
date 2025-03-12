import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { ReadOnlyFormFieldComponent } from '../readonly-form-field/readonly-form-field.component';
import { NgIf } from '@angular/common';
import { ObserversModule } from '@angular/cdk/observers';

/**
 * Wraps a mat-form-field to replace it by a readOnly representation if necessary
 *
 * @author Stefan Laesser
 */
@Component({
  selector: 'mad-readonly-form-field-wrapper',
  templateUrl: './readonly-form-field-wrapper.component.html',
  styleUrls: ['./readonly-form-field-wrapper.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  imports: [NgIf, ReadOnlyFormFieldComponent, ObserversModule],
})
export class ReadOnlyFormFieldWrapperComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {
  @ViewChild('contentWrapper', { static: false })
  originalContent: ElementRef;
  @ViewChild('readOnlyContentWrapper', { static: false })
  readOnlyContentWrapper: ElementRef;

  /**
   * If set to "false", the contained mat-form-field is rendered in all it's glory.
   * If set to "true", a readonly representation of the value is shown using the mat-form-fields label.
   */
  @Input() readonly = true;

  /**
   * This input *MUST MATCH* the mat-form-field value to ensure correct data
   * binding and formatting of readOnly representation!
   */
  @Input('value') value?: any;

  @Input('textAlign') textAlign: 'right' | 'left' = 'left';
  @Input('formatNumber') formatNumber = false;
  @Input('decimalPlaces') decimalPlaces = 2;
  @Input('roundDisplayValue') roundValue = false;
  @Input('autofillDecimals') autofillDecimals = false;
  @Input('unit') unit: string | null = null;
  @Input('unitPosition') unitPosition: 'right' | 'left' = 'left';
  @Input('errorMessage') errorMessage: string | null = null;
  @Input() id: string;
  /**
   * If set to "false", a readonly input will be rendered.
   * If set to "true", a readonly textarea will be rendered instead.
   */
  @Input() multiline = false;

  /**
   * Defines the rows for the readonly textarea.
   */
  @Input() rows: number;

  /**
   * If shrinkIfEmpty is set to "false", nothing changes
   * If set to "true" and multiline is also "true", the textarea will
   * shrink to one row, if value is empty/null/undefined.
   * Otherwise, the defined rows-value will be used
   */
  @Input() shrinkIfEmpty = false;
  @Input() hideIconInReadOnlyMode = false;
  /**
   * suffix iocon
   */
  @Input() suffix: string;
  /**
   * prefix iocon
   */
  @Input() prefix: string;
  /**
   * if cdkTextareaAutosize is active for textareas
   */
  @Input() multilineAutoSize = false;
  @Output() suffixClickedEmitter = new EventEmitter();
  @Output() prefixClickedEmitter = new EventEmitter();

  /**
   * Automatically taken from the contained <mat-label>
   */
  label: string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private rootFormGroup: FormGroupDirective,
  ) {}

  ngOnInit(): void {
    this.doRendering();
  }

  ngAfterViewInit(): void {
    this.doRendering();
    this.extractValue();
  }

  ngAfterViewChecked(): void {}

  ngOnChanges(_: SimpleChanges): void {
    this.doRendering();
  }

  getLabel(): string {
    if (!this.label) {
      this.extractLabel();
    }
    return this.label;
  }

  suffixClicked() {
    this.suffixClickedEmitter.emit(null);
  }

  prefixClicked() {
    this.prefixClickedEmitter.emit(null);
  }

  onContentChange(): void {
    this.extractLabel();
    this.extractValue();
  }

  private doRendering(): void {
    if (!this.originalContent) {
      return;
    }
    if (!this.readonly) {
      this.correctWidth();
      return;
    }

    this.changeDetector.detectChanges();
  }

  private extractLabel(): void {
    if (!this.originalContent || !this.originalContent.nativeElement) {
      return null;
    }
    const labelElement = this.originalContent.nativeElement.querySelector('mat-label');
    this.label = labelElement ? labelElement.innerHTML : 'mat-label is missing!';
  }

  private extractValue(): void {
    if (this.value) {
      return;
    }
    const form = this.rootFormGroup.form;
    if (!this.originalContent || !this.originalContent.nativeElement) {
      return;
    }
    const input = this.originalContent?.nativeElement?.querySelector('input');
    if (!input) {
      return;
    }
    const formControlName = input.getAttribute('formControlName');
    if (!formControlName) {
      return;
    }
    if (form && form.get(formControlName)) {
      this.value = form.get(formControlName).getRawValue();
    }
  }

  private correctWidth(): void {
    const formField = this.originalContent.nativeElement.querySelector('mat-form-field');
    if (formField) {
      formField.setAttribute('style', 'width:100%');
    }
  }
}
