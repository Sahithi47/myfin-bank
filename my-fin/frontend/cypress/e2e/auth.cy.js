describe('MyFin Bank Authentication E2E Tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('1. Should load the login page successfully', () => {
    cy.contains('MyFin Bank').should('be.visible');
    cy.contains('Customer Login').should('be.visible');
    cy.contains('Admin Login').should('be.visible');
  });

  it('2. Should show error for invalid credentials', () => {
    cy.get('input[type="text"]').first().type('wrong@gmail.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Customer not found', { timeout: 5000 }).should('be.visible');
  });

  it('3. Should login successfully with valid credentials and redirect to dashboard', () => {
    cy.get('input[type="text"]').first().type('sahithimettu2@gmail.com');
    cy.get('input[type="password"]').type('Sahithi@123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
  });

  it('4. Should logout and redirect to login page', () => {
    cy.get('input[type="text"]').first().type('sahithimettu2@gmail.com');
    cy.get('input[type="password"]').type('Sahithi@123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.get('button').contains('Logout').click();
    cy.url({ timeout: 5000 }).should('include', '/login');
  });

});
