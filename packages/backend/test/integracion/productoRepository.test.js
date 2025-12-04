import mongoose from 'mongoose';
import { ProductoRepository } from '../../src/models/repositories/productoRepository.js'; 
import { ProductoModel } from '../../src/schemas/productoSchema.js'; 
import { Producto } from '../../src/models/entities/producto.js'; 
import { Moneda } from '../../src/models/entities/moneda.js'; 

import { connectDB, disconnectDB, clearDatabase } from '../utils/db-setup.js';

const MOCK_VENDEDOR_ID = new mongoose.Types.ObjectId().toHexString(); 
const MOCK_CATEGORIA_ID = new mongoose.Types.ObjectId().toHexString();

beforeAll(async () => {
    await connectDB();
});

afterEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await disconnectDB();
});

describe('ProductoRepository - Integración con MongoDB', () => {
    let repository;

    beforeEach(() => {
        repository = new ProductoRepository();
    });

    it('Debería guardar un producto y verificar su persistencia en la DB real (SIN MOCKS)', async () => {
        const productoData = {
            vendedor: MOCK_VENDEDOR_ID,
            titulo: 'Auriculares Integración Pura',
            descripcion: 'Test simple sin mocks.',
            categorias: [{ _id: MOCK_CATEGORIA_ID, nombre: 'Audio' }],
            precio: 100.00,
            moneda: Moneda.DOLAR_USA,
            stock: 50,
            activo: true,
        };
        const nuevoProducto = new Producto(productoData);

        const productoGuardado = await repository.save(nuevoProducto);

        expect(productoGuardado).toBeInstanceOf(Producto);
        expect(productoGuardado._id).toBeDefined();

        const productoRecuperado = await ProductoModel.findById(productoGuardado._id);

        expect(productoRecuperado).not.toBeNull();
        expect(productoRecuperado.titulo).toBe(productoData.titulo);
    });
});