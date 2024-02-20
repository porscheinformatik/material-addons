import {BaseQuickListComponent, QuickListItem} from './base-quick-list.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import {ElementRef, QueryList} from '@angular/core';
import {Subject} from 'rxjs';

describe('BaseQuickListComponent', () => {
  let component: BaseQuickListComponent<QuickListItem>;
  let fixture: ComponentFixture<BaseQuickListComponent<QuickListItem>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaseQuickListComponent],
      providers: [
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BaseQuickListComponent<QuickListItem>);
    component = fixture.componentInstance;
    component.formArray = new FormArray([]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should add items as per minItems', () => {
    component.minItems = 3;
    component.ngOnInit();
    expect(component.allItems.length).toBe(3);
  });

  it('addItem should add a new item and emit added event', () => {
    const addedSpy = jest.spyOn(component.added, 'emit');
    component.addItem();
    expect(component.allItems.length).toBe(1);
    expect(addedSpy).toHaveBeenCalledTimes(1);
    expect(addedSpy).toHaveBeenCalledWith(component.allItems[0]);
  });

  it('removeItem should remove an item and emit removed event', () => {
    const item = { id: '1' };
    component.allItems.push(item);
    const removedSpy = jest.spyOn(component.removed, 'emit');
    component.removeItem(item);
    expect(component.allItems).not.toContain(item);
    expect(removedSpy).toHaveBeenCalledTimes(1);
    expect(removedSpy).toHaveBeenCalledWith(item);
  });

  it('isAddAllowed and isDeleteAllowed should work properly with different maxItems and minItems', () => {
    component.maxItems = 3;
    component.minItems = 1;
    expect(component.isAddAllowed()).toBeTruthy();
    expect(component.isDeleteAllowed()).toBeFalsy();
    component.allItems.push({ id: '1' }, { id: '2' }, { id: '3' });
    expect(component.isAddAllowed()).toBeFalsy();
    expect(component.isDeleteAllowed()).toBeTruthy();
  });

  it('ngAfterViewInit should call setFocusOnAdd', () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(component, 'setFocusOnAdd');
    component.ngAfterViewInit();
    jest.advanceTimersByTime(1);

    expect(spy).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('ngAfterViewInit should call setFocusOnAdd and set focus to another query item', () => {
    jest.useFakeTimers();
    const change = new Subject();
    const spy = jest.spyOn(component, 'setFocusOnAdd');
    const fakeQueryList = {
      changes: change.asObservable(),
      length: 1,
      last: { nativeElement: { querySelector: jest.fn().mockImplementation(() => ({ focus: jest.fn() })) } }
    } as unknown as QueryList<ElementRef>;
    const fakeQueryList2 = {
      changes: change.asObservable(),
      length: 2,
      last: { nativeElement: { querySelector: jest.fn().mockImplementation(() => ({ focus: jest.fn() })) } }
    } as unknown as QueryList<ElementRef>;
    component.itemRows = fakeQueryList;
    component.ngAfterViewInit();
    jest.advanceTimersByTime(1);

    expect(spy).toHaveBeenCalled();
    expect(component.rowCountFocus).toBe(fakeQueryList.length);
    change.next(fakeQueryList2);
    expect(component.rowCountFocus).toBe(fakeQueryList2.length);

    jest.useRealTimers();
  });

  it('isAddReactiveAllowed should return based on maxItems and the formArray controls length', () => {
    component.maxItems = 2;
    component.addPossible = true;
    component.formArray.push(new FormControl());
    expect(component.isAddReactiveAllowed()).toBeTruthy();
    component.formArray.push(new FormControl());
    expect(component.isAddReactiveAllowed()).toBeFalsy();
  });

  it('addReactiveItem should emit when item addition is allowed', () => {
    const spy = jest.spyOn(component.added, 'emit');
    component.maxItems = 2;
    component.addPossible = true;
    component.addReactiveItem();
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('addReactiveItem should not emit when item addition is not allowed', () => {
    const spy = jest.spyOn(component.added, 'emit');
    component.maxItems = 0;
    component.addPossible = false;
    component.addReactiveItem();
    expect(spy).not.toHaveBeenCalled();
  });

  it('isDeleteReactiveAllowed should return true or false based on minItems and the formArray controls length', () => {
    component.minItems = 1;
    component.removePossible = true;
    component.formArray.push(new FormControl());
    component.formArray.push(new FormControl());
    expect(component.isDeleteReactiveAllowed()).toBeTruthy();
    component.formArray.removeAt(1);
    expect(component.isDeleteReactiveAllowed()).toBeFalsy();
  });

  it('removeReactiveItem should remove and emit when item deletion is allowed', () => {
    const formControl = new FormControl();
    component.formArray.push(formControl);
    const spy = jest.spyOn(component.removed, 'emit');
    component.removePossible = true;
    component.removeReactiveItem(formControl);
    expect(component.formArray.controls).not.toContain(formControl);
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('removeReactiveItem should not remove or emit when item deletion is not allowed', () => {
    const formControl = new FormControl();
    component.formArray.push(formControl);
    const spy = jest.spyOn(component.removed, 'emit');
    component.removePossible = false;
    component.removeReactiveItem(formControl);
    expect(component.formArray.controls).toContain(formControl);
    expect(spy).not.toHaveBeenCalled();
  });
});
