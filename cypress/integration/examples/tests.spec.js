/* eslint-disable */
/// <reference types="cypress" />

context('Tests', () => {

  it('should have a PIXI app', () => {
    cy.visit(Cypress.config('url'));
    cy.getPixiApp().then((app) => {
      expect(app).to.exist;
    });
  });

  it('should have a Play scene', () => {
    
    cy.getPixiStage().then((play = cy.getPixiApp().__PIXI_APP.game.children[0]) => {
        expect(play).to.exist;
      });
  });
  
});