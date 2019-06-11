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
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Fallback to XHR
// This removes the fetch function, and forces the app to
// fallback to XHR (functionality provided by the 'react-app-polyfill' package)
Cypress.Commands.add('revertFetchToXHR', () => {
  Cypress.on('window:before:load', (win) => {
    delete win.fetch
  });
});

// Login Commands
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('button[type=submit]').click();

  // added assertion here so that cypress has to process that the view has changed
  cy.url().should('include', '/dashboard')
})

Cypress.Commands.add('noServerLogin', (email, password, uvc_admin=false) => {
  cy.server();
  const roles = uvc_admin ? [{
    "id": 1,
    "name": "uvc_admin",
    "resource_type": null,
    "resource_id": null
  }] : null
  cy.route({
    method: 'POST',
    url: '/api/admin/auth/sign_in',
    headers: {
      'access-token': 'some_token',
      'client': 'some_client',
      'expiry': new Date().getTime(),
      'token-type': 'Bearer',
      'uid': email
    },
    response: {
      "data": {
        "name":"Test User",
        "roles": roles
      }
    }
  });
  cy.visit('/');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('button[type=submit]').click();
});