// run `rake test_data:populate_set_1`
// run `rails s -p 3001`

/*
protocol_passive means we're testing the equip_item/equip_type/protocol work WITHOUT changing data.
These tests should be run on the dev_data facilities, where data should never be altered. 
There will be a protocol_active spec that targets other facilities and modifies the data.
*/

/*
Spec goals: 
  1. From dev_data, which is included in `rake test_data:populate_set_1`, confirm that when protocols exist, frequencies are read only.
  2. Confirm that when protocol does not exist, frequency is editable
  3. Confirm that bulk upload modal loads (should be in uvca_nav.spec)
  4. Confirm that "Upload" with no file throws appropriate error message
  5. Confirm that adding pre-existing tag_id throws error message (which means seeded tag_id must be hard coded)
  6. Confirm that 4 default equip_types are there from both bulk upload and add item options
  7. Split tests amongst User, FA, and UVC-A
*/

describe('confirms frequency is appropriately editable', () => {

  it('confirms frequency is not editable if protocol already exists (add item)', () => {
    cy.login('dev_user@firepointstudios.com', 'password');
    cy.clickIntoAddItem();
    cy.get('ul li').contains('Wheelchair').click();
    cy.get('input[name=frequency]').should('be.disabled'); // look at the frequency input field and confirm it is disabled
    cy.get('input[name=frequency]').should('not.be.enabled'); // confirm that the field is not enabled
  })

  it('confirms frequency is not editable if protocol already exists (bulk upload)', () => {
    cy.login('dev_fa@firepointstudios.com','password');
    cy.clickIntoBulkUpload();
    cy.get('ul li').contains('IV Pole').click();
    cy.get('input[name=frequency]').should('be.disabled');
  })

  it('confirms frequency is editable if protocol does not exists (add item)', () => {
    cy.login('dev_user@firepointstudios.com','password');
    cy.clickIntoBulkUpload();
    cy.get('ul li').contains('Computer').click();
    cy.get('input[name=frequency]').should('be.enabled');
  })

  it('confirms frequency is editable if protocol does not exists (bulk upload)', () => {
    cy.login('dev_fa@firepointstudios.com','password');
    cy.clickIntoAddItem();
    cy.get('ul li').contains('Gurney').click();
    cy.get('input[name=frequency').should('be.enabled');
  })
})

describe('confirms that protocol creation form throws appropriate error messages', () => {

  it('confirms modal throws "No file selected" error (bulk upload)', () => {
    cy.login('dev_fa@firepointstudios.com','password');
    cy.clickIntoBulkUpload();
    cy.get('ul li').contains('IV Pole').click();
    cy.get('#form-dialog-submit').click();
    cy.get('p').contains('Please select a file for upload').should('exist');
  })

  it('confirms modal throws "Tag already in use" error (add item)', () => {
    cy.login('dev_user@firepointstudios.com', 'password');
    cy.clickIntoAddItem();
    cy.get('ul li').contains('IV Pole').click();
    cy.get('input#tag_id').type('111222333');
    cy.get('#form-dialog-submit').click();
    cy.get('p#tag_id-helper-text').contains('is already in use').should('exist');
  })

  it('confirms modal throws "frequency not valid" error for entry that is too large (add item)', () => {
    cy.login('dev_fa@firepointstudios.com', 'password');
    cy.clickIntoAddItem();
    cy.get('ul li').contains('Gurney').click();
    cy.get('input[name=frequency]').type('366');
    cy.get('input#tag_id').type('111222333333');
    cy.get('#form-dialog-submit').click();
    cy.get('p#frequency-helper-text').contains('must be between 1 and 365').should('exist');
  })

  it('confirms that the frequency helper text appears if the input is disabled', () => {
    cy.login('uvc_admin@firepointstudios.com', 'password');
    cy.clickIntoAddItem();
    cy.get('ul li').contains('Wheelchair').click();
    cy.get('input[name=frequency]').click({force:true}); // needs force:true because element is disabled
    cy.get('p').contains('To update the frequency of this equipment type, please navigate to the Protocol Frequency section on the department detail view.').should('exist');
  })
})
