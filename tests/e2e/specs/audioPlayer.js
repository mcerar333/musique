describe('Audio Player', () => {
  it('plays audio', () => {
    cy.visit('/');

    cy.get('.song__info > a')
      .first()
      .click();

    cy.get('section.track > button').click();
    cy.wait(5000);
    cy.get('div.player__nav > button:nth-child(4)').click();
  });
});
