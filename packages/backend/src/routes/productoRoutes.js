import { ProductoController } from '../controllers/productoController.js';
import { vendedorErrorHandler } from '../middlewares/vendedorMiddleware.js';
import { loggerMiddleware } from '../middlewares/loggerMiddleware.js';
import express from 'express';
import { productoErrorHandler } from '../middlewares/productoMiddleware.js';

const pathProducto = "/productos";

export default function productoRoutes(getController) {
    const router = express.Router();
    const controller = getController(ProductoController);
    
    router.use(loggerMiddleware);

    router.get(pathProducto, async (req, res) => {
        try {
            await controller.buscarTodos(req, res);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.get(`${pathProducto}/:id`, async (req, res) => {
        try {
            await controller.buscarPorId(req, res);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.use(vendedorErrorHandler);
    router.use(productoErrorHandler);

    return router;
}