import { CategoriaModel } from "../../schemas/schemasAnidados/categoriaSchema.js";    
import mongoose from "mongoose";

export class CategoriaRepository {
    constructor() {
        this.model = CategoriaModel;
    }

    async findAll() {
        return this.model.find({}).sort({nombre: 1}).lean();
    }
}