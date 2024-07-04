import { DataTableAction, DataTableColumn, DataTableColumnsModalComponent, DataTableComponent } from './data-table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { ButtonModule } from '../button/button.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, Type } from '@angular/core';
import { exampleColumns } from '../../../../../src/app/example-components/data-table-example-data/data-table-example-columns';
import { exampleData } from '../../../../../src/app/example-components/data-table-example-data/data-table-example-data';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule } from '@angular/forms';
import { MountResponse } from 'cypress/angular';
import { CHILD_ROWS_EXAMPLE_DATA } from '../../../../../src/app/example-components/data-table-child-rows/child-rows-example-data';
import { CHILD_ROW_COLUMNS } from '../../../../../src/app/example-components/data-table-child-rows/child-rows-example-columns';

const DEUTSCH_LANGUAGE = 'de';
const DEUTSCH_TRANSLATIONS = {};

const commonImports = [
  CommonModule,
  NoopAnimationsModule,
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatProgressSpinnerModule,
  ButtonModule,
  TranslateModule,
  MatCheckboxModule,
  MatBadgeModule,
  DragDropModule,
  FormsModule,
  TranslateTestingModule.withTranslations(DEUTSCH_LANGUAGE, DEUTSCH_TRANSLATIONS),
  DataTableComponent,
  DataTableColumnsModalComponent,
];

function mountWrapperComponent(
  component: Type<
    | BasicDataTableWrapperComponent
    | TransformDataTableWrapperComponent
    | SingleModeDataTableWrapperComponent
    | BatchModeDataTableWrapperComponent
    | CustomGeneratorDataTableWrapperComponent
    | ChildRowsDataTableWrapperComponent
  >,
  componentProperties = {},
) {
  return cy.mount(component, {
    declarations: [],
    imports: commonImports,
    providers: [
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
      },
    ],
    componentProperties,
  });
}

@Component({
  template: ` <mad-data-table
    [displayedColumns]="displayedColumns"
    [tableData]="tableData"
    [defaultPageSize]="defaultPageSize"
    [paginationEnabled]="paginationEnabled"
    [filterEnabled]="filterEnabled"
    [noDataText]="noDataText"
    [pageSizeOptions]="pageSizeOptions"
  >
  </mad-data-table>`,
})
class BasicDataTableWrapperComponent {
  displayedColumns: DataTableColumn[] = exampleColumns;
  tableData = exampleData;
  paginationEnabled = false;
  filterEnabled = false;
  noDataText = '';
  pageSizeOptions = [5, 10, 15];
  defaultPageSize = 10;
}

@Component({
  template: ` <mad-data-table
    [displayedColumns]="displayedColumns"
    [tableData]="tableData"
    [defaultPageSize]="10"
    [paginationEnabled]="paginationEnabled"
    [filterEnabled]="filterEnabled"
  >
  </mad-data-table>`,
})
class TransformDataTableWrapperComponent {
  tableData = exampleData;
  paginationEnabled = true;
  filterEnabled = true;
  displayedColumns: DataTableColumn[] = [
    {
      id: 'Title',
      label: 'Title',
      isSortable: true,
      orderByName: 'title',
      dataPropertyName: 'title',
      transformer: TransformDataTableWrapperComponent.translateTitle,
    },
    {
      id: 'Name',
      label: 'Name',
      isSortable: true,
      orderByName: 'name',
      dataPropertyName: 'name',
    },
    {
      id: 'Gender',
      label: 'Gender',
      orderByName: 'gender',
      dataPropertyName: 'gender',
      transformer: TransformDataTableWrapperComponent.genderSymbol,
    },
    {
      id: 'Age',
      label: 'Age',
      orderByName: 'age',
      dataPropertyName: 'age',
      isRightAligned: true,
      isSortable: true,
    },
    {
      id: 'Salary',
      label: 'Salary',
      orderByName: 'salary',
      dataPropertyName: 'salary',
      isRightAligned: true,
      isSortable: true,
    },
    {
      id: 'Email',
      label: 'Email',
      orderByName: 'email',
      dataPropertyName: 'email',
      transformer: TransformDataTableWrapperComponent.uppercase,
    },
    {
      id: 'regDate',
      label: 'Registration Date',
      orderByName: 'registered',
      dataPropertyName: 'registered',
      isRightAligned: true,
    },
  ];

  public static uppercase(value: string): string {
    return ('' + value).toUpperCase();
  }

  public static translateTitle(value: string): string {
    switch (value) {
      case 'Mr':
        return 'Herr';
      default:
        return 'Frau';
    }
  }

  public static genderSymbol(value: string): string {
    return value === 'male' ? '♂' : '♀';
  }
}

