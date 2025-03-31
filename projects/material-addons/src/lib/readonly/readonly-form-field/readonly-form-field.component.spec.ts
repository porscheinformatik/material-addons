import { ReadOnlyFormFieldComponent } from './readonly-form-field.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberFormatService } from '../../numeric-field/number-format.service';
import { ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('ReadOnlyFormFieldComponent', () => {
  let component: ReadOnlyFormFieldComponent;
  let fixture: ComponentFixture<ReadOnlyFormFieldComponent>;
  let numberFormatService: NumberFormatService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadOnlyFormFieldComponent, NoopAnimationsModule],
      providers: [
        NumberFormatService,
        Renderer2,
        ChangeDetectorRef,
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadOnlyFormFieldComponent);
    component = fixture.componentInstance;
    numberFormatService = TestBed.inject(NumberFormatService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fallback to dash if value is not set', () => {
    component.value = undefined;
    component.ngOnChanges({});
    expect(component.value).toBe('-');
  });

  it('should format number if formatNumber is true', () => {
    const spy = jest.spyOn(numberFormatService, 'format').mockReturnValue('1,234.00');
    component.value = 1234;
    component.formatNumber = true;
    component.ngOnChanges({});
    expect(spy).toHaveBeenCalled();
    expect(component.value).toBe('1,234.00');
  });

  it('should emit suffixClickedEmitter when suffix icon is clicked', () => {
    const spy = jest.spyOn(component.suffixClickedEmitter, 'emit');
    component.suffix = 'info';
    fixture.detectChanges();
    const suffixIcon = fixture.debugElement.query(By.css('[data-cy="suffix-icon"]'));
    suffixIcon.triggerEventHandler('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should emit prefixClickedEmitter when prefix icon is clicked', () => {
    const spy = jest.spyOn(component.prefixClickedEmitter, 'emit');
    component.prefix = 'info';
    fixture.detectChanges();
    const prefixIcon = fixture.debugElement.query(By.css('[data-cy="prefix-icon"]'));
    prefixIcon.triggerEventHandler('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should compute tooltip text correctly for unit position right', () => {
    component.value = 123;
    component.unit = '%';
    component.unitPosition = 'right';
    const tooltip = component['calculateToolTipText']();
    expect(tooltip).toBe('123 %');
  });

  it('should compute tooltip text correctly for unit position left', () => {
    component.value = 123;
    component.unit = '$';
    component.unitPosition = 'left';
    const tooltip = component['calculateToolTipText']();
    expect(tooltip).toBe('$ 123');
  });
});
