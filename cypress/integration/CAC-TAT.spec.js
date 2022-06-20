/// <reference types="cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
    const THREE_SECONDS_IN_MS = 3000;
    
    beforeEach(() => {
        cy.visit('./src/index.html');
    });

    it('verifica o título da aplicação', () => {
        const titleApp = 'Central de Atendimento ao Cliente TAT';
        cy.title().should('eq', titleApp);
    });

    it('preenche os campos obrigatórios e envia o formulário', () => {
        cy.clock(); //trava o tempo do navegador
        cy.get('#firstName').type('Bruno');
        cy.get('#lastName').type('Caldara');
        cy.get('#email').type('brunocaldara@gmail.com');
        cy.get('#phone').type('123456789');
        cy.get('#email-checkbox').check();
        cy.get('#open-text-area').type('Curso de Cypress Básico', { delay: 0 });
        cy.get('button[type="submit"]').click();

        cy.get('.success').should('be.visible');

        cy.tick(THREE_SECONDS_IN_MS);

        cy.get('.success').should('not.be.visible');
    });

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.clock()
        cy.get('#firstName').type('Bruno');
        cy.get('#lastName').type('Caldara');
        cy.get('#email').type('brunocaldara');
        cy.get('#phone').type('123456789');
        cy.get('#open-text-area').type('Curso de Cypress Básico', { delay: 0 });
        cy.get('button[type="submit"]').click();
        
        cy.get('.error').should('be.visible');

        cy.tick(THREE_SECONDS_IN_MS);

        cy.get('.error').should('not.be.visible');
    });

    it('campo telefone continua vazio quando preenchido com valor não numérico', () => {
        cy.get('#phone').type('abc').should('have.value', '');
    });

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.clock();
        cy.get('#firstName').type('Bruno');
        cy.get('#lastName').type('Caldara');
        cy.get('#email').type('brunocaldara@gmail.com');
        //cy.get('#phone').type('');
        cy.get('#product').type('Youtube');
        cy.get('#phone-checkbox').click();
        cy.get('button[type="submit"]').click();
        
        cy.get('.error').should('be.visible');

        cy.tick(THREE_SECONDS_IN_MS);

        cy.get('.error').should('not.be.visible');
    });

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Bruno').should('have.value', 'Bruno').clear().should('be.empty');
    });

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.clock();
        cy.fillMandatoryFieldsAndSubmit();
        
        cy.get('.success').should('be.visible');

        cy.tick(THREE_SECONDS_IN_MS);

        cy.get('.success').should('not.be.visible');
    });

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product').select('YouTube').should('have.value', 'youtube');
    });

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria');
    });

    it('seleciona um produto (Cursos) por seu indice', () => {
        cy.get('#product').select(2).should('have.value', 'cursos');
    });

    it('marca o tipo de atendimento "Feedback" pelo nome', () => {
        cy.get('input[type="radio"][name="atendimento-tat"]').check().should('be.checked');
    });

    it('marca o tipo de atendimento "Feedback" pelo valor', () => {
        cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback');
    });

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]').should('have.length', 3)
            .each((radio) => {
                cy.wrap(radio).check().should('be.checked');
            });
    });

    it('marca todos os checkbox', () => {
        cy.get('#check input[type="checkbox"]').should('have.length', 2).check();
    });

    it('marcando o checkbox de e-mail', () => {
        cy.get('#email-checkbox').check();
    });

    it('marca todos os checkbox e desmarca o último', () => {
        cy.get('#check input[type="checkbox"]')
            .check()
            .last()
            .uncheck()
            .should('not.be.checked');
    });

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload').should('be.visible').selectFile('cypress/fixtures/example.json');
    });

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('#file-upload').should('be.visible').selectFile('cypress/fixtures/example.json', { action: 'drag-drop' });
    });

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        const fileName = 'example.json';
        
        cy.fixture(fileName).as('sampleFile');

        cy.get('input[type="file"]').selectFile('@sampleFile').should(file => {
            expect(file[0].files[0].name).to.equal(fileName);
        });
    });

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank');
    });

    it('acessa a página da política de privacidade removendo o target e então clicanco no link', () => {
        cy.get('a[href="privacy.html"]').invoke('removeAttr', 'target').click();

        cy.contains('Talking About Testing').should('be.visible');
    });

    it('testa a página da política de privavidade de forma independente', () => {
        cy.visit('./src/privacy.html');     

        cy.contains('Talking About Testing').should('be.visible');
    });
});