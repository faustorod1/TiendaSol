import { ProductoDoesNotExistError } from "../errors/ProductoDoesNotExistError.js";
import { Producto } from "../models/entities/producto.js";
import { ProductoRepository } from "../models/repositories/productoRepository.js";

export class ProductoService {
    constructor(productoRepository) {
        this.productoRepository = productoRepository;
    }

    async buscarTodos(page, limit, filtros) {
        const nroPagina = Math.max(Number(page), 1);
        const elemsXPagina = Math.min(Math.max(Number(limit), 1), 100);

       return await this.productoRepository.findByPage(nroPagina, elemsXPagina, filtros);
    }

    async buscarPorId(id) {
        const producto = await this.productoRepository.findById(id);
        if (producto === null) {
            throw new ProductoDoesNotExistError(id);
        }
        return producto;
    }
}