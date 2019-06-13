// to seed: use rake -AT | grep populate_set_1: in `api` project, then run that task. 

// The goal with this spec is to address Cards #200 and #203 with permanent regression tests. 
// These tests target "Doug's Facility" which shouldn't ever be changed.

// #200: Nav to department detail, then user browser back button. Facilities should render.
// #203: Open any modal, use browser back button, use browser forward button. Modal should be gone.

describe('regression on #200: department detail view, then browser back button', () => {

  it('navigates a UVC Admin to the departments view and click browser back button', () => {
    cy.login('uvc_admin@firepointstudios.com','password');
    cy.get('span').contains('Facilities').click();
    cy.url().should('include', '/facilities');
    cy.get('p').contains('Doug').click();
    cy.url().should('include', '/facilities/1');
    cy.get('p').contains('Oncology').click();
    cy.url().should('include', '/departments/1');
    cy.contains('111222333').should('exist'); // checks seeded eTag is there
    cy.go('back');
    cy.url().should('include', '/facilities/1');
    cy.contains('0987654321').should('exist');
  })

  it('navigates a Facility Admin to the departments view and then clicks the browser back button', () => {
    cy.login('dev_fa@firepointstudios.com','password');
    cy.get('span').contains('Facilities').click();
    cy.url().should('include', '/facilities');
    cy.get('p').contains('Oncology').click();
    cy.url().should('include', '/departments/1');
    cy.contains('111222333').should('exist'); // checks seeded eTag is there
    cy.go('back');
    cy.url().should('include', '/facilities/1');
    cy.contains('0987654321').should('exist');
  })

  it('navigates a User to the departments view and then clicks the browser back button', () => {
    cy.login('dev_user@firepointstudios.com','password');
    cy.get('span').contains('Facilities').click();
    cy.url().should('include', '/facilities');
    cy.get('p').contains('Oncology').click();
    cy.url().should('include', '/departments/1');
    cy.contains('111222333').should('exist'); // checks seeded eTag is there
    cy.go('back');
    cy.url().should('include', '/facilities/1');
    cy.contains('0987654321').should('exist');
  })
})

describe('regression on #203: open modals, then click Back and Forward', () =>  {
  it('navigates a UVC Admin to the Add Facility modal', () => {
    cy.login('uvc_admin@firepointstudios.com','password');
    cy.get('span').contains('Facilities').click();
    cy.url().should('include', '/facilities');
    cy.get('span').contains('Save Facility').should('not.exist');
    cy.get('#add-new-facility').click();
    cy.get('span').contains('Save Facility').should('exist');
    cy.go('back');
    cy.get('span').contains('Save Facility').should('not.exist');
    cy.url().should('include', '/dashboard')
    cy.go('forward');
    cy.get('span').contains('Save Facility').should('not.exist');
    cy.url().should('include', '/facilities')
  })
  
  it('navigates a UVC Admin to the Add UVE modal', () => {
    cy.login('uvc_admin@firepointstudios.com','password');
    cy.get('span').contains('Facilities').click();
    cy.url().should('include', '/facilities');
    cy.get('p').contains('Doug').click();
    cy.url().should('include', '/facilities/1');
    cy.wait(1000);
    cy.get('#add-uve').click({force: true});
    cy.get('span').contains('Add Enclosure').should('exist');
    cy.go('back');
    cy.url().should('not.include','/1');
    cy.get('#add-new-facility').should('exist');
    cy.go('forward');
    cy.get('#add-new-facility').should('not.exist');
    cy.get('span').contains('Add Enclosure').should('not.exist');
    cy.url().should('include', '/facilities/1');
  })
  
  it('navigates a Facility Admin to the Add User modal', () => {
    cy.login('dev_fa@firepointstudios.com','password');
    cy.get('span').contains('Facilities').click();
    cy.url().should('include', '/facilities/1');
    cy.wait(1000);
    cy.get('#add-user').click();
    cy.get('h2').contains('New User').should('exist');
    cy.go('back');
    cy.url().should('include','/dashboard');
    cy.go('forward');
    cy.url().should('include','/facilities/1');
    cy.get('button span').contains('Cancel').should('not.exist');
  })
  
  it('navigates a User to the Add Department modal', () => {
    cy.login('dev_user@firepointstudios.com','password');
    cy.get('span').contains('Facilities').click();
    cy.url().should('include','/facilities/1');
    cy.wait(1000);
    cy.get('button span').eq(4).click();
    cy.get('h6').contains('New Department').should('exist');
    cy.go('back')
    cy.url('include','/dashboard');
    cy.go('forward');
    cy.url().should('include','/facilities/1')
    cy.get('h6').contains('New Department').should('not.exist');
  })
})
