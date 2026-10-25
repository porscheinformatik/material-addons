import { Renderer2 } from '@angular/core';

type UnitPosition = 'left' | 'right';

export interface NumericFieldUnitOptions {
  unit: string | null;
  unitPosition: UnitPosition;
  textAlign: UnitPosition;
  text: string;
}

export interface NumericFieldLabelState {
  id: string | null | undefined;
  floating: boolean;
}

interface UnitLayout {
  text: string;
  font: string;
  fontSize: string;
  letterSpacing: string;
  marginTop: string;
  paddingTop: string;
  paddingBottom: string;
  inputWidth: number;
  inputOffset: number;
  paddingLeft: number;
  paddingRight: number;
  outerWidth: number;
  borderLeft: number;
  unitWidth: number;
}

interface UnitPresentation {
  color: string;
  layout?: UnitLayout;
  label?: { element: HTMLElement; width: number; shift: number };
}

interface OwnedStyle {
  property: string;
  value: string;
  priority: string;
  appliedValue: string;
  appliedPriority: string;
}

export class NumericFieldUnitPresentation {
  private options: NumericFieldUnitOptions = { unit: null, unitPosition: 'right', textAlign: 'right', text: '' };
  private resizeObserver?: ResizeObserver;
  private labelStyles?: { element: HTMLElement; properties: OwnedStyle[]; shift: number };
  private inputReservation?: OwnedStyle[];
  private textSpan?: HTMLSpanElement;
  private unitSpan?: HTMLSpanElement;
  private unitSpanPosition?: UnitPosition;
  private layoutDirty = true;

  constructor(
    private readonly inputElement: HTMLInputElement,
    private readonly renderer: Renderer2,
    private readonly onResize: () => void,
  ) {}

  invalidateLayout(): void {
    this.layoutDirty = true;
  }

  destroy(): void {
    this.removeUnitSpan();
    this.removeTextSpan();
  }

  render(options: NumericFieldUnitOptions, label: NumericFieldLabelState): void {
    if (
      this.options.unit !== options.unit ||
      this.options.unitPosition !== options.unitPosition ||
      this.options.textAlign !== options.textAlign ||
      this.options.text !== options.text ||
      (!!options.unit && !this.unitSpan)
    ) {
      this.updateUnit(options);
    }
    // Restoring natural sizing and applying measured text depend on intervening
    // DOM reads. The directive deliberately schedules the whole transaction as mixedReadWrite.
    const presentation = this.measurePresentation(label);
    const layout = this.applyPresentation(presentation);
    this.positionTrailingUnit(layout);
  }

  private updateUnit(options: NumericFieldUnitOptions): void {
    this.options = options;
    this.layoutDirty = true;
    if (!this.options.unit) {
      this.removeUnitSpan();
      return;
    }

    if (!this.unitSpan || this.unitSpanPosition !== this.options.unitPosition) {
      this.createUnitSpan();
    }

    if (!this.unitSpan) {
      return;
    }

    if (this.options.textAlign !== 'left' || this.options.unitPosition !== 'right' || this.options.text === '') {
      this.restoreInputReservation();
    }
    this.observeUnitSize();
    this.unitSpan.textContent = this.options.unit;

    if (this.options.textAlign === 'left' && this.options.unitPosition === 'right') {
      this.unitSpan.style.display = this.options.text !== '' ? 'unset' : 'none';
      this.unitSpan.style.position = 'absolute';
    } else {
      this.unitSpan.style.display = '';
      this.unitSpan.style.left = '';
      this.unitSpan.style.position = '';
    }
  }

