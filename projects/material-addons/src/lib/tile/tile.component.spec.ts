import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TileComponent } from './tile.component';

describe('TileComponent', () => {
  let fixture: ComponentFixture<TileComponent>;
  let component: TileComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TileComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Tile label');
    fixture.detectChanges();
  });

  function getTileElement(): HTMLElement {
    return fixture.debugElement.query(By.css('.tile')).nativeElement;
  }

  function getLabelElement(): HTMLElement {
    return fixture.debugElement.query(By.css('.tile__label')).nativeElement;
  }

  function getIconElement(): HTMLElement | null {
    return fixture.debugElement.query(By.css('.tile__icon'))?.nativeElement ?? null;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(getLabelElement().textContent?.trim()).toBe('Tile label');
  });

  it('should use info variant by default', () => {
    const tile = getTileElement();

    expect(tile.classList.contains('tile--info')).toBe(true);
    expect(tile.classList.contains('tile--success')).toBe(false);
    expect(tile.classList.contains('tile--error')).toBe(false);
    expect(tile.classList.contains('tile--warning')).toBe(false);
  });

  it('should use md size by default', () => {
    const tile = getTileElement();

    expect(tile.classList.contains('tile--md')).toBe(true);
    expect(tile.classList.contains('tile--sm')).toBe(false);
    expect(tile.classList.contains('tile--lg')).toBe(false);
  });

  it('should not render icon by default', () => {
    expect(getIconElement()).toBeNull();
  });

  it('should apply success variant class', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();

    const tile = getTileElement();

    expect(tile.classList.contains('tile--success')).toBe(true);
    expect(tile.classList.contains('tile--info')).toBe(false);
  });

  it('should apply error variant class', () => {
    fixture.componentRef.setInput('variant', 'error');
    fixture.detectChanges();

    const tile = getTileElement();

    expect(tile.classList.contains('tile--error')).toBe(true);
    expect(tile.classList.contains('tile--info')).toBe(false);
  });

  it('should apply warning variant class', () => {
    fixture.componentRef.setInput('variant', 'warning');
    fixture.detectChanges();

    const tile = getTileElement();

    expect(tile.classList.contains('tile--warning')).toBe(true);
    expect(tile.classList.contains('tile--info')).toBe(false);
  });

  it('should apply sm size class', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const tile = getTileElement();

    expect(tile.classList.contains('tile--sm')).toBe(true);
    expect(tile.classList.contains('tile--md')).toBe(false);
    expect(tile.classList.contains('tile--lg')).toBe(false);
  });

  it('should apply lg size class', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const tile = getTileElement();

    expect(tile.classList.contains('tile--lg')).toBe(true);
    expect(tile.classList.contains('tile--md')).toBe(false);
    expect(tile.classList.contains('tile--sm')).toBe(false);
  });

  it('should render icon at the start by default when icon is provided', () => {
    fixture.componentRef.setInput('icon', 'update');
    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('.tile__content')).nativeElement as HTMLElement;
    const icon = getIconElement();

    expect(icon).not.toBeNull();
    expect(icon?.textContent?.trim()).toBe('update');
    expect(content.firstElementChild?.classList.contains('tile__icon')).toBe(true);
  });

  it('should render icon at the end when iconPosition is end', () => {
    fixture.componentRef.setInput('icon', 'priority_high');
    fixture.componentRef.setInput('iconPosition', 'end');
    fixture.detectChanges();

    const tile = getTileElement();
    const content = fixture.debugElement.query(By.css('.tile__content')).nativeElement as HTMLElement;
    const icon = getIconElement();

    expect(tile.classList.contains('tile--icon-end')).toBe(true);
    expect(icon).not.toBeNull();
    expect(icon?.textContent?.trim()).toBe('priority_high');
    expect(content.lastElementChild?.classList.contains('tile__icon')).toBe(true);
  });

  it('should not apply tile--icon-end when iconPosition is start', () => {
    fixture.componentRef.setInput('icon', 'update');
    fixture.componentRef.setInput('iconPosition', 'start');
    fixture.detectChanges();

    const tile = getTileElement();

    expect(tile.classList.contains('tile--icon-end')).toBe(false);
  });

  it('should update the label when input changes', () => {
    fixture.componentRef.setInput('label', 'Updated label');
    fixture.detectChanges();

    expect(getLabelElement().textContent?.trim()).toBe('Updated label');
  });
});
