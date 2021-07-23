describe('My First Test', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true);
  });
});
describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('http://localhost:3000');
  });
  it('Contains the side bar options', () => {
    cy.contains('Help');
    cy.contains('Overview');
    cy.contains('Lookup');
  });
});
