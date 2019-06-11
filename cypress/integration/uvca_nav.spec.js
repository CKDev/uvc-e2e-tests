// The goal is to hit each nav path for UVC Admin to ensure they can see all facilities and 
// and the facility management buttons ("Add Facility" and "Edit Facility")

describe('uvc_admin login regression', () => {

  it('confirms uvc admin is logged in', () => {
    cy.visit('/');
    cy.url().should('include', '/login')
    cy.get('#email').type('uvc_admin@firepointstudios.com');
    cy.get('#password').type('password');
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/dashboard');
  })

})

describe('uvc_admin nav checks', () => {

  beforeEach(() => {
    cy.login('uvc_admin@firepointstudios.com','password');
  })

  it('confirms uvc admin can visit /protocols', () => {
    cy.get('span').contains('Protocols').click();
    cy.url().should('include', '/protocols');
  })

  it('confirms uvc admin can visit /facilities', () => {
    cy.get('span').contains('Facilities').click();
    cy.url().should('include', '/facilities');
  })

  it('confirms uvc admin sees all 5 seeded facilities', () => {
    cy.visit('/facilities');
    cy.url().should('include', '/facilities');
    cy.get('p').contains('Doug\'s Facility');
    cy.get('p').contains('Mount Carmel').should('exist');
    cy.get('p').contains('St. Jude Children\'s Research').should('exist');
    cy.get('p').contains('MD Anderson Cancer Center').should('exist');
    cy.get('p').contains('Mayo Clinic').should('exist');

    // try negative spec
    cy.get('p').contains('MayoP Clinic').should('not.exist')
  })

})

describe('uvc_admin permissions for creating and editing a facility', () => {

  beforeEach(() => {
    cy.login('uvc_admin@firepointstudios.com','password');
  })

  it('confirms uvc admin sees Add Facility button and can follow it', () => {

    // confirm "Add Facility" button is there
    cy.visit('/facilities');
    cy.get('span').contains('Add New Facility').should('exist');
    cy.get('span').contains('Save Facility').should('not.exist');

    // click the button and confirm the "New Facility" modal opened
    cy.get('span').contains('Add New Facility').click();
    cy.url().should('include', '/facilities');
    cy.get('span').contains('Save Facility').should('exist');
    cy.get('span').contains('Cancel').should('exist').click();
    cy.get('span').contains('Save Facility').should('not.exist');
  })

  it('confirms uvc admin sees Edit Facility button and can follow it', () => {
    cy.visit('/facilities/1');
    cy.get('#edit-facility').click({force: true});
    cy.get('span').contains('Save Facility').should('exist');
    cy.get('span').contains('Cancel').should('exist').click();
    cy.get('span').contains('Save Facility').should('not.exist');
  })

})
