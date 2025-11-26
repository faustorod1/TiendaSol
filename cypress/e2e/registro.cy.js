describe('registro', () => {
    it('Creacion de usuario', () => {
        cy.visit('http://localhost:3000/signup');
        
        const nombreField = cy.get('.signup-form')
            .find('.form-group')
            .contains('label', 'Nombre')
            .parent()
            .find('input');
        
        nombreField
            .should('be.visible')
            .type('Juan');
    })
});