@Component({
  template: ` <mad-data-table
    [displayedColumns]="displayedColumns"
    [tableData]="tableData"
    [defaultPageSize]="defaultPageSize"
    [actions]="actions"
    [paginationEnabled]="paginationEnabled"
    [filterEnabled]="filterEnabled"
    (actionEvent)="handleActionEvent($event)"
  >
  </mad-data-table>`,
})
class SingleModeDataTableWrapperComponent {
  displayedColumns: DataTableColumn[] = exampleColumns;
  tableData = exampleData;
  paginationEnabled = true;
  filterEnabled = false;
  defaultPageSize = 10;

  actions: DataTableAction[] = [
    {
      label: 'Edit',
      action: 'EDIT',
      type: 'SINGLE',
    },
    {
      label: 'Delete',
      action: 'DELETE',
      type: 'SINGLE',
    },
    {
      label: 'Create',
      action: 'CREATE',
      type: 'NONE',
    },
    {
      label: 'Create2',
      action: 'CREATE2',
      type: 'NONE',
    },
    {
      label: 'Hidden in batch',
      action: 'HIDDEN_IN_BATCH',
      type: 'NONE',
      hiddenInMode: 'BATCH',
    },
    {
      label: 'Hidden in single',
      action: 'HIDDEN_IN_SINGLE',
      type: 'NONE',
      hiddenInMode: 'SINGLE',
    },
  ];

  handleActionEvent(rowAction: DataTableAction): void {
    console.log(rowAction);
  }
}

@Component({
  template: ` <mad-data-table
    [displayedColumns]="displayedColumns"
    [tableData]="tableData"
    [defaultPageSize]="defaultPageSize"
    [actions]="actions"
    [paginationEnabled]="paginationEnabled"
    [filterEnabled]="filterEnabled"
    [forceMode]="forceMode"
    (actionEvent)="handleActionEvent($event)"
  >
  </mad-data-table>`,
})
class BatchModeDataTableWrapperComponent {
  tableData = exampleData;
  displayedColumns = exampleColumns;
  batchMode = true;
  forceMode = 'BATCH';
  paginationEnabled = true;
  filterEnabled = false;
  defaultPageSize = 10;

  actions: DataTableAction[] = [
    {
      label: 'Create',
      action: 'CREATE',
      type: 'NONE',
    },
    {
      label: 'Edit',
      action: 'EDIT',
      type: 'SINGLE',
    },
    {
      label: 'Delete',
      action: 'DELETE',
      type: 'SINGLE',
      hiddenInMode: 'BATCH',
    },
    {
      label: 'Delete selected',
      action: 'DELETE',
      type: 'BATCH',
    },
    {
      label: 'Export selected',
      action: 'EXPORT',
      type: 'BATCH',
    },
    {
      label: 'Export all',
      action: 'EXPORT_ALL',
      type: 'NONE',
    },
    {
      label: 'Batch selection',
      action: 'BATCH',
      type: 'NONE',
    },
  ];

  handleActionEvent(rowAction: DataTableAction): void {
    console.log(rowAction);
    if (rowAction.action === 'BATCH') {
      this.toggleForceMode();
    }
  }

  toggleForceMode() {
    this.batchMode = !this.batchMode;
    this.forceMode = this.batchMode ? 'BATCH' : 'SINGLE';
  }
}

@Component({
  template: ` <mad-data-table
    [idGenerator]="idGenerator"
    [displayedColumns]="displayedColumns"
    [tableData]="tableData"
    [actions]="actions"
    [paginationEnabled]="paginationEnabled"
    [pageSizeOptions]="[5, 10, 15]"
    [defaultPageSize]="10"
    (actionEvent)="handleActionEvent($event)"
  >
  </mad-data-table>`,
})
class CustomGeneratorDataTableWrapperComponent {
  paginationEnabled = true;
  filterEnabled = true;
  tableData = exampleData;
  displayedColumns = exampleColumns;

  actions: DataTableAction[] = [
    {
      label: 'Edit',
      action: 'EDIT',
      type: 'SINGLE',
    },
  ];

  idGenerator(row: any): string {
    return '' + row.id;
  }

  handleActionEvent(rowAction: DataTableAction): void {
    console.log(rowAction);
  }
}

@Component({
  template: ` <mad-data-table
    [idGenerator]="idGenerator"
    [parentIdGenerator]="parentIdGenerator"
    [displayedColumns]="displayedColumns"
    [tableData]="tableData"
    [actions]="actions"
    [paginationEnabled]="false"
    (actionEvent)="handleActionEvent($event)"
  >
  </mad-data-table>`,
})
class ChildRowsDataTableWrapperComponent {
  tableData = CHILD_ROWS_EXAMPLE_DATA;
  displayedColumns: DataTableColumn[] = CHILD_ROW_COLUMNS;

