import { ProductoModel } from "../../schemas/productoSchema.js";
import mongoose from "mongoose";

export class ProductoRepository {
    constructor() {
        this.model = ProductoModel;
    }
    async findByPage(nroPagina, elemsXPagina, filtros) {
        const filtrosValidos = {};
        if (filtros.vendedor) {
            filtrosValidos.vendedor = mongoose.Types.ObjectId.createFromHexString(filtros.vendedor);
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

        const sort = {};
        switch (filtros.orderBy) {
            case "precio_asc":
                sort.precio = 1;
                break;
            case "precio_desc":
                sort.precio = -1;
                break;
            case "ventas_desc":
                sort.cantidadVendida = -1;
                break;
            default:
                sort._id = -1;
        }

        return await this.model.find(filtrosValidos)
        .sort(sort)
        .skip((nroPagina - 1) * elemsXPagina)
        .limit(elemsXPagina);
    }

    async findAll() {
        return await this.model.find();
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async findManyById(ids){
        return await this.model.find({ _id: { $in : ids } });
    }

    async count() {
        return await this.model.countDocuments();
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

    async updateStockYVentas(productos) {
        if (!productos || productos.length === 0) return;

        const operaciones = productos.map(p => ({
            updateOne: {
                filter: { _id: p._id },
                update: {
                    $set: {
                        stock: p.stock,
                        cantidadVendida: p.cantidadVendida
                    }
                }
            }
        }));

        await this.model.bulkWrite(operaciones);
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }

    async incrementarVentasYReducirStock(items) {
        const operaciones = items.map(item => ({
            updateOne: {
                filter: { _id: item.productoId },
                update: { $inc: { cantidadVendida: item.cantidad }, $dec: { stock: item.cantidad } }
            }
        }));

        return await this.model.bulkWrite(operaciones);
    }
}