  private createUnitSpan(): void {
    const unitContainer = this.getUnitContainer();

    if (!unitContainer) {
      return;
    }

    this.removeUnitSpan();
    this.unitSpan = this.renderer.createElement('span') as HTMLSpanElement;
    this.unitSpanPosition = this.options.unitPosition;
    this.renderer.addClass(this.unitSpan, 'mad-numeric-field-unit');

    // Native compatibility spans; these attributes do not instantiate Material directives.
    if (this.options.unitPosition === 'left') {
      this.renderer.setAttribute(this.unitSpan, 'matPrefix', '');
      this.renderer.setAttribute(this.unitSpan, 'matTextPrefix', '');
      this.renderer.setStyle(this.unitSpan, 'padding-right', '5px');
      this.renderer.insertBefore(unitContainer, this.unitSpan, this.getUnitInsertReference(unitContainer));
    } else {
      this.renderer.setAttribute(this.unitSpan, 'matSuffix', '');
      this.renderer.setAttribute(this.unitSpan, 'matTextSuffix', '');
      this.renderer.setStyle(this.unitSpan, 'padding-left', '5px');
      this.renderer.appendChild(unitContainer, this.unitSpan);
    }
  }

  private getUnitContainer(): HTMLElement | null {
    const materialFormFieldFlex = this.inputElement.closest('.mat-mdc-form-field-flex');

    if (materialFormFieldFlex instanceof HTMLElement) {
      return materialFormFieldFlex;
    }

    return this.inputElement.parentElement;
  }

  private getUnitInsertReference(unitContainer: HTMLElement): HTMLElement | null {
    if (this.inputElement.parentElement?.parentElement === unitContainer) {
      return this.inputElement.parentElement;
    }

    if (this.inputElement.parentElement === unitContainer) {
      return this.inputElement;
    }

    return null;
  }

  private measurePresentation(label: NumericFieldLabelState): UnitPresentation | undefined {
    if (!this.unitSpan) {
      return undefined;
    }

    // Measure the consumer's authored width, including responsive CSS, before
    // reserving space. Restoration and reapplication finish in this render, so
    // the observed border box stays unchanged and no intermediate style paints.
    if (this.layoutDirty) {
      this.restoreInputReservation();
    }
    const view = this.inputElement.ownerDocument.defaultView;
    if (!view) {
      return undefined;
    }
    const inputStyles = view.getComputedStyle(this.inputElement);
    const restingLabel = this.readRestingLabel(label);
    const refreshLayout = this.layoutDirty;
    this.layoutDirty = false;

    if (!refreshLayout || this.options.textAlign !== 'left' || this.options.unitPosition !== 'right' || !this.inputElement.parentElement) {
      return { color: inputStyles.color, label: restingLabel };
    }

    const parentStyles = view.getComputedStyle(this.inputElement.parentElement);
    const offsetParent = this.unitSpan.offsetParent;
    const inputBounds = this.inputElement.getBoundingClientRect();
    const inputOffset =
      offsetParent instanceof HTMLElement ? inputBounds.left - offsetParent.getBoundingClientRect().left - offsetParent.clientLeft : 0;
    return {
      color: inputStyles.color,
      label: restingLabel,
      layout: {
        text: this.options.text,
        font: inputStyles.font,
        fontSize: inputStyles.fontSize,
        letterSpacing: inputStyles.letterSpacing,
        marginTop: parentStyles.getPropertyValue('border-top-width'),
        paddingTop: parentStyles.getPropertyValue('padding-top'),
        paddingBottom: parentStyles.getPropertyValue('padding-bottom'),
        inputWidth: this.inputElement.clientWidth,
        inputOffset,
        paddingLeft: Number.parseFloat(inputStyles.paddingLeft) || 0,
        paddingRight: Number.parseFloat(inputStyles.paddingRight) || 0,
        outerWidth:
          inputBounds.width ||
          this.inputElement.clientWidth +
            (Number.parseFloat(inputStyles.borderLeftWidth) || 0) +
            (Number.parseFloat(inputStyles.borderRightWidth) || 0),
        borderLeft: Number.parseFloat(inputStyles.borderLeftWidth) || 0,
        unitWidth: this.unitSpan.clientWidth,
      },
    };
  }

