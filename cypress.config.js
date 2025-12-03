import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // URL base de tu aplicación (ajusta si es necesario)
    baseUrl: 'http://localhost:3000', 
    setupNodeEvents(on, config) {
      // Implementa tu configuración de node aquí
    },
    chromeWebSecurity: false,
    // *****************************************************************
    // *** SOLUCIÓN DEFINITIVA PARA SyntaxError: expected expression ***
    // *****************************************************************
    // Esta bandera inyecta el código de Cypress de forma más agresiva 
    // y temprana, previniendo que scripts externos o scripts de la 
    // aplicación malformados (como el que lanza el SyntaxError) interfieran 
    // con el funcionamiento de Cypress.
    experimentalModifyObstructiveThirdPartyCode: true,
    // *****************************************************************

    // Otras opciones de e2e pueden ir aquí
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
  // Opciones de Component Testing si las usas
  // component: { ... }
});