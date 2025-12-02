const PRODUCTS_PER_PAGE = 10;
const URL_PRODUCTOS = '/productos';
const SELECTORS = {
    // TODO: REVISAR Y AJUSTAR ESTOS SELECTORES EN TU CÓDIGO REACT
    // Se recomienda usar atributos data-cy (Cypress data-testing attribute)
    nextButton: '[data-cy="pagination-next"]', 
    prevButton: '[data-cy="pagination-prev"]',
    productListContainer: '[data-cy="product-list"]',
    productItem: '[data-cy="product-item"]',
    firstProductTitle: '[data-cy="product-title"]', // Selector para el título del primer producto
};

describe('E2E Test: Paginado de Productos en TiendaSol', () => {
    let firstProductTitlePage1;
    let firstProductTitlePage2;

    // Antes de cada test, navegamos a la página de productos.
    beforeEach(() => {
        cy.visit(URL_PRODUCTOS);
    });

    it('1. Valida la carga inicial y el número correcto de productos', () => {
        // 1. Verificar que el contenedor de productos existe y es visible.
        cy.get(SELECTORS.productListContainer)
          .should('be.visible');

        // 2. Verificar que se cargan el número esperado de productos por página.
        cy.get(SELECTORS.productItem)
          .should('have.length', PRODUCTS_PER_PAGE);

        // 3. Capturar el título del primer producto para futuras comparaciones.
        cy.get(SELECTORS.firstProductTitle).first().then(($title) => {
            firstProductTitlePage1 = $title.text().trim();
            cy.log(`Producto 1 (Página 1): ${firstProductTitlePage1}`);
            expect(firstProductTitlePage1).to.not.be.empty;
        });

        // 4. Verificar que el botón "Anterior" esté deshabilitado en la primera página.
        cy.get(SELECTORS.prevButton).should('be.disabled');
    });

    it('2. Navegación a la página siguiente y verificación de cambio de contenido', () => {
        // Asegurarse de que el título de la Pág. 1 ya fue capturado (dependencia del test anterior).
        if (!firstProductTitlePage1) {
             cy.get(SELECTORS.firstProductTitle).first().then(($title) => {
                firstProductTitlePage1 = $title.text().trim();
            });
        }
        
        // 1. Hacer clic en el botón "Siguiente".
        cy.get(SELECTORS.nextButton)
          .should('not.be.disabled')
          .click();

        // 2. Verificar que el URL se actualice correctamente (ej. /productos?page=2).
        // Si tu aplicación no usa query params, puedes comentar la siguiente línea.
        cy.url().should('include', '?page=2');

        // 3. Verificar que el número de productos sigue siendo el mismo (PRODUCTS_PER_PAGE).
        cy.get(SELECTORS.productItem)
          .should('have.length', PRODUCTS_PER_PAGE);
        
        // 4. Capturar el título del primer producto de la Pág. 2.
        cy.get(SELECTORS.firstProductTitle).first().then(($title) => {
            firstProductTitlePage2 = $title.text().trim();
            cy.log(`Producto 1 (Página 2): ${firstProductTitlePage2}`);

            // 5. ¡Verificación clave! El contenido de la página debe haber cambiado.
            expect(firstProductTitlePage2).to.not.equal(firstProductTitlePage1);
        });

        // 6. Verificar que el botón "Anterior" ya no esté deshabilitado.
        cy.get(SELECTORS.prevButton).should('not.be.disabled');
    });

    it('3. Navegación a la página anterior y retorno al contenido original', () => {
        // 1. Navegar a la página 2 primero.
        cy.visit(`${URL_PRODUCTOS}?page=2`);

        // 2. Capturar el primer producto de la Pág. 2 (en caso de que el test 2 no haya corrido).
        cy.get(SELECTORS.firstProductTitle).first().then(($title) => {
            firstProductTitlePage2 = $title.text().trim();
        });

        // 3. Hacer clic en el botón "Anterior".
        cy.get(SELECTORS.prevButton)
          .should('not.be.disabled')
          .click();

        // 4. Verificar el retorno al URL base (o ?page=1).
        cy.url().should('not.include', 'page=2');
        cy.url().should('include', URL_PRODUCTOS); 

        // 5. Verificar que el contenido (el primer producto) sea idéntico al de la Pág. 1.
        cy.get(SELECTORS.firstProductTitle).first().then(($title) => {
            const returnedProductTitle = $title.text().trim();
            
            // Aquí usamos la asunción de que el primer producto de la Pág 1 es diferente al de la Pág 2
            // y que al volver a Pág 1, volvemos a ver el primer producto de Pág 1.
            expect(returnedProductTitle).to.not.equal(firstProductTitlePage2);
            cy.log(`Test de retorno exitoso. Producto 1: ${returnedProductTitle}`);
        });

        // 6. Verificar que el botón "Anterior" vuelva a estar deshabilitado.
        cy.get(SELECTORS.prevButton).should('be.disabled');
    });
});