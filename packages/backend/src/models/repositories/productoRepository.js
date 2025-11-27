import { ProductoModel } from "../../schemas/productoSchema.js";
import mongoose from "mongoose";

export class ProductoRepository {
    constructor() {
        this.model = ProductoModel;
    }

    async save(producto) {
        const productoParaGuardar = {
            vendedor: producto.vendedor,
            titulo: producto.titulo,
            descripcion: producto.descripcion,
            categorias: producto.categorias,
            precio: producto.precio,
            moneda: producto.moneda,
            stock: producto.stock,
            fotos: producto.fotos,
            activo: producto.activo,
            cantidadVendida: producto.cantidadVendida || 0
        };

        const nuevoProductoModel = new this.model(productoParaGuardar);
        const productoGuardado = await nuevoProductoModel.save();

        producto._id = productoGuardado._id;
        
        return producto;
    }

    async findByPage(nroPagina, elemsXPagina, filtros) {
        const filtrosValidos = this._buildFilters(filtros);
        const sort = this._buildSort(filtros);

        const totalItems = await this.model.countDocuments(filtrosValidos);

        const totalPages = Math.ceil(totalItems / elemsXPagina);
        const skipAmount = (nroPagina - 1) * elemsXPagina;

        let data = [];
        
        if (totalItems > 0 && nroPagina <= totalPages) {
            data = await this.model.find(filtrosValidos)
                .sort(sort)
                .skip(skipAmount)
                .limit(elemsXPagina)
                .lean();
        }

        return {
            page: nroPagina,
            perPage: elemsXPagina,
            total: totalItems,
            totalPages: totalPages,
            data: data
        };
    }

    async findAll() {
        return await this.model.find();
    }

    async findById(id) {
        const objId = mongoose.Types.ObjectId.createFromHexString(id);
        return await this.model.findById(objId);
    }

    async findManyById(ids){
        return await this.model.find({ _id: { $in : ids } });
    }

    async count(filtros) {
        const filtrosValidos = this._buildFilters(filtros);
        return await this.model.countDocuments(filtrosValidos);
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



    // Métodos privados

    _buildFilters(filtros) {
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
        if (filtros.categorias && filtros.categorias.length > 0) {
            const objIds = filtros.categorias.map(id => mongoose.Types.ObjectId.createFromHexString(id));
            filtrosValidos['categorias._id'] = { $in: objIds };
        }
        if (filtros.precioMin || filtros.precioMax) {
            filtrosValidos.precio = {};
            if (filtros.precioMin) filtrosValidos.precio.$gte = filtros.precioMin;
            if (filtros.precioMax) filtrosValidos.precio.$lte = filtros.precioMax;
        }

        return filtrosValidos;
    }

    _buildSort(filtros) {
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
            case "fecha_creacion_desc":
                sort.createdAt = -1;
            default:
                sort._id = -1;
        }

        return sort;
    }
}