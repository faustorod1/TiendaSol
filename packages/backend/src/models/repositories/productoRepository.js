import { ProductoModel } from "../../schemas/productoSchema";

export class ProductoRepository {
    constructor() {
        this.model = ProductoModel;
    }
    async findByPage(nroPagina, elemsXPagina, filtros) {
        const filtrosValidos = {};
        if (filtros.vendedor) {
            filtrosValidos.vendedor = vendedor;
        }
        if (filtros.titulo) {
            filtrosValidos.titulo = RegExp(filtros.titulo, "i");
        }
        if (filtros.descripcion) {
            filtrosValidos.descripcion = RegExp(filtros.descripcion, "i");
        }
        if (filtros.precioMin || filtros.precioMax) {
            filtrosValidos.precio = {};
            if (filtros.precioMin) filtrosValidos.precio.$gte = filtros.precioMin;
            if (filtros.precioMax) filtrosValidos.precio.$lte = filtros.precioMax;
        }


        // TODO Falta el sort by
        return this.model.find(filtrosValidos)
            .skip((nroPagina - 1) * elemsXPagina)
            .limit(elemsXPagina);
    }

    async findAll() {
        return await this.model.find();
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async findByTitle(titulo) {
        return await this.model.find({ "titulo": titulo });
    }

    async findByCategory(nombreCategoria) {
        return await this.model.find({ "categorias.nombre": nombreCategoria });
    }

    async findByDescription(descripcion) {
        return await this.model.find({ "descripcion": descripcion });
    }

    async findByPriceRange(minPrice, maxPrice) {
        return await this.model.find({
            precio: { $gte: minPrice, $lte: maxPrice }
        });
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
}