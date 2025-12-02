import { ProductoDoesNotExistError } from "../errors/ProductoDoesNotExistError.js";
import { Producto } from "../models/entities/producto.js";

export class ProductoService {
    constructor(productoRepository, usuarioRepository) {
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
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

    async crearProducto(datosProducto) {
        const vendedor = await this.usuarioRepository.findById(datosProducto.vendedor);
        if (!vendedor) {
            throw new Error("Vendedor no encontrado");
        }

        const nuevoProducto = new Producto(datosProducto);
        return await this.productoRepository.save(nuevoProducto);
    }

    async actualizarStock(productoId, nuevoStock, vendedorId) {
        const producto = await this.productoRepository.findById(productoId);
        if (!producto) {
            const error = new Error(`Producto con ID ${productoId} no encontrado`);
            error.name = 'ProductoNotFoundError';
            throw error;
        }

        if (producto.vendedor.toString() !== vendedorId.toString()) {
            const error = new Error('No tienes permisos para actualizar este producto');
            error.name = 'UnauthorizedError';
            throw error;
        }

        const productoActualizado = await this.productoRepository.actualizarStock(
            productoId, 
            nuevoStock
        );

        return productoActualizado;
    }
}