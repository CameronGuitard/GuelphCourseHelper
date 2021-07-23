// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })s

Cypress.Commands.add('is_table_empty', () => {
  cy.get('.lookup-table-header').contains('-');
  cy.contains('Description')
    .parent('tr')
    .within(() => {
      cy.get('td').eq(1).should('have.value', '');
    });
  cy.contains('Semester')
    .parent('tr')
    .within(() => {
      cy.get('td').eq(1).should('have.value', '');
    });
  cy.contains('Lecture/Labs')
    .parent('tr')
    .within(() => {
      cy.get('td').eq(1).should('have.value', '');
    });
  cy.contains('Offerings')
    .parent('tr')
    .within(() => {
      cy.get('td').eq(1).should('have.value', '');
    });
  cy.contains('Prerequisites')
    .parent('tr')
    .within(() => {
      cy.get('td').eq(1).should('have.value', '');
    });
  cy.contains('Departments')
    .parent('tr')
    .within(() => {
      cy.get('td').eq(1).should('have.value', '');
    });
  cy.contains('Current Spots')
    .parent('tr')
    .within(() => {
      cy.get('td').eq(1).should('have.value', '');
    });
  cy.contains('Total Spots')
    .parent('tr')
    .within(() => {
      cy.get('td').eq(1).should('have.value', '');
    });
});
