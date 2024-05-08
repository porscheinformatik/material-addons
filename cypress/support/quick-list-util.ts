export function testAddRemoveFunctionality(selector, initialCount = 2) {
  cy.getByCySel('add-item-button').click();
  cy.getByCySel(`${selector}-item`).should('have.length', initialCount + 1);
  cy.getByCySel('delete-item-button').should('have.length', initialCount + 1);
  cy.get('@onItemAddedSpy').should('have.been.calledOnce');

  cy.getByCySel('delete-item-button').first().click();
  cy.getByCySel(`${selector}-item`).should('have.length', initialCount);
  cy.get('@onItemRemovedSpy').should('have.been.calledOnce');
}

export function checkVisibilityBasedOnState(isEditable) {
  if (isEditable) {
    cy.getByCySel('add-item-button').should('exist');
    cy.getByCySel('delete-item-button').should('exist');
  } else {
    cy.getByCySel('add-item-button').should('not.exist');
    cy.getByCySel('delete-item-button').should('not.exist');
  }
}
