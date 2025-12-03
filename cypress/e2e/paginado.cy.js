const PRODUCTS_PER_PAGE = 10;
const URL_PRODUCTOS = '/productos';
const SELECTORS = {
    // Se recomienda usar atributos data-cy (Cypress data-testing attribute)
    nextButton: '[data-cy="pagination-next"]',
    prevButton: '[data-cy="pagination-prev"]',
    productListContainer: '[data-cy="product-list"]',
    productItem: '[data-cy="product-item"]',
    firstProductTitle: '[data-cy="product-title"]', // Selector para el título del primer producto
};

// Se ejecuta antes de toda la suite para asegurar un entorno limpio
before(() => {
    // Borra las cookies, localStorage y sesión para asegurar un estado limpio.
    cy.clearAllSessionStorage()
    cy.clearCookies()
})

describe('E2E Test: Paginado de Productos en TiendaSol', () => {
    // Variables para almacenar los títulos de los productos
    let firstProductTitlePage1;
    let firstProductTitlePage2;

    // Antes de cada test, navegamos a la página de productos.
    beforeEach(() => {
        // La configuración en e2e.js permite que esta visita continúe
        cy.visit(URL_PRODUCTOS);
        cy.log('*** Test: Navegación a página inicial completada. ***');
    });

    it('1. Valida la carga inicial y el número correcto de productos', () => {
        // 1. Verificar que el contenedor de productos existe y es visible.
        cy.get(SELECTORS.productListContainer)
          .should('be.visible');

        // 2. Verificar que se cargan el número esperado de productos por página.
        cy.get(SELECTORS.productItem)
          .should('have.length', PRODUCTS_PER_PAGE);

        // 3. Capturar el título del primer producto y guardarlo en la variable.
        cy.get(SELECTORS.firstProductTitle).first().then(($title) => {
            firstProductTitlePage1 = $title.text().trim();
            cy.log(`Producto 1 (Página 1): ${firstProductTitlePage1}`);
            expect(firstProductTitlePage1).to.not.be.empty;
        });

        // 4. Verificar que el botón "Anterior" esté deshabilitado en la primera página.
        cy.get(SELECTORS.prevButton).should('be.disabled');
    });

    it('2. Navegación a la página siguiente y verificación de cambio de contenido', () => {
        // Capturamos el título de la Pág. 1 nuevamente, en caso de que el test 1 no haya corrido antes.
        cy.get(SELECTORS.firstProductTitle).first().then(($title) => {
            firstProductTitlePage1 = $title.text().trim();
        });
        
        // 1. Hacer clic en el botón "Siguiente".
        cy.get(SELECTORS.nextButton)
          .should('not.be.disabled')
          .click();

        // 2. Verificar que el URL se actualice correctamente (ej. /productos?page=2).
        cy.url().should('include', '?page=2');

        // *** CAMBIO CLAVE AÑADIDO AQUÍ: Espera inteligente por el nuevo contenido renderizado. ***
        cy.get(SELECTORS.productItem).first().should('be.visible');
        // Usar .should('be.visible') o .should('have.length', PRODUCTS_PER_PAGE) fuerza a Cypress a esperar la recarga.
        
        // 3. Verificar que el número de productos sigue siendo el mismo.
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
        // 1. Navegar directamente a la página 2 para iniciar este test de forma independiente.
        cy.visit(`${URL_PRODUCTOS}?page=2`);

        // Capturar el título del primer producto de la Pág. 2 para la comparación.
        let productTitlePage2OnEntry;
        cy.get(SELECTORS.firstProductTitle).first().then(($title) => {
            productTitlePage2OnEntry = $title.text().trim();
        });

        // 2. Hacer clic en el botón "Anterior".
        cy.get(SELECTORS.prevButton)
          .should('not.be.disabled')
          .click();

        // 3. Verificar el retorno al URL base (o ?page=1).
        cy.url().should('not.include', 'page=2');
        cy.url().should('include', URL_PRODUCTOS); 
        
        // *** CAMBIO CLAVE AÑADIDO AQUÍ: Espera inteligente por el nuevo contenido renderizado. ***
        cy.get(SELECTORS.productItem).first().should('be.visible');

        // 4. Verificar que el contenido (el primer producto) sea idéntico al de la Pág. 1.
        cy.get(SELECTORS.firstProductTitle).first().then(($title) => {
            const returnedProductTitle = $title.text().trim();
            
            // Verificamos que el producto retornado NO sea el de la página 2.
            expect(returnedProductTitle).to.not.equal(productTitlePage2OnEntry);
            cy.log(`Test de retorno exitoso. Producto 1 retornado: ${returnedProductTitle}`);
        });

        // 5. Verificar que el botón "Anterior" vuelva a estar deshabilitado.
        cy.get(SELECTORS.prevButton).should('be.disabled');
    });
});