  private applyPresentation(presentation: UnitPresentation | undefined): UnitLayout | undefined {
    if (!presentation || !this.unitSpan) {
      return undefined;
    }

    this.writeRestingLabel(presentation.label);

    // Read the actual input color so filled/outlined themes and native disabled bindings agree.
    if (this.unitSpan.style.color !== presentation.color) {
      this.unitSpan.style.color = presentation.color;
    }
    const layout = presentation.layout;
    if (!layout) {
      return undefined;
    }

    if (layout.text !== '') {
      this.reserveInputSpace(layout);
    }
    this.unitSpan.style.marginTop = layout.marginTop;
    this.unitSpan.style.paddingTop = layout.paddingTop;
    this.unitSpan.style.paddingBottom = layout.paddingBottom;
    this.ensureTextSpan();
    if (this.textSpan) {
      this.textSpan.style.font = layout.font;
      this.textSpan.style.fontSize = layout.fontSize;
      this.textSpan.style.letterSpacing = layout.letterSpacing;
      this.textSpan.textContent = layout.text;
    }
    return layout;
  }

  private positionTrailingUnit(layout: UnitLayout | undefined): void {
    if (!layout || !this.textSpan || !this.unitSpan) {
      return;
    }
    const textWidth = layout.inputWidth - layout.paddingLeft - layout.paddingRight - layout.unitWidth;
    const width = Math.min(textWidth, Math.ceil(this.textSpan.clientWidth));
    this.unitSpan.style.left = `${layout.inputOffset + layout.borderLeft + layout.paddingLeft + Math.max(width, 0)}px`;
  }

  private observeUnitSize(): void {
    const Observer = this.inputElement.ownerDocument.defaultView?.ResizeObserver;
    if (this.resizeObserver || !Observer || !this.unitSpan) {
      return;
    }
    this.resizeObserver = new Observer(() => {
      this.layoutDirty = true;
      this.onResize();
    });
    // Padding changes the content box, not the border box. The parent also
    // detects responsive sizing while the input holds its measured outer width.
    this.resizeObserver.observe(this.inputElement, { box: 'border-box' });
    if (this.inputElement.parentElement) {
      this.resizeObserver.observe(this.inputElement.parentElement);
    }
    this.resizeObserver.observe(this.unitSpan);
  }

  private reserveInputSpace(layout: UnitLayout): void {
    const style = this.inputElement.style;
    this.inputReservation ??= ['width', 'box-sizing', 'padding-right'].map((property) => this.captureStyle(style, property));
    style.setProperty('box-sizing', 'border-box');
    style.setProperty('width', `${layout.outerWidth}px`);
    // unitWidth includes the unit span's existing five-pixel leading gap.
    style.setProperty('padding-right', `${layout.paddingRight + layout.unitWidth}px`);
    // Read back CSSOM declarations so ownership compares browser-canonical values.
    for (const reservation of this.inputReservation) {
      reservation.appliedValue = style.getPropertyValue(reservation.property);
      reservation.appliedPriority = style.getPropertyPriority(reservation.property);
    }
  }

  private restoreInputReservation(): void {
    this.restoreStyles(this.inputElement.style, this.inputReservation ?? []);
    this.inputReservation = undefined;
  }

  private readRestingLabel(label: NumericFieldLabelState): UnitPresentation['label'] {
    const labelId = label.id;
    if (!labelId || label.floating) {
      return undefined;
    }
    const element = this.inputElement.ownerDocument.getElementById(labelId);
    if (!element) {
      return undefined;
    }
    const margin = this.labelStyles?.properties.find((property) => property.property === 'margin-left');
    const previousShift = margin && this.ownsStyle(element.style, margin) ? (this.labelStyles?.shift ?? 0) : 0;
    return {
      element,
      width: this.inputElement.clientWidth,
      shift:
        this.options.unitPosition === 'left'
          ? previousShift + this.inputElement.getBoundingClientRect().left - element.getBoundingClientRect().left
          : 0,
    };
  }

