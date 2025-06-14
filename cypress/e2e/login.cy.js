
/// <reference types="cypress" />

describe('Login Modal Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('opens the login modal when clicking login', () => {
    cy.get('#loginLogoutLink').click();
    cy.get('#loginModal').should('be.visible');
  });

  it('closes the login modal with Escape key', () => {
    cy.get('#loginLogoutLink').click();
    cy.get('body').type('{esc}');
    cy.get('#loginModal').should('not.be.visible');
  });

  it('shows error on invalid login attempt', () => {
    cy.get('#loginLogoutLink').click();
    cy.get('#email').type('invaliduser@example.com');
    cy.get('#password').type('wrongpassword');
    cy.get('#logInBtn').click();
    cy.get('.toast').should('exist');
  });
});
