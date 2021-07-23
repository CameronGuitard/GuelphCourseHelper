describe('The Lookup Page', () => {
  it('All elements on the lookup page load correctly', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Lookup').click();

    // search field and button
    cy.get('label').contains('Enter a course code');
    cy.get('input#course-code');
    cy.get('.tableProp > :nth-child(2) > .btn').contains('Search');
    // checkbox input
    cy.get('input#export-checkbox');
    cy.get('label').contains('Add to export?');
    // table empty
    cy.is_table_empty();
  });

  it('Get error message when searching with empty text field', () => {
    cy.get('.tableProp > :nth-child(2) > .btn').click();
    cy.contains('You did not pass in an input');
    cy.is_table_empty();
  });

  it('Search for valid course code and get its details', () => {
    cy.get('input#course-code').type('ECON*2310');
    cy.get('.tableProp > :nth-child(2) > .btn').click();
    cy.contains('Successfully got Course');
    cy.contains('Description')
      .parent('tr')
      .within(() => {
        cy.get('td')
          .eq(1)
          .contains(
            'This course is an analysis of the behaviour of households and firms under alternative assumptions and market conditions.',
          );
      });
    cy.contains('Semester')
      .parent('tr')
      .within(() => {
        cy.get('td').eq(1).contains('S F W');
      });
    cy.contains('Lecture/Labs')
      .parent('tr')
      .within(() => {
        cy.get('td').eq(1).contains('(3-0)');
      });
    cy.contains('Offerings')
      .parent('tr')
      .within(() => {
        cy.get('td').eq(1).contains('Also offered through Distance Education format');
      });
    cy.contains('Prerequisites')
      .parent('tr')
      .within(() => {
        cy.get('td').eq(1).contains('(ECON*1050 or FARE*1040), (1 of IPS*1500, MATH*1030, MATH*1080, MATH*1200)');
      });
    cy.contains('Departments')
      .parent('tr')
      .within(() => {
        cy.get('td').eq(1).contains('Department of Economics and Finance');
      });

    cy.get('input#course-code').clear();
  });

  it('Search for invalid course code and get error message', () => {
    cy.get('input#course-code').type('ACDC*1000');
    cy.get('.tableProp > :nth-child(2) > .btn').click();
    cy.is_table_empty();
    cy.contains('Invalid Course Code');
  });
});
