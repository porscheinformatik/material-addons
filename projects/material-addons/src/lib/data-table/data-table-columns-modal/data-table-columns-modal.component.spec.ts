import { DataTableColumnsModalComponent } from './data-table-columns-modal.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DataTableColumn } from '../data-table-column';

describe('DataTableColumnsModalComponent', () => {
  let component: DataTableColumnsModalComponent;
  let dialogRefMock: any;
  let dialogDataMock: any;

  beforeEach(() => {
    dialogRefMock = { close: jest.fn() };
    dialogDataMock = {
      definition: { displayedColumns: [], id: '1' },
      allColumns: [
        { id: '1', label: 'Test Column 1', dataPropertyName: 'test1' },
        { id: '2', label: 'Test Column 2', dataPropertyName: 'test2' },
      ],
    };
    component = new DataTableColumnsModalComponent(dialogRefMock, dialogDataMock);
  });

  it('should initialize available columns based on definition and allColumns', () => {
    const clearFilterValueSpy = jest.spyOn(component, 'clearFilterValue');
    component.ngOnInit();
    expect(component.selectedColumns).toEqual([]);
    expect(component.availableColumns).toEqual([
      { id: '1', label: 'Test Column 1', dataPropertyName: 'test1' },
      { id: '2', label: 'Test Column 2', dataPropertyName: 'test2' },
    ]);
    expect(component.filteredAvailableColumns).toEqual([
      { id: '1', label: 'Test Column 1', dataPropertyName: 'test1' },
      { id: '2', label: 'Test Column 2', dataPropertyName: 'test2' },
    ]);
    expect(clearFilterValueSpy).toHaveBeenCalled();
  });

  it('should initialize selected columns based on definition and allColumns', () => {
    const clearFilterValueSpy = jest.spyOn(component, 'clearFilterValue');
    dialogDataMock.definition =  { displayedColumns: [{ id: '1', label: 'Test Column 1', dataPropertyName: 'test1' }], id: '1', label: 'firstDefinition' };
    component.ngOnInit();
    expect(component.selectedColumns).toEqual([{ id: '1', label: 'Test Column 1', dataPropertyName: 'test1' }]);
    expect(component.availableColumns).toEqual([{ id: '2', label: 'Test Column 2', dataPropertyName: 'test2' }]);
    expect(component.filteredAvailableColumns).toEqual(component.availableColumns);
    expect(clearFilterValueSpy).toHaveBeenCalled();
  });

  it('should be able to handle drag and drop', () => {
    const previousContainerData: DataTableColumn[] = [
      { id: '2', label: 'Test Column 2', dataPropertyName: 'test2' },
      { id: '3', label: 'Test Column 3', dataPropertyName: 'test3' },
    ];
    const containerData: DataTableColumn[] = [];
    const event: any = {
      previousContainer: { data: [...previousContainerData] },
      container: { data: containerData },
      currentIndex: 1,
      item: {
        element: {
          nativeElement: { id: '2' },
        },
      },
    };
    const clearFilterValueSpy = jest.spyOn(component, 'clearFilterValue');
    component.onDrop(event as CdkDragDrop<DataTableColumn[]>);

    expect(event.previousContainer.data).toEqual([previousContainerData[1]]);
    expect(event.container.data).toEqual([previousContainerData[0]]);
    expect(clearFilterValueSpy).toHaveBeenCalled();
  });

  it('should be able to handle drag and drop with equal containers', () => {
    const containerData: any = {
      data: [
        { id: '2', label: 'Test Column 2', dataPropertyName: 'test2' },
        { id: '3', label: 'Test Column 3', dataPropertyName: 'test3' },
      ],
    };
    const event: any = {
      previousContainer: containerData,
      container: containerData,
      currentIndex: 0,
      previousIndex: 1,
      item: {
        element: {
          nativeElement: { id: '2' },
        },
      },
    };
    const clearFilterValueSpy = jest.spyOn(component, 'clearFilterValue');
    component.onDrop(event as CdkDragDrop<DataTableColumn[]>);
    expect(event.container.data).toEqual([
      { id: '3', label: 'Test Column 3', dataPropertyName: 'test3' },
      { id: '2', label: 'Test Column 2', dataPropertyName: 'test2' },
    ]);
    expect(clearFilterValueSpy).not.toHaveBeenCalled();
  });

  it('should be able to close dialog with data on save', () => {
    component.ngOnInit();
    component.onSave();
    expect(dialogRefMock.close).toHaveBeenCalledWith({
      action: 'SAVE',
      definition: component.definition,
    });
  });

  it('should be able to close dialog with data on delete', () => {
    component.onDelete();
    expect(dialogRefMock.close).toHaveBeenCalledWith({
      action: 'DELETE',
      definition: component.definition,
    });
  });

  it('should be able to just close dialog onCancel', () => {
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should filter available columns when updateFilterValue is called', () => {
    component.ngOnInit();
    component.searchFilter = 'Test Column 1';
    component.updateFilterValue();
    expect(component.filteredAvailableColumns).toEqual([{ id: '1', label: 'Test Column 1', dataPropertyName: 'test1' }]);
  });

  it('should return available columns when updateFilterValue is called with empty filter', () => {
    component.ngOnInit();
    component.searchFilter = '';
    component.updateFilterValue();
    expect(component.filteredAvailableColumns).toEqual(component.availableColumns);
  });

  it('should clear the filter and reset filtered available columns', () => {
    component.clearFilterValue();
    expect(component.searchFilter).toBe('');
    expect(component.filteredAvailableColumns).toEqual(component.availableColumns);
  });
});
