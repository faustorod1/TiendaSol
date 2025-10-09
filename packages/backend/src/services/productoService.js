import { Producto } from "../entities/producto.js";
import { ProductoRepository } from "../models/repositories/productoRepository.js";

class ProductoService {
    constructor(productoRepository) {
        this.productoRepository = productoRepository;
    }

    async buscarTodos(page, limit, filtros) {
        const nroPagina = Math.max(Number(page), 1);
        const elemsXPagina = Math.min(Math.max(Number(limit), 1), 100);

        const productos = this.productoRepository.findByPage(nroPagina, elemsXPagina, filtros);

        const total = this.productoRepository.count();
        const totalPaginas = Math.ceil(total / elemsXPagina);

        return {
            page: nroPagina,
            perPage: elemsXPagina,
            total: total,
            totalPages: totalPaginas,
            data: productos
        };
    }
}