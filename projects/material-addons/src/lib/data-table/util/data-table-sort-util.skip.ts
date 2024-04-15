import { DataTableSortUtil } from './data-table-sort-util';
import { Sort } from '@angular/material/sort';

const lowerRecord = {
  myString: 'aaaa',
  myNumber: 1,
  myBoolean: true,
  myDate: '01.01.2020',
  garageCompanyNumber: 150,
};
const greaterRecord = {
  myString: 'zzzz',
  myNumber: 9,
  myBoolean: false,
  myDate: '31.12.2099',
  garageCompanyNumber: 'Customer',
};
const dateFormat = 'dd.MM.yyyy';

// TODO enable with cypress
function expectComparison(sort: Sort) {
  //expect(DataTableSortUtil.compare(lowerRecord, lowerRecord, sort, dateFormat)).to.equal(0);
  //expect(DataTableSortUtil.compare(lowerRecord, greaterRecord, sort, dateFormat)).to.be.below(0);
  //expect(DataTableSortUtil.compare(greaterRecord, lowerRecord, sort, dateFormat)).to.be.above(0);
}

describe('compare', () => {
  it('should compare strings', () => {
    const sort: Sort = { active: 'myString', direction: 'asc' };
    expectComparison(sort);
  });
  it('should compare numbers', () => {
    const sort: Sort = { active: 'myNumber', direction: 'asc' };
    expectComparison(sort);
  });
  it('should compare booleans', () => {
    const sort: Sort = { active: 'myBoolean', direction: 'asc' };
    expectComparison(sort);
  });
  it('should compare dates', () => {
    const sort: Sort = { active: 'myDate', direction: 'asc' };
    expectComparison(sort);
  });
  it('should compare string mixed with number', () => {
    const sort: Sort = { active: 'garageCompanyNumber', direction: 'asc' };
    expectComparison(sort);
  });
});
