import { ProductoController } from '../controllers/productoController.js';
import { vendedorErrorHandler } from '../middlewares/vendedorMiddleware.js';
import { loggerMiddleware } from '../middlewares/loggerMiddleware.js';
import express from 'express';
import { productoErrorHandler } from '../middlewares/productoMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const pathProducto = "/productos";

export default function productoRoutes(getController) {
    const router = express.Router();
    const controller = getController(ProductoController);
    
    router.use(loggerMiddleware);

    router.get(pathProducto, async (req, res, next) => {
        try {
            await controller.buscarTodos(req, res);
        } catch (error) {
            next(error);
        }
    });

    router.get(`${pathProducto}/:id`, async (req, res, next) => {
        try {
            await controller.buscarPorId(req, res);
        } catch (error) {
            next(error);
        }
    });

    router.post(pathProducto, authMiddleware ,vendedorErrorHandler, async (req, res, next) => {
        try {
            await controller.crearProducto(req, res);
        } catch (error) {
            next(error);
        }
    });

    router.use(productoErrorHandler);

    return router;
}