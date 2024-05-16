export const checkButtonAttributes = (text: string, color: string, icon?: string) => {
  const buttonCy = cy.getByCySel('button');
  buttonCy.should('be.visible');
  text && buttonCy.should('contain.text', text);
  color && buttonCy.should('have.attr', 'color', color);
  buttonCy.should('have.attr', 'title', 'Test tooltip');
  icon && buttonCy.find('mat-icon').should('exist');
  icon && buttonCy.find('mat-icon').should('have.text', icon);
};

export function checkMadButtonOpacityAndPointerEvent(selector, pointerEvents, opacity) {
  const selectorButtonCy = cy.getByCySel(selector);
  selectorButtonCy.should('have.css', 'pointer-events', pointerEvents).and('have.css', 'opacity', opacity);
}
