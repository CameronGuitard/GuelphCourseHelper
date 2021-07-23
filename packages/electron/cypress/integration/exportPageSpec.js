describe('Export Page', () => {
  it('All elements on the export page load correctly', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Export').click();
  });
});
