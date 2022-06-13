/// <reference types="cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
    beforeEach(() => {
        cy.visit('./src/index.html');
    });

    it('verifica o título da aplicação', () => {
        const titleApp = 'Central de Atendimento ao Cliente TAT';
        cy.title().should('eq', titleApp);
    });

    it('preenche os campos obrigatórios e envia o formulário', () => {
        cy.get('#firstName').type('Bruno');
        cy.get('#lastName').type('Caldara');
        cy.get('#email').type('brunocaldara@gmail.com');
        cy.get('#phone').type('123456789');
        cy.get('#product').type('Youtube');
        //cy.get('[name="atendimento-tat"]').type('elogio');
        cy.get('#email-checkbox').check();
        cy.get('#open-text-area').type('Curso de Cypress Básico');
    });
});