  private writeRestingLabel(label: UnitPresentation['label']): void {
    if (this.labelStyles?.element !== label?.element) {
      this.restoreLabelStyles();
    }
    if (!label) {
      return;
    }
    if (!this.labelStyles) {
      this.labelStyles = {
        element: label.element,
        properties: [this.captureStyle(label.element.style, 'max-width')],
        shift: 0,
      };
    }
    const style = label.element.style;
    if (this.options.unitPosition === 'left' && !this.labelStyles.properties.some(({ property }) => property === 'margin-left')) {
      this.labelStyles.properties.push(this.captureStyle(style, 'margin-left'));
    }
    // Keep newer consumer declarations as the restoration baseline, including
    // priority-only changes. Right units never take ownership of margin-left.
    for (const property of this.labelStyles.properties) {
      if (!this.ownsStyle(style, property)) {
        property.value = style.getPropertyValue(property.property);
        property.priority = style.getPropertyPriority(property.property);
      }
    }
    // Material owns truncation and floating transforms. Limit only the resting
    // label to the input's available space, using its public label relationship.
    style.setProperty('max-width', `${label.width}px`);
    if (this.options.unitPosition === 'left') {
      this.labelStyles.shift = label.shift;
      const margin = this.labelStyles.properties.find(({ property }) => property === 'margin-left');
      style.setProperty('margin-left', `calc(${margin?.value || '0px'} + ${label.shift}px)`);
    }
    for (const property of this.labelStyles.properties) {
      property.appliedValue = style.getPropertyValue(property.property);
      property.appliedPriority = style.getPropertyPriority(property.property);
    }
  }

  private restoreLabelStyles(): void {
    if (this.labelStyles) {
      this.restoreStyles(this.labelStyles.element.style, this.labelStyles.properties);
      this.labelStyles = undefined;
    }
  }

  private captureStyle(style: CSSStyleDeclaration, property: string): OwnedStyle {
    return {
      property,
      value: style.getPropertyValue(property),
      priority: style.getPropertyPriority(property),
      appliedValue: '',
      appliedPriority: '',
    };
  }

  private ownsStyle(style: CSSStyleDeclaration, snapshot: OwnedStyle): boolean {
    return (
      style.getPropertyValue(snapshot.property) === snapshot.appliedValue &&
      style.getPropertyPriority(snapshot.property) === snapshot.appliedPriority
    );
  }

  private restoreStyles(style: CSSStyleDeclaration, snapshots: OwnedStyle[]): void {
    for (const snapshot of snapshots) {
      if (!this.ownsStyle(style, snapshot)) {
        continue;
      }
      if (snapshot.value) {
        style.setProperty(snapshot.property, snapshot.value, snapshot.priority);
      } else {
        style.removeProperty(snapshot.property);
      }
    }
  }

  private ensureTextSpan(): void {
    if (this.textSpan) {
      return;
    }

    const document = this.inputElement.ownerDocument;
    this.textSpan = document.createElement('span');
    document.body.appendChild(this.textSpan);
    this.textSpan.style.height = 'auto';
    this.textSpan.style.width = 'auto';
    this.textSpan.style.position = 'absolute';
    this.textSpan.style.top = '0';
    this.textSpan.style.whiteSpace = 'nowrap';
    this.textSpan.style.visibility = 'hidden';
  }

  private removeUnitSpan(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.restoreLabelStyles();
    this.restoreInputReservation();
    if (!this.unitSpan) {
      return;
    }

    this.unitSpan.remove();
    this.unitSpan = undefined;
    this.unitSpanPosition = undefined;
  }

  private removeTextSpan(): void {
    if (!this.textSpan) {
      return;
    }

    this.textSpan.remove();
    this.textSpan = undefined;
  }
}
