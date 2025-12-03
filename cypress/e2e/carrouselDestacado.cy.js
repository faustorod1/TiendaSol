describe('Carrusel de Productos Destacados', () => {
    const activeProductSelector = '[data-testid="active-product-item"]';
    const nextButtonSelector = '[data-testid="next-button"]';
    const prevButtonSelector = '[data-testid="prev-button"]';

    beforeEach(() => {
        cy.visit('/'); 
    });

    it('Debe cambiar al producto siguiente al hacer clic en la flecha derecha', () => {
        let initialProductId;

        cy.get(activeProductSelector)
            .should('exist') 
            .invoke('attr', 'data-product-id')
            .then((id) => {
                initialProductId = id; 
                cy.log(`ID Inicial (Next): ${initialProductId}`);
            });

        cy.get(nextButtonSelector).click();

        cy.get(activeProductSelector) //verifica el cambio
            .invoke('attr', 'data-product-id')
            .then((newId) => {
                cy.log(`Nuevo ID (Next): ${newId}`);
                expect(newId).to.not.equal(initialProductId);
            });
    });

    it('Debe cambiar al producto anterior al hacer clic en la flecha izquierda', () => {
        let currentProductId;
        let nextProductId;

        cy.get(nextButtonSelector).click();
        
        cy.get(activeProductSelector)
            .invoke('attr', 'data-product-id')
            .then((id) => {
                currentProductId = id; 
                cy.log(`ID antes de PREV: ${currentProductId}`);
            });

        cy.get(prevButtonSelector).click();
        
        cy.get(activeProductSelector) //verificar el cambio
            .invoke('attr', 'data-product-id')
            .then((idBeforePrev) => {
                nextProductId = idBeforePrev;
                cy.log(`ID después de PREV: ${nextProductId}`);
                expect(nextProductId).to.not.equal(currentProductId);
            });
    });

    it('Debe hacer bucle al ir hacia atrás desde el primer producto', () => {
        let initialProductId;
        
        cy.get(activeProductSelector)
            .invoke('attr', 'data-product-id')
            .then((id) => {
                initialProductId = id; 
                cy.log(`ID Inicial (Bucle): ${initialProductId}`);
            });

        cy.get(prevButtonSelector).click();
        
        cy.get(activeProductSelector) //verificar el cambio
            .invoke('attr', 'data-product-id')
            .then((lastProductId) => {
                cy.log(`ID después de bucle PREV: ${lastProductId}`);
                expect(lastProductId).to.not.equal(initialProductId);
            });
    });
});