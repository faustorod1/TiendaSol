const URL_BASE = '/'; // Asume que tienes una página de inicio simple en la raíz

describe('Smoke Test: Carga de la Aplicación', () => {
    
    // Este test solo intenta visitar la URL base y verifica que el body esté visible.
    it('Debe visitar la URL base y cargar el contenido (sin fallar por sintaxis)', () => {
        // La configuración de cypress.config.js debería prevenir el error de sintaxis.
        cy.visit(URL_BASE);

        // Si la carga fue exitosa, el cuerpo de la página debe ser visible.
        cy.get('body').should('be.visible');

        cy.log('*** Carga exitosa del body de la página. ***');
    });

    // Si la página de inicio tiene un título, puedes verificarlo.
    it('Debe verificar el título de la página', () => {
        cy.visit(URL_BASE);
        cy.title().should('include', 'Tienda'); // Cambia 'Tienda' por el texto real de tu título
    });
});