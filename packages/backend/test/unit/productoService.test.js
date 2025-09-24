import { productoService } from "../../src/services/productoService.js";
import { Producto } from "../../src/models/producto.js";
import { Moneda } from "../../src/models/moneda.js";
import { Usuario } from "../../src/models/usuario.js";
import { Categoria } from "../../src/models/categoria.js";
import { paginationSchema } from "../../src/schemas/paginationSchema.js";
import { jest } from "@jest/globals"

describe("productoService.buscarTodos", () =>{
    const mockRepo = {
        findByPage: jest.fn(),
        contarTodos: jest.fn(),
    };

    const productoService = new productoService(mockRepo);

    test("Estructura de paginacion default", () => {

        const vendedor1 = new Usuario("1");
        const vendedor2 = new Usuario("2");
        const vendedor3 = new Usuario("3");

        const sampleData = [
            new Producto(
                "1", vendedor1, "Jabon", "Producto de limpieza", [new Categoria("Limpieza")], 500, Moneda.PESO_ARG, 50, ["jabon.jpg"], true
            ),
            new Producto(
                "1", vendedor2, "Jabon", "Producto de limpieza", [new Categoria("Limpieza")], 100, Moneda.PESO_ARG, 50, ["jabon.jpg"], true
            ),
            new Producto(
                "3", vendedor1, "Palta", "Alimento", [new Categoria("Consumible")], 100, Moneda.PESO_ARG, 50, ["palta.jpg"], true
            ),
            new Producto(
                "1", vendedor1, "Jabon", "Producto de limpieza", [new Categoria("Limpieza")], 200, Moneda.PESO_ARG, 50, ["jabon.jpg"], true
            ),
            new Producto(
                "1", vendedor1, "Jabon", "Producto de limpieza", [new Categoria("Limpieza")], 100, Moneda.PESO_ARG, 50, ["jabon.jpg"], true
            ),
        ]

        // Filtros: vendedor = vendedor1, titulo = 'jabon', precio > 50 & precio < 300
        const filtros = {
            vendedor: vendedor1,
            titulo: "Jabon",
            precioMin: 50,
            precioMax: 300
        };

        // Mock de datos filtrados
        const filtrados = sampleData.filter(p =>
            p.vendedor === vendedor1 &&
            p.titulo.toLowerCase() === "jabon" &&
            p.precio > 50 && p.precio < 300
        );
        mockRepo.findByPage.mockReturnValue(filtrados);
        mockRepo.contarTodos.mockReturnValue(filtrados.length);

        const page = 1;
        const limit = 10;
        return productoService.buscarTodos(page, limit, filtros).then(result => {
            expect(result.data).toEqual(filtrados);
            expect(result.page).toBe(page);
            expect(result.perPage).toBe(limit);
            expect(result.total).toBe(filtrados.length);
            expect(result.totalPages).toBe(1);
        });
    })
}
)