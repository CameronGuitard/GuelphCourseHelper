describe('The Overview Page', () => {
  it('Navigates to the overview page', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Overview').click();
  });
  it('Get overview of all ARAB courses from the Overview page', () => {
    cy.get('select').select('ARAB').should('have.value', 'ARAB');
    cy.get('.btn.button-body.button-primary').contains('Get All Courses for Subject Area').click();
    cy.contains('Successfully parsed courses');
    // verify table contents
    cy.get('tbody > :nth-child(1) > :nth-child(1)').contains('ARAB*1100');
    cy.get('tbody > :nth-child(2) > :nth-child(1)').contains('ARAB*1110');
    cy.get('tbody > :nth-child(1) > :nth-child(2)').contains(
      'This course provides an introduction to Arabic script, articulation of the sounds, basic grammar, and is designed to enable students to begin communicating in Modern Standard Arabic (MSA). ). This course is not intended for students with native or near-native fluency in Arabic. Students with advanced Arabic may be removed from the course.',
    );
    cy.get('tbody > :nth-child(2) > :nth-child(2)').contains(
      'This course is a continuation of Introductory Arabic I with emphasis on oral work. Heritage speakers of Arabic may be admitted with permission of the instructor. However, this course is not intended for students with native or near-native fluency in Arabic. Students with advanced Arabic may be removed from the course.',
    );
  });
  it('Click to lookup details of the first search result', () => {
    cy.get('.btn.button-body.button-primary').contains('Click to Lookup').click();
    // should navigate to lookup page
    cy.get('.sidebar-selected').contains('Lookup');
    // input field filled out
    cy.get('.mr-3').should('have.value', 'ARAB*1100');
    // table filled out
    cy.get('.lookup-table-header').contains('ARAB*1100 - Introductory Arabic I');
    cy.contains('Description')
      .parent('tr')
      .within(() => {
        cy.get('td')
          .eq(1)
          .contains(
            'This course provides an introduction to Arabic script, articulation of the sounds, basic grammar, and is designed to enable students to begin communicating in Modern Standard Arabic (MSA). ). This course is not intended for students with native or near-native fluency in Arabic. Students with advanced Arabic may be removed from the course.',
          );
      });
    cy.contains('Semester')
      .parent('tr')
      .within(() => {
        cy.get('td').eq(1).contains('F');
      });
    cy.contains('Lecture/Labs')
      .parent('tr')
      .within(() => {
        cy.get('td').eq(1).contains('(4-0)');
      });
    cy.contains('Departments')
      .parent('tr')
      .within(() => {
        cy.get('td').eq(1).contains('School of Languages and Literatures');
      });
  });
});