  actions: DataTableAction[] = [
    {
      label: 'Edit',
      action: 'EDIT',
      type: 'SINGLE',
    },
  ];

  idGenerator(row: any): string {
    return row.id ? row.id : row.addressId;
  }

  parentIdGenerator(row: any): string {
    return row.userId ? row.userId : null;
  }

  handleActionEvent(rowAction: DataTableAction): void {
    console.log(rowAction);
  }
}

function checkTableActionButtonBasicProperties(buttonText: string): void {
  cy.get('@tableActionButtons')
    .find('button')
    .should('be.visible')
    .and('contain.text', buttonText)
    .and('have.class', 'mat-mdc-outlined-button')
    .and('have.attr', 'mat-stroked-button');
}

function checkTableBodyRowContent(rowAccessor: 'first' | 'last', data: any) {
  cy.get('@bodyRows')[rowAccessor]().should('exist').and('be.visible');
  cy.get('@bodyRows')[rowAccessor]().find('td').should('exist').and('be.visible');
  cy.get('@bodyRows')[rowAccessor]().find('td').should('have.length', 8);
  cy.get('@bodyRows')
    [rowAccessor]()
    .find('td')
    .first()
    .should('exist')
    .and('have.class', 'no-action-cell')
    .next()
    .should('contain.text', data.title)
    .and('be.visible')
    .next()
    .should('contain.text', data.name)
    .and('be.visible')
    .next()
    .should('contain.text', data.gender)
    .and('be.visible')
    .next()
    .should('contain.text', data.age)
    .and('be.visible')
    .next()
    .should('contain.text', data.salary)
    .and('be.visible')
    .next()
    .should('contain.text', data.email)
    .and('be.visible')
    .next()
    .should('contain.text', data.registered)
    .and('be.visible');
}

type DataTableActionTestConfig = { name: string; idx?: number; disabled?: boolean };

function checkTableActionBarClassesAndButtonsProperties(buttonsCount: number, config: DataTableActionTestConfig[]) {
  cy.getByCySel('table-action-bar').should('be.visible').and('have.class', 'mad-datatable-action-bar');
  cy.getByCySel('table-action-bar').find('mad-outline-button').as('tableActionButtons');

  // check buttons and classes
  cy.get('@tableActionButtons').should('have.length', `${buttonsCount}`);

  config.forEach((btn) => {
    checkTableActionButtonBasicProperties(btn.name);
    if (btn.disabled) {
      cy.get('@tableActionButtons').eq(btn.idx).should('have.attr', 'ng-reflect-disabled', 'true');
    }
  });
}

function checkRowCheckboxSelected(rowId: number, isSelected: boolean) {
  cy.get('@bodyRows').eq(rowId).find('td').find('mat-checkbox').should('have.attr', 'ng-reflect-checked', `${isSelected}`);
}

