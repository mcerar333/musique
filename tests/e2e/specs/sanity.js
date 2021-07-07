describe('Sanity Test', () => {
  it('visits the app root url', () => {
    cy.visit('/');
    cy.contains('h1', 'Listen to Great Music');
  });
});