describe('data-table.component.cy.ts', () => {
  beforeEach(() => {
    cy.viewport(1280, 750);
  });

  it('should mount the DataTableComponent', () => {
    mountWrapperComponent(BasicDataTableWrapperComponent);
  });

  describe('Basic data table behavior', () => {
    it('should show no data block with custom text if table data is empty', () => {
      mountWrapperComponent(BasicDataTableWrapperComponent, {
        tableData: [],
        noDataText: 'There is no data :(',
      });

      cy.getByCySel('no-data-block').should('have.class', 'noDataText');
      cy.getByCySel('no-data-block').contains('There is no data :(');
    });

    it('should contain proper header content', () => {
      mountWrapperComponent(BasicDataTableWrapperComponent);

      cy.get('table').should('exist').and('be.visible');
      cy.get('table').find('thead').should('be.visible');
      cy.get('thead').find('tr').should('be.visible');

      cy.get('thead').find('tr').find('th').as('tableHeaderCells').should('have.length', 8);
      cy.get('@tableHeaderCells')
        .first()
        .should('exist')
        .and('have.class', 'no-action-cell')
        .next()
        .should('contain.text', exampleColumns[0].label)
        .and('be.visible')
        .next()
        .should('contain.text', exampleColumns[1].label)
        .and('be.visible')
        .next()
        .should('contain.text', exampleColumns[2].label)
        .and('be.visible')
        .next()
        .should('contain.text', exampleColumns[3].label)
        .and('be.visible')
        .next()
        .should('contain.text', exampleColumns[4].label)
        .and('be.visible')
        .next()
        .should('contain.text', exampleColumns[5].label)
        .and('be.visible')
        .next()
        .should('contain.text', exampleColumns[6].label)
        .and('be.visible');
    });

    it('should contain proper body content', () => {
      mountWrapperComponent(BasicDataTableWrapperComponent);

      cy.get('table').should('exist').and('be.visible');
      cy.get('table').find('tbody').should('be.visible');
      cy.get('tbody').find('tr').as('bodyRows');
      cy.get('@bodyRows').should('be.visible').and('have.length', 100);

      // Check first row cells
      checkTableBodyRowContent('first', exampleData[0]);
      // Check last row cells
      checkTableBodyRowContent('last', exampleData[99]);
    });

    it('should not show filter and pagination', () => {
      mountWrapperComponent(BasicDataTableWrapperComponent);

      cy.getByCySel('filter-input').should('not.exist');
      cy.getByCySel('table-bottom-area').should('exist').should('not.be.visible');
      cy.getByCySel('definition-button-block').should('not.be.visible');
      cy.getByCySel('table-bottom-area').find('mat-paginator').should('not.be.visible');
    });

    it('should show table bottom area properly', () => {
      mountWrapperComponent(BasicDataTableWrapperComponent, {
        paginationEnabled: true,
      });
      //check pagination
      cy.getByCySel('table-bottom-area').should('exist').should('be.visible');
      cy.getByCySel('table-bottom-area').find('mat-paginator').should('be.visible');
      cy.get('mat-paginator').should('have.attr', 'ng-reflect-page-size', '10').and('have.attr', 'ng-reflect-page-size-options', '5,10,15');
      // check definition buttons not exist
      cy.getByCySel('definition-button-block').should('be.visible').and('not.contain', 'mad-icon-button');
    });

    it('should show pagination options properly', () => {
      mountWrapperComponent(BasicDataTableWrapperComponent, {
        paginationEnabled: true,
        defaultPageSize: 20,
        pageSizeOptions: [20, 50],
      });
      //check pagination
      cy.getByCySel('table-bottom-area').should('exist').should('be.visible');
      cy.getByCySel('table-bottom-area').find('mat-paginator').should('be.visible');
      cy.get('mat-paginator').should('have.attr', 'ng-reflect-page-size', '20').and('have.attr', 'ng-reflect-page-size-options', '20,50');
      // check definition buttons not exist
      cy.getByCySel('definition-button-block').should('be.visible').and('not.contain', 'mad-icon-button');
    });

    it('should show and apply filter properly', () => {
      mountWrapperComponent(BasicDataTableWrapperComponent, { filterEnabled: true });

      // check filter
      cy.getByCySel('filter-input').should('exist').and('be.visible').and('have.class', 'mat-form-field-appearance-outline');
      // check row count before filtering
      cy.get('tbody').find('tr').as('bodyRows');
      cy.get('@bodyRows').should('be.visible').and('have.length', 100);
      // filter by name and check rows
      cy.getByCySel('filter-input').type('eevi');
      cy.get('@bodyRows').should('be.visible').and('have.length', 1);
      cy.get('@bodyRows').first().contains('Eevi Jarvi');
      // clear input and filter by date
      cy.getByCySel('filter-input').find('input').clear();
      cy.getByCySel('filter-input').type('2016-03-10');
      cy.get('@bodyRows').should('be.visible').and('have.length', 1);
      cy.get('@bodyRows').first().contains('2016-03-10');
    });

    it('should sort data when click on column header (asc/desc)', () => {
      mountWrapperComponent(BasicDataTableWrapperComponent);

      cy.get('table').should('exist').and('be.visible');
      cy.get('table').find('thead').should('be.visible');
      cy.get('thead').find('tr').should('be.visible');

      cy.get('thead').find('tr').find('th').as('tableHeaderCells').should('have.length', 8);
      cy.get('@tableHeaderCells').contains('Age').click(); // turn asc sort
      // check first and last row
      cy.get('tbody').find('tr').as('bodyRows');
      cy.get('@bodyRows').should('be.visible').and('have.length', 100);
      cy.get('@bodyRows').first().should('contain.text', 'Jan Aulie').and('contain.text', '3');
      cy.get('@bodyRows').last().should('contain.text', 'Sarah Graves').and('contain.text', '20');

      cy.get('@tableHeaderCells').contains('Salary').dblclick(); // turn desc sort
      cy.get('@bodyRows').first().should('contain.text', 'Signe Jørgensen').and('contain.text', '89.6213');
      cy.get('@bodyRows').last().should('contain.text', 'Aatu Waisanen').and('contain.text', '1.5358');
    });
  });

  describe('Transformation data table behavior', () => {
    it('should show transformed data (Title, Gender and email)', () => {
      mountWrapperComponent(TransformDataTableWrapperComponent);
      cy.getByCySel('filter-input').should('exist').and('be.visible').and('have.class', 'mat-form-field-appearance-outline');

      cy.get('table').should('exist').and('be.visible');
      cy.get('table').find('thead').should('be.visible');
      cy.get('thead').find('tr').should('be.visible');

      cy.get('tbody').find('tr').as('bodyRows');
      cy.get('@bodyRows').first().find('td').should('have.length', '8');
      cy.get('@bodyRows').first().find('td').eq(1).should('contain.text', 'Herr');
      cy.get('@bodyRows').first().find('td').eq(3).should('contain.text', '♂');
      cy.get('@bodyRows').first().find('td').eq(6).should('contain.text', 'JACOB.SHAW@EXAMPLE.COM');
    });

    it('should filter data by transformed values', () => {
      mountWrapperComponent(TransformDataTableWrapperComponent, {
        paginationEnabled: false,
      });
      // check filter
      cy.getByCySel('filter-input').should('exist').and('be.visible').and('have.class', 'mat-form-field-appearance-outline');
      // check row count before filtering
      cy.get('tbody').find('tr').as('bodyRows');
      cy.get('@bodyRows').should('be.visible').and('have.length', 100);
      // filter by title and check rows
      cy.getByCySel('filter-input').type('Miss');
      cy.getByCySel('no-data-block').should('exist').and('be.visible');
      // clear input and filter by transformed title
      cy.getByCySel('filter-input').find('input').clear();
      cy.getByCySel('filter-input').type('Frau');
      cy.get('@bodyRows').should('be.visible').and('have.length', 56);
      cy.get('@bodyRows').first().contains('Frau');
      // clear input and filter by transformed gender
      cy.getByCySel('filter-input').find('input').clear();
      cy.getByCySel('filter-input').type('♂');
      cy.get('@bodyRows').should('be.visible').and('have.length', 47);
      cy.get('@bodyRows').first().contains('♂');
    });
  });

  describe('SINGLE mode table behavior', () => {
    describe('table actions and filter', () => {
      const singleActionsConfig: DataTableActionTestConfig[] = [{ name: 'Create' }, { name: 'Create2' }, { name: 'Hidden in batch' }];

      it('should contain table actions with provided action buttons', () => {
        mountWrapperComponent(SingleModeDataTableWrapperComponent);
        checkTableActionBarClassesAndButtonsProperties(3, singleActionsConfig);
        cy.get('@tableActionButtons').should('not.contain', 'Hidden in single');
      });

      it('should contain table actions and filter together', () => {
        mountWrapperComponent(SingleModeDataTableWrapperComponent, {
          filterEnabled: true,
        });
        checkTableActionBarClassesAndButtonsProperties(3, singleActionsConfig);
        cy.get('@tableActionButtons').should('not.contain', 'Hidden in single');
        // check filter
        cy.getByCySel('filter-input').should('exist').and('be.visible').and('have.class', 'mat-form-field-appearance-outline');
      });

      it('should emit table action event on click', () => {
        mountWrapperComponent(SingleModeDataTableWrapperComponent).then((response: MountResponse<SingleModeDataTableWrapperComponent>) => {
          cy.spy(response.component, 'handleActionEvent').as('actionEventSpy');
        });

        const expectedTableActionData: DataTableAction = {
          label: 'Create',
          action: 'CREATE',
          type: 'NONE',
          selected: [],
        };
        cy.getByCySel('table-action-bar').find('mad-outline-button').as('tableActionButtons');
        cy.get('@tableActionButtons').first().click();
        cy.get('@actionEventSpy').should('be.calledOnceWith', expectedTableActionData);
      });
    });

    describe('row actions and selection', () => {
      const expectedEditEventData = {
        label: 'Edit',
        action: 'EDIT',
        type: 'SINGLE',
        selected: [
          {
            id: 0,
            title: 'Mr',
            name: 'Jacob Shaw',
            gender: 'male',
            email: 'jacob.shaw@example.com',
            age: 17,
            salary: 88.6463,
            registered: '2005-09-04T03:09:06.480Z',
          },
        ],
      };

      const expectedDeleteEventData = {
        label: 'Delete',
        action: 'DELETE',
        type: 'SINGLE',
        selected: [
          {
            id: 1,
            title: 'Ms',
            name: 'Angela Cortes',
            gender: 'female',
            email: 'angela.cortes@example.com',
            age: 6,
            salary: 32.1336,
            registered: '2016-03-10T12:35:00.807Z',
          },
        ],
      };

      it('should change row bg color on hover', () => {
        mountWrapperComponent(SingleModeDataTableWrapperComponent);

        const initialRowBgColor = 'rgb(255, 255, 255)';
        const hoveredRowBgColor = 'rgba(0, 114, 163, 0.08)';

        cy.get('table').should('exist').and('be.visible');
        cy.get('table').find('tbody').should('be.visible');
        cy.get('tbody').find('tr').as('bodyRows');
        cy.get('@bodyRows').should('be.visible');
        cy.get('@bodyRows').first().should('have.class', 'clickable-table-row');
        cy.get('@bodyRows').first().should('have.css', 'background-color', initialRowBgColor);
        cy.get('@bodyRows').first().realHover().should('have.css', 'background-color', hoveredRowBgColor);
      });

      it('should show row actions button', () => {
        mountWrapperComponent(SingleModeDataTableWrapperComponent);

        cy.get('tbody').find('tr').as('bodyRows');
        cy.get('@bodyRows').first().find('td').first().find('mad-icon-button').contains('more_vert').should('be.visible');
      });

      it('should show row actions when click on button', () => {
        mountWrapperComponent(SingleModeDataTableWrapperComponent);

        cy.get('tbody').find('tr').as('bodyRows');
        cy.getByCySel('row-action-button').first().click();
        cy.getByCySel('row-action-menu-button').should('be.visible').and('have.length', 2);
        cy.getByCySel('row-action-menu-button').first().should('contain.text', 'Edit').next().should('contain.text', 'Delete');
      });

      it('should emit event with selected row data and first action when click on row', () => {
        mountWrapperComponent(SingleModeDataTableWrapperComponent).then((response: MountResponse<SingleModeDataTableWrapperComponent>) => {
          cy.spy(response.component, 'handleActionEvent').as('actionEvent');
        });
        cy.get('tbody').find('tr').as('bodyRows');
        cy.get('@bodyRows').first().click();
        cy.get('@actionEvent').should('be.calledOnceWith', expectedEditEventData);
      });

      it('should emit event with selected row data when click on row action buttons', () => {
        mountWrapperComponent(SingleModeDataTableWrapperComponent).then((response: MountResponse<SingleModeDataTableWrapperComponent>) => {
          cy.spy(response.component, 'handleActionEvent').as('actionEvent');
        });

        //check edit action on first row
        cy.getByCySel('row-action-button').first().click();
        cy.getByCySel('row-action-menu-button').first().click();
        cy.get('@actionEvent').should('be.calledWith', expectedEditEventData);
        cy.getByCySel('row-action-menu-button').should('not.exist'); // should disappear after click
        //check delete action on second row
        cy.getByCySel('row-action-button').eq(1).click();
        cy.getByCySel('row-action-menu-button').next().click();
        cy.get('@actionEvent').should('be.calledWith', expectedDeleteEventData);
      });
    });
  });

  describe('BATCH mode table behavior', () => {
    describe('table actions and filter', () => {
      const batchActionsConfig: DataTableActionTestConfig[] = [
        { name: 'Create', idx: 0, disabled: false },
        { name: 'Edit', idx: 1, disabled: true },
        { name: 'Delete selected', idx: 2, disabled: true },
        { name: 'Export selected', idx: 3, disabled: true },
        { name: 'Export all', idx: 4, disabled: false },
        { name: 'Batch selection', idx: 5, disabled: false },
      ];

      it('should contain table actions with provided action buttons', () => {
        mountWrapperComponent(BatchModeDataTableWrapperComponent);
        //check action bar, buttons and classes
        checkTableActionBarClassesAndButtonsProperties(6, batchActionsConfig);
      });

      it('should contain table actions and filter together', () => {
        mountWrapperComponent(BatchModeDataTableWrapperComponent, { filterEnabled: true });
        //check action bar, buttons and classes
        checkTableActionBarClassesAndButtonsProperties(6, batchActionsConfig);
        // check filter
        cy.getByCySel('filter-input').should('exist').and('be.visible').and('have.class', 'mat-form-field-appearance-outline');
      });

      it('should emit table action event on click', () => {
        mountWrapperComponent(BatchModeDataTableWrapperComponent).then((response: MountResponse<BatchModeDataTableWrapperComponent>) => {
          cy.spy(response.component, 'handleActionEvent').as('actionEventSpy');
        });

        const expectedTableActionData: DataTableAction = {
          label: 'Create',
          action: 'CREATE',
          type: 'NONE',
          selected: [],
        };
        cy.getByCySel('table-action-bar').find('mad-outline-button').as('tableActionButtons');
        cy.get('@tableActionButtons').first().click();
        cy.get('@actionEventSpy').should('be.calledOnceWith', expectedTableActionData);
      });
    });

    describe('switch mode by forceMode and check content', () => {
      it('should show checkboxes in table header and body in BATCH mode', () => {
        mountWrapperComponent(BatchModeDataTableWrapperComponent).then((response: MountResponse<BatchModeDataTableWrapperComponent>) => {
          cy.spy(response.component, 'handleActionEvent').as('actionEventSpy');
        });

        cy.get('thead').find('tr').find('th').as('tableHeaderCells');
        cy.get('@tableHeaderCells').first().should('exist').and('have.class', 'row-action-cell');
        cy.get('@tableHeaderCells').first().find('mat-checkbox').should('be.visible');
        cy.get('tbody').find('tr').as('bodyRows');
        cy.get('@bodyRows').first().find('td').first().find('mat-checkbox').should('be.visible');
        cy.get('@bodyRows').first().find('td').first().should('exist').and('have.class', 'row-action-cell');
      });

      it('should switch mode from BATCH to SINGLE and show row action instead of checkboxes', () => {
        mountWrapperComponent(BatchModeDataTableWrapperComponent);
        cy.getByCySel('table-action-bar').find('mad-outline-button').as('tableActionButtons');
        cy.get('@tableActionButtons').eq(5).click(); // click on button which switch mode to SINGLE
        // check header
        cy.get('thead').find('tr').find('th').as('tableHeaderCells');
        cy.get('@tableHeaderCells').first().should('be.visible');
        cy.get('@tableHeaderCells').first().should('not.contain', 'mat-checkbox');
        // check body
        cy.get('tbody').find('tr').as('bodyRows');
        cy.get('@bodyRows')
          .first()
          .find('td')
          .first()
          .should('exist')
          .and('not.contain', 'mat-checkbox')
          .and('have.class', 'row-action-cell');
        cy.get('@bodyRows').first().find('td').first().find('mad-icon-button').contains('more_vert').should('be.visible');
      });
    });

    describe('actions and selection', () => {
      it('should select more than one row and not trigger event emit on selection', () => {
        mountWrapperComponent(BatchModeDataTableWrapperComponent).then((response: MountResponse<BatchModeDataTableWrapperComponent>) => {
          cy.spy(response.component, 'handleActionEvent').as('actionEventSpy');
        });

        cy.get('tbody').find('tr').as('bodyRows');
        cy.get('@bodyRows').eq(0).click();
        cy.get('@bodyRows').eq(1).click();
        cy.get('@bodyRows').eq(2).click();
        cy.get('@actionEventSpy').should('not.have.been.called');
      });

      it('should select 2 rows and trigger action event with selected data', () => {
        mountWrapperComponent(BatchModeDataTableWrapperComponent).then((response: MountResponse<BatchModeDataTableWrapperComponent>) => {
          cy.spy(response.component, 'handleActionEvent').as('actionEventSpy');
        });
        // select rows
        cy.get('tbody').find('tr').as('bodyRows');
        cy.get('@bodyRows').eq(0).click();
        cy.get('@bodyRows').eq(1).click();
        // click on BATCH button
        cy.getByCySel('table-action-bar').find('mad-outline-button').as('tableActionButtons');
        cy.get('@tableActionButtons').eq(2).click();
        const expectedActionEventData = {
          label: 'Delete selected',
          action: 'DELETE',
          type: 'BATCH',
          selected: [
            {
              id: 0,
              title: 'Mr',
              name: 'Jacob Shaw',
              gender: 'male',
              email: 'jacob.shaw@example.com',
              age: 17,
              salary: 88.6463,
              registered: '2005-09-04T03:09:06.480Z',
            },
            {
              id: 1,
              title: 'Ms',
              name: 'Angela Cortes',
              gender: 'female',
              email: 'angela.cortes@example.com',
              age: 6,
              salary: 32.1336,
              registered: '2016-03-10T12:35:00.807Z',
            },
          ],
        };
        // check event and data
        cy.get('@actionEventSpy').should('have.been.calledOnceWith', expectedActionEventData);
      });

      it('should select more than one row and show select count on BATCH table actions when click on row checkboxes', () => {
        mountWrapperComponent(BatchModeDataTableWrapperComponent);
        // select 3 rows
        cy.get('tbody').find('tr').as('bodyRows');
        cy.get('@bodyRows').eq(0).click();
        cy.get('@bodyRows').eq(1).click();
        cy.get('@bodyRows').eq(2).click();
        // check 3 rows checkboxes are checked
        checkRowCheckboxSelected(0, true);
        checkRowCheckboxSelected(1, true);
        checkRowCheckboxSelected(2, true);
        // check 4th row checkbox is not checked
        checkRowCheckboxSelected(3, false);
        // check button text contain correct number of selected rows
        cy.getByCySel('table-action-bar').find('mad-outline-button').as('tableActionButtons');
        cy.get('@tableActionButtons').eq(2).find('button').should('contain.text', ' Delete selected  (3) ');
      });

      it('should select all rows and show select count on BATCH table actions when click on header checkbox', () => {
        mountWrapperComponent(BatchModeDataTableWrapperComponent);
        //click checkbox in header
        cy.get('thead').find('tr').find('th').as('tableHeaderCells');
        cy.get('@tableHeaderCells').first().should('exist').and('have.class', 'row-action-cell');
        cy.get('@tableHeaderCells').first().find('mat-checkbox').should('be.visible');
        cy.get('@tableHeaderCells').first().find('mat-checkbox').click();
        // check button text contain correct number of selected rows
        cy.getByCySel('table-action-bar').find('mad-outline-button').as('tableActionButtons');
        cy.get('@tableActionButtons').eq(2).find('button').should('contain.text', ' Delete selected  (10) ');
      });

      it('should select row when first click and deselect on second click', () => {
        mountWrapperComponent(BatchModeDataTableWrapperComponent);
        //click row
        cy.get('tbody').find('tr').as('bodyRows');
        // check is selected on click
        cy.get('@bodyRows').eq(0).click();
        checkRowCheckboxSelected(0, true);
        // check deselected on click
        cy.get('@bodyRows').eq(0).click();
        checkRowCheckboxSelected(0, false);
      });

      it('SINGLE table action should be available only on one selection', () => {
        mountWrapperComponent(BatchModeDataTableWrapperComponent);
        //click first row
        cy.get('tbody').find('tr').as('bodyRows');
        cy.get('@bodyRows').eq(0).click();
        //check single action is available
        cy.getByCySel('table-action-bar').find('mad-outline-button').as('tableActionButtons');
        checkTableActionButtonBasicProperties('Edit');
        cy.get('@tableActionButtons').eq(1).should('have.attr', 'ng-reflect-disabled', 'false');
        // click second row
        cy.get('@bodyRows').eq(1).click();
        checkTableActionButtonBasicProperties('Edit');
        cy.get('@tableActionButtons').eq(1).should('have.attr', 'ng-reflect-disabled', 'true');
      });
    });
  });

  describe('Custom id generator table behavior', () => {
    it('should provide custom selection id on action', () => {
      mountWrapperComponent(CustomGeneratorDataTableWrapperComponent).then(
        (response: MountResponse<CustomGeneratorDataTableWrapperComponent>) => {
          cy.spy(response.component, 'handleActionEvent').as('actionEventSpy');
        },
      );

      cy.get('tbody').find('tr').as('bodyRows');
      cy.get('@bodyRows').eq(1).click();
      const expectedActionData = {
        label: 'Edit',
        action: 'EDIT',
        type: 'SINGLE',
        selected: ['1'],
      };
      cy.get('@actionEventSpy').should('have.been.calledOnceWith', expectedActionData);
    });
  });

  describe('Child rows table behavior', () => {
    it('should change parent row bg color on hover', () => {
      mountWrapperComponent(ChildRowsDataTableWrapperComponent);

      const initialRowBgColor = 'rgb(255, 255, 255)';
      const hoveredRowBgColor = 'rgba(0, 114, 163, 0.08)';

      cy.get('table').should('exist').and('be.visible');
      cy.get('tbody').find('tr').as('bodyRows');
      cy.get('@bodyRows').first().should('have.class', 'clickable-table-row').and('have.css', 'background-color', initialRowBgColor);
      cy.get('@bodyRows').first().realHover().should('have.css', 'background-color', hoveredRowBgColor);
    });

    it('should not change child row bg color on hover', () => {
      mountWrapperComponent(ChildRowsDataTableWrapperComponent);

      const initialRowBgColor = 'rgb(255, 255, 255)';
      cy.get('table').should('exist').and('be.visible');
      cy.get('tbody').find('tr').as('bodyRows');
      cy.get('@bodyRows').eq(1).should('not.have.class', 'clickable-table-row').and('have.css', 'background-color', initialRowBgColor);
      // on hover should not change bg color
      cy.get('@bodyRows').eq(1).realHover().should('have.css', 'background-color', initialRowBgColor);
      // all child row cells after first should have class
      cy.get('@bodyRows').eq(1).find('td').first().nextAll().should('have.class', 'mad-dt-child-cell');
    });

    it('should have action on parent row', () => {
      mountWrapperComponent(ChildRowsDataTableWrapperComponent);

      cy.get('table').should('exist').and('be.visible');
      cy.get('tbody').find('tr').as('bodyRows');
      cy.get('@bodyRows').first().find('td').first().find('mad-icon-button').contains('more_vert').should('be.visible');
    });

    it('should not have action on child row', () => {
      mountWrapperComponent(ChildRowsDataTableWrapperComponent);

      cy.get('table').should('exist').and('be.visible');
      cy.get('tbody').find('tr').as('bodyRows');
      cy.get('@bodyRows').eq(1).find('td').first().should('not.contain', 'mad-icon-button');
    });
  });
});
